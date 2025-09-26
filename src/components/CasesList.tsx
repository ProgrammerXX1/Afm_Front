import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Briefcase, Calendar, User, ArrowRight, X, Building, UserCheck, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';

interface CaseData {
  id: string;
  fio: string;
  patronymic: string;
  iin: string;
  organization: string;
  investigator: string;
  registration_date: Date;
  qualification: string;
  damage_amount: number;
  income_amount: number;
  indictment_date: Date;
  created_at: Date;
  updated_at: Date;
  // Legacy fields for display
  name: string;
  type: string;
  status: string;
  client: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  description: string;
  generatedFiles: Array<{
    id: string;
    name: string;
    type: string;
    generatedAt: Date;
    size: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    size: string;
    uploadDate: Date;
    uploadedBy: string;
    content?: string;
  }>;
}

interface CasesListProps {
  cases: CaseData[];
  onCaseSelect: (caseId: string) => void;
  onNavigate: (section: string) => void;
}

const translations = {
  en: {
    activeCases: 'Active Cases',
    caseDetails: 'Case Details',
    client: 'Client',
    type: 'Type',
    deadline: 'Deadline',
    priority: 'Priority',
    description: 'Description',
    generatedFiles: 'Generated Files',
    selectCase: 'Select Case',
    manageCases: 'Manage All Cases',
    noFiles: 'No files generated yet',
    files: 'files',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    review: 'In Review',
    clickToViewAll: 'Click to view all',
    // New fields
    fio: 'Full Name',
    iin: 'IIN',
    organization: 'Organization',
    investigator: 'Investigator',
    qualification: 'Qualification',
    damageAmount: 'Damage Amount',
    registrationDate: 'Registration Date'
  },
  ru: {
    activeCases: 'Активные Дела',
    caseDetails: 'Детали Дела',
    client: 'Клиент',
    type: 'Тип',
    deadline: 'Срок',
    priority: 'Приоритет',
    description: 'Описание',
    generatedFiles: 'Сгенерированные Файлы',
    selectCase: 'Выбрать Дело',
    manageCases: 'Управление Всеми Делами',
    noFiles: 'Файлы ещё не сгенерированы',
    files: 'файлов',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    active: 'Активное',
    pending: 'Ожидание',
    completed: 'Завершено',
    review: 'На Рассмотрении',
    clickToViewAll: 'Нажмите для просмотра всех',
    // New fields
    fio: 'ФИО',
    iin: 'ИИН',
    organization: 'Организация',
    investigator: 'Следователь',
    qualification: 'Квалификация',
    damageAmount: 'Сумма Ущерба',
    registrationDate: 'Дата Регистрации'
  }
};

export default function CasesList({ cases, onCaseSelect, onNavigate }: CasesListProps) {
  const { language } = useAuth();
  const t = translations[language];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const translatePriority = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return t.high;
      case 'medium': return t.medium;
      case 'low': return t.low;
      default: return priority;
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return t.active;
      case 'pending': return t.pending;
      case 'completed': return t.completed;
      case 'in review': return t.review;
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'KZT',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3>{t.activeCases}</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{cases.length}</p>
              <p className="text-sm text-muted-foreground">{t.clickToViewAll}</p>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            {t.activeCases}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight mb-1">{caseItem.name}</h4>
                        <p className="text-xs text-muted-foreground">{caseItem.fio}</p>
                        <p className="text-xs text-muted-foreground">{t.iin}: {caseItem.iin}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getPriorityColor(caseItem.priority)} variant="secondary">
                          {translatePriority(caseItem.priority)}
                        </Badge>
                        <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                          {translateStatus(caseItem.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span className="truncate">{caseItem.organization}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span className="truncate">{caseItem.investigator}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span className="truncate">{formatCurrency(caseItem.damage_amount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{caseItem.registration_date.toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <p className="line-clamp-2 text-muted-foreground mb-1">{caseItem.qualification}</p>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-muted-foreground">{t.generatedFiles}: </span>
                      <span className="font-medium text-primary">
                        {caseItem.generatedFiles.length} {caseItem.generatedFiles.length === 0 ? t.noFiles : t.files}
                      </span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        onCaseSelect(caseItem.id);
                        // Close dialog
                        const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
                        if (closeButton) closeButton.click();
                      }}
                    >
                      {t.selectCase}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                onNavigate('cases');
                const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
                if (closeButton) closeButton.click();
              }}
            >
              {t.manageCases}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}