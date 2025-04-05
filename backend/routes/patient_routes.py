from flask import Blueprint, jsonify, request
from services.patient_service import fetch_all_patients, fetch_patient_by_id, create_patient, modify_patient, remove_patient

app = Blueprint('patient', __name__)

@app.route('', methods=['GET', 'OPTIONS'])
@app.route('/', methods=['GET', 'OPTIONS'])
def get_patients():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_all_patients()
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:patient_id>', methods=['GET', 'OPTIONS'])
def get_patient(patient_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_patient_by_id(patient_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    if not response['data']:
        return jsonify({'error': 'Patient not found'}), 404
    return jsonify(response), 200

@app.route('', methods=['POST', 'OPTIONS'])
@app.route('/', methods=['POST', 'OPTIONS'])
def add_patient():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = create_patient(data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 201

@app.route('/<int:patient_id>', methods=['PUT', 'OPTIONS'])
def update_patient(patient_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = modify_patient(patient_id, data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:patient_id>', methods=['DELETE', 'OPTIONS'])
def delete_patient(patient_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = remove_patient(patient_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200
