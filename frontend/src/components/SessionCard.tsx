
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { User } from "lucide-react";

type SessionCardProps = {
  id: string;
  patientName: string;
  patientId: string;
  createdAt: string;
};

export const SessionCard = ({ id, patientName, patientId, createdAt }: SessionCardProps) => {
  const navigate = useNavigate();
  
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <div className="medical-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{patientName}</h3>
            <button 
              onClick={() => navigate(`/patient/${patientId}`)} 
              className="text-xs text-medical-primary hover:underline"
            >
              View Patient Details
            </button>
          </div>
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <Button 
          variant="outline" 
          className="text-sm"
          onClick={() => navigate(`/session/${id}`)}
        >
          View Session
        </Button>
        <div className="text-sm text-gray-500">
          Session ID: {id.substring(0, 8)}...
        </div>
      </div>
    </div>
  );
};
