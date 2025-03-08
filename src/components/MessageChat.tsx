
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'match';
}

interface MessageChatProps {
  matchName: string;
  matchPhoto: string;
  compatibilityScore?: number;
  messages: Message[];
  onSendMessage: (content: string) => void;
  suggestionStarters?: string[];
}

const MessageChat: React.FC<MessageChatProps> = ({
  matchName,
  matchPhoto,
  compatibilityScore,
  messages,
  onSendMessage,
  suggestionStarters = [],
}) => {
  const [messageText, setMessageText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <Card className="h-full flex flex-col border-love-100">
      <CardHeader className="px-4 py-3 border-b border-love-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={matchPhoto}
            alt={matchName}
            className="h-10 w-10 rounded-full object-cover"
          />
          
          <div>
            <h3 className="font-medium">{matchName}</h3>
            {compatibilityScore && (
              <Badge variant="outline" className="bg-love-50 text-love-700 border-love-200">
                <Sparkles size={12} className="mr-1 text-love-500" />
                {compatibilityScore}% Match
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Start a conversation with {matchName}
                </p>
                
                {suggestionStarters.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-love-700">Suggested starters:</p>
                    <div className="flex flex-col gap-2">
                      {suggestionStarters.map((starter, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="border-love-200 hover:bg-love-50 text-sm justify-start h-auto py-2 px-3"
                          onClick={() => {
                            setMessageText(starter);
                          }}
                        >
                          {starter}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] break-words",
                    message.sender === 'user' 
                      ? "ml-auto" 
                      : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      message.sender === 'user'
                        ? "bg-love-500 text-white rounded-br-none"
                        : "bg-gray-100 rounded-bl-none"
                    )}
                  >
                    {message.content}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      message.sender === 'user'
                        ? "text-right text-muted-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(message.timestamp, 'h:mm a')}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-love-100">
        <div className="flex w-full items-center gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow border-love-200 focus-visible:ring-love-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            size="icon"
            className="bg-love-500 hover:bg-love-600"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageChat;
