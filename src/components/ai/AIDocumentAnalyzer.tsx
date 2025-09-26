import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Brain, Database, FileText, ArrowLeft, Copy, Download, Share, CheckCircle, AlertCircle, FileCheck, X, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';

interface Document {
  id: string;
  name: string;
  type: string;
  content?: string;
}

interface AIDocumentAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  aiType: 'completeness' | 'legal';
}

const translations = {
  en: {
    completenessAnalyzer: 'AI Document Completeness Analyzer',
    legalAnalyzer: 'AI Legal Database Analyzer',
    analyzing: 'Analyzing document...',
    analysis: 'Analysis',
    recommendations: 'Recommendations',
    legalReferences: 'Legal References',
    compliance: 'Compliance Check',
    compliant: 'Compliant',
    nonCompliant: 'Non-Compliant',
    partiallyCompliant: 'Partially Compliant',
    askQuestion: 'Ask a question about this document...',
    send: 'Send',
    copy: 'Copy',
    download: 'Download',
    share: 'Share',
    close: 'Close'
  },
  ru: {
    completenessAnalyzer: 'ИИ Анализатор Полноты Документов',
    legalAnalyzer: 'ИИ Анализатор Базы Законов',
    analyzing: 'Анализ документа...',
    analysis: 'Анализ',
    recommendations: 'Рекомендации',
    legalReferences: 'Правовые Ссылки',
    compliance: 'Проверка Соответствия',
    compliant: 'Соответствует',
    nonCompliant: 'Не соответствует',
    partiallyCompliant: 'Частично соответствует',
    askQuestion: 'Задайте вопрос о документе...',
    send: 'Отправить',
    copy: 'Копировать',
    download: 'Скачать',
    share: 'Поделиться',
    close: 'Закрыть'
  }
};

export default function AIDocumentAnalyzer({ isOpen, onClose, document, aiType }: AIDocumentAnalyzerProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai'}>>([]);

  React.useEffect(() => {
    if (isOpen && document && !analysisComplete) {
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  }, [isOpen, document, analysisComplete]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: chatMessage,
      sender: 'user' as const
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: aiType === 'completeness' 
          ? 'Согласно анализу полноты документа, требуется дополнить следующие разделы в соответствии с требованиями УПК РК...'
          : 'По данному вопросу применимы следующие нормы законодательства РК: УК РК ст. 190, УПК РК ст. 300-302...',
        sender: 'ai' as const
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getAnalysisResults = () => {
    if (aiType === 'completeness') {
      return {
        title: 'Анализ полноты документа',
        status: 'partiallyCompliant',
        score: 75,
        issues: [
          { type: 'critical', text: 'Отсутствует подпись прокурора (ст. 300 УПК РК)' },
          { type: 'warning', text: 'Не указана точная дата составления' },
          { type: 'info', text: 'Рекомендуется дополнить список доказательств' }
        ],
        recommendations: [
          'Добавить подпись прокурора согласно требованиям ст. 300 УПК РК',
          'Указать точную дату и время составления документа',
          'Детализировать размер причиненного ущерба с обоснованием',
          'Проверить процессуальные сроки по ст. 299 УПК РК'
        ]
      };
    } else {
      return {
        title: 'Анализ правовых норм',
        status: 'compliant',
        score: 95,
        legalRefs: [
          { code: 'УК РК', article: 'ст. 190', description: 'Мошенничество' },
          { code: 'УПК РК', article: 'ст. 300-302', description: 'Обвинительный акт' },
          { code: 'ГК РК', article: 'ст. 917', description: 'Возмещение ущерба' },
          { code: 'НК РК', article: 'ст. 231', description: 'Уклонение от налогов' }
        ],
        recommendations: [
          'Документ соответствует требованиям действующего законодательства РК',
          'Применимые нормы указаны корректно',
          'Рекомендуется дополнительно изучить судебную практику по аналогичным делам'
        ]
      };
    }
  };

  const results = getAnalysisResults();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'nonCompliant': return 'text-red-600 bg-red-50 border-red-200';
      case 'partiallyCompliant': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return t.compliant;
      case 'nonCompliant': return t.nonCompliant;
      case 'partiallyCompliant': return t.partiallyCompliant;
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'nonCompliant': return X;
      case 'partiallyCompliant': return AlertCircle;
      default: return FileCheck;
    }
  };

  const StatusIcon = getStatusIcon(results.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {aiType === 'completeness' ? (
                <Brain className="w-6 h-6 text-green-500" />
              ) : (
                <Database className="w-6 h-6 text-purple-500" />
              )}
              <div>
                <h2 className="text-lg">
                  {aiType === 'completeness' ? t.completenessAnalyzer : t.legalAnalyzer}
                </h2>
                {document && (
                  <p className="text-sm text-muted-foreground font-normal">{document.name}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-1" />
                {t.copy}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                {t.download}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-1" />
                {t.share}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t.close}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto">
            {isAnalyzing ? (
              <Card className="p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4"
                >
                  {aiType === 'completeness' ? (
                    <Brain className="w-12 h-12 text-green-500" />
                  ) : (
                    <Database className="w-12 h-12 text-purple-500" />
                  )}
                </motion.div>
                <p className="text-lg font-medium">{t.analyzing}</p>
              </Card>
            ) : analysisComplete ? (
              <div className="space-y-4">
                {/* Status Card */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{results.title}</h3>
                    <Badge className={`gap-1 ${getStatusColor(results.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      {getStatusText(results.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${results.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-medium">{results.score}%</span>
                  </div>
                </Card>

                {/* Issues/Legal References */}
                {aiType === 'completeness' && results.issues && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Выявленные вопросы</h4>
                    <div className="space-y-2">
                      {results.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          {issue.type === 'critical' && <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />}
                          {issue.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                          {issue.type === 'info' && <FileCheck className="w-4 h-4 text-blue-500 mt-0.5" />}
                          <span className="text-sm">{issue.text}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {aiType === 'legal' && results.legalRefs && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">{t.legalReferences}</h4>
                    <div className="space-y-2">
                      {results.legalRefs.map((ref, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded bg-muted/50">
                          <Badge variant="outline">{ref.code}</Badge>
                          <span className="font-medium">{ref.article}</span>
                          <span className="text-sm text-muted-foreground">{ref.description}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">{t.recommendations}</h4>
                  <div className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-1 flex flex-col">
            <Card className="flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Чат с ИИ</h4>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded text-sm ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-6' 
                        : 'bg-secondary mr-6'
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    {t.askQuestion}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={t.askQuestion}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">{t.send}</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}