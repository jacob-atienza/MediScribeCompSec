from models.report import get_all_reports, get_report_by_id, add_report, update_report, delete_report

def fetch_all_reports():
    return get_all_reports()

def fetch_report_by_id(report_id):
    report = get_report_by_id(report_id)
    if not report['data']:
        return {"error": "Report not found"}
    return report['data']

def create_report(report_data):
    new_report = add_report(report_data)
    return new_report

def modify_report(report_id, report_data):
    updated_report = update_report(report_id, report_data)
    return updated_report

def remove_report(report_id):
    deleted_report = delete_report(report_id)
    return deleted_report
