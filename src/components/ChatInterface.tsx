
import React from 'react';
import { useChat } from './chat/useChat';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { ConfigError, LimitReached } from './chat/ErrorStates';

const ChatInterface = () => {
  const {
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
  } = useChat();
  
  const isEmpty = messages.length === 0;
  
  return (
    <div className="rounded-xl overflow-hidden glass-morphism border-white/10 flex flex-col h-[600px] md:h-[700px]">
      <div className="flex-1 overflow-hidden p-4">
        <ConfigError show={configError} />
        
        <LimitReached 
          show={limitReached} 
          messageLimit={messageLimit} 
          isEmpty={isEmpty} 
        />
        
        {!isEmpty && (
          <ChatMessages 
            messages={messages}
            isLoading={isLoading}
            hasError={configError}
            limitReached={limitReached}
            messageLimit={messageLimit}
            onExampleClick={handleExampleClick}
          />
        )}
        
        {isEmpty && !configError && !limitReached && (
          <ChatMessages 
            messages={[]}
            isLoading={isLoading}
            hasError={configError}
            limitReached={limitReached}
            messageLimit={messageLimit}
            onExampleClick={handleExampleClick}
          />
        )}
      </div>
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        hasError={configError}
        limitReached={limitReached}
        messageCount={messageCount}
        messageLimit={messageLimit}
      />
    </div>
  );
};

export default ChatInterface;
