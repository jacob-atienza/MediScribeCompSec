
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api, mockData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type Report = {
  summary: string;
  symptoms: string;
  medications: string;
  followups: string;
  notes: string;
};

type ReportEditorProps = {
  sessionId: string;
  initialData?: Report;
  onSave?: (report: Report) => void;
};

export const ReportEditor = ({ sessionId, initialData, onSave }: ReportEditorProps) => {
  const [report, setReport] = useState<Report>({
    summary: "",
    symptoms: "",
    medications: "",
    followups: "",
    notes: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setReport(initialData);
    } else {
      // Fetch report data if no initial data is provided
      fetchReportData();
    }
  }, [sessionId, initialData]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // const data = await api.reports.getBySessionId(sessionId);
      
      // Mock implementation for now
      const mockReport = mockData.reports[sessionId as keyof typeof mockData.reports];
      
      if (mockReport) {
        setReport(mockReport);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof Report
  ) => {
    setReport((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real implementation, this would call the API
      // await api.reports.update(sessionId, report);
      
      // Mock implementation for now
      mockData.reports[sessionId as keyof typeof mockData.reports] = report;
      
      toast({
        title: "Success",
        description: "Report saved successfully",
      });
      
      if (onSave) {
        onSave(report);
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: "Failed to save report",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Report</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-4">
            {["summary", "symptoms", "medications", "followups", "notes"].map(
              (section) => (
                <div key={section} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="report-section">
            <label htmlFor="summary" className="report-title">
              Summary
            </label>
            <Textarea
              id="summary"
              placeholder="Enter consultation summary"
              value={report.summary}
              onChange={(e) => handleChange(e, "summary")}
              className="w-full resize-none h-24"
            />
          </div>

          <div className="report-section">
            <label htmlFor="symptoms" className="report-title">
              Symptoms
            </label>
            <Textarea
              id="symptoms"
              placeholder="List patient symptoms"
              value={report.symptoms}
              onChange={(e) => handleChange(e, "symptoms")}
              className="w-full resize-none h-24"
            />
          </div>

          <div className="report-section">
            <label htmlFor="medications" className="report-title">
              Medications & Treatments
            </label>
            <Textarea
              id="medications"
              placeholder="Enter prescribed medications and treatments"
              value={report.medications}
              onChange={(e) => handleChange(e, "medications")}
              className="w-full resize-none h-24"
            />
          </div>

          <div className="report-section">
            <label htmlFor="followups" className="report-title">
              Follow-ups
            </label>
            <Textarea
              id="followups"
              placeholder="Enter recommended follow-up actions"
              value={report.followups}
              onChange={(e) => handleChange(e, "followups")}
              className="w-full resize-none h-24"
            />
          </div>

          <div className="report-section">
            <label htmlFor="notes" className="report-title">
              Additional Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or observations"
              value={report.notes}
              onChange={(e) => handleChange(e, "notes")}
              className="w-full resize-none h-24"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          className="w-full bg-medical-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Report"}
        </Button>
      </CardFooter>
    </Card>
  );
};
