
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsCardProps {
  counter: number | null;
  apiUrl?: string;
  isGlobalCounter?: boolean;
}

const StatisticsCard = ({ counter, apiUrl, isGlobalCounter = false }: StatisticsCardProps) => {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>
          {isGlobalCounter ? "Globale Chat Statistik" : "Chat Statistik"}
        </CardTitle>
        <CardDescription>
          {isGlobalCounter 
            ? "Gesamtanzahl aller Chat-Anfragen von allen Nutzern" 
            : "Anzahl der Chat-Anfragen in dieser Session"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="text-5xl font-bold highlight-text">{counter !== null ? counter : '...'}</div>
          {apiUrl && (
            <div className="mt-4 text-xs text-white/50 border-t border-white/10 pt-2">
              <div>API Quelle: {apiUrl}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
