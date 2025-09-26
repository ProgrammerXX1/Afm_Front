import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Scale, Search, Plus, Eye, FileText, User, Building, Calendar, DollarSign, Gavel, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import { CaseData } from './dashboard/constants';
import { mockCasesData } from './dashboard/data';

const translations = {
  en: {
    caseManagement: 'Case Management',
    searchCases: 'Search cases...',
    addNewCase: 'Add New Case',
    selectCase: 'Select Case',
    viewDocuments: 'View Documents',
    aiQualification: 'AI Qualification',
    noResults: 'No cases found',
    tryDifferentSearch: 'Try adjusting your search criteria or add a new case',
    
    // Case details modal
    caseDetails: 'Case Details',
    fio: 'Full Name',
    patronymic: 'Patronymic',
    iin: 'IIN',
    organization: 'Organization',
    investigator: 'Investigator',
    registrationDate: 'Registration Date',
    qualification: 'Qualification',
    damageAmount: 'Damage Amount',
    incomeAmount: 'Income Amount',
    indictmentDate: 'Indictment Date',
    status: 'Status',
    priority: 'Priority',
    deadline: 'Deadline',
    close: 'Close'
  },
  ru: {
    caseManagement: 'Управление Делами',
    searchCases: 'Поиск дел...',
    addNewCase: 'Добавить Новое Дело',
    selectCase: 'Выбрать Дело',
    viewDocuments: 'Посмотреть Документы',
    aiQualification: 'ИИ Квалификация',
    noResults: 'Дела не найдены',
    tryDifferentSearch: 'Попробуйте изменить параметры поиска или добавьте новое дело',
    
    // Case details modal
    caseDetails: 'Детали Дела',
    fio: 'ФИО',
    patronymic: 'Отчество',
    iin: 'ИИН',
    organization: 'Организация',
    investigator: 'Следователь',
    registrationDate: 'Дата Регистрации',
    qualification: 'Квалификация',
    damageAmount: 'Сумма Ущерба',
    incomeAmount: 'Сумма Дохода',
    indictmentDate: 'Дата Обвинительного Заключения',
    status: 'Статус',
    priority: 'Приоритет',
    deadline: 'Крайний Срок',
    close: 'Закрыть'
  }
};

interface CaseManagementProps {
  selectedCase?: string;
  onCaseSelect?: (caseId: string, documentType?: string) => void;
  onNavigate?: (section: string, context?: any) => void;
  onNavigateToDocuments?: (caseId: string) => void;
  onAddNewCase?: () => void;
  casesData?: CaseData[];
  onAddToHistory?: (caseId: string, caseName: string, documentType: string, section: string, context?: any) => void;
}

export default function CaseManagement({ 
  selectedCase, 
  onCaseSelect, 
  onNavigate, 
  onNavigateToDocuments,
  onAddNewCase,
  casesData = mockCasesData,
  onAddToHistory 
}: CaseManagementProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<CaseData | null>(null);

  const filteredCases = casesData.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'KZT',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const handleSelectCase = (caseData: CaseData) => {
    onCaseSelect?.(caseData.id, 'General');
  };

  const handleViewDocuments = (caseData: CaseData) => {
    onNavigateToDocuments?.(caseData.id);
  };

  const handleViewCaseDetails = (caseData: CaseData) => {
    setSelectedCaseForDetails(caseData);
  };

  const handleAIQualification = (caseData: CaseData) => {
    const context = { 
      type: 'qualification', 
      data: { id: caseData.id, name: caseData.name, type: caseData.type, caseData },
      aiType: 'qualification'
    };
    onAddToHistory?.(caseData.id, caseData.name, 'AI Квалификация', 'aiSystem', context);
    onNavigate?.('aiSystem', context);
  };

  return (
    <div className="space-y-6">
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
            <Scale className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.caseManagement}</h1>
        </div>
        <Button onClick={onAddNewCase} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {t.addNewCase}
        </Button>
      </motion.div>

      {/* Search */}
      <Card className="p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.searchCases}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t.noResults}</h3>
              <p className="text-muted-foreground mb-4">{t.tryDifferentSearch}</p>
              <Button onClick={onAddNewCase}>
                <Plus className="w-4 h-4 mr-2" />
                {t.addNewCase}
              </Button>
            </Card>
          </div>
        ) : (
          filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
                {/* Case Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gavel className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{caseItem.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {caseItem.type}
                      </Badge>
                      <Badge 
                        variant={
                          caseItem.status === 'Active' ? 'default' :
                          caseItem.status === 'In Review' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {caseItem.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Case Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{caseItem.fio}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{caseItem.organization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{formatCurrency(caseItem.damage_amount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{caseItem.registration_date.toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                {/* Action Buttons - All in one row with 4 buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Select Case - Main long button */}
                  <Button 
                    className="col-span-1"
                    onClick={() => handleSelectCase(caseItem)}
                    variant={selectedCase === caseItem.id ? "default" : "outline"}
                    size="sm"
                    title={t.selectCase}
                  >
                    <Gavel className="w-4 h-4" />
                  </Button>
                  
                  {/* View Documents - Icon only */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDocuments(caseItem)}
                    className="col-span-1"
                    title={t.viewDocuments}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  
                  {/* View Case Details - Icon only */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCaseDetails(caseItem)}
                    className="col-span-1"
                    title={t.caseDetails}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {/* AI Qualification - Icon only */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAIQualification(caseItem)}
                    className="col-span-1"
                    title={t.aiQualification}
                  >
                    <Brain className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Case Details Modal */}
      <Dialog open={!!selectedCaseForDetails} onOpenChange={() => setSelectedCaseForDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              {t.caseDetails}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCaseForDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.fio}</label>
                  <p className="text-sm">{selectedCaseForDetails.fio}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.patronymic}</label>
                  <p className="text-sm">{selectedCaseForDetails.patronymic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.iin}</label>
                  <p className="text-sm">{selectedCaseForDetails.iin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.organization}</label>
                  <p className="text-sm">{selectedCaseForDetails.organization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.investigator}</label>
                  <p className="text-sm">{selectedCaseForDetails.investigator}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.registrationDate}</label>
                  <p className="text-sm">{selectedCaseForDetails.registration_date.toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.qualification}</label>
                  <p className="text-sm">{selectedCaseForDetails.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.damageAmount}</label>
                  <p className="text-sm">{formatCurrency(selectedCaseForDetails.damage_amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.incomeAmount}</label>
                  <p className="text-sm">{formatCurrency(selectedCaseForDetails.income_amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.indictmentDate}</label>
                  <p className="text-sm">{selectedCaseForDetails.indictment_date.toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t.status}</label>
                    <Badge variant="secondary">{selectedCaseForDetails.status}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t.priority}</label>
                    <Badge variant={
                      selectedCaseForDetails.priority === 'High' ? 'destructive' :
                      selectedCaseForDetails.priority === 'Medium' ? 'default' : 'secondary'
                    }>
                      {selectedCaseForDetails.priority}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t.deadline}</label>
                    <p className="text-sm">{selectedCaseForDetails.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setSelectedCaseForDetails(null)}>
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}