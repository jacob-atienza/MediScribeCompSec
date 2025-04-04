import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type PatientSelectProps = {
  onPatientSelected: (patientId: string, patientName: string) => void;
};

export const PatientSelect = ({ onPatientSelected }: PatientSelectProps) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [createNew, setCreateNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("");
  const { toast } = useToast();

  // Fetch existing patients
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await api.patients.getAll();
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patients",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const handleExistingPatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      onPatientSelected(patient.id, patient.name);
    }
  };

  const handleCreateNewPatient = async () => {
    if (!newPatientName.trim()) {
      toast({
        title: "Error",
        description: "Patient name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const newPatient = await api.patients.create({
        name: newPatientName,
        dob: newPatientDob
      });
      
      onPatientSelected(newPatient.id, newPatient.name);
      
      toast({
        title: "Success",
        description: "New patient created",
      });
    } catch (error) {
      console.error("Error creating patient:", error);
      toast({
        title: "Error",
        description: "Failed to create patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Patient Information</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCreateNew(!createNew)}
        >
          {createNew ? "Select Existing" : "Create New"}
        </Button>
      </div>

      {createNew ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              placeholder="Enter patient name"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientDob">Date of Birth</Label>
            <Input
              id="patientDob"
              type="date"
              value={newPatientDob}
              onChange={(e) => setNewPatientDob(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateNewPatient} 
            disabled={loading || !newPatientName.trim()}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Patient & Continue"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientSelect">Select Patient</Label>
            <Select onValueChange={handleExistingPatientSelect}>
              <SelectTrigger id="patientSelect" className="w-full">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading patients...
                  </SelectItem>
                ) : patients.length > 0 ? (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No patients found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
