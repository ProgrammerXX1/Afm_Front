import React, { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  type: string;
}

export default function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const uploadFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        type: file.type || 'unknown'
      };

      setUploadedFiles(prev => [...prev, uploadFile]);

      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => {
            if (f.id === fileId) {
              const newProgress = f.progress + Math.random() * 30;
              if (newProgress >= 100) {
                clearInterval(interval);
                return { ...f, progress: 100, status: Math.random() > 0.1 ? 'completed' : 'error' };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 200);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Upload Files</h1>
      
      <Card 
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3>Drag and drop files here</h3>
            <p className="text-muted-foreground">or click to select files</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => document.getElementById('fileInput')?.click()}>
              Select Files
            </Button>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-muted-foreground">
            Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD, Images
          </p>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Upload Progress</h3>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <File className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="truncate">{file.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{file.status}</span>
                  </div>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="w-full" />
                  )}
                </div>
                <div className="flex items-center">
                  {getStatusIcon(file.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {[
            { name: 'presentation-draft.pptx', size: '4.2 MB', uploaded: '2 hours ago' },
            { name: 'financial-report.xlsx', size: '1.8 MB', uploaded: '1 day ago' },
            { name: 'project-specs.pdf', size: '892 KB', uploaded: '2 days ago' },
            { name: 'design-mockup.png', size: '2.1 MB', uploaded: '3 days ago' },
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>{file.name}</p>
                  <p className="text-sm text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{file.uploaded}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}