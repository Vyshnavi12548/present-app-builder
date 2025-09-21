import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, File, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
}

const FileUpload = ({ onFilesUploaded }: { onFilesUploaded: (files: File[]) => void }) => {
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

  const handleFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    const validFiles: File[] = [];
    
    files.forEach(file => {
      if (validTypes.includes(file.type)) {
        validFiles.push(file);
        const newFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate upload process
        setTimeout(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.name === file.name ? { ...f, status: 'success' } : f
          ));
        }, 1000 + Math.random() * 1000);
        
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not supported. Please upload PDF, DOCX, or image files.`,
          variant: "destructive"
        });
      }
    });
    
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