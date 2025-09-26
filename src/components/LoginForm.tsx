import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Scale, Eye, EyeOff, Globe, Shield, Gavel, FileText, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { login, language, setLanguage } = useAuth();
  
  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  const translations = {
    ru: {
      welcomeBack: 'Добро пожаловать',
      loginDescription: 'Войдите в систему AI Legal Assistant',
      username: 'Имя пользователя',
      password: 'Пароль',
      signIn: 'Войти',
      signingIn: 'Вход...',
      poweredBy: 'Разработано',
      legalSystem: 'AI Legal Assistant Kazakhstan',
      invalidCredentials: 'Неверные учетные данные',
      legalTitle: 'Правовая Система',
      legalSubtitle: 'Искусственный интеллект в служении правосудия',
      projectCreators: 'АО "ТрансТелеком"',
      forMilitary: 'Все данные выдуманные и носят правовой характер до момента продакшена',
      casesProcessed: 'Дел обработано',
      judgesInSystem: 'Судей в системе', 
      aiAccuracy: 'Точность ИИ',
      support: 'Поддержка 24/7',
      judicialSystem: 'Судебная система',
      republicKazakhstan: 'Республика Казахстан',
      legalDocuments: 'Правовые документы',
      aiProcessing: 'ИИ обработка',
      scalesJustice: 'Весы правосудия',
      justiceAndLaw: 'Справедливость и закон',
      lawEnforcement: 'Правоохранители',
      executiveAuthority: 'Исполнительная власть'
    },
    en: {
      welcomeBack: 'Welcome Back',
      loginDescription: 'Sign in to AI Legal Assistant',
      username: 'Username',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      poweredBy: 'Developed by',
      legalSystem: 'AI Legal Assistant Kazakhstan',
      invalidCredentials: 'Invalid credentials',
      legalTitle: 'Kazakhstan Legal System',
      legalSubtitle: 'Artificial Intelligence in Service of Justice',
      projectCreators: 'JSC "TransTelecom"',
      forMilitary: 'All data is fictional and legal until the time of production',
      casesProcessed: 'Cases Processed',
      judgesInSystem: 'Judges in System',
      aiAccuracy: 'AI Accuracy',
      support: '24/7 Support',
      judicialSystem: 'Judicial System',
      republicKazakhstan: 'Republic of Kazakhstan',
      legalDocuments: 'Legal Documents',
      aiProcessing: 'AI Processing',
      scalesJustice: 'Scales of Justice',
      justiceAndLaw: 'Justice and Law',
      lawEnforcement: 'Law Enforcement',
      executiveAuthority: 'Executive Authority'
    }
  };

  const t = translations[language];

  const legalImages = [
    {
      url: "https://images.unsplash.com/photo-1645570990200-2701a49d45ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdWRnZSUyMGNvdXJ0cm9vbSUyMGxhd3xlbnwxfHx8fDE3NTg3MDE2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: t.judicialSystem,
      subtitle: t.republicKazakhstan,
      icon: Gavel
    },
    {
      url: "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50cyUyMHBhcGVyc3xlbnwxfHx8fDE3NTg3MDE2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: t.legalDocuments,
      subtitle: t.aiProcessing,
      icon: FileText
    },
    {
      url: "https://images.unsplash.com/photo-1757939056741-6a3e18923193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydGhvdXNlJTIwanVzdGljZSUyMHNjYWxlc3xlbnwxfHx8fDE3NTg2NzY2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: t.scalesJustice,
      subtitle: t.justiceAndLaw,
      icon: Scale
    },
    {
      url: "https://images.unsplash.com/photo-1652793806995-7bf3265e40b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBlbmZvcmNlbWVudCUyMG9mZmljZXJ8ZW58MXx8fHwxNzU4NzAxNjI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: t.lawEnforcement,
      subtitle: t.executiveAuthority,
      icon: Shield
    }
  ];

  // Auto-change images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % legalImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [legalImages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const success = await login(username, password);
      if (!success) {
        setError(t.invalidCredentials);
      }
    } catch (error) {
      setError(t.invalidCredentials);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex">
      {/* Left Side - Legal System Info (50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/5 to-secondary/10 p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }} />
        
        <div className="relative z-10 flex flex-col justify-center w-full max-w-lg mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {t.legalTitle}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t.legalSubtitle}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={legalImages[currentImageIndex].url}
                    alt={legalImages[currentImageIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      {React.createElement(legalImages[currentImageIndex].icon, {
                        size: 20,
                        className: "text-primary"
                      })}
                      <h3 className="text-lg font-semibold">{legalImages[currentImageIndex].title}</h3>
                    </div>
                    <p className="text-sm opacity-90">{legalImages[currentImageIndex].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {legalImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { value: "2,847", label: t.casesProcessed },
              { value: "156", label: t.judgesInSystem },
              { value: "98.2%", label: t.aiAccuracy },
              { value: t.support, label: "" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Creator info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50"
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-primary mb-1">
                {t.projectCreators}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.forMilitary}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form (50%) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-xl border-0 bg-card/95 backdrop-blur-sm">
            {/* Language Toggle */}
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Globe size={16} />
                <span>{language === 'ru' ? 'EN' : 'RU'}</span>
              </Button>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t.welcomeBack}
              </h2>
              <p className="text-muted-foreground">
                {t.loginDescription}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t.username}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.signingIn}
                  </div>
                ) : (
                  t.signIn
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t.poweredBy}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <Scale className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {t.legalSystem}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;