
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SessionCard } from "@/components/SessionCard";
import { PatientCard } from "@/components/PatientCard";
import { NewSessionForm } from "@/components/NewSessionForm";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionsData = await api.sessions.getAll();
      const patientsData = await api.patients.getAll();
      
      setSessions(sessionsData || []);
      setPatients(patientsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const getSessionCountForPatient = (patientId: string) => {
    return sessions.filter(s => s.patient_id === patientId).length;
  };

  const handleNewSessionForPatient = async (patientId: string, patientName: string) => {
    try {
      await api.sessions.create({
        patient_id: patientId,
        patient_name: patientName
      });
      
      // Refresh data
      fetchData();
      
      toast({
        title: "Success",
        description: `New session created for ${patientName}`,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
          <Button
            onClick={() => setShowNewSessionForm(!showNewSessionForm)}
            className="bg-medical-primary"
          >
            {showNewSessionForm ? "Cancel" : "New Session"}
          </Button>
        </div>
        
        {showNewSessionForm && (
          <div className="mb-8">
            <NewSessionForm
              onSuccess={() => {
                setShowNewSessionForm(false);
                fetchData();
              }}
            />
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sessions" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Patients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="medical-card animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-6"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    id={session.id}
                    patientName={session.patient_name}
                    patientId={session.patient_id}
                    createdAt={session.created_at}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">No sessions yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first patient session to get started
                </p>
                <Button
                  onClick={() => setShowNewSessionForm(true)}
                  className="bg-medical-primary"
                >
                  Create First Session
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patients">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="medical-card animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-6"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    id={patient.id}
                    name={patient.name}
                    dob={patient.dob}
                    createdAt={patient.created_at}
                    sessionCount={getSessionCountForPatient(patient.id)}
                    onNewSession={handleNewSessionForPatient}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-400">
                  <Users className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">No patients yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first patient session to get started
                </p>
                <Button
                  onClick={() => setShowNewSessionForm(true)}
                  className="bg-medical-primary"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add First Patient
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
