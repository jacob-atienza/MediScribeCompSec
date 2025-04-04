
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { ReportEditor } from "@/components/ReportEditor";
import { RecordingControl } from "@/components/RecordingControl";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const SessionDetail = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [session, setSession] = useState<any>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSessionData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const sessionData = await api.sessions.getById(id);
      
      if (!sessionData) {
        toast({
          title: "Error",
          description: "Session not found",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      setSession(sessionData);
      
      try {
        const transcriptData = await api.transcripts.getBySessionId(id);
        if (transcriptData) {
          setTranscript(transcriptData.raw_text);
        }
      } catch (error) {
        console.log('No transcript found for this session');
      }
      
      try {
        const reportData = await api.reports.getBySessionId(id);
        if (reportData) {
          setReport(reportData);
        }
      } catch (error) {
        console.log('No report found for this session');
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchSessionData();
    }
  }, [user, id]);

  // Handle recording completion
  const handleRecordingComplete = () => {
    // Refresh transcript data
    fetchSessionData();
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-medical-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="mb-4"
              >
                &larr; Back to Dashboard
              </Button>
              
              {loading ? (
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-800">
                  {session?.patient_name || "Patient Session"}
                </h1>
              )}
            </div>
            
            {!loading && (
              <div className="text-sm text-gray-500">
                Created: {new Date(session?.created_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TranscriptViewer transcript={transcript} loading={loading} />
            
            <ReportEditor
              sessionId={id || ""}
              initialData={report}
              onSave={(updatedReport) => setReport(updatedReport)}
            />
          </div>
          
          <div className="space-y-8">
            <RecordingControl
              sessionId={id || ""}
              onRecordingComplete={handleRecordingComplete}
            />
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Session Information</h3>
              
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient:</span>
                    <span className="font-medium">{session?.patient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Session ID:</span>
                    <span className="font-medium">{id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">
                      {new Date(session?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">
                      {new Date(session?.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionDetail;
