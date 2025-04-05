from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from services.report_service import fetch_all_reports, fetch_report_by_id, create_report, modify_report, remove_report

app = Blueprint('report', __name__)

@app.route('/', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_reports():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_all_reports()
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:report_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_report(report_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = fetch_report_by_id(report_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    if not response['data']:
        return jsonify({'error': 'Report not found'}), 404
    return jsonify(response), 200

@app.route('/', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_report():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = create_report(data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 201

@app.route('/<int:report_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_report(report_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    response = modify_report(report_id, data)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

@app.route('/<int:report_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_report(report_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    response = remove_report(report_id)
    if response['error']:
        return jsonify({'error': response['error']}), 500
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
