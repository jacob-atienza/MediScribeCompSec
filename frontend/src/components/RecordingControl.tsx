
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff } from "lucide-react";

type RecordingControlProps = {
  sessionId: string;
  onRecordingComplete?: () => void;
};

export const RecordingControl = ({ sessionId, onRecordingComplete }: RecordingControlProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startRecording = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // await api.recording.start(sessionId);
      
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Audio recording has begun",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // await api.recording.stop(sessionId);
      
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Audio recording has been saved",
      });
      
      if (onRecordingComplete) {
        onRecordingComplete();
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast({
        title: "Error",
        description: "Failed to stop recording",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isRecording && <span className="recording-indicator"></span>}
          Recording
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            {isRecording ? (
              <div className="text-red-500 font-medium">Recording in progress...</div>
            ) : (
              <div className="text-gray-500">Click to start recording the consultation</div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className={`h-16 w-16 rounded-full ${isRecording ? "bg-red-500" : "bg-medical-primary"}`}
              disabled={loading}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            {isRecording
              ? "Click to stop recording"
              : "The recorded audio will be transcribed automatically"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
