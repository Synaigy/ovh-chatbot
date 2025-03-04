
import React, { useRef } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  hasError: boolean;
  limitReached: boolean;
  messageCount: number;
  messageLimit: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  hasError,
  limitReached,
  messageCount,
  messageLimit
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid unexpected scrolling
      if (!isLoading && input.trim() && !hasError && !limitReached) {
        const form = e.currentTarget.form;
        if (form) {
          e.stopPropagation(); // Stop event propagation
          form.requestSubmit(); // Use requestSubmit instead of custom events
        }
      }
    }
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    e.stopPropagation(); // Stop event propagation
    
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Submit the form
    handleSubmit(e);
    
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto'
      });
    }, 0);
  };
  
  return (
    <form onSubmit={onSubmit} className="border-t border-white/10 p-4 bg-card">
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
          onKeyDown={handleKeyDown}
          placeholder={
            limitReached 
              ? "Tageslimit erreicht. Bitte versuchen Sie es morgen wieder." 
              : hasError 
                ? "Konfigurationsfehler. Bitte kontaktieren Sie den Administrator." 
                : "Ich bin hier, um Ihre Fragen zu beantworten..."
          }
          className="flex-1 bg-card/50 border-white/10 placeholder:text-white/50 resize-none"
          disabled={isLoading || hasError || limitReached}
          rows={1}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !input.trim() || hasError || limitReached}
          className={`rounded-full h-10 w-10 p-2 ${isLoading ? 'bg-white/5' : 'bg-accent'}`}
        >
          <Send className="h-4 w-4" />
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
  );
};

export default ChatInput;
