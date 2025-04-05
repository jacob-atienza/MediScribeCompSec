from utils.supabase_client import init_supabase
import logging

supabase = init_supabase()
logging.basicConfig(level=logging.DEBUG)

def get_all_users():
    return supabase.table('users').select('*').execute()

def get_user_by_id(user_id):
    return supabase.table('users').select('*').eq('id', user_id).execute()

def get_user_by_email(email):
    return supabase.table('users').select('*').eq('email', email).execute()

def create_user(email, password, role):
    try:
        logging.debug(f"Creating user with email: {email}")
        return supabase.table('users').insert({
            'email': email,
            'password': password,
            'role': role
        }).execute()
    except Exception as e:
        logging.error(f"Error creating user: {str(e)}")
        raise

def update_user(user_id, data):
    return supabase.table('users').update(data).eq('id', user_id).execute()

def delete_user(user_id):
    return supabase.table('users').delete().eq('id', user_id).execute()

def verify_password(email, password):
    user = get_user_by_email(email)
    if not user or not user.data or len(user.data) == 0:
        logging.debug(f"No user found with email: {email}")
        return False
    
    stored_password = user.data[0].get('password')
    if not stored_password:
        logging.debug(f"No password found for user: {email}")
        return False
        
    is_valid = stored_password == password
    logging.debug(f"Password verification for {email}: {'success' if is_valid else 'failed'}")
    return is_valid 