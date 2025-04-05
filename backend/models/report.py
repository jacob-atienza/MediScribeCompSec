from utils.supabase_client import init_supabase

supabase = init_supabase()

def get_all_reports():
    return supabase.table('reports').select('*').execute()

def get_report_by_id(report_id):
    return supabase.table('reports').select('*').eq('id', report_id).execute()

def add_report(data):
    return supabase.table('reports').insert(data).execute()

def update_report(report_id, data):
    return supabase.table('reports').update(data).eq('id', report_id).execute()

def delete_report(report_id):
    return supabase.table('reports').delete().eq('id', report_id).execute()
