from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from services.doctor_service import fetch_all_doctors, fetch_doctor_by_id, create_doctor, modify_doctor, remove_doctor

app = Blueprint('doctor', __name__)

@app.route('/', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_doctors():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_all_doctors()
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:doctor_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_doctor(doctor_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_doctor_by_id(doctor_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    if not response['data']:
        return jsonify({'error': 'Doctor not found'}), 404
    return jsonify(response), 200

@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_doctor():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = create_doctor(data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 201

@app.route('/<int:doctor_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_doctor(doctor_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = modify_doctor(doctor_id, data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:doctor_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_doctor(doctor_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = remove_doctor(doctor_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
