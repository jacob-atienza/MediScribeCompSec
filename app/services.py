import whisper
import google.generativeai as genai
from dotenv import load_dotenv
import os
import torch

load_dotenv()

# Initialize Whisper model (will be loaded on first use)
whisper_model = None

def get_whisper_model():
    global whisper_model
    if whisper_model is None:
        # Use "base" model for faster processing, or "medium" for better accuracy
        whisper_model = whisper.load_model("base", device="cuda" if torch.cuda.is_available() else "cpu")
    return whisper_model

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

async def transcribe_audio(audio_file_path: str) -> str:
    try:
        model = get_whisper_model()
        # Transcribe the audio file
        result = model.transcribe(audio_file_path)
        return result["text"]
    except Exception as e:
        raise Exception(f"Error transcribing audio: {str(e)}")

async def generate_report(transcript: str) -> dict:
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Analyze this medical consultation transcript and extract the following information in JSON format:
    - Summary of the consultation
    - List of symptoms mentioned
    - List of medications with doses
    - Any follow-up appointments or surgeries mentioned
    - Any pre/post-operative restrictions
    
    Transcript:
    {transcript}
    """
    
    response = await model.generate_content(prompt)
    return response.text 