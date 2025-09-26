import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Download, Share, Star, ExternalLink, Bookmark, Search, Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
import { LegalResource, translations } from './constants';
import { getTypes, getTypeColor, handleResourceActions } from './utils';
import { useAuth } from '../AuthContext';

interface ResourceViewerProps {
  resource: LegalResource;
  onClose: () => void;
  resources: LegalResource[];
  setResources: (resources: LegalResource[]) => void;
}

export default function ResourceViewer({ resource, onClose, resources, setResources }: ResourceViewerProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  const types = getTypes(t);
  const actions = handleResourceActions(language);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ index: number; text: string }[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const content = resource.content || '';
    const results: { index: number; text: string }[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(term.toLowerCase())) {
        results.push({ index, text: line });
      }
    });
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
  };

  const navigateSearchResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    if (direction === 'next') {
      setCurrentSearchIndex((prev) => (prev + 1) % searchResults.length);
    } else {
      setCurrentSearchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> : part
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.closeViewer}
          </Button>
          <h1 className="text-2xl sm:text-3xl text-ttc-gradient">{t.resourceViewer}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className={`grid ${isFullscreen ? 'grid-cols-1 flex-1' : 'grid-cols-1 lg:grid-cols-3 flex-1'} gap-6 p-4 overflow-hidden`}>
        <div className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-2'} flex flex-col min-h-0`}>
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold truncate">{resource.title}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => actions.handleDownload(resource)}>
                  <Download className="w-4 h-4 mr-2" />
                  {t.download}
                </Button>
                <Button variant="outline" size="sm" onClick={() => actions.handleShare(resource)}>
                  <Share className="w-4 h-4 mr-2" />
                  {t.share}
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'ru' ? 'Поиск по тексту документа...' : 'Search document text...'}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {currentSearchIndex + 1} / {searchResults.length}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateSearchResults('prev')}
                      disabled={searchResults.length === 0}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateSearchResults('next')}
                      disabled={searchResults.length === 0}
                    >
                      ↓
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 bg-muted/20 p-4 rounded-lg overflow-y-auto">
              <div className="space-y-4">
                {!isFullscreen && (
                  <div>
                    <h4 className="font-medium mb-2">{language === 'ru' ? 'Описание' : 'Description'}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">{t.resourceContent}</h4>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {resource.content ? 
                      highlightText(resource.content, searchTerm) :
                      (language === 'ru' 
                        ? 'Полное содержание ресурса будет загружено...' 
                        : 'Full resource content will be loaded...')
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {!isFullscreen && (
          <div className="space-y-4 flex flex-col min-h-0">
            <Card className="p-4 flex-shrink-0">
              <h4 className="mb-3">{language === 'ru' ? 'Информация о ресурсе' : 'Resource Information'}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ru' ? 'Тип' : 'Type'}:</span>
                  <Badge className={getTypeColor(resource.type)} variant="secondary">
                    {types.find(t => t.value === resource.type)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.rating}:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{resource.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.lastUpdated}:</span>
                  <span>{resource.date.toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.source}:</span>
                  <span className="truncate">{resource.source}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 flex-shrink-0">
              <h4 className="mb-3">{language === 'ru' ? 'Теги' : 'Tags'}</h4>
              <div className="flex flex-wrap gap-1">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-4 flex-shrink-0">
              <h4 className="mb-3">{t.actions}</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => actions.handleBookmark(resource.id, resources, setResources)}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                  {resource.isBookmarked ? t.removeBookmark : t.bookmark}
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => actions.handleDownload(resource)}>
                  <Download className="w-4 h-4 mr-2" />
                  {t.download}
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => actions.handleShare(resource)}>
                  <Share className="w-4 h-4 mr-2" />
                  {t.share}
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => actions.handleCopyLink(resource)}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t.copyLink}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}