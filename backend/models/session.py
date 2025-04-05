from utils.supabase_client import init_supabase

supabase = init_supabase()

def get_all_sessions():
    return supabase.table('sessions').select('*').execute()

def get_session_by_id(session_id):
    return supabase.table('sessions').select('*').eq('id', session_id).execute()

def add_session(data):
    return supabase.table('sessions').insert(data).execute()

def update_session(session_id, data):
    return supabase.table('sessions').update(data).eq('id', session_id).execute()

def delete_session(session_id):
    return supabase.table('sessions').delete().eq('id', session_id).execute()
