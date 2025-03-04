
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticsCardProps {
  counter: number | null;
}

const StatisticsCard = ({ counter }: StatisticsCardProps) => {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Chat Statistik</CardTitle>
        <CardDescription>Gesamtanzahl der Chat-Anfragen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold highlight-text">{counter !== null ? counter : '...'}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
