import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Home, Scale, Briefcase, Brain, Settings, LogOut, Edit, History, X, Globe, Monitor, Cpu, Info, MessageSquare, ChevronLeft, ChevronRight, Menu, User, Building, Calendar, DollarSign, FileText, ChevronRight as BreadcrumbChevron } from 'lucide-react';
import QualificationGeneration from './QualificationGeneration';
import CaseManagement from './CaseManagement';
import DocumentsCase from './DocumentsCase';
import LegalInformation from './LegalInformation';
import AddCaseForm from './AddCaseForm';
import AISystem from './ai/AISystem';
import OverviewSection from './dashboard/OverviewSection';
import DocumentsSection from './dashboard/DocumentsSection';
import SettingsSection from './dashboard/SettingsSection';
import MobileSidebar from './dashboard/MobileSidebar';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';
import { translations, GenerationHistory, CaseData } from './dashboard/constants';
import { mockCasesData, getTypeFromQualification } from './dashboard/data';

export default function Dashboard() {
  const { user, logout, language, setLanguage, theme, setTheme } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([]);
  const [selectedCase, setSelectedCase] = useState<string>('case-001');
  const [currentContext, setCurrentContext] = useState<any>(null);
  const [showAddCaseForm, setShowAddCaseForm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [casesData, setCasesData] = useState<CaseData[]>(mockCasesData);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const t = translations[language as keyof typeof translations];

  const menuItems = [
    { id: 'overview', label: t.overview, icon: Home },
    { id: 'cases', label: t.caseManagement, icon: Briefcase },
    { id: 'aiSystem', label: t.aiSystem, icon: Brain },
    { id: 'legalInfo', label: t.legalInformation, icon: Info },
  ];

  useEffect(() => {
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          lastAccessed: item.lastAccessed ? new Date(item.lastAccessed) : undefined
        }));
        setGenerationHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }

    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      setIsDesktopSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleDesktopSidebar = () => {
    const newState = !isDesktopSidebarCollapsed;
    setIsDesktopSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const addToGenerationHistory = (caseId: string, caseName: string, documentType: string, section: string, context?: any) => {
    const historyItem: GenerationHistory = {
      id: Date.now().toString(),
      caseId,
      caseName,
      documentType,
      timestamp: new Date(),
      context,
      section,
      persistent: true,
      lastAccessed: new Date()
    };
    
    const newHistory = [historyItem, ...generationHistory.slice(0, 99)];
    setGenerationHistory(newHistory);
    setCurrentContext(context);
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  const removeFromHistory = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = generationHistory.filter(item => item.id !== historyId);
    setGenerationHistory(newHistory);
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  const navigateFromHistory = (historyItem: GenerationHistory) => {
    setSelectedCase(historyItem.caseId);
    setActiveSection('aiSystem');
    setCurrentContext(historyItem.context);
    setIsMobileSidebarOpen(false);
    
    // Update last accessed
    const updatedHistory = generationHistory.map(item => 
      item.id === historyItem.id ? { ...item, lastAccessed: new Date() } : item
    );
    setGenerationHistory(updatedHistory);
    localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
  };

  const handleSectionChange = (sectionId: string, context?: any, breadcrumbPath?: string[]) => {
    setActiveSection(sectionId);
    if (context) {
      setCurrentContext(context);
    }
    if (breadcrumbPath) {
      setBreadcrumb(breadcrumbPath);
    } else {
      setBreadcrumb([]);
    }
    setIsMobileSidebarOpen(false);
  };

  const handleCaseChange = (caseId: string, documentType: string = 'General') => {
    const caseData = casesData.find(c => c.id === caseId);
    if (caseData) {
      setSelectedCase(caseId);
      const context = { type: 'case', data: { id: caseId, name: caseData.name, type: caseData.type } };
      setCurrentContext(context);
      
      if (activeSection === 'qualification' || activeSection === 'aiSystem' || activeSection === 'documents') {
        addToGenerationHistory(caseId, caseData.name, documentType, activeSection, context);
      }
    }
  };

  const handleNavigateToDocumentsCase = (caseId: string) => {
    setSelectedCase(caseId);
    setActiveSection('documentsCase');
    const caseData = casesData.find(c => c.id === caseId);
    setBreadcrumb([t.caseManagement, t.documentsCase + (caseData ? ` - ${caseData.name}` : '')]);
  };

  const handleNavigateToCurrentCaseDocuments = () => {
    setActiveSection('documentsCase');
    const caseData = casesData.find(c => c.id === selectedCase);
    setBreadcrumb([t.caseManagement, t.documentsCase + (caseData ? ` - ${caseData.name}` : '')]);
  };

  const handleAddNewCase = (newCaseData: any) => {
    const newCase: CaseData = {
      ...newCaseData,
      damage_amount: parseInt(newCaseData.damage_amount) || 0,
      income_amount: parseInt(newCaseData.income_amount) || 0,
      registration_date: new Date(newCaseData.registration_date),
      indictment_date: newCaseData.indictment_date ? new Date(newCaseData.indictment_date) : new Date(),
      name: `Уголовное дело №${Date.now().toString().slice(-6)}`,
      type: getTypeFromQualification(newCaseData.qualification),
      status: 'Active',
      client: newCaseData.fio,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      generatedFiles: [],
      documents: []
    };

    setCasesData(prev => [newCase, ...prev]);
    setSelectedCase(newCase.id);
    setShowAddCaseForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'KZT',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const currentCase = casesData.find(c => c.id === selectedCase);

  const renderContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const content = (() => {
      switch (activeSection) {
        case 'overview':
          return <OverviewSection 
            selectedCase={selectedCase} 
            casesData={casesData} 
            onCaseChange={handleCaseChange} 
            onNavigate={handleSectionChange}
            onNavigateToCurrentCaseDocuments={handleNavigateToCurrentCaseDocuments}
            generationHistory={generationHistory}
          />;
        case 'cases':
          return <CaseManagement 
            selectedCase={selectedCase} 
            onCaseSelect={handleCaseChange} 
            onNavigate={handleSectionChange} 
            onNavigateToDocuments={handleNavigateToDocumentsCase} 
            onAddNewCase={() => setShowAddCaseForm(true)} 
            casesData={casesData}
            onAddToHistory={addToGenerationHistory}
          />;
        case 'documentsCase':
          const selectedCaseData = casesData.find(c => c.id === selectedCase);
          return <DocumentsCase selectedCase={selectedCase} caseName={selectedCaseData?.name} onNavigate={handleSectionChange} breadcrumb={breadcrumb} />;

        case 'documents':
          return <DocumentsSection onNavigate={handleSectionChange} onAddToHistory={(documentType: string) => {
            const caseData = casesData.find(c => c.id === selectedCase);
            if (caseData) {
              addToGenerationHistory(selectedCase, caseData.name, documentType, 'documents', currentContext);
            }
          }} />;
        case 'legalInfo':
          return <LegalInformation />;
        case 'qualification':
          return <QualificationGeneration 
            context={currentContext} 
            onNavigate={handleSectionChange}
            onGeneration={(documentType: string) => {
              const caseData = casesData.find(c => c.id === selectedCase);
              if (caseData) {
                addToGenerationHistory(selectedCase, caseData.name, documentType, 'qualification', currentContext);
              }
            }}
          />;
        case 'aiSystem':
          return <AISystem 
            context={currentContext} 
            onNavigate={handleSectionChange}
            selectedCase={selectedCase}
            casesData={casesData}
            onAddToHistory={addToGenerationHistory}
            breadcrumb={breadcrumb}
          />;
        case 'settings':
          return <SettingsSection />;
        default:
          return <OverviewSection 
            selectedCase={selectedCase} 
            casesData={casesData} 
            onCaseChange={handleCaseChange} 
            onNavigate={handleSectionChange}
            onNavigateToCurrentCaseDocuments={handleNavigateToCurrentCaseDocuments}
            generationHistory={generationHistory}
          />;
      }
    })();

    return (
      <motion.div key={activeSection} variants={contentVariants} initial="hidden" animate="visible">
        {content}
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar - Fixed Position */}
      <div 
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 ${isDesktopSidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r tech-glow z-40 cursor-pointer`}
        onClick={(e) => {
          // Only toggle if clicking on empty space (not on buttons or interactive elements)
          if (e.target === e.currentTarget) {
            toggleDesktopSidebar();
          }
        }}
      >
        {/* Sidebar Header */}
        <motion.div 
          className="p-4 border-b"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={toggleDesktopSidebar}
        >
          <div className="flex items-center justify-between">
            {!isDesktopSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center tech-glow"
                >
                  <Scale className="w-4 h-4 text-primary-foreground" />
                </motion.div>
                <div>
                  <h2 className="text-sm font-semibold text-ttc-gradient drop-shadow-sm">
                    ИИ Правовая система
                  </h2>
                  <p className="text-xs text-primary font-medium">{t.poweredBy}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDesktopSidebar}
              className="w-8 h-8 p-0"
            >
              {isDesktopSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>
        
        {/* Main Menu */}
        <div className="flex-1 p-4" onClick={toggleDesktopSidebar}>
          {!isDesktopSidebarCollapsed && (
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {t.mainMenu}
            </h3>
          )}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start transition-all duration-200 hover:bg-primary/10 ${
                    isDesktopSidebarCollapsed ? 'px-2' : 'px-3'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectionChange(item.id);
                  }}
                  title={isDesktopSidebarCollapsed ? item.label : undefined}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  {!isDesktopSidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* History Section in Sidebar - Always visible when not collapsed */}
        {!isDesktopSidebarCollapsed && (
          <div className="flex-1 border-t p-4 overflow-hidden" onClick={toggleDesktopSidebar}>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t.generationHistory}
              </h3>
            </div>
            <div className="h-full overflow-y-auto space-y-2">
              {generationHistory.length > 0 ? generationHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative p-2 text-xs rounded cursor-pointer hover:bg-muted/50 transition-colors border border-border/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateFromHistory(item);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.documentType}</p>
                      <p className="text-muted-foreground truncate text-xs">{item.caseName}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.timestamp.toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => removeFromHistory(item.id, e)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">{language === 'ru' ? 'История пуста' : 'History is empty'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Account Info in Sidebar */}
        {!isDesktopSidebarCollapsed && (
          <div className="border-t p-4 mt-auto" onClick={toggleDesktopSidebar}>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'ru' ? 'Профиль пользователя' : 'User Profile'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/01.png" alt={user?.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <Badge variant="secondary" className="text-xs">
                    {language === 'ru' ? 'Аккаунт Про' : 'Pro Account'}
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Роль:' : 'Role:'}</span>
                  <span>{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Дел активных:' : 'Active cases:'}</span>
                  <span>{casesData.filter(c => c.status === 'Active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'ИИ-запросов:' : 'AI requests:'}</span>
                  <span>{generationHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Подписка:' : 'Subscription:'}</span>
                  <span className="text-primary">{language === 'ru' ? 'Активна' : 'Active'}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionChange('settings');
                }}
              >
                <Settings className="w-3 h-3 mr-2" />
                {language === 'ru' ? 'Настройки' : 'Settings'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isDesktopSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Unified Header - Fixed Position */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-card/95 backdrop-blur-sm sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center justify-between gap-4">
            {/* Selected Case Info */}
            {currentCase && (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Scale className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate text-foreground">{currentCase.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{currentCase.fio}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span className="truncate">{currentCase.organization}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{formatCurrency(currentCase.damage_amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={
                    currentCase.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    currentCase.status === 'In Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                  }>
                    {currentCase.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSectionChange('cases')}
                  >
                    <Cpu className="w-3 h-3 mr-1" />
                    {language === 'ru' ? 'Сменить' : 'Switch'}
                  </Button>
                </div>
              </div>
            )}

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
                  className="bg-transparent border border-border rounded px-2 py-1 text-sm"
                >
                  <option value="en">EN</option>
                  <option value="ru">RU</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'ttc')}
                  className="bg-transparent border border-border rounded px-2 py-1 text-sm"
                >
                  <option value="light">{t.light}</option>
                  <option value="dark">{t.dark}</option>
                  <option value="ttc">{t.ttc}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 bg-muted/30 rounded-lg px-2 sm:px-3 py-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src="/avatars/01.png" alt={user?.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm hidden sm:block">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSectionChange('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>{t.editProfile}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          menuItems={menuItems}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          generationHistory={generationHistory}
          onNavigateFromHistory={navigateFromHistory}
        />
        
        {/* Main Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>

      <AddCaseForm
        isOpen={showAddCaseForm}
        onClose={() => setShowAddCaseForm(false)}
        onSubmit={handleAddNewCase}
      />
    </div>
  );
}