import { Scale, FileText, Book } from 'lucide-react';
import { LegalResource, translations } from './constants';

export const getCategories = (t: any) => [
  { value: 'all', label: t.allCategories },
  { value: 'Civil Law', label: t.civilLaw },
  { value: 'Criminal Law', label: t.criminalLaw },
  { value: 'Labor Law', label: t.laborLaw },
  { value: 'Corporate Law', label: t.corporateLaw },
  { value: 'Family Law', label: t.familyLaw },
  { value: 'Administrative Law', label: t.administrativeLaw }
];

export const getTypes = (t: any) => [
  { value: 'all', label: t.allCategories },
  { value: 'law', label: t.laws },
  { value: 'article', label: t.articles },
  { value: 'precedent', label: t.precedents },
  { value: 'guideline', label: t.guidelines }
];

export const getSortOptions = (t: any) => [
  { value: 'relevance', label: t.relevance },
  { value: 'dateDesc', label: t.dateDesc },
  { value: 'dateAsc', label: t.dateAsc },
  { value: 'ratingDesc', label: t.ratingDesc }
];

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'law': return Scale;
    case 'article': return FileText;
    case 'precedent': return Book;
    case 'guideline': return FileText;
    default: return FileText;
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'law': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'article': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'precedent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case 'guideline': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export const filterResources = (
  resources: LegalResource[],
  activeTab: string,
  searchTerm: string,
  selectedCategory: string,
  selectedType: string,
  sortBy: string
): LegalResource[] => {
  let filtered = [...resources];

  // Filter by tab
  if (activeTab === 'recent') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filtered = filtered.filter(resource => resource.date >= thirtyDaysAgo);
  } else if (activeTab === 'popular') {
    filtered = filtered.filter(resource => resource.rating >= 4.5);
  } else if (activeTab === 'bookmarks') {
    filtered = filtered.filter(resource => resource.isBookmarked);
  }

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Apply category filter
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(resource => resource.category === selectedCategory);
  }

  // Apply type filter
  if (selectedType !== 'all') {
    filtered = filtered.filter(resource => resource.type === selectedType);
  }

  // Apply sorting
  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'dateDesc':
        return b.date.getTime() - a.date.getTime();
      case 'dateAsc':
        return a.date.getTime() - b.date.getTime();
      case 'ratingDesc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
};

export const handleResourceActions = (language: string) => {
  const t = translations[language as keyof typeof translations];
  
  return {
    handleBookmark: (resourceId: string, resources: LegalResource[], setResources: (resources: LegalResource[]) => void) => {
      setResources(resources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, isBookmarked: !resource.isBookmarked }
          : resource
      ));
      
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        alert(resource.isBookmarked ? t.bookmarkRemoved : t.bookmarkAdded);
      }
    },
    
    handleShare: (resource: LegalResource) => {
      navigator.clipboard.writeText(`${resource.title} - ${resource.source}`);
      alert(t.resourceShared);
    },
    
    handleDownload: (resource: LegalResource) => {
      alert(t.downloadStarted);
    },
    
    handleCopyLink: (resource: LegalResource) => {
      navigator.clipboard.writeText(`https://legal-system.kz/resource/${resource.id}`);
      alert(t.linkCopied);
    }
  };
};