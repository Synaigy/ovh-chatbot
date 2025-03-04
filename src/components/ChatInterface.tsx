
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ArrowDown, Database, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageItem from './MessageItem';
import { 
  sendMessage, 
  incrementCounter, 
  getSessionCounter, 
  resetSessionCounter, 
  getDailyMessageLimit, 
  checkMessageLimit,
  getConfig
} from '@/services/aiService';
import { useToast } from "@/hooks/use-toast";
import CodeBlock from './CodeBlock';

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current) {
        const chatWindow = messagesEndRef.current.parentElement;
        if (chatWindow) {
          const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop === chatWindow.clientHeight;
          setShowScrollButton(!isAtBottom);
        }
      }
    };
    
    const chatWindow = messagesEndRef.current?.parentElement;
    chatWindow?.addEventListener('scroll', handleScroll);
    
    return () => {
      chatWindow?.removeEventListener('scroll', handleScroll);
    };
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
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
  
  const isEmpty = messages.length === 0;
  const hasError = configError === true;
  
  const exampleQuestions = [
    "Was ist ein Reasoning-LLM?",
    "Wie ist deepseek-r1-distill-llama-70b aufgebaut?",
    "Welche Vorteile bieten die OVHcloud AI Endpoints?",
    "Was sind Anwendungsfälle für KI in Unternehmen?"
  ];
  
  const handleExampleClick = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };
  
  return (
    <div className="rounded-xl overflow-hidden glass-morphism border-white/10 flex flex-col h-[600px] md:h-[700px]">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {isEmpty && !hasError && !limitReached && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Bot className="h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Wie kann ich helfen?</h3>
            <p className="text-white/70 mb-6">
              Ich bin hier, um Ihre Fragen zu beantworten. <br />
              Stellen Sie mir eine Frage, um zu beginnen!
            </p>
            
            <div className="w-full max-w-md space-y-2">
              <p className="text-sm text-white/50 mb-2">Beispielfragen:</p>
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  className="w-full p-2 text-left text-sm rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  onClick={() => handleExampleClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Database className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Konfigurationsfehler</h3>
            <p className="text-white/70 mb-4">
              Die Konfiguration konnte nicht von der Datenbank geladen werden. 
              Bitte wenden Sie sich an den Administrator.
            </p>
          </div>
        )}
        
        {limitReached && isEmpty && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tageslimit erreicht</h3>
            <p className="text-white/70 mb-4">
              Sie haben das tägliche Limit von {messageLimit} Nachrichten erreicht. 
              Bitte versuchen Sie es morgen wieder.
            </p>
          </div>
        )}
        
        {!isEmpty && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageItem 
                key={index}
                message={message}
                isLast={index === messages.length - 1}
                isLoading={index === messages.length - 1 && message.role === 'assistant' && isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
        <div className="flex items-start space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              
              e.target.style.height = 'auto';
              const newHeight = Math.min(e.target.scrollHeight, 5 * 24);
              e.target.style.height = `${newHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading && input.trim() && !configError && !limitReached) {
                  handleSubmit(e as any);
                }
              }
            }}
            placeholder={
              limitReached 
                ? "Tageslimit erreicht. Bitte versuchen Sie es morgen wieder." 
                : hasError 
                  ? "Konfigurationsfehler. Bitte kontaktieren Sie den Administrator." 
                  : "Ich bin hier, um Ihre Fragen zu beantworten..."
            }
            className="flex-1 bg-white/5 border-white/10 placeholder:text-white/50 resize-none"
            disabled={isLoading || hasError || limitReached}
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim() || hasError || limitReached}
            className={`rounded-full h-10 w-10 p-2 ${isLoading ? 'bg-white/5' : 'bg-accent'}`}
          >
            {isLoading ? (
              <Send className="h-4 w-4 opacity-50" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-white/50 text-right flex justify-end items-center">
          {limitReached && (
            <span className="mr-2 text-amber-400 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Session-Limit erreicht
            </span>
          )}
          <span>Session-Nachrichten: {messageCount}/{messageLimit}</span>
        </div>
      </form>
      
      {showScrollButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-20 right-8 rounded-full bg-black/50 hover:bg-black/70"
          onClick={() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatInterface;
