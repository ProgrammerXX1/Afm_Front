import React from 'react';
import { Card } from '../ui/card';
import { Briefcase, Clock, Calendar } from 'lucide-react';
import { CaseData, translations } from './constants';
import { useAuth } from '../AuthContext';

interface CaseStatsProps {
  filteredCases: CaseData[];
}

export default function CaseStats({ filteredCases }: CaseStatsProps) {
  const { language } = useAuth();
  const t = translations[language as keyof typeof translations];

  const activeCasesCount = filteredCases.filter(c => c.status === 'Active').length;
  const pendingCasesCount = filteredCases.filter(c => c.status === 'Pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">{t.totalCases}</p>
            <p className="text-2xl font-bold">{filteredCases.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">{t.activeCases}</p>
            <p className="text-2xl font-bold">{activeCasesCount}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">{t.pendingCases}</p>
            <p className="text-2xl font-bold">{pendingCasesCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}