
import React, { useRef, useEffect } from 'react';
import { Message, User } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
  selectedUser: User | null;
  isLoading: boolean;
  typingStatus?: {
    isTyping: boolean;
    username: string | null;
  };
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUser, 
  selectedUser,
  isLoading,
  typingStatus = { isTyping: false, username: null } 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingStatus.isTyping]);
  
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-md">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <div className="mr-3 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 ml-auto"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!selectedUser) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center text-slate-500 dark:text-slate-400">
        Select a conversation to start messaging
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center text-slate-500 dark:text-slate-400">
        No messages yet. Start the conversation!
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUser?.id;
        const sender = isCurrentUser ? currentUser : selectedUser;
        
        return (
          <div 
            key={message.id} 
            className={`flex items-start ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={sender?.photos?.[0]} alt={sender?.name} />
                <AvatarFallback className="bg-love-100 text-love-800 dark:bg-love-900 dark:text-love-200">
                  {sender?.name?.substring(0, 2).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`mx-2 max-w-[75%] ${isCurrentUser ? 'order-first' : 'order-last'}`}
            >
              <div 
                className={`px-4 py-2 rounded-xl ${
                  isCurrentUser 
                    ? 'bg-love-500 text-white dark:bg-love-600'
                    : 'bg-gray-100 dark:bg-slate-800 dark:text-slate-200'
                } ${
                  message.type === 'image' ? 'p-1' : ''
                }`}
              >
                {message.type === 'image' ? (
                  <img src={message.content} alt="Shared image" className="rounded-lg max-w-full h-auto" />
                ) : message.type === 'gift' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">🎁</span>
                    <p>{message.content}</p>
                  </div>
                ) : message.type === 'voice' ? (
                  <div className="flex items-center">
                    <span className="mr-2">🎤</span>
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(message.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
            
            {isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={sender?.photos?.[0]} alt={sender?.name} />
                <AvatarFallback className="bg-love-100 text-love-800 dark:bg-love-900 dark:text-love-200">
                  {sender?.name?.substring(0, 2).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
      
      <TypingIndicator isTyping={typingStatus.isTyping} username={typingStatus.username} />
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
