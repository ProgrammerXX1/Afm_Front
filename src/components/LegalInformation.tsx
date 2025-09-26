import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Scale, Search, BookOpen, Star, Bookmark, Eye, Download, Share, Filter, Calendar, User, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import { mockLegalResources } from './legal/constants';
import ResourceCard from './legal/ResourceCard';
import ResourceViewer from './legal/ResourceViewer';

const translations = {
  en: {
    legalInformation: 'Legal Information',
    searchLegal: 'Search legal resources...',
    allCategories: 'All Categories',
    criminalLaw: 'Criminal Law',
    civilLaw: 'Civil Law',
    administrativeLaw: 'Administrative Law',
    laborLaw: 'Labor Law',
    taxLaw: 'Tax Law',
    businessLaw: 'Business Law',
    laws: 'Laws & Codes',
    articles: 'Articles',
    precedents: 'Court Practice',
    guidelines: 'Guidelines',
    recentUpdates: 'Recent Updates',
    popularResources: 'Popular Resources',
    bookmarks: 'Bookmarks',
    allResources: 'All Resources',
    readMore: 'Read More',
    bookmark: 'Bookmark',
    removeBookmark: 'Remove Bookmark',
    source: 'Source',
    lastUpdated: 'Last Updated',
    rating: 'Rating',
    noResults: 'No results found',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    relevance: 'Relevance',
    dateDesc: 'Date (Newest)',
    dateAsc: 'Date (Oldest)',
    ratingDesc: 'Rating (Highest)',
    viewDetails: 'View Details',
    resourceViewer: 'Resource Viewer',
    closeViewer: 'Close Viewer',
    resourceContent: 'Resource Content',
    actions: 'Actions',
    share: 'Share',
    download: 'Download',
    print: 'Print',
    copyLink: 'Copy Link',
    found: 'found',
    resources: 'resources',
    bookmarkAdded: 'Resource bookmarked!',
    bookmarkRemoved: 'Bookmark removed!',
    linkCopied: 'Link copied to clipboard!',
    resourceShared: 'Resource shared successfully!',
    downloadStarted: 'Download started'
  },
  ru: {
    legalInformation: 'База данных',
    searchLegal: 'Поиск юридических ресурсов...',
    allCategories: 'Все Категории',
    criminalLaw: 'Уголовное Право',
    civilLaw: 'Гражданское Право',
    administrativeLaw: 'Административное Право',
    laborLaw: 'Трудовое Право',
    taxLaw: 'Налоговое Право',
    businessLaw: 'Предпринимательское Право',
    laws: 'Законы и Кодексы',
    articles: 'Статьи',
    precedents: 'Судебная Практика',
    guidelines: 'Руководства',
    recentUpdates: 'Последние Обновления',
    popularResources: 'Популярные Ресурсы',
    bookmarks: 'Закладки',
    allResources: 'Все Ресурсы',
    readMore: 'Читать Далее',
    bookmark: 'В Закладки',
    removeBookmark: 'Удалить из Закладок',
    source: 'Источник',
    lastUpdated: 'Последнее Обновление',
    rating: 'Рейтинг',
    noResults: 'Результаты не найдены',
    filterBy: 'Фильтр по',
    sortBy: 'Сортировка',
    relevance: 'Релевантность',
    dateDesc: 'Дата (Новые)',
    dateAsc: 'Дата (Старые)',
    ratingDesc: 'Рейтинг (Высокий)',
    viewDetails: 'Подробнее',
    resourceViewer: 'Просмотр Ресурса',
    closeViewer: 'Закрыть Просмотр',
    resourceContent: 'Содержание Ресурса',
    actions: 'Действия',
    share: 'Поделиться',
    download: 'Скачать',
    print: 'Печать',
    copyLink: 'Копировать Ссылку',
    found: 'найдено',
    resources: 'ресурсов',
    bookmarkAdded: 'Ресурс добавлен в закладки!',
    bookmarkRemoved: 'Закладка удалена!',
    linkCopied: 'Ссылка скопирована в буфер обмена!',
    resourceShared: 'Ресурс успешно отправлен!',
    downloadStarted: 'Загрузка начата'
  }
};

export default function LegalInformation() {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [resources, setResources] = useState(mockLegalResources);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'Criminal Law', label: t.criminalLaw },
    { id: 'Civil Law', label: t.civilLaw },
    { id: 'Administrative Law', label: t.administrativeLaw },
    { id: 'Labor Law', label: t.laborLaw },
    { id: 'Tax Law', label: t.taxLaw },
    { id: 'Business Law', label: t.businessLaw },
  ];

  const types = [
    { id: 'all', label: t.allResources },
    { id: 'law', label: t.laws },
    { id: 'article', label: t.articles },
    { id: 'precedent', label: t.precedents },
    { id: 'guideline', label: t.guidelines },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'dateDesc':
        return b.date.getTime() - a.date.getTime();
      case 'dateAsc':
        return a.date.getTime() - b.date.getTime();
      case 'ratingDesc':
        return b.rating - a.rating;
      case 'relevance':
      default:
        // Simple relevance based on search term matches
        if (!searchTerm) return 0;
        const aMatches = (a.title.toLowerCase().match(new RegExp(searchTerm.toLowerCase(), 'g')) || []).length;
        const bMatches = (b.title.toLowerCase().match(new RegExp(searchTerm.toLowerCase(), 'g')) || []).length;
        return bMatches - aMatches;
    }
  });

  const handleResourceSelect = (resource: any) => {
    setSelectedResource(resource);
  };

  const handleCloseViewer = () => {
    setSelectedResource(null);
  };

  const handleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => {
      const isBookmarked = prev.includes(resourceId);
      if (isBookmarked) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
    
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked }
        : resource
    ));
  };

  const popularResources = resources.filter(r => r.rating >= 4.5).slice(0, 3);
  const recentResources = [...resources].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

  if (selectedResource) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <ResourceViewer
          resource={selectedResource}
          onClose={handleCloseViewer}
          resources={resources}
          setResources={setResources}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
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
          <h1 className="text-3xl text-ttc-gradient">{t.legalInformation}</h1>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchLegal}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t.filterBy} категории</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-sm bg-background"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t.filterBy} типу</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-sm bg-background"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t.sortBy}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-border rounded px-3 py-2 text-sm bg-background"
              >
                <option value="relevance">{t.relevance}</option>
                <option value="dateDesc">{t.dateDesc}</option>
                <option value="dateAsc">{t.dateAsc}</option>
                <option value="ratingDesc">{t.ratingDesc}</option>
              </select>
            </div>
          </div>

          {filteredResources.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {filteredResources.length} {t.resources} {t.found}
            </div>
          )}
        </div>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t.allResources}</TabsTrigger>
          <TabsTrigger value="popular">{t.popularResources}</TabsTrigger>
          <TabsTrigger value="recent">{t.recentUpdates}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {sortedResources.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t.noResults}</h3>
              <p className="text-muted-foreground">
                {language === 'ru' 
                  ? 'Попробуйте изменить параметры поиска или фильтры'
                  : 'Try adjusting your search terms or filters'
                }
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  index={index}
                  onSelect={handleResourceSelect}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkedResources.includes(resource.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                onSelect={handleResourceSelect}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedResources.includes(resource.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                onSelect={handleResourceSelect}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedResources.includes(resource.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}