
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TranscriptViewerProps = {
  transcript: string;
  loading?: boolean;
};

export const TranscriptViewer = ({ transcript, loading = false }: TranscriptViewerProps) => {
  // Process transcript to distinguish between doctor and patient
  const processTranscript = (text: string) => {
    if (!text) return [];
    
    return text.split('\n').map((line, index) => {
      const isDoctor = line.toLowerCase().startsWith('doctor:');
      const isPatient = line.toLowerCase().startsWith('patient:');
      
      let className = '';
      
      if (isDoctor) {
        className = 'bg-secondary/30 rounded-lg px-3 py-2';
      } else if (isPatient) {
        className = 'bg-accent/30 rounded-lg px-3 py-2';
      }
      
      return { text: line, className, key: index };
    });
  };

  const processedTranscript = processTranscript(transcript);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {processedTranscript.length > 0 ? (
            processedTranscript.map((line) => (
              <div key={line.key} className={line.className}>
                {line.text}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No transcript available. Start recording to generate a transcript.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
