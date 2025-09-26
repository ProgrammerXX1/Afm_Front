import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { translations } from './constants';

export default function SettingsSection() {
  const { user, language, setLanguage, theme, setTheme } = useAuth();
  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ttc-gradient">{t.settings}</h1>
      
      <Card className="p-6">
        <h3 className="mb-4">{language === 'ru' ? 'Внешний вид' : 'Appearance'}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>{t.theme}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Выберите предпочитаемую тему' : 'Choose your preferred theme'}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'ttc')}
                className="border border-border rounded px-3 py-2"
              >
                <option value="ttc">{t.ttc}</option>
                <option value="light">{t.light}</option>
                <option value="dark">{t.dark}</option>
              </select>
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p>{t.language}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Выберите предпочитаемый язык' : 'Choose your preferred language'}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
                className="border border-border rounded px-3 py-2"
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </motion.div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="mb-4">{language === 'ru' ? 'Настройки аккаунта' : 'Account Settings'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">{language === 'ru' ? 'Отображаемое имя' : 'Display Name'}</label>
            <Input placeholder={user?.username} />
          </div>
          <div>
            <label className="block mb-2">{language === 'ru' ? 'Роль' : 'Role'}</label>
            <Input placeholder={user?.role} disabled />
          </div>
          <Button>{language === 'ru' ? 'Сохранить изменения' : 'Save Changes'}</Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="mb-4">{language === 'ru' ? 'Настройки ИИ правовой системы' : 'AI Legal System Settings'}</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>{language === 'ru' ? 'Автосохранение документов' : 'Auto-save documents'}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-center">
            <span>{language === 'ru' ? 'Умные правовые предложения' : 'Smart legal suggestions'}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex justify-between items-center">
            <span>{language === 'ru' ? 'ИИ-анализ по законодательству РК' : 'AI analysis for RK legislation'}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </div>
  );
}