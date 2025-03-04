
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatisticsCardProps {
  counter: number | null;
  apiUrl?: string;
  isGlobalCounter?: boolean;
}

const StatisticsCard = ({ counter, apiUrl, isGlobalCounter = false }: StatisticsCardProps) => {
  // Calculate progress percentage, max at 50 messages
  const progressValue = counter !== null ? Math.min((counter / 50) * 100, 100) : 0;
  
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
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>0</span>
              <span>50+</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
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
