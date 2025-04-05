from models.patient import (
    get_all_patients,
    get_patient_by_id,
    get_patient_by_user_id,
    add_patient,
    update_patient,
    delete_patient
)
import logging

logging.basicConfig(level=logging.DEBUG)

def fetch_all_patients():
    try:
        response = get_all_patients()
        return response
    except Exception as e:
        logging.error(f"Error in fetch_all_patients: {str(e)}")
        return {"data": None, "error": str(e)}

def fetch_patient_by_id(patient_id):
    try:
        response = get_patient_by_id(patient_id)
        return response
    except Exception as e:
        logging.error(f"Error in fetch_patient_by_id: {str(e)}")
        return {"data": None, "error": str(e)}

def fetch_patient_by_user_id(user_id):
    try:
        response = get_patient_by_user_id(user_id)
        return response
    except Exception as e:
        logging.error(f"Error in fetch_patient_by_user_id: {str(e)}")
        return {"data": None, "error": str(e)}

def create_patient(data):
    try:
        response = add_patient(data)
        if response.data:
            return {"data": response.data[0], "error": None}
        return {"data": None, "error": "Failed to create patient"}
    except Exception as e:
        logging.error(f"Error in create_patient: {str(e)}")
        return {"data": None, "error": str(e)}

def modify_patient(patient_id, data):
    try:
        response = update_patient(patient_id, data)
        if response.data:
            return {"data": response.data[0], "error": None}
        return {"data": None, "error": "Failed to update patient"}
    except Exception as e:
        logging.error(f"Error in modify_patient: {str(e)}")
        return {"data": None, "error": str(e)}

def remove_patient(patient_id):
    try:
        response = delete_patient(patient_id)
        if response.data:
            return {"data": response.data[0], "error": None}
        return {"data": None, "error": "Failed to delete patient"}
    except Exception as e:
        logging.error(f"Error in remove_patient: {str(e)}")
        return {"data": None, "error": str(e)}
