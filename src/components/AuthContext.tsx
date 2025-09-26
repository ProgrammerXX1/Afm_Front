import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>('ru');
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    const savedLanguage = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('light'); // Default to light theme
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = '';
    if (theme !== 'light') {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication check
    if (username === 'beka' && password === '2123') {
      const userData: User = {
        id: 'user-001',
        username: 'beka',
        role: 'Главный Юрист РК'
      };
      
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    language,
    setLanguage,
    theme,
    setTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}