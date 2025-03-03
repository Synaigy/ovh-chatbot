
import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MessageItem from './MessageItem';
import { sendMessage } from '@/services/aiService';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUESTIONS_LIMIT = 50;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(() => {
    const savedCount = sessionStorage.getItem('questionCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    sessionStorage.setItem('questionCount', questionCount.toString());
  }, [questionCount]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Check if question limit reached
    if (questionCount >= QUESTIONS_LIMIT) {
      toast({
        title: "Limit erreicht",
        description: "Voucher aufgebraucht, Versuch es morgen nochmal",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentAssistantMessage('');
    
    // Increment question counter
    setQuestionCount(prev => prev + 1);
    
    // Add loading message bubble
    const loadingMessage = { role: 'assistant' as const, content: '...' };
    setMessages((prev) => [...prev, loadingMessage]);
    
    try {
      const allMessages = [...messages, userMessage];
      const stream = await sendMessage(allMessages);
      
      // Remove the loading message and initialize a real assistant message
      setMessages((prev) => {
        const updated = [...prev];
        // Remove the last message (which is the loading message)
        updated.pop();
        return updated;
      });
      
      // Initialize assistant message
      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      let fullContent = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content || '';
        fullContent += content;
        
        setCurrentAssistantMessage(fullContent);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            ...updated[updated.length - 1], 
            content: fullContent 
          };
          return updated;
        });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Remove the loading message
      setMessages((prev) => {
        const updated = [...prev];
        // Remove the last message (which is the loading message)
        updated.pop();
        return updated;
      });
      
      // Create detailed error message
      let errorMessage = "Bei der Kommunikation mit der AI ist ein Fehler aufgetreten.";
      if (error) {
        // Extract as much information as possible from the error object
        if (error.message) {
          errorMessage += ` Fehler: ${error.message}`;
        }
        if (error.status) {
          errorMessage += ` (Status: ${error.status})`;
        }
        
        // Additional error details
        if (error.type) {
          errorMessage += ` Typ: ${error.type}`;
        }
        
        // Check for error response details
        if (error.response?.data?.message) {
          errorMessage += ` Details: ${error.response.data.message}`;
        }
        
        // If there's a headers with more information
        if (error.headers) {
          try {
            const headerInfo = JSON.stringify(error.headers);
            if (headerInfo && headerInfo !== '{}') {
              errorMessage += ` Header-Info: ${headerInfo.substring(0, 100)}`;
            }
          } catch (e) {
            // Ignore stringify errors
          }
        }
      }
      
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const questionsRemaining = QUESTIONS_LIMIT - questionCount;
  const progressPercentage = (questionCount / QUESTIONS_LIMIT) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="flex flex-col h-full">
        <div className="chat-window-height overflow-y-auto p-4 glass-morphism rounded-t-xl scrollbar-thin">
          {/* Show error message when limit is reached */}
          {questionsRemaining <= 0 && (
            <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-center">
              <AlertCircle className="w-5 h-5 mx-auto mb-2" />
              <p className="text-red-400 font-medium">Voucher aufgebraucht, Versuch es morgen nochmal</p>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 highlight-text animate-pulse-subtle">
                Willkommen beim OVHcloud Chatbot mit DeepSeek-R1
              </h3>
              <p className="text-white/70 max-w-lg mb-6">
                Stellen Sie Ihre Fragen an DeepSeek R1, ein fortschrittliches Reasoning-LLM für logisches Denken, Problemlösung und präzise Antworten.
              </p>
              <div className="glass-morphism p-4 rounded-lg max-w-md text-white/60 text-sm">
                <p className="mb-2">Beispielfragen:</p>
                <ul className="space-y-2 text-left">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setInput("Wie kann ich das OVHcloud AI Endpoint in meine Anwendung integrieren?")}>
                    → Wie kann ich das OVHcloud AI Endpoint in meine Anwendung integrieren?
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setInput("Erkläre die Unterschiede zwischen verschiedenen KI-Modellen.")}>
                    → Erkläre die Unterschiede zwischen verschiedenen KI-Modellen.
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setInput("Schreibe mir ein Python-Skript zur Automatisierung von Dateioperationen.")}>
                    → Schreibe mir ein Python-Skript zur Automatisierung von Dateioperationen.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pb-2">
              {messages.map((message, index) => (
                <MessageItem 
                  key={index} 
                  message={message} 
                  isLast={index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <form 
          onSubmit={handleSubmit} 
          className="glass-morphism p-4 rounded-b-xl flex items-end gap-2 border-t border-white/5"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeySubmit}
            placeholder={questionCount >= QUESTIONS_LIMIT 
              ? "Voucher aufgebraucht, Versuch es morgen nochmal" 
              : "Ihre Nachricht hier eingeben..."}
            className="flex-1 min-h-[60px] max-h-[200px] resize-none overflow-y-auto glass-morphism"
            disabled={isLoading || questionCount >= QUESTIONS_LIMIT}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim() || questionCount >= QUESTIONS_LIMIT}
            className={cn(
              "h-10 rounded-full hover:highlight-glow",
              input.trim() && questionCount < QUESTIONS_LIMIT ? "bg-highlight hover:bg-highlight/80" : "bg-white/10 hover:bg-white/20",
              "flex items-center justify-center",
              isLoading && "animate-pulse opacity-70",
              questionCount >= QUESTIONS_LIMIT && "cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        
        {/* Question Counter - Moved below chat interface */}
        <div className="mt-2 glass-morphism p-3 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-white/70">Verbleibende Fragen:</span>
            <span className={cn(
              "font-medium",
              questionsRemaining <= 10 ? "text-red-400" : "text-white"
            )}>
              {questionsRemaining} / {QUESTIONS_LIMIT}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-2",
              progressPercentage > 80 ? "bg-red-500/20" :
              progressPercentage > 60 ? "bg-orange-500/20" :
              "bg-green-500/20"
            )}
          />
        </div>
        
        {questionCount >= QUESTIONS_LIMIT && (
          <div className="mt-2 glass-morphism p-3 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">Voucher aufgebraucht, Versuch es morgen nochmal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
