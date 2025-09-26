import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Brain, FolderOpen, FileText, Scale, Eye, Download, ChevronRight, Users, BarChart, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { SectionProps, translations, GenerationHistory } from './constants';

interface OverviewSectionProps extends SectionProps {
  generationHistory?: GenerationHistory[];
}

export default function OverviewSection({ selectedCase, casesData, onCaseChange, onNavigate, generationHistory }: OverviewSectionProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];
  const currentCase = casesData?.find(c => c.id === selectedCase);

  // Calculate statistics
  const activeCases = casesData?.filter(c => c.status === 'Active').length || 0;
  const totalDocumentsByCase = currentCase?.generatedFiles.length || 0;
  const totalDocumentsAllCases = casesData?.reduce((sum, c) => sum + c.generatedFiles.length, 0) || 0;
  const aiGeneratedDocuments = generationHistory?.length || 0;

  const overviewCards = [
    {
      title: language === 'ru' ? 'Активные Дела' : 'Active Cases',
      value: activeCases,
      description: language === 'ru' ? 'Дела в работе' : 'Cases in progress',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: () => onNavigate?.('cases')
    },
    {
      title: language === 'ru' ? 'Документы по Текущему Делу' : 'Documents for Current Case',
      value: totalDocumentsByCase,
      description: language === 'ru' ? `${currentCase?.name || 'Не выбрано'}` : `${currentCase?.name || 'Not selected'}`,
      icon: FolderOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      action: () => onNavigate?.('cases')
    },
    {
      title: language === 'ru' ? 'Общие Документы' : 'Total Documents',
      value: totalDocumentsAllCases,
      description: language === 'ru' ? 'По всем делам' : 'Across all cases',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => onNavigate?.('cases')
    },
    {
      title: language === 'ru' ? 'История ИИ' : 'AI History',
      value: aiGeneratedDocuments,
      description: language === 'ru' ? 'Сессий с ИИ' : 'AI sessions',
      icon: Brain,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => onNavigate?.('history')
    }
  ];

  return (
    <div className="space-y-6">
     

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/20"
              onClick={card.action}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-medium">{card.title}</h3>
                </div>
                <p className="text-2xl font-bold text-primary">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.description}</p>
                <div className="flex items-center text-xs text-primary">
                  <span>{language === 'ru' ? 'Перейти' : 'Go to'}</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Generation History */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{language === 'ru' ? 'Недавняя ИИ Активность' : 'Recent AI Activity'}</h3>
            <Button variant="outline" size="sm" onClick={() => onNavigate?.('history')}>
              {language === 'ru' ? 'Посмотреть все' : 'View all'}
            </Button>
          </div>
          <div className="space-y-3">
            {generationHistory && generationHistory.length > 0 ? (
              generationHistory.slice(0, 5).map((activity, index) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-center justify-between py-2 border-b last:border-b-0 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onNavigate?.('aiSystem', activity.context)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Brain className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">{activity.documentType}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.caseName}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'ru' ? 'Пока нет активности ИИ' : 'No AI activity yet'}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => onNavigate?.('aiSystem')}>
                  {language === 'ru' ? 'Начать работу с ИИ' : 'Start AI Work'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4 sm:p-6">
          <h3 className="font-medium mb-4">{language === 'ru' ? 'Быстрая Статистика' : 'Quick Stats'}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{language === 'ru' ? 'Дела в обработке' : 'Cases in progress'}</span>
              </div>
              <Badge variant="secondary">{casesData?.filter(c => c.status === 'In Review').length || 0}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm">{language === 'ru' ? 'Завершенные дела' : 'Completed cases'}</span>
              </div>
              <Badge variant="secondary">{casesData?.filter(c => c.status === 'Completed').length || 0}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="text-sm">{language === 'ru' ? 'Среднее документов на дело' : 'Avg documents per case'}</span>
              </div>
              <Badge variant="secondary">
                {casesData && casesData.length > 0 
                  ? Math.round(totalDocumentsAllCases / casesData.length) 
                  : 0
                }
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm">{language === 'ru' ? 'ИИ сессии сегодня' : 'AI sessions today'}</span>
              </div>
              <Badge variant="secondary">
                {generationHistory?.filter(h => {
                  const today = new Date();
                  const itemDate = new Date(h.timestamp);
                  return itemDate.toDateString() === today.toDateString();
                }).length || 0}
              </Badge>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => onNavigate?.('cases')}>
              <Users className="w-4 h-4 mr-2" />
              {language === 'ru' ? 'Управление Всеми Делами' : 'Manage All Cases'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}