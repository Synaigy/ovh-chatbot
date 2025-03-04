
import React, { useState, useEffect } from 'react';
import { getGlobalCounter } from '@/services/aiService';
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
          // Get the global counter value and the API URL used
          const { count, url } = await getGlobalCounter();
          setCounter(count);
          setApiUrl(url);
          console.log(`Global counter fetched from ${url}: ${count}`);
        } catch (error) {
          console.error('Error loading global counter:', error);
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

  return <StatisticsCard counter={counter} apiUrl={apiUrl} isGlobalCounter={true} />;
};

export default CounterDisplay;
