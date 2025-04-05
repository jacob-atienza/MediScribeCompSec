from models.user import create_user, verify_password, get_user_by_email
from flask import jsonify
import logging

logging.basicConfig(level=logging.DEBUG)

def register_user(email, password, role):
    existing_user = get_user_by_email(email)
    if existing_user.data:
        return jsonify({'error': 'Email already exists'}), 400
    
    user = create_user(email, password, role)
    if not user.data:
        return jsonify({'error': 'Failed to create user'}), 500
    
    return jsonify(user.data[0]), 201

def login_user(email, password):
    logging.debug(f"Attempting login for user: {email}")
    user = get_user_by_email(email)
    
    if not user or not user.data or len(user.data) == 0:
        logging.debug(f"No user found with email: {email}")
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not verify_password(email, password):
        logging.debug(f"Login failed for user: {email}")
        return jsonify({'error': 'Invalid credentials'}), 401
    
    logging.debug(f"Login successful for user: {email}")
    user_data = user.data[0]
    return jsonify({
        'data': [{
            'id': user_data['id'],
            'email': user_data['email'],
            'role': user_data['role'],
            'name': user_data['email'].split('@')[0]  # Use email prefix as name
        }]
    }), 200 