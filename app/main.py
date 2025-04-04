from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
from datetime import datetime
import os
import tempfile
import json

from .models import (
    Patient, PatientCreate, PatientBase,
    Session, SessionCreate, SessionBase,
    Transcript, TranscriptCreate, TranscriptBase,
    Report, ReportCreate, ReportBase
)
from .database import supabase
from .services import transcribe_audio, generate_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/patients", response_model=Patient)
async def create_patient(patient: PatientCreate):
    try:
        # Validate required fields
        if not patient.name:
            raise HTTPException(status_code=400, detail="Name is required")
        if not patient.doctor_id:
            raise HTTPException(status_code=400, detail="Doctor ID is required")
            
        # Insert into database
        data = supabase.table("patients").insert(patient.dict()).execute()
        
        if not data.data:
            raise HTTPException(status_code=500, detail="Failed to create patient")
            
        return data.data[0]
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating patient: {str(e)}")

@app.get("/api/patients", response_model=List[Patient])
async def list_patients():
    try:
        data = supabase.table("patients").select("*").execute()
        return data.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/sessions", response_model=Session)
async def create_session(session: SessionCreate):
    try:
        data = supabase.table("sessions").insert(session.dict()).execute()
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/sessions", response_model=List[Session])
async def list_sessions():
    try:
        data = supabase.table("sessions").select("*").execute()
        return data.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/patients/{patient_id}/sessions", response_model=List[Session])
async def list_patient_sessions(patient_id: uuid.UUID):
    try:
        data = supabase.table("sessions").select("*").eq("patient_id", str(patient_id)).execute()
        return data.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/sessions/{session_id}/upload", response_model=Transcript)
async def upload_audio(session_id: uuid.UUID, file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file.flush()
            
            transcript_text = await transcribe_audio(temp_file.name)
            
            # Here you would typically upload the audio file to your storage service
            # and get back a URL. For now, we'll use a placeholder
            audio_url = f"https://storage.example.com/audio/{session_id}/{file.filename}"
            
            transcript = TranscriptCreate(
                session_id=session_id,
                raw_text=transcript_text,
                audio_url=audio_url
            )
            
            data = supabase.table("transcripts").insert(transcript.dict()).execute()
            os.unlink(temp_file.name)
            return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/sessions/{session_id}/transcript", response_model=Transcript)
async def get_transcript(session_id: uuid.UUID):
    try:
        data = supabase.table("transcripts").select("*").eq("session_id", str(session_id)).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Transcript not found")
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/sessions/{session_id}/report", response_model=Report)
async def trigger_report_generation(session_id: uuid.UUID):
    try:
        transcript_data = supabase.table("transcripts").select("*").eq("session_id", str(session_id)).execute()
        if not transcript_data.data:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        transcript_text = transcript_data.data[0]["raw_text"]
        report_data = await generate_report(transcript_text)
        
        # Parse the JSON response from Gemini
        report_dict = json.loads(report_data)
        
        report = ReportCreate(
            session_id=session_id,
            summary=report_dict["summary"],
            symptoms=report_dict["symptoms"],
            medications=report_dict["medications"],
            followups=report_dict["followups"],
            restrictions=report_dict["restrictions"]
        )
        
        data = supabase.table("reports").insert(report.dict()).execute()
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/sessions/{session_id}/report", response_model=Report)
async def get_report(session_id: uuid.UUID):
    try:
        data = supabase.table("reports").select("*").eq("session_id", str(session_id)).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Report not found")
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 