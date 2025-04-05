from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from services.session_service import fetch_all_sessions, fetch_session_by_id, create_session, modify_session, remove_session

app = Blueprint('session', __name__)

@app.route('/', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_sessions():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_all_sessions()
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:session_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_session(session_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_session_by_id(session_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    if not response['data']:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(response), 200

@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_session():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = create_session(data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 201

@app.route('/<int:session_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_session(session_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = modify_session(session_id, data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:session_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_session(session_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = remove_session(session_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200
