import React, { useCallback, useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, FileText, File as FileIcon, Presentation, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [deckFile, setDeckFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!notesFile && !deckFile) {
      toast({ title: "Please select at least one file.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    if (notesFile) formData.append("notes", notesFile);
    if (deckFile) formData.append("presentation", deckFile);

    try {
      const response = await fetch("/api/generator/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const data = await response.json();
      setLocation(`/questionnaire/${data.sessionId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your files.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif text-primary tracking-tight">Takeaway Notes Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your rough speaker notes and presentation decks into polished, print-ready documents for your audience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <FileUploadZone 
            id="notes"
            title="Speaker Notes"
            description="Accepts PDF, DOCX"
            icon={<FileText className="w-8 h-8 text-primary" />}
            acceptedTypes=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            file={notesFile}
            onFileSelect={setNotesFile}
          />
          <FileUploadZone 
            id="deck"
            title="Presentation"
            description="Accepts PPTX"
            icon={<Presentation className="w-8 h-8 text-primary" />}
            acceptedTypes=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            file={deckFile}
            onFileSelect={setDeckFile}
          />
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="px-12 py-6 text-lg" 
            onClick={handleProcess} 
            disabled={isUploading || (!notesFile && !deckFile)}
          >
            {isUploading ? "Processing..." : "Process Files"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileUploadZone({ 
  id, title, description, icon, acceptedTypes, file, onFileSelect 
}: { 
  id: string, title: string, description: string, icon: React.ReactNode, acceptedTypes: string, file: File | null, onFileSelect: (f: File | null) => void 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 border-2 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer ${
        isDragOver ? "border-primary bg-primary/5" : 
        file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef} 
        accept={acceptedTypes}
        onChange={onChange}
      />
      
      {file ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-foreground line-clamp-1 break-all px-4">{file.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-4 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <p className="text-sm text-primary font-medium mt-4">
            Click or drag and drop
          </p>
        </div>
      )}
    </Card>
  );
}
