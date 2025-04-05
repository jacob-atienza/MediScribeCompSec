from utils.supabase_client import init_supabase

supabase = init_supabase()

def get_all_doctors():
    return supabase.table('doctors').select('*, users(*)').execute()

def get_doctor_by_id(doctor_id):
    return supabase.table('doctors').select('*, users(*)').eq('id', doctor_id).execute()

def get_doctor_by_user_id(user_id):
    return supabase.table('doctors').select('*, users(*)').eq('user_id', user_id).execute()

def add_doctor(data):
    return supabase.table('doctors').insert(data).execute()

def update_doctor(doctor_id, data):
    return supabase.table('doctors').update(data).eq('id', doctor_id).execute()

def delete_doctor(doctor_id):
    return supabase.table('doctors').delete().eq('id', doctor_id).execute()
