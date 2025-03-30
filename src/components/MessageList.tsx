
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Clock, MessageCircleHeart, CircleUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

export interface MessageListProps {
  matches: {
    id: string;
    name: string;
    photo: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
    status?: 'online' | 'offline' | 'away';
  }[];
  activeMatchId?: string | null;
  onSelectMatch: (matchId: string) => void;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
  className
}) => {
  // Add a check to make sure matches is an array before rendering
  const validMatches = Array.isArray(matches) ? matches : [];
  
  const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };
  
  const getStatusClass = (status: string = 'offline') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <Card className="h-full border-love-100 flex flex-col bg-gradient-to-b from-white to-love-50/30">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-love-100 flex-shrink-0 bg-white">
          <h2 className="text-xl font-display font-semibold text-love-900">Messages</h2>
          {validMatches.length === 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              No matches yet. Start discovering!
            </p>
          )}
        </div>
        
        <ScrollArea className={cn("flex-grow", className)}>
          <div className="divide-y divide-love-100">
            {validMatches.map((match) => (
              <div
                key={`message-match-${match.id}`}
                className={cn(
                  "p-4 flex items-center gap-3 hover:bg-love-50/70 cursor-pointer transition-all duration-300",
                  activeMatchId === match.id ? "bg-love-50 border-l-4 border-l-love-500" : "border-l-4 border-l-transparent"
                )}
                onClick={() => onSelectMatch(match.id)}
              >
                <div className="relative">
                  <div className={cn(
                    "h-12 w-12 rounded-full overflow-hidden border-2",
                    activeMatchId === match.id ? "border-love-500" : "border-love-200"
                  )}>
                    {match.photo ? (
                      <img
                        src={match.photo}
                        alt={match.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-love-100 flex items-center justify-center">
                        <CircleUser className="text-love-300" size={32} />
                      </div>
                    )}
                  </div>
                  
                  {match.status && (
                    <div className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                      getStatusClass(match.status)
                    )} />
                  )}
                  
                  {match.unreadCount && match.unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 bg-love-500 text-white h-5 w-5 flex items-center justify-center p-0 shadow-md animate-pulse"
                    >
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={cn(
                      "font-medium truncate",
                      match.unreadCount && match.unreadCount > 0 ? "font-semibold text-love-900" : "text-gray-700"
                    )}>
                      {match.name}
                    </h3>
                    {match.lastMessageTime && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={10} />
                        {formatMessageDate(match.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  
                  {match.lastMessage ? (
                    <p className={cn(
                      "text-sm truncate max-w-[180px]",
                      match.unreadCount && match.unreadCount > 0 
                        ? "text-love-800 font-medium" 
                        : "text-muted-foreground"
                    )}>
                      {match.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-love-500 flex items-center gap-1">
                      <MessageCircleHeart size={12} className="fill-love-500" />
                      <span className="text-love-700">New match! Say hello</span>
                    </p>
                  )}
                </div>
                
                {activeMatchId === match.id && (
                  <Sparkles size={14} className="text-love-500 animate-pulse ml-1" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageList;
