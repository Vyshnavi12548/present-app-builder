import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, File, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'success' | 'error';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees?: number;
  description?: string;
  confidence: number;
}

const FileUpload = ({ onFilesUploaded, onEventsExtracted }: { 
  onFilesUploaded: (files: File[]) => void;
  onEventsExtracted: (events: CalendarEvent[]) => void;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const extractEventsFromText = (text: string, fileName: string): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    // Enhanced regex patterns for better event detection
    const eventPatterns = [
      // Meeting patterns
      /(?:meeting|session|workshop|conference|call|demo|presentation|training|seminar|webinar|review)\s*:?\s*(.+?)(?:\n|$)/gi,
      // Date and time patterns
      /(\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\s*(?:at|@)?\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/gi,
      // Event with location
      /(?:event|appointment|booking)\s*:?\s*(.+?)(?:\s+at\s+(.+?))?(?:\n|$)/gi
    ];

    const lines = text.split('\n');
    let eventId = 1;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 10) return; // Skip short lines
      
      // Look for time patterns
      const timeMatch = trimmedLine.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i);
      // Look for date patterns
      const dateMatch = trimmedLine.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i);
      
      // If we find both date and time, it's likely an event
      if (timeMatch || dateMatch || 
          /meeting|session|workshop|conference|call|demo|presentation|training|seminar|webinar|review|appointment|event/i.test(trimmedLine)) {
        
        const event: CalendarEvent = {
          id: `${fileName}-${eventId++}`,
          title: trimmedLine.length > 50 ? trimmedLine.substring(0, 50) + '...' : trimmedLine,
          date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
          time: timeMatch ? timeMatch[1] : "TBD",
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
        };
        
        // Extract location if mentioned
        const locationMatch = trimmedLine.match(/(?:at|@|in|room|location)\s+([^,.\n]+)/i);
        if (locationMatch) {
          event.location = locationMatch[1].trim();
        }
        
        // Extract attendees if mentioned
        const attendeesMatch = trimmedLine.match(/(\d+)\s+(?:people|attendees|participants)/i);
        if (attendeesMatch) {
          event.attendees = parseInt(attendeesMatch[1]);
        }
        
        // Add description from context
        if (index > 0) {
          event.description = lines[index - 1]?.trim() || "Extracted from document";
        }
        
        events.push(event);
      }
    });
    
    return events;
  };

  const handleFiles = async (files: File[]) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    const validFiles: File[] = [];
    
    for (const file of files) {
      if (validTypes.includes(file.type)) {
        validFiles.push(file);
        const newFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        try {
          // Update status to processing
          setUploadedFiles(prev => prev.map(f => 
            f.name === file.name ? { ...f, status: 'processing' } : f
          ));
          
          // For demo purposes, we'll simulate document parsing with realistic content
          setTimeout(async () => {
            try {
              let extractedText = "";
              
              // Simulate different types of documents
              if (file.name.toLowerCase().includes('meeting')) {
                extractedText = `Team Meeting: Q4 Planning Session
Date: ${new Date().toLocaleDateString()}
Time: 10:00 AM - 11:30 AM
Location: Conference Room A
Attendees: 8 people
Agenda: Review quarterly objectives and plan for Q4 deliverables`;
              } else if (file.name.toLowerCase().includes('schedule')) {
                extractedText = `Weekly Schedule
Monday: Project review meeting at 9:00 AM
Wednesday: Client presentation at 2:00 PM in Room B
Friday: Team workshop from 1:00 PM to 4:00 PM`;
              } else {
                extractedText = `Event Planning Document
${file.name.replace(/\.[^/.]+$/, "")}
Date: ${new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Time: ${Math.floor(Math.random() * 12) + 1}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]} ${Math.random() > 0.5 ? 'AM' : 'PM'}
Important meeting scheduled for project discussion and planning`;
              }
              
              const events = extractEventsFromText(extractedText, file.name);
              onEventsExtracted(events);
              
              setUploadedFiles(prev => prev.map(f => 
                f.name === file.name ? { ...f, status: 'success' } : f
              ));
              
            } catch (error) {
              console.error('Error processing file:', error);
              setUploadedFiles(prev => prev.map(f => 
                f.name === file.name ? { ...f, status: 'error' } : f
              ));
            }
          }, 2000 + Math.random() * 2000);
          
        } catch (error) {
          console.error('Error handling file:', error);
          setUploadedFiles(prev => prev.map(f => 
            f.name === file.name ? { ...f, status: 'error' } : f
          ));
        }
        
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not supported. Please upload PDF, DOCX, or image files.`,
          variant: "destructive"
        });
      }
    }
    
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
      toast({
        title: "Files uploaded successfully",
        description: `Processing ${validFiles.length} file(s) for calendar events.`,
      });
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 gradient-card shadow-ai">
        <CardContent className="p-8">
          <div
            className={`upload-zone rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive ? 'dragover scale-105' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload your documents</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Drag and drop your files here, or click to browse. We support PDF, DOCX, and image files.
            </p>
            
            <Button 
              variant="ai" 
              size="lg" 
              onClick={onButtonClick}
              className="mb-4"
            >
              <Upload className="mr-2 h-5 w-5" />
              Choose Files
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, JPG, PNG • Max size: 20MB per file
            </p>
          </div>
          
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleChange}
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            className="hidden"
          />
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="shadow-ai">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Uploaded Files</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {file.status === 'processing' && (
                      <div className="flex items-center gap-1 text-primary">
                        <Brain className="w-4 h-4 animate-pulse" />
                        <span className="text-xs">AI Processing...</span>
                      </div>
                    )}
                    {file.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;