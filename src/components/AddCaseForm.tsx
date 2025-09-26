import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Calendar, User, Building, Scale, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';

interface CaseFormData {
  fio: string;
  patronymic: string;
  iin: string;
  organization: string;
  investigator: string;
  registration_date: string;
  qualification: string;
  damage_amount: string;
  income_amount: string;
  indictment_date: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface AddCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: CaseFormData & { id: string; created_at: Date; updated_at: Date }) => void;
}

const translations = {
  en: {
    addNewCase: 'Add New Case',
    caseInformation: 'Case Information',
    personalInformation: 'Personal Information',
    legalInformation: 'Legal Information',
    additionalInformation: 'Additional Information',
    fio: 'Full Name (FIO)',
    patronymic: 'Patronymic',
    iin: 'Individual Identification Number (IIN)',
    organization: 'Organization',
    investigator: 'Investigator',
    registrationDate: 'Registration Date',
    qualification: 'Legal Qualification',
    damageAmount: 'Damage Amount (KZT)',
    incomeAmount: 'Illegal Income Amount (KZT)',
    indictmentDate: 'Indictment Date',
    description: 'Case Description',
    priority: 'Priority Level',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    cancel: 'Cancel',
    createCase: 'Create Case',
    creating: 'Creating...',
    required: 'This field is required',
    caseCreated: 'Case created successfully!',
    enterFio: 'Enter full name',
    enterPatronymic: 'Enter patronymic',
    enterIin: 'Enter 12-digit IIN',
    enterOrganization: 'Enter organization name',
    enterInvestigator: 'Enter investigator name',
    enterQualification: 'Enter legal qualification',
    enterDamageAmount: 'Enter damage amount',
    enterIncomeAmount: 'Enter illegal income amount',
    enterDescription: 'Enter case description',
    selectPriority: 'Select priority level',
    // Common Kazakhstan legal qualifications
    criminalArticles: 'Criminal Code Articles (Kazakhstan)',
    fraud: 'Fraud (Article 190 CC RK)',
    embezzlement: 'Embezzlement (Article 189 CC RK)',
    bribery: 'Bribery (Article 366 CC RK)',
    taxEvasion: 'Tax Evasion (Article 231 CC RK)',
    corruptionOffenses: 'Corruption Offenses (Article 361 CC RK)',
    moneyLaundering: 'Money Laundering (Article 193 CC RK)',
    officialMisconduct: 'Official Misconduct (Article 362 CC RK)'
  },
  ru: {
    addNewCase: 'Добавить Новое Дело',
    caseInformation: 'Информация о Деле',
    personalInformation: 'Личная Информация',
    legalInformation: 'База данных',
    additionalInformation: 'Дополнительная Информация',
    fio: 'Фамилия Имя Отчество (ФИО)',
    patronymic: 'Отчество',
    iin: 'Индивидуальный Идентификационный Номер (ИИН)',
    organization: 'Организация',
    investigator: 'Следователь',
    registrationDate: 'Дата Регистрации',
    qualification: 'Правовая Квалификация',
    damageAmount: 'Сумма Ущерба (тенге)',
    incomeAmount: 'Сумма Незаконного Дохода (тенге)',
    indictmentDate: 'Дата Обвинительного Заключения',
    description: 'Описание Дела',
    priority: 'Уровень Приоритета',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    cancel: 'Отмена',
    createCase: 'Создать Дело',
    creating: 'Создаем...',
    required: 'Это поле обязательно',
    caseCreated: 'Дело успешно создано!',
    enterFio: 'Введите ФИО',
    enterPatronymic: 'Введите отчество',
    enterIin: 'Введите 12-значный ИИН',
    enterOrganization: 'Введите название организации',
    enterInvestigator: 'Введите имя следователя',
    enterQualification: 'Введите правовую квалификацию',
    enterDamageAmount: 'Введите сумму ущерба',
    enterIncomeAmount: 'Введите сумму незаконного дохода',
    enterDescription: 'Введите описание дела',
    selectPriority: 'Выберите уровень приоритета',
    // Common Kazakhstan legal qualifications
    criminalArticles: 'Статьи Уголовного Кодекса (Казахстан)',
    fraud: 'Мошенничество (ст. 190 УК РК)',
    embezzlement: 'Присвоение или растрата (ст. 189 УК РК)',
    bribery: 'Взяточничество (ст. 366 УК РК)',
    taxEvasion: 'Уклонение от уплаты налогов (ст. 231 УК РК)',
    corruptionOffenses: 'Коррупционные правонарушения (ст. 361 УК РК)',
    moneyLaundering: 'Легализация денег (ст. 193 УК РК)',
    officialMisconduct: 'Должностные злоупотребления (ст. 362 УК РК)'
  }
};

