import React from 'react';
import { Button } from '../ui/button';
import { Scale, X, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { translations, GenerationHistory } from './constants';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  generationHistory: GenerationHistory[];
  onNavigateFromHistory: (item: GenerationHistory) => void;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  menuItems,
  activeSection,
  onSectionChange,
  generationHistory,
  onNavigateFromHistory
}: MobileSidebarProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div 
        className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-lg"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="font-semibold text-ttc-gradient">ИИ Правовая система</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">{t.mainMenu}</h3>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => onSectionChange(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          
          {generationHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">{t.generationHistory}</h3>
              <div className="space-y-1">
                {generationHistory.slice(0, 5).map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => onNavigateFromHistory(item)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-sm font-medium truncate">{item.caseName}</div>
                      <div className="text-xs text-muted-foreground">{item.documentType}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}