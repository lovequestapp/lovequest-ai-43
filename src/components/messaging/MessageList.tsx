
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Message, User } from '@/types/user';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
  selectedUser: User | null;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUser, 
  selectedUser,
  isLoading 
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const isSentByMe = (message: Message) => message.senderId === currentUser?.id;
  
  if (isLoading) {
    return (
      <div className="flex-grow overflow-y-auto p-4 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading messages...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-grow overflow-y-auto p-4" ref={scrollAreaRef}>
      <ScrollArea className="h-full">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id}
                className={`flex flex-col ${isSentByMe(message) ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-gray-500">
                  {isSentByMe(message) ? 'You' : selectedUser?.name}
                </div>
                <Card className={`w-fit max-w-[80%] ${isSentByMe(message) ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-3 break-words">
                    <div>{message.content}</div>
                  </CardContent>
                </Card>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isSentByMe(message) && message.isRead && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
