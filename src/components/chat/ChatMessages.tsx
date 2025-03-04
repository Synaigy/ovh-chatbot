
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on every render
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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
  
  const isEmpty = messages.length === 0;
  
  const exampleQuestions = [
    "Was ist ein Reasoning-LLM?",
    "Wie ist deepseek-r1-distill-llama-70b aufgebaut?",
    "Welche Vorteile bieten die OVHcloud AI Endpoints?",
    "Was sind Anwendungsfälle für KI in Unternehmen?"
  ];
  
  if (isEmpty && !hasError && !limitReached) {
    return (
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
    <>
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
          className="absolute bottom-20 right-8 rounded-full bg-black/50 hover:bg-black/70"
          onClick={(e) => {
            e.preventDefault(); // Prevent scrolling issues
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default ChatMessages;
