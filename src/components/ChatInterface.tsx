
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ArrowDown, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageItem from './MessageItem';
import { sendMessage, incrementCounter, getCounter } from '@/services/aiService';
import { useToast } from "@/hooks/use-toast";
import CodeBlock from './CodeBlock';

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
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
    const loadCounter = async () => {
      try {
        const initialCount = await getCounter();
        setMessageCount(initialCount);
      } catch (error) {
        console.error('Error loading counter:', error);
      }
    };
    
    loadCounter();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Don't allow empty submissions
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    
    // Clear input and reset rows
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Increment message counter
      const count = await incrementCounter();
      setMessageCount(count);
      
      // Format messages for the API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send to API with streaming
      const streamingResponse = await sendMessage(apiMessages);
      
      // Create a new assistant message with empty content to show the loading animation
      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Handle the streaming response
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
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error toast
      toast({
        title: "Fehler",
        description: error instanceof Error 
          ? `Die Nachricht konnte nicht gesendet werden: ${error.message}` 
          : "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Display configuration error state
  const [configError, setConfigError] = useState(false);
  
  // Check for any messages and configuration status
  const isEmpty = messages.length === 0;
  const hasError = configError === true;
  
  // Example questions to show when the chat is empty
  const exampleQuestions = [
    "Was ist ein Reasoning-LLM?",
    "Wie ist deepseek-r1-distill-llama-70b aufgebaut?",
    "Welche Vorteile bieten die OVHcloud AI Endpoints?",
    "Was sind Anwendungsfälle für KI in Unternehmen?"
  ];
  
  const handleExampleClick = (question: string) => {
    setInput(question);
    // Auto-focus the textarea
    textareaRef.current?.focus();
  };
  
  return (
    <div className="rounded-xl overflow-hidden glass-morphism border-white/10 flex flex-col h-[600px] md:h-[700px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {isEmpty && !hasError && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Bot className="h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Wie kann ich helfen?</h3>
            <p className="text-white/70 mb-6">
              Ich bin hier, um Ihre Fragen zu beantworten. <br />
              Stellen Sie mir eine Frage, um zu beginnen!
            </p>
            
            {/* Example questions */}
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
        
        {/* Message list */}
        {!isEmpty && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageItem 
                key={index}
                message={message}
                isLast={index === messages.length - 1}
                isLoading={index === messages.length - 1 && message.role === 'assistant' && message.content === '' && isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
        <div className="flex items-start space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              
              // Auto-grow textarea (but limit to 5 rows)
              e.target.style.height = 'auto';
              const newHeight = Math.min(e.target.scrollHeight, 5 * 24); // 24px line height
              e.target.style.height = `${newHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading && input.trim()) {
                  handleSubmit(e as any);
                }
              }
            }}
            placeholder="Ich bin hier, um Ihre Fragen zu beantworten..."
            className="flex-1 bg-white/5 border-white/10 placeholder:text-white/50 resize-none"
            disabled={isLoading || hasError}
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim() || hasError}
            className={`rounded-full h-10 w-10 p-2 ${isLoading ? 'bg-white/5' : 'bg-accent'}`}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Message Counter */}
        {messageCount > 0 && (
          <div className="mt-2 text-xs text-white/50 text-right">
            Nachrichten: {messageCount}
          </div>
        )}
      </form>
      
      {/* Scroll to Bottom Button */}
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
