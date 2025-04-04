import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PatientSelect } from "@/components/PatientSelect";

type NewSessionFormProps = {
  onSuccess: () => void;
};

export const NewSessionForm = ({ onSuccess }: NewSessionFormProps) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePatientSelected = (patientId: string, patientName: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Please select or create a patient",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const session = await api.sessions.create({
        patient_id: selectedPatientId,
        patient_name: selectedPatientName
      });
      
      toast({
        title: "Success",
        description: "New patient session created",
      });
      
      // Clear form and trigger refresh
      setSelectedPatientId(null);
      setSelectedPatientName("");
      onSuccess();
      
      // Optionally navigate to the new session
      // navigate(`/session/${session.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Start New Patient Session</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <PatientSelect onPatientSelected={handlePatientSelected} />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-medical-primary" 
            disabled={loading || !selectedPatientId}
          >
            {loading ? "Creating..." : "Create Session"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
