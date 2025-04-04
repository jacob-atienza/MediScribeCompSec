
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { PlusCircle, User } from "lucide-react";

type PatientCardProps = {
  id: string;
  name: string;
  dob?: string;
  createdAt: string;
  sessionCount?: number;
  onNewSession?: (patientId: string, patientName: string) => void;
};

export const PatientCard = ({ 
  id, 
  name, 
  dob, 
  createdAt, 
  sessionCount = 0,
  onNewSession 
}: PatientCardProps) => {
  const navigate = useNavigate();
  
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <div className="medical-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
            {dob && (
              <div className="text-sm text-gray-500">
                DOB: {new Date(dob).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <span className="text-sm text-gray-500">Added {formattedDate}</span>
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <div className="text-sm text-gray-600">
          Total Sessions: {sessionCount}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => navigate(`/patient/${id}`)}
          >
            View Details
          </Button>
          
          {onNewSession && (
            <Button 
              onClick={() => onNewSession(id, name)} 
              variant="outline"
              className="text-sm text-medical-primary"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              New Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
