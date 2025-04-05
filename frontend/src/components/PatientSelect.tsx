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
  const [newPatientFirstName, setNewPatientFirstName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientPassword, setNewPatientPassword] = useState("");
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
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      onPatientSelected(
        patient.id,
        `${patient.first_name} ${patient.last_name}`
      );
    }
  };

  const handleCreateNewPatient = async () => {
    if (
      !newPatientFirstName.trim() ||
      !newPatientLastName.trim() ||
      !newPatientEmail.trim() ||
      !newPatientPassword.trim()
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const newPatient = await api.patients.create({
        first_name: newPatientFirstName,
        last_name: newPatientLastName,
        email: newPatientEmail,
        password: newPatientPassword,
        dob: newPatientDob,
      });

      onPatientSelected(
        newPatient.id,
        `${newPatient.first_name} ${newPatient.last_name}`
      );

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
          onClick={() => setCreateNew(!createNew)}>
          {createNew ? "Select Existing" : "Create New"}
        </Button>
      </div>

      {createNew ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientFirstName">First Name</Label>
            <Input
              id="patientFirstName"
              placeholder="Enter first name"
              value={newPatientFirstName}
              onChange={(e) => setNewPatientFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientLastName">Last Name</Label>
            <Input
              id="patientLastName"
              placeholder="Enter last name"
              value={newPatientLastName}
              onChange={(e) => setNewPatientLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email</Label>
            <Input
              id="patientEmail"
              type="email"
              placeholder="Enter email"
              value={newPatientEmail}
              onChange={(e) => setNewPatientEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPassword">Password</Label>
            <Input
              id="patientPassword"
              type="password"
              placeholder="Enter password"
              value={newPatientPassword}
              onChange={(e) => setNewPatientPassword(e.target.value)}
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
            disabled={
              loading ||
              !newPatientFirstName.trim() ||
              !newPatientLastName.trim() ||
              !newPatientEmail.trim() ||
              !newPatientPassword.trim()
            }
            className="w-full">
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
                      {patient.first_name} {patient.last_name}
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
