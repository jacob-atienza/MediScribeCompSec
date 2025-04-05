from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from services.auth_service import register_user, login_user

app = Blueprint('auth', __name__)

@app.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True, origins=['http://localhost:8080'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not all([email, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if role not in ['doctor', 'patient']:
        return jsonify({'error': 'Invalid role'}), 400
    
    return register_user(email, password, role)

@app.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True, origins=['http://localhost:8080'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    return login_user(email, password) 