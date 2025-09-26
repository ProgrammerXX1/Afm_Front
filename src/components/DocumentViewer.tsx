import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, Download, Brain, Database } from 'lucide-react';
import { useAuth } from './AuthContext';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadDate: Date;
  uploadedBy: string;
  content?: string;
  caseId?: string;
}

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onDownload: (doc: Document) => void;
  onOpenWithAI: (doc: Document, aiType: 'completeness' | 'legal') => void;
}

const translations = {
  en: {
    documentContent: 'Document Content',
    fileType: 'File Type',
    fileSize: 'File Size',
    uploadedBy: 'Uploaded By',
    uploadedOn: 'Uploaded On',
    download: 'Download',
    openWithAICompleteness: 'AI Completeness',
    openWithAILegal: 'AI Legal Database',
  },
  ru: {
    documentContent: 'Содержание Документа',
    fileType: 'Тип Файла',
    fileSize: 'Размер Файла',
    uploadedBy: 'Загружено',
    uploadedOn: 'Дата Загрузки',
    download: 'Скачать',
    openWithAICompleteness: 'ИИ Полнота',
    openWithAILegal: 'ИИ База Законов',
  }
};

export default function DocumentViewer({ 
  isOpen, 
  onClose, 
  document, 
  onDownload, 
  onOpenWithAI 
}: DocumentViewerProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="truncate">{document.name}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => onDownload(document)}>
                <Download className="w-4 h-4 mr-2" />
                {t.download}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-muted/20 p-4 rounded-lg overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{t.documentContent}</h4>
                <div className="text-sm leading-relaxed whitespace-pre-wrap bg-background border rounded p-4 max-h-96 overflow-y-auto">
                  {document.content || (language === 'ru' 
                    ? 'Содержимое документа недоступно' 
                    : 'Document content unavailable')}
                </div>
              </div>
              
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">{t.fileType}</p>
                  <p className="font-medium">{document.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.fileSize}</p>
                  <p className="font-medium">{document.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.uploadedBy}</p>
                  <p className="font-medium">{document.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.uploadedOn}</p>
                  <p className="font-medium">{document.uploadDate.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              
              {/* AI Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenWithAI(document, 'completeness')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {t.openWithAICompleteness}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenWithAI(document, 'legal')}
                >
                  <Database className="w-4 h-4 mr-2" />
                  {t.openWithAILegal}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}