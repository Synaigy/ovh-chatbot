
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MessageItem from './MessageItem';
import { sendMessage } from '@/services/aiService';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentAssistantMessage('');
    
    try {
      const allMessages = [...messages, userMessage];
      const stream = await sendMessage(allMessages);
      
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
      
      // Create detailed error message
      let errorMessage = "Bei der Kommunikation mit der AI ist ein Fehler aufgetreten.";
      if (error) {
        if (error.message) {
          errorMessage += ` Fehler: ${error.message}`;
        }
        if (error.status) {
          errorMessage += ` (Status: ${error.status})`;
        }
        if (error.type) {
          errorMessage += ` Typ: ${error.type}`;
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

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="flex flex-col h-full">
        <div className="chat-window-height overflow-y-auto p-4 glass-morphism rounded-t-xl scrollbar-thin">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 highlight-text animate-pulse-subtle">
                Willkommen beim DeepSeek AI Chatbot
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
            placeholder="Ihre Nachricht hier eingeben..."
            className="flex-1 min-h-[60px] max-h-[200px] resize-none overflow-y-auto glass-morphism"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className={cn(
              "h-10 rounded-full hover:highlight-glow",
              input.trim() ? "bg-highlight hover:bg-highlight/80" : "bg-white/10 hover:bg-white/20",
              "flex items-center justify-center",
              isLoading && "animate-pulse opacity-70"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
