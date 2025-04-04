
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-medical-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
                  Streamline Your Patient Records with AI-Powered Transcription
                </h1>
                <p className="text-lg text-gray-600">
                  Our intelligent medical assistant automatically transcribes 
                  patient consultations and generates structured clinical reports, 
                  saving you time and improving documentation quality.
                </p>
                <div className="pt-4 space-x-4">
                  {user ? (
                    <Button 
                      size="lg" 
                      className="bg-medical-primary hover:bg-medical-primary/90"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="lg" 
                        className="bg-medical-primary hover:bg-medical-primary/90"
                        onClick={() => navigate("/signup")}
                      >
                        Get Started
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => navigate("/login")}
                      >
                        Log In
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative">
                <div className="absolute right-4 top-4 bg-medical-primary text-white text-xs px-2 py-1 rounded">
                  Live Demo
                </div>
                <h3 className="font-medium mb-4 text-lg">Example Transcript</h3>
                <div className="space-y-3">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <span className="font-medium">Doctor:</span> Hello, how are you feeling today?
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3">
                    <span className="font-medium">Patient:</span> I've been experiencing headaches and feeling tired lately.
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <span className="font-medium">Doctor:</span> How long have you been experiencing these symptoms?
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3">
                    <span className="font-medium">Patient:</span> For about two weeks now.
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-2">AI-Generated Summary</h4>
                  <p className="text-sm text-gray-700">
                    Patient reports headaches and fatigue for the past two weeks.
                    Recommend checking vitals and discussing potential causes including
                    stress, dehydration, or sleep issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Record</h3>
                <p className="text-gray-600">
                  Start a recording during your patient consultation with a single click
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transcribe</h3>
                <p className="text-gray-600">
                  Our AI automatically transcribes the conversation into a structured format
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="h-8 w-8 text-medical-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Edit & Save</h3>
                <p className="text-gray-600">
                  Review, edit, and save the generated clinical report with ease
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Medical Records Assistant. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Mic, FileText, Edit } from "lucide-react";
