import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SessionCard } from "@/components/SessionCard";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { NewSessionForm } from "@/components/NewSessionForm";
import { PlusCircle, Calendar, User } from "lucide-react";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPatient = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const patientData = await api.patients.getById(id);
      
      if (!patientData) {
        toast({
          title: "Error",
          description: "Patient not found",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      setPatient(patientData);
      
      const sessionsData = await api.patients.getSessions(id);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchPatient();
    }
  }, [user, id]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-medical-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="medical-card h-32"></div>
              ))}
            </div>
          </div>
        ) : patient ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <User className="mr-2 h-6 w-6" />
                  {patient.name}
                </h1>
                {patient.dob && (
                  <p className="text-gray-600">
                    Date of Birth: {new Date(patient.dob).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                onClick={() => setShowNewSessionForm(!showNewSessionForm)}
                className="bg-medical-primary"
              >
                {showNewSessionForm ? (
                  "Cancel"
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Session
                  </>
                )}
              </Button>
            </div>
            
            {showNewSessionForm && (
              <div className="mb-8">
                <NewSessionForm
                  onSuccess={() => {
                    setShowNewSessionForm(false);
                    fetchPatient();
                  }}
                />
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Patient Sessions
              </h2>
              
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      id={session.id}
                      patientName={patient.name}
                      patientId={patient.id}
                      createdAt={session.created_at}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mb-4 text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No sessions yet</h3>
                  <p className="text-gray-500 mb-6">
                    This patient doesn't have any recorded sessions
                  </p>
                  <Button
                    onClick={() => setShowNewSessionForm(true)}
                    className="bg-medical-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create First Session
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Patient not found</h3>
            <Button
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDetail;
