from flask import Flask
from flask_cors import CORS
from routes.patient_routes import app as patient_app
from routes.doctor_routes import app as doctor_app
from routes.session_routes import app as session_app
from routes.report_routes import app as report_app
from routes.auth_routes import app as auth_app

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, 
    resources={r"/*": {
        "origins": ["http://localhost:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }},
    automatic_options=True
)

# Register blueprints
app.register_blueprint(auth_app, url_prefix='/api/auth')
app.register_blueprint(patient_app, url_prefix='/api/patients')
app.register_blueprint(doctor_app, url_prefix='/api/doctors')
app.register_blueprint(session_app, url_prefix='/api/sessions')
app.register_blueprint(report_app, url_prefix='/api/reports')

if __name__ == '__main__':
    app.run(debug=True, port=8000)
