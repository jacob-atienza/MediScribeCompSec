import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An error occurred with the API request");
  }
  return response.json();
};

// API error handler
const handleApiError = (error: Error, customMessage?: string) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: customMessage || error.message || "Something went wrong",
    variant: "destructive",
  });
  throw error;
};

// API service object with methods for each endpoint
export const api = {
  // Patients endpoints
  patients: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch patients");
      }
    },

    create: async (patientData: { name: string; dob?: string }) => {
      try {
        // For demo purposes, using a hardcoded doctor_id
        // In a real app, this would come from the authenticated user
        const doctor_id = "123e4567-e89b-12d3-a456-426614174000";

        const response = await fetch(`${API_BASE_URL}/patients`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...patientData,
            doctor_id,
          }),
        });
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to create patient");
      }
    },

    getById: async (id: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`);
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch patient");
      }
    },

    getSessions: async (patientId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/patients/${patientId}/sessions`
        );
        return handleResponse(response);
      } catch (error) {
        return handleApiError(
          error as Error,
          "Failed to fetch patient sessions"
        );
      }
    },
  },

  // Sessions endpoints
  sessions: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions`);
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch sessions");
      }
    },

    create: async (params: { patient_id: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to create session");
      }
    },

    getById: async (id: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${id}`);
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch session");
      }
    },
  },

  // Transcript endpoints
  transcripts: {
    getBySessionId: async (sessionId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/sessions/${sessionId}/transcript`
        );
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch transcript");
      }
    },

    upload: async (sessionId: string, audioFile: File) => {
      try {
        const formData = new FormData();
        formData.append("file", audioFile);

        const response = await fetch(
          `${API_BASE_URL}/sessions/${sessionId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to upload audio");
      }
    },
  },

  // Report endpoints
  reports: {
    getBySessionId: async (sessionId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/sessions/${sessionId}/report`
        );
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to fetch report");
      }
    },

    generate: async (sessionId: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/sessions/${sessionId}/report`,
          {
            method: "POST",
          }
        );
        return handleResponse(response);
      } catch (error) {
        return handleApiError(error as Error, "Failed to generate report");
      }
    },
  },
};

// Mock data for frontend development before backend is ready
// Keeping this as a fallback in case connection to Supabase fails
export const mockData = {
  patients: [
    {
      id: "patient-1",
      name: "John Doe",
      dob: "1980-05-15",
      doctor_id: "user_123",
      created_at: "2023-05-01T10:00:00Z",
    },
    {
      id: "patient-2",
      name: "Jane Smith",
      dob: "1975-11-22",
      doctor_id: "user_123",
      created_at: "2023-05-02T11:30:00Z",
    },
    {
      id: "patient-3",
      name: "Robert Johnson",
      dob: "1990-03-08",
      doctor_id: "user_123",
      created_at: "2023-05-03T09:15:00Z",
    },
  ],
  sessions: [
    {
      id: "session-1",
      patient_id: "patient-1",
      patient_name: "John Doe",
      created_at: "2023-05-10T14:30:00Z",
      doctor_id: "user_123",
    },
    {
      id: "session-2",
      patient_id: "patient-2",
      patient_name: "Jane Smith",
      created_at: "2023-05-11T10:15:00Z",
      doctor_id: "user_123",
    },
    {
      id: "session-3",
      patient_id: "patient-3",
      patient_name: "Robert Johnson",
      created_at: "2023-05-12T16:45:00Z",
      doctor_id: "user_123",
    },
  ],
  transcripts: {
    "session-1": {
      raw_text:
        "Doctor: Hello, how are you feeling today?\nPatient: I've been experiencing headaches and feeling tired lately.\nDoctor: How long have you been experiencing these symptoms?\nPatient: For about two weeks now.\nDoctor: Let me check your vitals and then we'll discuss some possible causes and treatments.",
      created_at: "2023-05-10T14:35:00Z",
    },
    "session-2": {
      raw_text:
        "Doctor: Good morning, what brings you in today?\nPatient: I have this persistent cough that won't go away.\nDoctor: How long have you had this cough?\nPatient: About a month, and it's worse at night.\nDoctor: Are you experiencing any other symptoms like fever or chest pain?\nPatient: No fever, but sometimes I feel a little tightness in my chest.",
      created_at: "2023-05-11T10:20:00Z",
    },
    "session-3": {
      raw_text:
        "Doctor: Hello Mr. Johnson, how can I help you today?\nPatient: I've been having some knee pain after I started jogging.\nDoctor: When did you start jogging and how often do you run?\nPatient: I started about three weeks ago, and I've been going three times a week.\nDoctor: Let's examine your knee and discuss proper running techniques and possible treatments.",
      created_at: "2023-05-12T16:50:00Z",
    },
  },
  reports: {
    "session-1": {
      summary:
        "Patient reports persistent headaches and fatigue for the past two weeks.",
      symptoms: "Headaches, fatigue, difficulty concentrating",
      medications: "Recommended Acetaminophen 500mg as needed for headaches",
      followups:
        "Return in 2 weeks if symptoms persist. Consider blood work if no improvement.",
      notes:
        "Patient may be experiencing stress-related symptoms. Discussed relaxation techniques and proper sleep hygiene.",
    },
    "session-2": {
      summary:
        "Patient presents with persistent cough for one month, worse at night, with mild chest tightness.",
      symptoms: "Chronic cough, chest tightness, no fever",
      medications:
        "Prescribed guaifenesin with codeine for nighttime, Fluticasone nasal spray",
      followups:
        "Follow up in 10 days. If symptoms worsen, come in immediately.",
      notes:
        "Possible post-nasal drip causing cough. Advised to elevate head while sleeping and avoid dairy products.",
    },
    "session-3": {
      summary:
        "Patient experiencing knee pain following initiation of jogging routine three weeks ago.",
      symptoms: "Right knee pain, mild swelling, pain increases after activity",
      medications: "Recommended OTC NSAIDs before and after running",
      followups: "Return in 3 weeks for reassessment",
      notes:
        "Demonstrated proper stretching techniques. Advised to reduce frequency to twice weekly and to run on softer surfaces.",
    },
  },
};
