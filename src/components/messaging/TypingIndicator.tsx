
import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  username: string | null;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping, username }) => {
  if (!isTyping) return null;
  
  return (
    <div className="flex items-center px-4 py-1 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
      <div className="flex space-x-1 mr-2">
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{username || 'Someone'} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
