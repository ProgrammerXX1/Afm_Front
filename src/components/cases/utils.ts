import { translations } from './constants';

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'in review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export const translatePriority = (priority: string, language: string) => {
  const t = translations[language as keyof typeof translations];
  switch (priority.toLowerCase()) {
    case 'high': return t.high;
    case 'medium': return t.medium;
    case 'low': return t.low;
    default: return priority;
  }
};

export const translateStatus = (status: string, language: string) => {
  const t = translations[language as keyof typeof translations];
  switch (status.toLowerCase()) {
    case 'active': return t.active;
    case 'pending': return t.pending;
    case 'completed': return t.completed;
    case 'in review': return t.review;
    default: return status;
  }
};

export const translateType = (type: string, language: string) => {
  const t = translations[language as keyof typeof translations];
  switch (type.toLowerCase()) {
    case 'уголовное дело': 
    case 'criminal case': return t.criminalCase;
    case 'гражданское дело':
    case 'civil case': return t.civilCase;
    case 'административное дело':
    case 'administrative case': return t.administrativeCase;
    case 'экономическое преступление':
    case 'economic case': return t.economicCase;
    default: return type;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'KZT',
    minimumFractionDigits: 0 
  }).format(amount);
};

export const filterCases = (
  cases: any[], 
  searchTerm: string
) => {
  return cases.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.fio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.iin.includes(searchTerm) ||
    caseItem.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
};