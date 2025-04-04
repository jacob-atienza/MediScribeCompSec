# Mediscribe Backend

FastAPI backend for medical transcription and report generation.

## Prerequisites

1. FFmpeg installed on your system:

   - Windows: Download from https://ffmpeg.org/download.html
   - Linux: `sudo apt update && sudo apt install ffmpeg`
   - macOS: `brew install ffmpeg`

2. CUDA-capable GPU (optional, but recommended for faster transcription)

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with your API keys:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Running the Application

1. Start the backend server:

```bash
uvicorn app.main:app --reload --port 8000
```

2. The API will be available at `http://localhost:8000`
3. API documentation will be available at `http://localhost:8000/docs`

## Frontend Integration

The backend is configured to accept CORS requests from the frontend. Make sure your frontend is making requests to:

- `http://localhost:8000/api/...` for all API endpoints

## API Endpoints

- `POST /api/patients` - Create a new patient
- `GET /api/patients` - List all patients
- `POST /api/sessions` - Create a new session
- `GET /api/patients/{patient_id}/sessions` - List sessions for a patient
- `POST /api/sessions/{session_id}/upload` - Upload audio for transcription
- `GET /api/sessions/{session_id}/transcript` - Get transcript
- `POST /api/sessions/{session_id}/report` - Generate report
- `GET /api/sessions/{session_id}/report` - Get report

## Notes

- The first time you run the application, it will download the Whisper model (about 1GB for the "base" model)
- Transcription speed depends on your hardware:
  - GPU: Much faster processing
  - CPU: Slower but still functional
- Supported audio formats: WAV, MP3, M4A, and other common formats supported by FFmpeg
