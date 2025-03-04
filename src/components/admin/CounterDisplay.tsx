
import React, { useState, useEffect } from 'react';
import { getCounter } from '@/services/aiService';
import StatisticsCard from '@/components/admin/StatisticsCard';

interface CounterDisplayProps {
  isAuthenticated: boolean;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ isAuthenticated }) => {
  const [counter, setCounter] = useState<number | null>(null);

  useEffect(() => {
    const loadCounter = async () => {
      if (isAuthenticated) {
        const count = await getCounter();
        setCounter(count);
      }
    };
    
    loadCounter();
    
    let intervalId: number | undefined;
    if (isAuthenticated) {
      intervalId = window.setInterval(() => {
        loadCounter();
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  return <StatisticsCard counter={counter} />;
};

export default CounterDisplay;
