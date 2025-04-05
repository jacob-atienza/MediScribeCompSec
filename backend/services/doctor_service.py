from models.doctor import get_all_doctors, get_doctor_by_id, add_doctor, update_doctor, delete_doctor

def fetch_all_doctors():
    return get_all_doctors()

def fetch_doctor_by_id(doctor_id):
    doctor = get_doctor_by_id(doctor_id)
    if not doctor['data']:
        return {"error": "Doctor not found"}
    return doctor['data']

def create_doctor(doctor_data):
    new_doctor = add_doctor(doctor_data)
    return new_doctor

def modify_doctor(doctor_id, doctor_data):
    updated_doctor = update_doctor(doctor_id, doctor_data)
    return updated_doctor

def remove_doctor(doctor_id):
    deleted_doctor = delete_doctor(doctor_id)
    return deleted_doctor
