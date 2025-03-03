import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MessageItem from './MessageItem';
import { sendMessage, initializeClient, isClientInitialized } from '@/services/aiService';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isKeyProvided, setIsKeyProvided] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    const storedKey = localStorage.getItem('ovh_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      try {
        initializeClient(storedKey);
        setIsKeyProvided(true);
      } catch (error) {
        console.error('Failed to initialize client with stored key:', error);
        localStorage.removeItem('ovh_api_key');
      }
    }
  }, []);

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
    
    try {
      const allMessages = [...messages, userMessage];
      const response = await sendMessage(allMessages);
      const assistantMessage = {
        role: 'assistant' as const,
        content: response.choices[0]?.message.content || "Entschuldigung, ich konnte keine Antwort generieren."
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fehler",
        description: "Bei der Kommunikation mit der AI ist ein Fehler aufgetreten.",
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

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    try {
      initializeClient(apiKey);
      localStorage.setItem('ovh_api_key', apiKey);
      setIsKeyProvided(true);
      toast({
        title: "Erfolg",
        description: "API-Schlüssel gespeichert und bereit zur Nutzung.",
      });
    } catch (error) {
      console.error('Failed to initialize client:', error);
      toast({
        title: "Fehler",
        description: "Der API-Schlüssel konnte nicht initialisiert werden.",
        variant: "destructive"
      });
    }
  };

  const resetApiKey = () => {
    setApiKey('');
    setIsKeyProvided(false);
    localStorage.removeItem('ovh_api_key');
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {!isKeyProvided ? (
        <div className="w-full glass-morphism p-6 rounded-xl animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 highlight-text">API-Schlüssel eingeben</h3>
          <p className="mb-4 text-white/80">
            Um den Chatbot zu nutzen, benötigen Sie einen API-Schlüssel für OVHcloud AI Endpoints.
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OVHcloud API-Schlüssel eingeben"
              className="glass-morphism"
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-highlight hover:bg-highlight/80"
            >
              Bestätigen
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetApiKey}
              className="absolute top-2 right-2 z-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10"
              title="API-Schlüssel zurücksetzen"
            >
              <X size={18} />
            </Button>
          </div>
          
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
      )}
    </div>
  );
};

export default ChatInterface;