export default function AddCaseForm({ isOpen, onClose, onSubmit }: AddCaseFormProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [formData, setFormData] = useState<CaseFormData>({
    fio: '',
    patronymic: '',
    iin: '',
    organization: '',
    investigator: '',
    registration_date: '',
    qualification: '',
    damage_amount: '',
    income_amount: '',
    indictment_date: '',
    description: '',
    priority: 'Medium'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const commonQualifications = [
    t.fraud,
    t.embezzlement,
    t.bribery,
    t.taxEvasion,
    t.corruptionOffenses,
    t.moneyLaundering,
    t.officialMisconduct
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fio.trim()) newErrors.fio = t.required;
    if (!formData.iin.trim()) newErrors.iin = t.required;
    else if (!/^\d{12}$/.test(formData.iin)) newErrors.iin = 'ИИН должен содержать 12 цифр';
    if (!formData.organization.trim()) newErrors.organization = t.required;
    if (!formData.investigator.trim()) newErrors.investigator = t.required;
    if (!formData.registration_date) newErrors.registration_date = t.required;
    if (!formData.qualification.trim()) newErrors.qualification = t.required;
    if (!formData.damage_amount.trim()) newErrors.damage_amount = t.required;
    if (!formData.description.trim()) newErrors.description = t.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCase = {
        ...formData,
        id: `case-${Date.now()}`,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      onSubmit(newCase);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          fio: '',
          patronymic: '',
          iin: '',
          organization: '',
          investigator: '',
          registration_date: '',
          qualification: '',
          damage_amount: '',
          income_amount: '',
          indictment_date: '',
          description: '',
          priority: 'Medium'
        });
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating case:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-ttc-gradient">
            <Scale className="w-6 h-6" />
            {t.addNewCase}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 1 }}
            >
              <CheckCircle className="w-16 h-16 text-ttc-primary mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold text-ttc-gradient mb-2">{t.caseCreated}</h3>
            <p className="text-muted-foreground text-center">
              {language === 'ru' 
                ? 'Дело было успешно добавлено в систему. Переходим к обзору...'
                : 'Case has been successfully added to the system. Navigating to overview...'
              }
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t.personalInformation}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fio">{t.fio} *</Label>
                  <Input
                    id="fio"
                    value={formData.fio}
                    onChange={(e) => handleInputChange('fio', e.target.value)}
                    placeholder={t.enterFio}
                    className={errors.fio ? 'border-destructive' : ''}
                  />
                  {errors.fio && <p className="text-destructive text-sm mt-1">{errors.fio}</p>}
                </div>
                <div>
                  <Label htmlFor="patronymic">{t.patronymic}</Label>
                  <Input
                    id="patronymic"
                    value={formData.patronymic}
                    onChange={(e) => handleInputChange('patronymic', e.target.value)}
                    placeholder={t.enterPatronymic}
                  />
                </div>
                <div>
                  <Label htmlFor="iin">{t.iin} *</Label>
                  <Input
                    id="iin"
                    value={formData.iin}
                    onChange={(e) => handleInputChange('iin', e.target.value)}
                    placeholder={t.enterIin}
                    maxLength={12}
                    className={errors.iin ? 'border-destructive' : ''}
                  />
                  {errors.iin && <p className="text-destructive text-sm mt-1">{errors.iin}</p>}
                </div>
                <div>
                  <Label htmlFor="organization">{t.organization} *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder={t.enterOrganization}
                    className={errors.organization ? 'border-destructive' : ''}
                  />
                  {errors.organization && <p className="text-destructive text-sm mt-1">{errors.organization}</p>}
                </div>
              </div>
            </Card>

            {/* Legal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                {t.legalInformation}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investigator">{t.investigator} *</Label>
                  <Input
                    id="investigator"
                    value={formData.investigator}
                    onChange={(e) => handleInputChange('investigator', e.target.value)}
                    placeholder={t.enterInvestigator}
                    className={errors.investigator ? 'border-destructive' : ''}
                  />
                  {errors.investigator && <p className="text-destructive text-sm mt-1">{errors.investigator}</p>}
                </div>
                <div>
                  <Label htmlFor="registration_date">{t.registrationDate} *</Label>
                  <Input
                    id="registration_date"
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) => handleInputChange('registration_date', e.target.value)}
                    className={errors.registration_date ? 'border-destructive' : ''}
                  />
                  {errors.registration_date && <p className="text-destructive text-sm mt-1">{errors.registration_date}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="qualification">{t.qualification} *</Label>
                  <Select onValueChange={(value) => handleInputChange('qualification', value)}>
                    <SelectTrigger className={errors.qualification ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t.enterQualification} />
                    </SelectTrigger>
                    <SelectContent>
                      {commonQualifications.map((qual, index) => (
                        <SelectItem key={index} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.qualification && <p className="text-destructive text-sm mt-1">{errors.qualification}</p>}
                </div>
                <div>
                  <Label htmlFor="damage_amount">{t.damageAmount} *</Label>
                  <Input
                    id="damage_amount"
                    type="number"
                    value={formData.damage_amount}
                    onChange={(e) => handleInputChange('damage_amount', e.target.value)}
                    placeholder={t.enterDamageAmount}
                    className={errors.damage_amount ? 'border-destructive' : ''}
                  />
                  {errors.damage_amount && <p className="text-destructive text-sm mt-1">{errors.damage_amount}</p>}
                </div>
                <div>
                  <Label htmlFor="income_amount">{t.incomeAmount}</Label>
                  <Input
                    id="income_amount"
                    type="number"
                    value={formData.income_amount}
                    onChange={(e) => handleInputChange('income_amount', e.target.value)}
                    placeholder={t.enterIncomeAmount}
                  />
                </div>
                <div>
                  <Label htmlFor="indictment_date">{t.indictmentDate}</Label>
                  <Input
                    id="indictment_date"
                    type="date"
                    value={formData.indictment_date}
                    onChange={(e) => handleInputChange('indictment_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">{t.priority}</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: 'High' | 'Medium' | 'Low') => handleInputChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">{t.high}</SelectItem>
                      <SelectItem value="Medium">{t.medium}</SelectItem>
                      <SelectItem value="Low">{t.low}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t.additionalInformation}
              </h3>
              <div>
                <Label htmlFor="description">{t.description} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t.enterDescription}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
              </div>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-ttc-primary hover:bg-ttc-secondary text-ttc-dark">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-ttc-dark border-t-transparent rounded-full"
                    />
                    {t.creating}
                  </div>
                ) : (
                  t.createCase
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}