import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Calendar, ExternalLink, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { LegalResource, translations } from './constants';
import { getTypeIcon, getTypeColor, getTypes, handleResourceActions } from './utils';
import { useAuth } from '../AuthContext';

interface ResourceCardProps {
  resource: LegalResource;
  index: number;
  onSelect: (resource: LegalResource) => void;
  onBookmark: (resourceId: string) => void;
  isBookmarked: boolean;
}

export default function ResourceCard({ resource, index, onSelect, onBookmark, isBookmarked }: ResourceCardProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  const types = getTypes(t);
  const IconComponent = getTypeIcon(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-200 h-[400px] flex flex-col border-2 border-transparent hover:border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium leading-tight mb-2 line-clamp-2">{resource.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resource.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(resource.id)}
            className="flex-shrink-0"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className="space-y-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <Badge className={getTypeColor(resource.type)} variant="secondary">
              {types.find(t => t.value === resource.type)?.label}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-muted-foreground">{resource.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 flex-1 content-start">
            {resource.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1 mt-auto">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{resource.date.toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">{resource.source}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => onSelect(resource)}
            >
              {t.viewDetails}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}