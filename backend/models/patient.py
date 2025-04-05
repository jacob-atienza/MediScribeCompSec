from utils.supabase_client import init_supabase
import logging

supabase = init_supabase()
logging.basicConfig(level=logging.DEBUG)

def get_all_patients():
    try:
        response = supabase.table('patients').select('*, users!inner(*)').execute()
        logging.debug(f"Get all patients response: {response}")
        
        if not response.data:
            return {'data': [], 'error': None}
            
        # Format the response to include user data
        formatted_data = []
        for patient in response.data:
            formatted_patient = {
                'id': patient['id'],
                'user_id': patient['user_id'],
                'date_of_birth': patient['date_of_birth'],
                'first_name': patient['users']['first_name'],
                'last_name': patient['users']['last_name'],
                'email': patient['users']['email']
            }
            formatted_data.append(formatted_patient)
            
        return {'data': formatted_data, 'error': None}
    except Exception as e:
        logging.error(f"Error getting all patients: {str(e)}")
        return {'data': None, 'error': str(e)}

def get_patient_by_id(patient_id):
    try:
        response = supabase.table('patients').select('*, users!inner(*)').eq('id', patient_id).execute()
        logging.debug(f"Get patient by id response: {response}")
        
        if not response.data:
            return {'data': None, 'error': 'Patient not found'}
            
        patient = response.data[0]
        formatted_patient = {
            'id': patient['id'],
            'user_id': patient['user_id'],
            'date_of_birth': patient['date_of_birth'],
            'first_name': patient['users']['first_name'],
            'last_name': patient['users']['last_name'],
            'email': patient['users']['email']
        }
        
        return {'data': formatted_patient, 'error': None}
    except Exception as e:
        logging.error(f"Error getting patient by id: {str(e)}")
        return {'data': None, 'error': str(e)}

def get_patient_by_user_id(user_id):
    try:
        response = supabase.table('patients').select('*, users!inner(*)').eq('user_id', user_id).execute()
        logging.debug(f"Get patient by user id response: {response}")
        
        if not response.data:
            return {'data': None, 'error': 'Patient not found'}
            
        patient = response.data[0]
        formatted_patient = {
            'id': patient['id'],
            'user_id': patient['user_id'],
            'date_of_birth': patient['date_of_birth'],
            'first_name': patient['users']['first_name'],
            'last_name': patient['users']['last_name'],
            'email': patient['users']['email']
        }
        
        return {'data': formatted_patient, 'error': None}
    except Exception as e:
        logging.error(f"Error getting patient by user id: {str(e)}")
        return {'data': None, 'error': str(e)}

def add_patient(data):
    try:
        # Remove fields that don't exist in the database schema
        fields_to_remove = ['dob', 'doctor_id', 'name']
        for field in fields_to_remove:
            if field in data:
                del data[field]
            
        # Create user first
        user_data = {
            'email': data.get('email'),
            'password': data.get('password'),
            'role': 'patient',
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name')
        }
        
        user_response = supabase.table('users').insert(user_data).execute()
        if not user_response.data:
            raise Exception("Failed to create user")
            
        # Create patient with user_id and date_of_birth
        patient_data = {
            'user_id': user_response.data[0]['id'],
            'date_of_birth': data.get('dob') or '1900-01-01'  # Provide a default date if not specified
        }
        
        response = supabase.table('patients').insert(patient_data).execute()
        logging.debug(f"Add patient response: {response}")
        return response
    except Exception as e:
        logging.error(f"Error adding patient: {str(e)}")
        raise

def update_patient(patient_id, data):
    try:
        response = supabase.table('patients').update(data).eq('id', patient_id).execute()
        logging.debug(f"Update patient response: {response}")
        return response
    except Exception as e:
        logging.error(f"Error updating patient: {str(e)}")
        raise

def delete_patient(patient_id):
    try:
        response = supabase.table('patients').delete().eq('id', patient_id).execute()
        logging.debug(f"Delete patient response: {response}")
        return response
    except Exception as e:
        logging.error(f"Error deleting patient: {str(e)}")
        raise
