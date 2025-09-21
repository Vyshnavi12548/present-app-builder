import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import EventsPreview from "@/components/EventsPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Calendar } from "lucide-react";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [hasProcessedFiles, setHasProcessedFiles] = useState(false);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    // Simulate AI processing
    setTimeout(() => {
      setHasProcessedFiles(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero Section */}
        <div className="text-center py-12 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
              AI Calendar Agent
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform any document into organized calendar events instantly. 
            Our intelligent AI reads your PDFs, Word docs, and images to automatically create Google Calendar events.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Smart Document Processing
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              95% Accuracy Rate
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Instant Google Sync
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2" disabled={!hasProcessedFiles}>
              <Calendar className="w-4 h-4" />
              Review Events ({hasProcessedFiles ? 3 : 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload onFilesUploaded={handleFilesUploaded} />
            
            {uploadedFiles.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Brain className="w-4 h-4 animate-pulse" />
                  <span className="font-medium">AI is processing your documents...</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsPreview />
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Smart AI Extraction",
              description: "Our advanced AI understands context and extracts event details with 95% accuracy"
            },
            {
              icon: <FileText className="w-6 h-6" />, 
              title: "Multiple Formats",
              description: "Works with PDFs, Word documents, spreadsheet images, and more file types"
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: "Instant Calendar Sync", 
              description: "Events automatically appear in your Google Calendar with all the right details"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl gradient-card shadow-ai">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
