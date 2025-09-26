import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { FileText, Upload, Search, Eye, FolderOpen, Plus, Brain, Download, Database, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import DocumentViewer from './DocumentViewer';

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

interface DocumentsCaseProps {
  selectedCase?: string;
  caseName?: string;
  onNavigate?: (section: string, context?: any, breadcrumbPath?: string[]) => void;
  breadcrumb?: string[];
}

const translations = {
  en: {
    documentsCase: 'Documents Case',
    uploadDocument: 'Upload Document',
    allCategories: 'All Categories',
    searchDocuments: 'Search documents...',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    name: 'Name',
    dateUploaded: 'Date Uploaded',
    size: 'Size',
    noDocuments: 'No documents found',
    uploadNewDocument: 'Upload New Document',
    documentDetails: 'Document Details',
    fileName: 'File Name',
    fileType: 'File Type',
    fileSize: 'File Size',
    uploadedBy: 'Uploaded By',
    uploadedOn: 'Uploaded On',
    category: 'Category',
    actions: 'Actions',
    download: 'Download',
    share: 'Share',
    print: 'Print',
    viewContent: 'View Content',
    openWithAICompleteness: 'AI Completeness',
    openWithAILegal: 'AI Legal Database',
    downloading: 'Downloading...',
    downloadCompleted: 'Download completed',
    documentContent: 'Document Content',
    closeViewer: 'Close',
    // Categories
    evidence: 'Evidence',
    legal: 'Legal Documents',
    procedural: 'Procedural',
    expert: 'Expert Reports',
    financial: 'Financial',
    correspondence: 'Correspondence',
    other: 'Other'
  },
  ru: {
    documentsCase: 'Документы по Делу',
    uploadDocument: 'Загрузить Документ',
    allCategories: 'Все Категории',
    searchDocuments: 'Поиск документов...',
    filterBy: 'Фильтр по',
    sortBy: 'Сортировка',
    name: 'Название',
    dateUploaded: 'Дата Загрузки',
    size: 'Размер',
    noDocuments: 'Документы не найдены',
    uploadNewDocument: 'Загрузить Новый Документ',
    documentDetails: 'Детали Документа',
    fileName: 'Имя Файла',
    fileType: 'Тип Файла',
    fileSize: 'Размер Файла',
    uploadedBy: 'Загружено',
    uploadedOn: 'Дата Загрузки',
    category: 'Категория',
    actions: 'Действия',
    download: 'Скачать',
    share: 'Поделиться',
    print: 'Печать',
    viewContent: 'Посмотреть Содержимое',
    openWithAICompleteness: 'ИИ Полнота',
    openWithAILegal: 'ИИ База Законов',
    downloading: 'Скачивание...',
    downloadCompleted: 'Скачивание завершено',
    documentContent: 'Содержание Документа',
    closeViewer: 'Закрыть',
    // Categories
    evidence: 'Доказательства',
    legal: 'Юридические Документы',
    procedural: 'Процессуальные',
    expert: 'Экспертные Заключения',
    financial: 'Финансовые',
    correspondence: 'Переписка',
    other: 'Прочее'
  }
};

// Documents data for different cases with more unique files
const documentsData: { [key: string]: Document[] } = {
  'case-001': [
    {
      id: '1-1',
      name: 'Обвинительный акт по делу №1-45/2024.pdf',
      type: 'PDF',
      category: 'legal',
      size: '2.1 MB',
      uploadDate: new Date(2024, 0, 15),
      uploadedBy: 'Ахметов С.Н.',
      caseId: 'case-001',
      content: `ОБВИНИТЕЛЬНЫЙ АКТ

По уголовному делу № 1-45/2024

УТВЕРЖДАЮ
Прокурор города Алматы
Қ.Б. Тулебаев
"15" января 2024 года

В соответствии со статьями 300-302 УПК РК обвиняется:

ИВАНОВ Петр Сергеевич, 15.03.1985 г.р., ИИН 850315123456,
гражданин РК, русский, образование высшее,
работает директором ТОО "БизнесКом",
проживает: г. Алматы, ул. Абая, д. 123, кв. 45

В том, что он в период с 01.01.2023 по 31.12.2023 года,
находясь в должности директора ТОО "БизнесКом",
с целью хищения чужого имущества путем обмана,
заключил фиктивные договоры поставки с ТОО "Поставщик",
создав видимость законной предпринимательской деятельности,
фактически направленной на завладение денежными средствами
в особо крупном размере.

Указанными действиями причинен ущерб на сумму 50 000 000 тенге.

Деяние квалифицируется по ч. 4 ст. 190 УК РК
как мошенничество, совершенное в особо крупном размере.

Прокурор города Алматы                    Қ.Б. Тулебаев`
    },
    {
      id: '1-2',
      name: 'Протокол допроса свидетеля Петровой А.И.pdf',
      type: 'PDF',
      category: 'evidence',
      size: '1.8 MB',
      uploadDate: new Date(2024, 0, 18),
      uploadedBy: 'Жумабеков А.К.',
      caseId: 'case-001',
      content: `ПРОТОКОЛ ДОПРОСА СВИДЕТЕЛЯ

г. Алматы                                    18 января 2024 года

Следователь Жумабеков А.К. допросил в качестве свидетеля:
ПЕТРОВУ Анну Ивановну, 12.04.1990 г.р., ИИН 900412123789

На вопросы следователя показала:
- С обвиняемым Ивановым П.С. знакома с 2020 года по работе.
- В 2023 году Иванов давал указания оформлять фиктивные договоры.
- Всего было переведено около 50 миллионов тенге.

Протокол мною прочитан, записано верно.
Свидетель                                   А.И. Петрова`
    },
    {
      id: '1-3',
      name: 'Банковские выписки ТОО БизнесКом.xlsx',
      type: 'Excel',
      category: 'financial',
      size: '4.2 MB',
      uploadDate: new Date(2024, 0, 22),
      uploadedBy: 'Нурланова С.К.',
      caseId: 'case-001',
      content: `БАНКОВСКИЕ ВЫПИСКИ ТОО "БИЗНЕСКОМ"
БИН: 123456789012
Расчетный счет: KZ94601A123456789012

Период: 01.01.2023 - 31.12.2023

ВХОДЯЩИЕ ПЛАТЕЖИ:
15.02.2023 - 5 000 000 тенге от ТОО "Поставщик" (НДС возмещение)
28.04.2023 - 8 500 000 тенге от ИП "Касымов" (оплата за товар)
12.06.2023 - 12 000 000 тенге от ТОО "Инвест Групп" (аванс)
03.09.2023 - 15 200 000 тенге от АО "Казхром" (поставка металла)
20.11.2023 - 9 300 000 тенге от ТОО "Стройматериалы" (возврат займа)

ИСХОДЯЩИЕ ПЛАТЕЖИ:
Заработная плата сотрудникам: 2 400 000 тенге
Аренда офиса: 360 000 тенге
Коммунальные услуги: 180 000 тенге
Неизвестные получатели: 47 640 000 тенге

ЗАКЛЮЧЕНИЕ:
Обнаружены подозрительные операции на общую сумму 47 640 000 тенге`
    }
  ],
  'case-002': [
    {
      id: '2-1',
      name: 'Постановление о возбуждении уголовного дела №2-78/2024.pdf',
      type: 'PDF',
      category: 'legal',
      size: '1.9 MB',
      uploadDate: new Date(2024, 1, 10),
      uploadedBy: 'Касымов Н.А.',
      caseId: 'case-002',
      content: `ПОСТАНОВЛЕНИЕ О ВОЗБУЖДЕНИИ УГОЛОВНОГО ДЕЛА

г. Нур-Султан                               10 февраля 2024 года

Следователь Касымов Н.А. рассмотрев материалы проверки
по факту хищения бюджетных средств в ТОО "СтройИнвест",

УСТАНОВИЛ:
В период с 2022 по 2023 годы должностными лицами ТОО "СтройИнвест"
были похищены бюджетные средства в размере 75 000 000 тенге
путем представления подложных документов о выполненных работах.

ПОСТАНОВИЛ:
1. Возбудить уголовное дело по признакам преступления,
   предусмотренного ч. 3 ст. 189 УК РК.
2. Принять дело к своему производству.

Следователь                                 Н.А. Касымов`
    }
  ],
  'case-003': [
    {
      id: '3-1',
      name: 'Обвинительное заключение по делу №3-112/2024.pdf',
      type: 'PDF',
      category: 'legal',
      size: '3.2 MB',
      uploadDate: new Date(2024, 2, 5),
      uploadedBy: 'Алибеков Т.С.',
      caseId: 'case-003',
      content: `ОБВИНИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ

По уголовному делу № 3-112/2024

г. Шымкент                                  5 марта 2024 года

Следователь Алибеков Т.С. составил обвинительное заключение
по уголовному делу в отношении:

СМАНОВА Ерлана Касымовича, 22.07.1980 г.р., ИИН 800722234567,
обвиняемого в совершении преступления, предусмотренного
ч. 2 ст. 378 УК РК (получение взятки должностным лицом).

СУЩЕСТВО ОБВИНЕНИЯ:
Сманов Е.К., работая в должности начальника отдела Акимата,
в период с мая по октябрь 2023 года получил взятки от
предпринимателей за ускорение рассмотрения документов
на общую сумму 15 000 000 тенге.

ДОКАЗАТЕЛЬСТВА:
- Показания свидетелей
- Аудиозаписи разговоров
- Банковские документы
- Заключение экспертизы

Следователь                                 Т.С. Алибеков`
    }
  ]
};

export default function DocumentsCase({ selectedCase, caseName, onNavigate, breadcrumb }: DocumentsCaseProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [documents] = useState<Document[]>(documentsData[selectedCase || 'case-001'] || []);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'evidence', label: t.evidence },
    { id: 'legal', label: t.legal },
    { id: 'procedural', label: t.procedural },
    { id: 'expert', label: t.expert },
    { id: 'financial', label: t.financial },
    { id: 'correspondence', label: t.correspondence },
    { id: 'other', label: t.other }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      default:
        return 0;
    }
  });

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected:', e.target.files?.[0]);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocumentViewer(true);
  };

  const handleDownload = async (doc: Document) => {
    setIsDownloading(doc.id);
    
    try {
      // Create a blob with the document content
      const content = doc.content || `Document: ${doc.name}\\nType: ${doc.type}\\nSize: ${doc.size}\\nUploaded: ${doc.uploadDate.toLocaleDateString('ru-RU')}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name.replace('.pdf', '.txt').replace('.docx', '.txt').replace('.xlsx', '.txt');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      
      // Show completion
      setTimeout(() => {
        setIsDownloading(null);
        console.log(t.downloadCompleted);
      }, 1000);
      
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(null);
    }
  };

  const handleOpenWithAI = (doc: Document, aiType: 'completeness' | 'legal') => {
    const context = { 
      type: 'document', 
      data: doc,
      aiType: aiType 
    };
    const breadcrumbPath = [t.caseManagement, t.documentsCase + (caseName ? ` - ${caseName}` : ''), language === 'ru' ? 'ИИ Система' : 'AI System'];
    onNavigate?.('aiSystem', context, breadcrumbPath);
  };

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
            <FolderOpen className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.documentsCase}</h1>
            {caseName && <p className="text-sm text-muted-foreground">{caseName}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onNavigate?.('cases')}
            className="gap-2"
          >
            <Briefcase className="w-4 h-4" />
            {language === 'ru' ? 'К Управлению Делами' : 'Back to Case Management'}
          </Button>
          <Button onClick={handleUpload} className="gap-2 w-full sm:w-auto">
            <Upload className="w-4 h-4" />
            {t.uploadDocument}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            />
          </Button>
        </div>

      </motion.div>

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchDocuments}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm bg-background min-w-[150px]"
            >
              <option value="name">{t.name}</option>
              <option value="date">{t.dateUploaded}</option>
              <option value="size">{t.size}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocuments.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t.noDocuments}</h3>
              <p className="text-muted-foreground mb-4">
                {language === 'ru' 
                  ? 'Попробуйте изменить параметры поиска или загрузите новый документ'
                  : 'Try adjusting your search criteria or upload a new document'
                }
              </p>
              <Button onClick={handleUpload}>
                <Plus className="w-4 h-4 mr-2" />
                {t.uploadNewDocument}
              </Button>
            </Card>
          </div>
        ) : (
          sortedDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
                {/* Document Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.id === doc.category)?.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Document Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.fileType}:</span>
                    <span>{doc.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.uploadedBy}:</span>
                    <span>{doc.uploadedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.uploadedOn}:</span>
                    <span>{doc.uploadDate.toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                {/* Document Actions */}
                <div className="space-y-2">
                  {/* Main Action - View Content (long button) */}
                  <Button 
                    className="w-full"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.viewContent}
                  </Button>
                  
                  {/* Secondary Actions - Icons in one row */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading === doc.id}
                      className="col-span-1"
                      title={t.download}
                    >
                      {isDownloading === doc.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenWithAI(doc, 'completeness')}
                      className="col-span-1"
                      title={t.openWithAICompleteness}
                    >
                      <Brain className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenWithAI(doc, 'legal')}
                      className="col-span-1"
                      title={t.openWithAILegal}
                    >
                      <Database className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Document Viewer */}
      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        document={selectedDocument}
        onDownload={handleDownload}
        onOpenWithAI={handleOpenWithAI}
      />
    </div>
  );
}