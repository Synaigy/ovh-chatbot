
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  sendMessage, 
  incrementCounter, 
  getSessionCounter, 
  resetSessionCounter, 
  getDailyMessageLimit, 
  checkMessageLimit,
  getConfig
} from '@/services/aiService';

export const useChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const { toast } = useToast();
  const messageLimit = getDailyMessageLimit();
  
  const [messageCount, setMessageCount] = useState(getSessionCounter());
  
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const config = await getConfig();
        if (!config || !config.API_ENDPOINT || !config.API_KEY) {
          setConfigError(true);
        } else {
          setConfigError(false);
        }
      } catch (error) {
        console.error('Configuration error:', error);
        setConfigError(true);
      }
    };
    
    checkConfig();
  }, []);
  
  useEffect(() => {
    resetSessionCounter();
    setMessageCount(0);
  }, []);
  
  useEffect(() => {
    const loadCounterAndCheckLimit = async () => {
      try {
        const { limitReached: limitStatus } = await checkMessageLimit();
        setMessageCount(getSessionCounter());
        setLimitReached(limitStatus);
      } catch (error) {
        console.error('Error checking message limit:', error);
      }
    };
    
    loadCounterAndCheckLimit();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || configError || limitReached) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    
    setInput('');
    
    setIsLoading(true);
    
    try {
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const streamingResponse = await sendMessage(apiMessages);
      
      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages(prev => [...prev, assistantMessage]);
      
      setMessageCount(getSessionCounter());
      const { limitReached: newLimitStatus } = await checkMessageLimit();
      setLimitReached(newLimitStatus);
      
      let fullContent = '';
      
      for await (const chunk of streamingResponse) {
        if (chunk.choices[0]?.delta?.content) {
          fullContent += chunk.choices[0].delta.content;
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].content = fullContent;
            return updatedMessages;
          });
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error instanceof Error && error.message.includes('Tägliches Nachrichtenlimit')) {
        setLimitReached(true);
      }
      
      toast({
        title: "Fehler",
        description: error instanceof Error 
          ? `${error.message}` 
          : "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      
      if (error instanceof Error && error.message.includes('Konfiguration')) {
        setConfigError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExampleClick = (question: string) => {
    setInput(question);
  };
  
  return {
    messages,
    input,
    setInput,
    isLoading,
    configError,
    limitReached,
    messageCount,
    messageLimit,
    handleSubmit,
    handleExampleClick
  };
};
