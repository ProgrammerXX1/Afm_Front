import React, { useState, useRef, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Brain, FileText, Scale, Database, Users, Send, Copy, Download, Share, Upload, ChevronUp, ChevronDown, X, File, FileCheck, AlertCircle, GripVertical, Maximize2, Minimize2, ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import DocumentsSection from '../dashboard/DocumentsSection';

interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiType: 'qualifier' | 'completeness' | 'legal' | 'evidence' | 'unified';
  attachments?: Array<{ name: string; type: string; size: string }>;
}

interface AISystemProps {
  context?: {
    type: 'case' | 'document' | 'general';
    data?: any;
  };
  onNavigate?: (section: string, context?: any, breadcrumbPath?: string[]) => void;
  selectedCase?: string;
  casesData?: any[];
  documents?: any[];
  onAddToHistory?: (caseId: string, caseName: string, documentType: string, section: string, context?: any) => void;
  breadcrumb?: string[];
}

const translations = {
  en: {
    aiSystem: 'AI Legal System',
    multiAgentSystem: 'Multi-Agent AI System',
    qualifier: 'LegИИ: AI',
    completeness: 'Document Completeness AI',
    legalDatabase: 'Legal Database AI',
    evidenceAnalyzer: 'Evidence Analyzer AI',
    unifiedSystem: 'Unified AI System',
    aiDocuments: 'AI Documents',
    
    qualifierDesc: 'Analyzes legal qualifications and classifications',
    completenessDesc: 'Checks document completeness and compliance',
    legalDesc: 'Searches and analyzes Kazakhstan legal database',
    evidenceDesc: 'Analyzes evidence and key legal moments',
    unifiedDesc: 'Combines all AI systems for comprehensive analysis',
    
    askQuestion: 'Ask a question to the AI system...',
    analyzing: 'AI is analyzing...',
    
    activeAI: 'Active AI',
    actions: 'Actions',
    copy: 'Copy',
    download: 'Download',
    share: 'Share',
    uploadFile: 'Upload File',
    generatedOutput: 'Generated Output',
    collapse: 'Collapse',
    expand: 'Expand',
    maximize: 'Maximize',
    minimize: 'Minimize',
    backToAI: 'Back to AI System',
    clearChat: 'Clear Chat',
    
    // File upload
    dragDropFiles: 'Drag & drop files here or click to upload',
    supportedFormats: 'Supported formats: PDF, DOC, DOCX, TXT',
    uploadSuccess: 'File uploaded successfully',
    uploadError: 'Error uploading file',
    
    // Context
    currentContext: 'Current Context',
    caseContext: 'Case Context',
    documentContext: 'Document Context'
  },
  ru: {
    aiSystem: 'ИИ Правовая система',
    multiAgentSystem: 'Мульти-агентная ИИ Система',
    qualifier: 'ИИ Квалификатор',
    completeness: 'ИИ Полнота Документов',
    legalDatabase: 'ИИ База Законов',
    evidenceAnalyzer: 'ИИ Анализатор Доказательств',
    unifiedSystem: 'Единая ИИ Система',
    aiDocuments: 'ИИ Документы',
    
    qualifierDesc: 'Анализирует правовые квалификации и классификации',
    completenessDesc: 'Проверяет полноту документов и соответствие требованиям',
    legalDesc: 'Поиск и анализ казахстанской правовой базы',
    evidenceDesc: 'Анализирует доказательства и ключевые правовые моменты',
    unifiedDesc: 'Объединяет все ИИ системы для комплексного анализа',
    
    askQuestion: 'Задайте вопрос ИИ системе...',
    analyzing: 'ИИ анализирует...',
    
    activeAI: 'Активный ИИ',
    actions: 'Действия',
    copy: 'Копировать',
    download: 'Скачать',
    share: 'Поделиться',
    uploadFile: 'Загрузить Файл',
    generatedOutput: 'Сгенерированный Результат',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    maximize: 'Развернуть',
    minimize: 'Свернуть',
    backToAI: 'Назад в ИИ Систему',
    clearChat: 'Очистить Чат',
    
    // File upload
    dragDropFiles: 'Перетащите файлы сюда или нажмите для загрузки',
    supportedFormats: 'Поддерживаемые форматы: PDF, DOC, DOCX, TXT',
    uploadSuccess: 'Файл успешно загружен',
    uploadError: 'Ошибка загрузки файла',
    
    // Context
    currentContext: 'Текущий Контекст',
    caseContext: 'Контекст Дела',
    documentContext: 'Контекст Документа'
  }
};

