
import React, { useState, useEffect } from 'react';
import { getCounter } from '@/services/aiService';
import StatisticsCard from '@/components/admin/StatisticsCard';

interface CounterDisplayProps {
  isAuthenticated: boolean;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ isAuthenticated }) => {
  const [counter, setCounter] = useState<number | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    const loadCounter = async () => {
      if (isAuthenticated) {
        try {
          // Get the counter value and the API URL used
          const { count, url } = await getCounter();
          setCounter(count);
          setApiUrl(url);
          console.log(`Counter fetched from ${url}: ${count}`);
        } catch (error) {
          console.error('Error loading counter:', error);
        }
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

  return <StatisticsCard counter={counter} apiUrl={apiUrl} />;
};

export default CounterDisplay;
