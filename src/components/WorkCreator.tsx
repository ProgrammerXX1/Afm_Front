import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, CalendarIcon, FileText, Users, Tag, Plus, X } from 'lucide-react';

export default function WorkCreator() {
  const [workData, setWorkData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    tags: [] as string[],
    assignees: [] as string[],
    template: ''
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    'Design Project',
    'Marketing Campaign',
    'Research Study',
    'Product Development',
    'Content Creation',
    'Data Analysis'
  ];

  const templates = [
    'Blank Project',
    'Marketing Report',
    'Design Brief',
    'Research Plan',
    'Project Proposal',
    'Content Calendar'
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const addTag = () => {
    if (newTag.trim() && !workData.tags.includes(newTag.trim())) {
      setWorkData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setWorkData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating work:', workData);
    // Here you would typically send the data to your backend
    alert('Work created successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Create New Work</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2">Project Title</label>
                <Input
                  placeholder="Enter project title..."
                  value={workData.title}
                  onChange={(e) => setWorkData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <Textarea
                  placeholder="Describe your project..."
                  value={workData.description}
                  onChange={(e) => setWorkData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Category</label>
                  <Select value={workData.category} onValueChange={(value) => setWorkData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2">Priority</label>
                  <Select value={workData.priority} onValueChange={(value) => setWorkData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block mb-2">Due Date</label>
                <Input
                  type="date"
                  value={workData.dueDate}
                  onChange={(e) => setWorkData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block mb-2">Tags</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {workData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block mb-2">Template</label>
                <Select value={workData.template} onValueChange={(value) => setWorkData(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template} value={template}>{template}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  Create Work
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Project Preview</h3>
            <div className="space-y-3">
              <div>
                <h4>{workData.title || 'Untitled Project'}</h4>
                <p className="text-muted-foreground text-sm">
                  {workData.description || 'No description provided'}
                </p>
              </div>
              
              {workData.category && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  {workData.category}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Badge className={priorityColors[workData.priority as keyof typeof priorityColors]}>
                  {workData.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
              
              {workData.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  Due: {new Date(workData.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {workData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {workData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Import from File
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Add Collaborators
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Tag className="w-4 h-4 mr-2" />
                Manage Templates
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}