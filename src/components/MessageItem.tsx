
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface MessageItemProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  isLast?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLast = false }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  const isUser = message.role === 'user';
  const isLoading = message.role === 'assistant' && message.content === '...';
  
  // Handling code blocks in the message
  const processMessageContent = (content: string) => {
    // Find all code blocks (content between ```)
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }

      // Extract language (if specified)
      const codeContent = match[1];
      const firstLineEnd = codeContent.indexOf('\n');
      let language = '';
      let code = codeContent;

      if (firstLineEnd > 0) {
        const possibleLang = codeContent.slice(0, firstLineEnd).trim();
        if (possibleLang && !possibleLang.includes(' ')) {
          language = possibleLang;
          code = codeContent.slice(firstLineEnd + 1);
        }
      }

      // Add code block
      parts.push({
        type: 'code',
        language,
        content: code,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return parts;
  };

  const contentParts = processMessageContent(message.content);

  return (
    <div 
      className={cn(
        'flex w-full mb-4 opacity-0',
        isUser ? 'justify-end' : 'justify-start',
        visible && 'opacity-100',
        isUser ? 'animate-slide-in-left' : 'animate-slide-in-right'
      )}
    >
      <div className={cn(
        'flex max-w-[85%] md:max-w-[75%]',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <div className={cn(
          'flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-full glass-morphism',
          isUser ? 'ml-3' : 'mr-3',
          isUser ? 'bg-highlight/20' : 'bg-white/10'
        )}>
          {isUser ? (
            <User className="w-5 h-5 mt-2.5" />
          ) : (
            <Bot className="w-5 h-5 mt-2.5" />
          )}
        </div>
        <div className={cn(
          'flex flex-col',
          'glass-morphism rounded-2xl p-4',
          isUser ? 'rounded-tr-sm' : 'rounded-tl-sm',
          isUser ? 'bg-highlight/10' : isLoading ? 'bg-white/5' : 'bg-[#FF3366]/10',
          isLast && isUser ? 'highlight-glow' : '',
          isLoading ? 'animate-pulse' : ''
        )}>
          {isLoading ? (
            <div className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          ) : (
            contentParts.map((part, index) => (
              part.type === 'code' ? (
                <CodeBlock 
                  key={index} 
                  language={part.language} 
                  code={part.content} 
                />
              ) : (
                <div 
                  key={index} 
                  className="whitespace-pre-wrap mb-2 last:mb-0"
                  dangerouslySetInnerHTML={{ __html: part.content.replace(/\n/g, '<br/>') }}
                />
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