export default function AISystem({ context, onNavigate, selectedCase, casesData, documents, onAddToHistory, breadcrumb }: AISystemProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [activeAI, setActiveAI] = useState<'qualifier' | 'completeness' | 'legal' | 'evidence' | 'unified' | 'documents'>('unified');
  const [messages, setMessages] = useState<{[key: string]: AIMessage[]}>({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
  const [isOutputMaximized, setIsOutputMaximized] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState<{[key: string]: string}>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatWidth, setChatWidth] = useState(66.666); // 2/3 of the width initially
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action handlers
  const handleCopy = async () => {
    const currentMessages = messages[activeAI] || [];
    const currentOutput = generatedOutputs[activeAI] || '';
    
    let contentToCopy = '';
    
    // First, get chat messages
    if (currentMessages.length > 0) {
      contentToCopy += `=== ЧАТ С ${aiSystems.find(ai => ai.id === activeAI)?.name.toUpperCase()} ===\n\n`;
      currentMessages.forEach(msg => {
        const sender = msg.sender === 'user' ? 'ПОЛЬЗОВАТЕЛЬ' : 'ИИ';
        contentToCopy += `${sender} (${msg.timestamp.toLocaleString('ru-RU')}):\n${msg.text}\n\n`;
      });
    }
    
    // Then, add generated output if exists
    if (currentOutput) {
      contentToCopy += `\n=== СГЕНЕРИРОВАННЫЙ РЕЗУЛЬТАТ ===\n\n${currentOutput}`;
    }
    
    if (contentToCopy) {
      try {
        await navigator.clipboard.writeText(contentToCopy);
        // Show success feedback
        const button = document.querySelector('[data-copy-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = language === 'ru' ? 'Скопировано!' : 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = contentToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          console.log(language === 'ru' ? 'Скопировано в буфер обмена' : 'Copied to clipboard');
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDownload = () => {
    const currentMessages = messages[activeAI] || [];
    const currentOutput = generatedOutputs[activeAI] || '';
    
    let contentToDownload = '';
    
    // Chat messages
    if (currentMessages.length > 0) {
      contentToDownload += `=== ЧАТ С ${aiSystems.find(ai => ai.id === activeAI)?.name.toUpperCase()} ===\n\n`;
      currentMessages.forEach(msg => {
        const sender = msg.sender === 'user' ? 'ПОЛЬЗОВАТЕЛЬ' : 'ИИ';
        contentToDownload += `${sender} (${msg.timestamp.toLocaleString('ru-RU')}):\n${msg.text}\n\n`;
      });
    }
    
    // Generated output
    if (currentOutput) {
      contentToDownload += `\n=== СГЕНЕРИРОВАННЫЙ РЕЗУЛЬТАТ ===\n\n${currentOutput}`;
    }
    
    if (contentToDownload) {
      const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_${activeAI}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleShare = () => {
    const currentMessages = messages[activeAI] || [];
    const currentOutput = generatedOutputs[activeAI] || '';
    
    let contentToShare = '';
    
    if (currentMessages.length > 0) {
      contentToShare += `Чат с ${aiSystems.find(ai => ai.id === activeAI)?.name}: ${currentMessages.length} сообщений\n`;
    }
    
    if (currentOutput) {
      contentToShare += `Сгенерирован отчет: ${currentOutput.slice(0, 100)}...`;
    }
    
    // For now, use a random Google link as requested
    const shareUrl = 'https://www.google.com/search?q=' + encodeURIComponent(`AI Legal Assistant ${aiSystems.find(ai => ai.id === activeAI)?.name}`);
    
    if (navigator.share && contentToShare) {
      navigator.share({
        title: `AI Legal Assistant - ${aiSystems.find(ai => ai.id === activeAI)?.name}`,
        text: contentToShare,
        url: shareUrl
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log(language === 'ru' ? 'Ссылка скопирована в буфер обмена' : 'Link copied to clipboard');
        // Show feedback
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = language === 'ru' ? 'Ссылка скопирована!' : 'Link copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      }).catch(console.error);
    }
  };

  const handleClearChat = () => {
    const confirmed = window.confirm(
      language === 'ru' 
        ? 'Вы уверены, что хотите очистить историю чата для этого ИИ?' 
        : 'Are you sure you want to clear the chat history for this AI?'
    );
    
    if (confirmed) {
      setMessages(prev => ({
        ...prev,
        [activeAI]: []
      }));
      setGeneratedOutputs(prev => ({
        ...prev,
        [activeAI]: ''
      }));
    }
  };

  const aiSystems = [
    {
      id: 'qualifier' as const,
      name: t.qualifier,
      description: t.qualifierDesc,
      icon: Scale,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'completeness' as const,
      name: t.completeness,
      description: t.completenessDesc,
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'legal' as const,
      name: t.legalDatabase,
      description: t.legalDesc,
      icon: Database,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'evidence' as const,
      name: t.evidenceAnalyzer,
      description: t.evidenceDesc,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'unified' as const,
      name: t.unifiedSystem,
      description: t.unifiedDesc,
      icon: Brain,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'documents' as const,
      name: t.aiDocuments,
      description: language === 'ru' ? 'Генерация и работа с юридическими документами' : 'Generate and work with legal documents',
      icon: FileText,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    }
  ];

  // Load chat history from localStorage
  React.useEffect(() => {
    const savedChats = localStorage.getItem('aiChatHistory');
    const savedOutputs = localStorage.getItem('aiGeneratedOutputs');
    
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Convert timestamp strings back to Date objects
        Object.keys(parsedChats).forEach(aiType => {
          parsedChats[aiType] = parsedChats[aiType].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        setMessages(parsedChats);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
    
    if (savedOutputs) {
      try {
        setGeneratedOutputs(JSON.parse(savedOutputs));
      } catch (error) {
        console.error('Error loading generated outputs:', error);
      }
    }
  }, []);

  // Save to localStorage whenever messages or outputs change
  React.useEffect(() => {
    localStorage.setItem('aiChatHistory', JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    localStorage.setItem('aiGeneratedOutputs', JSON.stringify(generatedOutputs));
  }, [generatedOutputs]);

  React.useEffect(() => {
    if (activeAI === 'documents') return; // Don't show welcome message for documents tab
    
    // Check if we have a document context that should set the AI type
    if (context?.aiType && context.aiType !== activeAI) {
      if (context.aiType === 'completeness') {
        setActiveAI('completeness');
      } else if (context.aiType === 'legal') {
        setActiveAI('legal');
      }
      return;
    }

    // Skip if we already have messages for this AI (loaded from localStorage)
    if (messages[activeAI] && messages[activeAI].length > 0) {
      return;
    }
    
    const getWelcomeMessage = () => {
      let welcomeText = '';
      
      // If we have a document context, customize the welcome message
      if (context?.type === 'document' && context.data) {
        const documentName = context.data.name;
        const baseWelcome = activeAI === 'completeness' 
          ? (language === 'ru' 
            ? `Я ИИ Полнота Документов. Анализирую документ "${documentName}" на соответствие требованиям УПК РК.`
            : `I am the Document Completeness AI. Analyzing document "${documentName}" for CCP RK compliance.`)
          : (language === 'ru'
            ? `Я ИИ База Законов. Анализирую документ "${documentName}" в контексте законодательства РК.`
            : `I am the Legal Database AI. Analyzing document "${documentName}" in the context of RK legislation.`);
        return baseWelcome;
      }
      
      switch (activeAI) {
        case 'qualifier':
          welcomeText = language === 'ru' 
            ? 'Я ИИ Квалификатор. Специализируюсь на анализе правовых квалификаций по УК РК, определении составов преступлений и применимых статей закона.'
            : 'I am the LegИИ: AI. I specialize in analyzing legal qualifications under CC RK, determining crime elements and applicable law articles.';
          break;
        case 'completeness':
          welcomeText = language === 'ru'
            ? 'Я ИИ Полнота Документов. Проверяю документы на соответствие требованиям УПК РК, полноту заполнения и процессуальную правильность. Загрузите документ для проверки.'
            : 'I am the Document Completeness AI. I check documents for CCP RK compliance, completeness and procedural correctness. Upload a document for verification.';
          break;
        case 'legal':
          welcomeText = language === 'ru'
            ? 'Я ИИ База Законов. Имею доступ ко всему законодательству РК: УК, УПК, ГК, КоАП, НК и др. Загрузите документ или задайте вопрос о правовых нормах.'
            : 'I am the Legal Database AI. I have access to all RK legislation: CC, CCP, Civil Code, Administrative Code, Tax Code, etc. Upload a document or ask about legal norms.';
          break;
        case 'evidence':
          welcomeText = language === 'ru'
            ? 'Я ИИ Анализатор Доказательств. Анализирую все документы дела, выявляю ключевые моменты, противоречия и пробелы в доказательной базе.'
            : 'I am the Evidence Analyzer AI. I analyze all case documents, identify key moments, contradictions and gaps in the evidence base.';
          break;
        case 'unified':
          welcomeText = language === 'ru'
            ? 'Я Единая ИИ Система РК. Объединяю возможности всех ИИ-ассистентов: квалификатора, анализатора полноты, базы законов и анализатора доказательств для комплексного правового анализа.'
            : 'I am the Unified AI System RK. I combine capabilities of all AI assistants: qualifier, completeness analyzer, legal database and evidence analyzer for comprehensive legal analysis.';
          break;
      }

      return welcomeText;
    };

    const welcomeMessage = getWelcomeMessage();
    const initialMessages = [{
      id: '1',
      text: welcomeMessage,
      sender: 'ai' as const,
      timestamp: new Date(),
      aiType: activeAI as any
    }];

    // If we have a document context, add a message about the loaded document
    if (context?.type === 'document' && context.data) {
      const documentMessage = {
        id: '2',
        text: language === 'ru' 
          ? `Документ "${context.data.name}" загружен и готов к анализу. Начинаю проверку...`
          : `Document "${context.data.name}" loaded and ready for analysis. Starting review...`,
        sender: 'ai' as const,
        timestamp: new Date(),
        aiType: activeAI as any
      };
      initialMessages.push(documentMessage);
    }

    setMessages(prev => ({
      ...prev,
      [activeAI]: initialMessages
    }));
  }, [activeAI, language, context]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: `Загружен файл: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        aiType: activeAI as any,
        attachments: [{ name: file.name, type: file.type, size: `${(file.size / 1024 / 1024).toFixed(2)} MB` }]
      };

      setMessages(prev => ({
        ...prev,
        [activeAI]: [...(prev[activeAI] || []), userMessage]
      }));
      
      // Add to history
      if (onAddToHistory && selectedCase && casesData) {
        const caseData = casesData.find(c => c.id === selectedCase);
        if (caseData) {
          onAddToHistory(selectedCase, caseData.name, `File Upload: ${file.name}`, 'aiSystem', { type: 'document', data: { name: file.name } });
        }
      }
      
      // Simulate AI processing
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          text: language === 'ru'
            ? `Файл "${file.name}" успешно загружен и обработан. Анализирую содержимое согласно требованиям ${activeAI === 'completeness' ? 'УПК РК' : activeAI === 'legal' ? 'законодательства РК' : 'системы'}...`
            : `File "${file.name}" successfully uploaded and processed. Analyzing content according to ${activeAI === 'completeness' ? 'CCP RK' : activeAI === 'legal' ? 'RK legislation' : 'system'} requirements...`,
          sender: 'ai',
          timestamp: new Date(),
          aiType: activeAI as any
        };
        setMessages(prev => ({
          ...prev,
          [activeAI]: [...(prev[activeAI] || []), aiResponse]
        }));
      }, 1000);
    });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      aiType: activeAI as any
    };

    setMessages(prev => ({
      ...prev,
      [activeAI]: [...(prev[activeAI] || []), userMessage]
    }));
    setCurrentMessage('');
    setIsProcessing(true);

    // Add to history for AI generated content
    if (onAddToHistory && selectedCase && casesData) {
      const caseData = casesData.find(c => c.id === selectedCase);
      if (caseData) {
        onAddToHistory(selectedCase, caseData.name, `AI ${activeAI}: ${currentMessage.slice(0, 50)}...`, 'aiSystem', context);
      }
    }

    setTimeout(() => {
      let aiResponseText = '';
      const lowerMessage = currentMessage.toLowerCase();
      
      switch (activeAI) {
        case 'qualifier':
          if (lowerMessage.includes('квалификац') || lowerMessage.includes('статья') || lowerMessage.includes('ук рк')) {
            aiResponseText = language === 'ru'
              ? `Анализирую предоставленные факты и применимые статьи УК РК. Выявлены признаки преступления по статье 190 УК РК (мошенничество). Рекомендую дополнительно проверить квалифицирующие признаки по частям 2-4 данной статьи.`
              : `I'm analyzing the provided facts and applicable CC RK articles. Crime elements under Article 190 CC RK (fraud) are identified. I recommend additionally checking qualifying features under parts 2-4 of this article.`;
          } else {
            aiResponseText = language === 'ru'
              ? 'Я специализируюсь на правовой квалификации. Предоставьте фактические обстоятельства дела, и я определю применимые статьи УК РК.'
              : 'I specialize in legal qualification. Provide case facts and I will determine applicable CC RK articles.';
          }
          break;

        case 'completeness':
          aiResponseText = language === 'ru'
            ? `Проверил документ на соответствие УПК РК. Обнаружены следующие недостатки: отсутствует подпись прокурора, не указана дата составления, требуется дополнить список доказательств согласно ст. 302 УПК РК.`
            : `Checked document for CCP RK compliance. Found following deficiencies: prosecutor's signature missing, composition date not specified, evidence list needs completion according to Art. 302 CCP RK.`;
          
          // Generate comprehensive output for completeness check
          const outputContent = language === 'ru' ? `ЗАКЛЮЧЕНИЕ ПО ПРОВЕРКЕ ПОЛНОТЫ ДОКУМЕНТА

Документ: Обвинительный акт
Дата проверки: ${new Date().toLocaleDateString('ru-RU')}
ИИ Система: Анализатор Полноты Документов

РЕЗУЛЬТАТЫ ПРОВЕРКИ:
✓ Структура документа соответствует требованиям УПК РК ст. 300
✗ Отсутствует подпись прокурора
✗ Не указана точная дата составления
✓ Перечень доказательств присутствует
✗ Недостаточно детализирован размер ущерба
✓ Квалификация преступления указана корректно
✗ Отсутствуют данные о процессуальных нарушениях

СООТВЕТСТВИЕ ТРЕБОВАНИЯМ УПК РК:
- Статья 300: Частично соответствует
- Статья 301: Требует доработки
- Статья 302: Соответствует

РЕКОМЕНДАЦИИ ПО УСТРАНЕНИЮ НЕДОСТАТКОВ:
1. Добавить подпись прокурора согласно ст. 300 УПК РК
2. Указать точную дату и время составления документа
3. Детализировать размер причиненного ущерба с обоснованием
4. Проверить процессуальные сроки по ст. 299 УПК РК
5. Дополнить перечень вещественных доказательств

ПРАВОВАЯ ОЦЕНКА: УСЛОВНО ГОТОВ К НАПРАВЛЕНИЮ В СУД
Требуется устранение указанных недостатков.` : 
`DOCUMENT COMPLETENESS CHECK CONCLUSION

Document: Indictment
Check Date: ${new Date().toLocaleDateString('en-US')}
AI System: Document Completeness Analyzer

CHECK RESULTS:
✓ Document structure complies with CCP RK Art. 300 requirements
✗ Prosecutor's signature missing
✗ Exact composition date not specified
✓ Evidence list present
✗ Damage details insufficient
✓ Crime qualification correct
✗ Missing procedural violations data

CCP RK COMPLIANCE:
- Article 300: Partially compliant
- Article 301: Requires improvement
- Article 302: Compliant

RECOMMENDATIONS:
1. Add prosecutor's signature per Art. 300 CCP RK
2. Specify exact composition date and time
3. Detail damage amount with justification
4. Check procedural deadlines per Art. 299 CCP RK
5. Supplement physicИИ: list

LEGAL ASSESSMENT: CONDITIONALLY READY FOR COURT
Requires fixing identified deficiencies.`;
          
          setGeneratedOutputs(prev => ({
            ...prev,
            [activeAI]: outputContent
          }));
          break;

        case 'legal':
          aiResponseText = language === 'ru'
            ? `Найдены соответствующие нормы: УК РК ст. 190 (мошенничество), УПК РК ст. 300-302 (обвинительный акт), НК РК ст. 231 (уклонение от налогов). Также применимы нормы ГК РК о возмещении ущерба.`
            : `Found relevant norms: CC RK Art. 190 (fraud), CCP RK Art. 300-302 (indictment), Tax Code RK Art. 231 (tax evasion). Also applicable Civil Code RK provisions on damage compensation.`;
          
          const legalOutput = language === 'ru' ? `ПРАВОВОЙ АНАЛИЗ И ПОИСК ПО БАЗЕ ЗАКОНОВ РК

Дата анализа: ${new Date().toLocaleDateString('ru-RU')}
ИИ Система: База Законов РК

НАЙДЕННЫЕ НОРМАТИВНЫЕ АКТЫ:

1. УГОЛОВНЫЙ КОДЕКС РК
   Статья 190 - Мошенничество
   Часть 4: в особо крупном размере - до 12 лет лишения свободы

2. УГОЛОВНО-ПРОЦЕССУАЛЬНЫЙ КОДЕКС РК
   Статья 300 - Содержание обвинительного акта
   Статья 301 - Приложения к обвинительному акту
   Статья 302 - Направление дела с обвинительным актом

3. НАЛОГОВЫЙ КОДЕКС РК
   Статья 231 - Уклонение от уплаты налогов
   Применимо при сокрытии доходов

4. ГРАЖДАНСКИЙ КОДЕКС РК
   Статья 917 - Возмещение вреда
   Статья 1086 - Возмещение морального вреда

ПРАВОВАЯ КВАЛИФИКАЦИЯ:
✓ Деяние содержит признаки мошенничества (ст. 190 УК РК)
✓ Размер ущерба квалифицируется как особо крупный
✓ Подлежит возмещению материальный ущерб
✓ Возможно взыскание морального вреда

ПРОЦЕССУАЛЬНЫЕ ТРЕБОВАНИЯ:
- Соблюдение сроков расследования
- Полнота доказательной базы
- Правильность составления процессуальных документов

ЗАКЛЮЧЕНИЕ: Правовые нормы применены корректно` : 
`LEGAL ANALYSIS AND RK LAW DATABASE SEARCH

Analysis Date: ${new Date().toLocaleDateString('en-US')}
AI System: RK Legal Database

FOUND LEGAL ACTS:

1. CRIMINAL CODE RK
   Article 190 - Fraud
   Part 4: especially large amount - up to 12 years imprisonment

2. CRIMINAL PROCEDURE CODE RK
   Article 300 - Content of indictment
   Article 301 - Attachments to indictment
   Article 302 - Case submission with indictment

3. TAX CODE RK
   Article 231 - Tax evasion
   Applicable for income concealment

4. CIVIL CODE RK
   Article 917 - Damage compensation
   Article 1086 - Moral damage compensation

LEGAL QUALIFICATION:
✓ Act contains fraud elements (Art. 190 CC RK)
✓ Damage amount qualifies as especially large
✓ Material damage subject to compensation
✓ Moral damage recovery possible

PROCEDURAL REQUIREMENTS:
- Investigation timeframes compliance
- Evidence base completeness
- Correct procedural documents drafting

CONCLUSION: Legal norms applied correctly`;

          setGeneratedOutputs(prev => ({
            ...prev,
            [activeAI]: legalOutput
          }));
          break;

        case 'evidence':
          aiResponseText = language === 'ru'
            ? `Проанализировал все файлы дела. Ключевые моменты: банковские операции подтверждают движение средств, документы содержат противоречия в датах, требуется дополнительная экспертиза подписей. Сила доказательств: высокая по финансовым документам, средняя по свидетельским показаниям.`
            : `Analyzed all case files. Key moments: banking operations confirm money movement, documents contain date contradictions, additional signature expertise required. Evidence strength: high for financial documents, medium for witness testimonies.`;
          break;

        case 'unified':
          aiResponseText = language === 'ru'
            ? `Единая ИИ Система: Проведен комплексный анализ всеми подсистемами.

🔍 Квалификатор: Деяние квалифицируется по ч.4 ст. 190 УК РК
📋 Полнота документов: Обвинительный акт соответствует требованиям УПК РК  
⚖️ База законов: Применимы нормы УК РК, УПК РК, ГК РК
🔎 Доказательства: Достаточная доказательная база для обвинения

Рекомендации: Дело готово к направлению в суд при условии устранения выявленных недостатков в процессуальных документах.`
            : `Unified AI System: Comprehensive analysis conducted by all subsystems.

🔍 Qualifier: Act qualifies under Part 4 Art. 190 CC RK
📋 Completeness: Indictment meets CCP RK requirements  
⚖️ Legal Database: CC RK, CCP RK, Civil Code RK provisions apply
🔎 Evidence: Sufficient evidence base for prosecution

Recommendations: Case ready for court submission upon fixing identified procedural document deficiencies.`;
          break;
      }

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        aiType: activeAI as any
      };
      setMessages(prev => ({
        ...prev,
        [activeAI]: [...(prev[activeAI] || []), aiResponse]
      }));
      setIsProcessing(false);
    }, 2000);
  };

  const currentAISystem = aiSystems.find(ai => ai.id === activeAI);
  const showFileUpload = activeAI === 'completeness' || activeAI === 'legal';
  const showContext = activeAI === 'completeness' && context;

  const handleResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startChatWidth = chatWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const containerWidth = window.innerWidth - 320; // Adjust for sidebar
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newChatWidth = Math.max(30, Math.min(80, startChatWidth + deltaPercent));
      setChatWidth(newChatWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Show AI Documents section if documents tab is active
  if (activeAI === 'documents') {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.div 
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <span className={index === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground cursor-pointer'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{t.aiDocuments}</span>
          </motion.div>
        )}

        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileText className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.aiDocuments}</h1>
              <p className="text-sm text-muted-foreground">{language === 'ru' ? 'Генерация и управление юридическими документами' : 'Generate and manage legal documents'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setActiveAI('unified')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToAI}
          </Button>
        </motion.div>
        
        <DocumentsSection 
          onNavigate={onNavigate} 
          onAddToHistory={(documentType: string) => {
            if (onAddToHistory && selectedCase && casesData) {
              const caseData = casesData.find(c => c.id === selectedCase);
              if (caseData) {
                onAddToHistory(selectedCase, caseData.name, documentType, 'documents', context);
              }
            }
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {breadcrumb && breadcrumb.length > 0 && (
        <motion.div 
          className="flex items-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              <span className={index === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground cursor-pointer'}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      )}

      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.aiSystem}</h1>
            <p className="text-sm text-muted-foreground">{t.multiAgentSystem}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            {currentAISystem && <currentAISystem.icon className="w-3 h-3" />}
            {t.activeAI}: {currentAISystem?.name}
          </Badge>
        </div>
      </motion.div>

      <Tabs value={activeAI} onValueChange={setActiveAI as any} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto gap-1 p-1">
          {aiSystems.map((ai) => (
            <TabsTrigger 
              key={ai.id} 
              value={ai.id}
              className="flex flex-col gap-1 p-2 sm:p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ai.icon className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">{ai.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {aiSystems.filter(ai => ai.id !== 'documents').map((ai) => (
          <TabsContent key={ai.id} value={ai.id} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Resizable Chat Interface */}
              <div className={`grid ${isOutputCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-1'} gap-6`}>
                {!isOutputCollapsed && !isOutputMaximized && (
                  <div className="flex gap-6 h-[600px]">
                    {/* Chat Panel */}
                    <div style={{ width: `${chatWidth}%` }} className="flex flex-col">
                      <Card className="p-4 sm:p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className={`w-8 h-8 ${ai.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <ai.icon className={`w-4 h-4 ${ai.color}`} />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium truncate">{ai.name}</h3>
                            <p className="text-sm text-muted-foreground">{ai.description}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            ● {t.activeAI}
                          </Badge>
                        </div>

                        {/* Actions moved to top left */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy} data-copy-button>
                              <Copy className="w-4 h-4 mr-1" />
                              {t.copy}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownload}>
                              <Download className="w-4 h-4 mr-1" />
                              {t.download}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare} data-share-button>
                              <Share className="w-4 h-4 mr-1" />
                              {t.share}
                            </Button>
                            {showFileUpload && (
                              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="w-4 h-4 mr-1" />
                                {t.uploadFile}
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={handleClearChat} className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t.clearChat}
                            </Button>
                          </div>
                          
                          {showContext && (
                            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {t.currentContext}: {context?.data?.name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 bg-muted/20 rounded-lg p-3 sm:p-4 overflow-y-auto mb-4 relative">
                          {/* File Drop Zone */}
                          {showFileUpload && (
                            <div
                              className={`absolute inset-0 border-2 border-dashed rounded-lg transition-all ${
                                isDragOver 
                                  ? 'border-primary bg-primary/5 z-10' 
                                  : 'border-transparent'
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              {isDragOver && (
                                <div className="flex items-center justify-center h-full">
                                  <div className="text-center">
                                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm text-primary">{t.dragDropFiles}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t.supportedFormats}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="space-y-3 h-full overflow-y-auto">
                            {(messages[activeAI] || []).map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[80%] rounded-lg p-3 ${
                                  message.sender === 'user' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-card border shadow-sm'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                  {message.attachments && (
                                    <div className="mt-2 space-y-1">
                                      {message.attachments.map((attachment, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs bg-muted/50 rounded p-2">
                                          <File className="w-3 h-3" />
                                          <span>{attachment.name}</span>
                                          <span className="text-muted-foreground">({attachment.size})</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            
                            {isProcessing && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                              >
                                <div className="bg-card border shadow-sm rounded-lg p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                                    <span className="text-sm text-muted-foreground ml-2">{t.analyzing}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder={t.askQuestion}
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            disabled={isProcessing}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} disabled={!currentMessage.trim() || isProcessing}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleFileUpload(Array.from(e.target.files));
                            }
                          }}
                        />
                      </Card>
                    </div>

                    {/* Resizer */}
                    <div
                      className="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex items-center justify-center group transition-colors"
                      onMouseDown={handleResize}
                    >
                      <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Generated Output Panel */}
                    <div style={{ width: `${100 - chatWidth}%` }} className="flex flex-col">
                      <Card className="p-4 sm:p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-primary" />
                            <h3 className="font-medium">{t.generatedOutput}</h3>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsOutputCollapsed(true)}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsOutputMaximized(true)}
                            >
                              <Maximize2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 bg-muted/20 rounded-lg p-4 overflow-y-auto">
                          {generatedOutputs[activeAI] ? (
                            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                              {generatedOutputs[activeAI]}
                            </pre>
                          ) : (
                            <div className="flex items-center justify-center h-full text-center">
                              <div>
                                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">
                                  {language === 'ru' 
                                    ? 'Сгенерированный контент появится здесь после обработки запроса'
                                    : 'Generated content will appear here after processing your request'
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Collapsed Output Panel */}
                {isOutputCollapsed && (
                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{t.generatedOutput}</span>
                        <Badge variant="secondary" className="text-xs">
                          {generatedOutputs[activeAI] ? language === 'ru' ? 'Готов' : 'Ready' : language === 'ru' ? 'Пусто' : 'Empty'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOutputCollapsed(false)}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOutputMaximized(true)}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Maximized Output Panel */}
                {isOutputMaximized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-background z-50 p-6"
                  >
                    <Card className="h-full flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-primary" />
                          <h3 className="font-medium">{t.generatedOutput}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOutputMaximized(false)}
                        >
                          <Minimize2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto">
                        {generatedOutputs[activeAI] ? (
                          <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                            {generatedOutputs[activeAI]}
                          </pre>
                        ) : (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">
                                {language === 'ru' 
                                  ? 'Сгенерированный контент появится здесь после обработки запроса'
                                  : 'Generated content will appear here after processing your request'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}