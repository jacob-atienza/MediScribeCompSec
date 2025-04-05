from models.session import get_all_sessions, get_session_by_id, add_session, update_session, delete_session

def fetch_all_sessions():
    response = get_all_sessions()
    return {
        'data': response.data if response.data else [],
        'error': response.error if hasattr(response, 'error') else None
    }

def fetch_session_by_id(session_id):
    response = get_session_by_id(session_id)
    return {
        'data': response.data[0] if response.data and len(response.data) > 0 else None,
        'error': response.error if hasattr(response, 'error') else None
    }

def create_session(session_data):
    response = add_session(session_data)
    return {
        'data': response.data[0] if response.data and len(response.data) > 0 else None,
        'error': response.error if hasattr(response, 'error') else None
    }

def modify_session(session_id, session_data):
    response = update_session(session_id, session_data)
    return {
        'data': response.data[0] if response.data and len(response.data) > 0 else None,
        'error': response.error if hasattr(response, 'error') else None
    }

def remove_session(session_id):
    response = delete_session(session_id)
    return {
        'data': response.data[0] if response.data and len(response.data) > 0 else None,
        'error': response.error if hasattr(response, 'error') else None
    }
