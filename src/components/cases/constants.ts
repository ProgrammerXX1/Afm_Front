export const translations = {
  en: {
    caseManagement: 'Case Management',
    searchCases: 'Search cases...',
    addNewCase: 'Add New Case',
    caseDetails: 'Case Details',
    client: 'Client',
    type: 'Type',
    status: 'Status',
    priority: 'Priority',
    deadline: 'Deadline',
    description: 'Description',
    generatedFiles: 'Generated Files',
    selectCase: 'Select Case',
    addDocument: 'Add Document',
    generateDocument: 'Generate Document',
    viewDocuments: 'View Documents',
    totalCases: 'Total Cases',
    activeCases: 'Active Cases',
    pendingCases: 'Pending Cases',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    review: 'In Review',
    // New fields
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
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    documents: 'Documents',
    // Case types
    criminalCase: 'Criminal Case',
    civilCase: 'Civil Case',
    administrativeCase: 'Administrative Case',
    economicCase: 'Economic Case'
  },
  ru: {
    caseManagement: 'Управление Делами',
    searchCases: 'Поиск дел...',
    addNewCase: 'Добавить Новое Дело',
    caseDetails: 'Детали Дела',
    client: 'Клиент',
    type: 'Тип',
    status: 'Статус',
    priority: 'Приоритет',
    deadline: 'Срок',
    description: 'Описание',
    generatedFiles: 'Сгенерированные Файлы',
    selectCase: 'Выбрать Дело',
    addDocument: 'Добавить Документ',
    generateDocument: 'Генерировать Документ',
    viewDocuments: 'Просмотр Документов',
    totalCases: 'Всего Дел',
    activeCases: 'Активные Дела',
    pendingCases: 'Дела в Ожидании',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    active: 'Активное',
    pending: 'Ожидание',
    completed: 'Завершено',
    review: 'На Рассмотрении',
    // New fields
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
    createdAt: 'Создано',
    updatedAt: 'Обновлено',
    documents: 'Документы',
    // Case types
    criminalCase: 'Уголовное дело',
    civilCase: 'Гражданское дело',
    administrativeCase: 'Административное дело',
    economicCase: 'Экономическое дело'
  }
};

export interface CaseData {
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