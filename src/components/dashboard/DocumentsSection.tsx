import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { SectionProps, translations, Message } from './constants';
import { mockDocuments } from './data';

export default function DocumentsSection({ onNavigate, onAddToHistory }: SectionProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleDocumentSelect = (doc: any) => {
    setSelectedDocument(doc.id);
    onNavigate?.('aiSystem', { type: 'document', data: doc });
    onAddToHistory?.(`Document Analysis: ${doc.name}`);
  };

  const documents = mockDocuments.map(doc => ({
    ...doc,
    modified: language === 'ru' ? doc.modified : doc.modified.replace('день', 'day').replace('дня', 'days').replace('дней', 'days').replace('неделю', 'week')
  }));

  if (selectedDocument) {
    const doc = documents.find(d => d.id === selectedDocument);
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedDocument(null)}>
            {t.backToDocuments}
          </Button>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileText className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{doc?.name}</h1>
          </div>
        </div>
        <Card className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">
            {language === 'ru' 
              ? 'Документ открыт. Используйте ИИ Систему для анализа.'
              : 'Document opened. Use AI System for analysis.'
            }
          </p>
          <Button className="w-full mt-4" onClick={() => onNavigate?.('aiSystem')}>
            <Brain className="w-4 h-4 mr-2" />
            {t.openWithAi}
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileText className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.aiLegalDocuments}</h1>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card 
              className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20"
              onClick={() => handleDocumentSelect(doc)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>{t.size}: {doc.size}</span>
                    <span>{doc.modified}</span>
                  </div>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-primary/5 to-blue-500/5 hover:from-primary/10 hover:to-blue-500/10">
                    <Brain className="w-4 h-4 mr-2" />
                    {t.openWithAi}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}