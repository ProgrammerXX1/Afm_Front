import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Grid, List, Eye, Edit, Copy, Trash2, Plus, FileText, Image, Presentation, Calculator } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
  usageCount: number;
  lastModified: string;
  type: 'document' | 'presentation' | 'spreadsheet' | 'design';
}

export default function TemplateView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Marketing Report Template',
      category: 'Marketing',
      description: 'Comprehensive marketing analysis and reporting template with charts and metrics',
      thumbnail: '/api/placeholder/300/200',
      tags: ['report', 'analytics', 'marketing'],
      usageCount: 45,
      lastModified: '2 days ago',
      type: 'document'
    },
    {
      id: '2',
      name: 'Project Proposal',
      category: 'Business',
      description: 'Professional project proposal template for client presentations',
      thumbnail: '/api/placeholder/300/200',
      tags: ['proposal', 'business', 'client'],
      usageCount: 32,
      lastModified: '1 week ago',
      type: 'presentation'
    },
    {
      id: '3',
      name: 'Budget Tracker',
      category: 'Finance',
      description: 'Track expenses, income, and budget allocations with automated calculations',
      thumbnail: '/api/placeholder/300/200',
      tags: ['budget', 'finance', 'tracking'],
      usageCount: 28,
      lastModified: '3 days ago',
      type: 'spreadsheet'
    },
    {
      id: '4',
      name: 'Design Brief Template',
      category: 'Design',
      description: 'Structured template for design project briefs and requirements',
      thumbnail: '/api/placeholder/300/200',
      tags: ['design', 'brief', 'requirements'],
      usageCount: 19,
      lastModified: '5 days ago',
      type: 'document'
    },
    {
      id: '5',
      name: 'Content Calendar',
      category: 'Marketing',
      description: 'Plan and organize content across multiple channels and platforms',
      thumbnail: '/api/placeholder/300/200',
      tags: ['content', 'calendar', 'planning'],
      usageCount: 67,
      lastModified: '1 day ago',
      type: 'spreadsheet'
    },
    {
      id: '6',
      name: 'Team Meeting Agenda',
      category: 'Management',
      description: 'Structured agenda template for productive team meetings',
      thumbnail: '/api/placeholder/300/200',
      tags: ['meeting', 'agenda', 'team'],
      usageCount: 53,
      lastModified: '4 days ago',
      type: 'document'
    }
  ];

  const categories = ['all', 'Marketing', 'Business', 'Finance', 'Design', 'Management'];
  const types = ['all', 'document', 'presentation', 'spreadsheet', 'design'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'presentation':
        return <Presentation className="w-5 h-5" />;
      case 'spreadsheet':
        return <Calculator className="w-5 h-5" />;
      case 'design':
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => (
        <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            {getTypeIcon(template.type)}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="truncate">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline" className="text-xs">
                {template.usageCount} uses
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {template.lastModified}
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredTemplates.map((template) => (
        <Card key={template.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {getTypeIcon(template.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="truncate">{template.name}</h4>
                <p className="text-sm text-muted-foreground truncate">{template.description}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{template.category}</Badge>
                <Badge variant="outline" className="text-xs">
                  {template.usageCount} uses
                </Badge>
              </div>
              
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {template.lastModified}
              </span>
            </div>
            
            <div className="flex gap-1 ml-4">
              <Button size="sm" variant="ghost">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Templates</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div>
        {viewMode === 'grid' ? <GridView /> : <ListView />}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3>No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
            <Button>Create New Template</Button>
          </div>
        </Card>
      )}
    </div>
  );
}