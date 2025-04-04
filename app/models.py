from datetime import datetime, date
from typing import List, Dict, Optional
from pydantic import BaseModel, UUID4
from uuid import UUID

class PatientBase(BaseModel):
    name: str
    dob: Optional[date] = None
    doctor_id: UUID4

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    patient_id: UUID4
    doctor_id: UUID4

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class TranscriptBase(BaseModel):
    session_id: UUID4
    raw_text: str
    audio_url: Optional[str] = None

class TranscriptCreate(TranscriptBase):
    pass

class Transcript(TranscriptBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    session_id: UUID4
    summary: str
    symptoms: List[str]
    medications: List[Dict[str, str]]
    followups: List[str]
    restrictions: str

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True 