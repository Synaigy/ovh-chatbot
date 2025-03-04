
import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MessageItem from '../MessageItem';

interface ChatMessagesProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
  isLoading: boolean;
  hasError: boolean;
  limitReached: boolean;
  messageLimit: number;
  onExampleClick: (question: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  hasError,
  limitReached,
  messageLimit,
  onExampleClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  };
  
  // Initial scroll to bottom when component mounts
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(false);
    }
  }, []);
  
  // Handle new messages - only auto-scroll if user hasn't manually scrolled up
  useEffect(() => {
    if (messages.length > 0 && !userScrolled) {
      // Store the current scroll position before scrolling
      const { scrollTop } = containerRef.current || { scrollTop: 0 };
      
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom();
        
        // Restore scroll position if this was a user message being sent
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
          if (containerRef.current) {
            containerRef.current.scrollTop = scrollTop;
          }
        }
      }, 10);
    }
  }, [messages, userScrolled]);
  
  // Reset userScrolled when a new message is added by the user
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      // Don't force scroll here, just mark that we've seen a user message
      setUserScrolled(false);
    }
  }, [messages.length]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        // Check if user has scrolled up
        const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
        
        setShowScrollButton(!isScrolledToBottom);
        
        // Only set userScrolled if they've scrolled away from bottom
        if (!isScrolledToBottom) {
          setUserScrolled(true);
        } else {
          setUserScrolled(false);
        }
      }
    };
    
    const chatContainer = containerRef.current;
    chatContainer?.addEventListener('scroll', handleScroll);
    
    return () => {
      chatContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isEmpty = messages.length === 0;
  
  const exampleQuestions = [
    "Was ist ein Reasoning-LLM?",
    "Wie ist deepseek-r1-distill-llama-70b aufgebaut?",
    "Welche Vorteile bieten die OVHcloud AI Endpoints?",
    "Was sind Anwendungsfälle für KI in Unternehmen?"
  ];
  
  if (isEmpty && !hasError && !limitReached) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 overflow-y-auto">
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
              onClick={() => onExampleClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className="h-full overflow-y-auto scrollbar-thin" style={{ position: 'relative' }}>
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
      
      {showScrollButton && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-20 right-8 rounded-full bg-black/50 hover:bg-black/70 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollToBottom();
            setUserScrolled(false);
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessages;
