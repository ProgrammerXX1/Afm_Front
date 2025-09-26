import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ArrowRight, FileText, Scale, FolderOpen, Building, UserCheck, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { CaseData, translations } from './constants';
import { getPriorityColor, getStatusColor, translatePriority, translateStatus, formatCurrency } from './utils';
import { useAuth } from '../AuthContext';

interface CaseCardProps {
  caseItem: CaseData;
  index: number;
  selectedCase: string;
  onCaseSelect: (caseId: string, documentType?: string) => void;
  onNavigate?: (section: string, context?: any) => void;
  onNavigateToDocuments?: (caseId: string) => void;
}

export default function CaseCard({ 
  caseItem, 
  index, 
  selectedCase, 
  onCaseSelect, 
  onNavigate, 
  onNavigateToDocuments 
}: CaseCardProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        selectedCase === caseItem.id ? 'border-primary' : 'border-transparent hover:border-primary/20'
      }`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-sm leading-tight mb-2">{caseItem.name}</h3>
              <p className="text-xs text-muted-foreground">{caseItem.fio}</p>
              <p className="text-xs text-muted-foreground">{t.iin}: {caseItem.iin}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={getPriorityColor(caseItem.priority)} variant="secondary">
                {translatePriority(caseItem.priority, language)}
              </Badge>
              <Badge className={getStatusColor(caseItem.status)} variant="secondary">
                {translateStatus(caseItem.status, language)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span className="truncate">{t.organization}: {caseItem.organization}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="truncate">{t.investigator}: {caseItem.investigator}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="truncate">{t.damageAmount}: {formatCurrency(caseItem.damage_amount)}</span>
            </div>
          </div>
          
          <div className="text-xs">
            <span className="text-muted-foreground">{t.generatedFiles}: </span>
            <span className="font-medium text-primary">
              {caseItem.generatedFiles.length}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => {
                onCaseSelect(caseItem.id);
                onNavigate?.('overview');
              }}
            >
              {t.selectCase}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    {t.caseDetails}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4>{language === 'ru' ? 'Основная информация' : 'Basic Information'}</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.fio}</label>
                          <p className="text-lg">{caseItem.fio}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.iin}</label>
                          <p className="text-lg">{caseItem.iin}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.organization}</label>
                          <p className="text-lg">{caseItem.organization}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.investigator}</label>
                          <p className="text-lg">{caseItem.investigator}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4>{language === 'ru' ? 'Правовая информация' : 'Legal Information'}</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.qualification}</label>
                          <p className="text-lg">{caseItem.qualification}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.damageAmount}</label>
                          <p className="text-lg">{formatCurrency(caseItem.damage_amount)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.incomeAmount}</label>
                          <p className="text-lg">{formatCurrency(caseItem.income_amount)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">{t.registrationDate}</label>
                          <p className="text-lg">{caseItem.registration_date.toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">{t.generatedFiles}</label>
                    {caseItem.generatedFiles.length > 0 ? (
                      <div className="space-y-2">
                        {caseItem.generatedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.type} • {file.size}</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {file.generatedAt.toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        {language === 'ru' ? 'Файлы ещё не сгенерированы' : 'No files generated yet'}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        onNavigateToDocuments?.(caseItem.id);
                        document.querySelector('[data-state="open"]')?.querySelector('button')?.click();
                      }}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {t.addDocument}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        onCaseSelect(caseItem.id);
                        onNavigate?.('qualification');
                        document.querySelector('[data-state="open"]')?.querySelector('button')?.click();
                      }}
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      {t.generateDocument}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}