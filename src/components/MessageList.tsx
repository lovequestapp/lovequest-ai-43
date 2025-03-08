
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageListProps {
  matches: {
    id: string;
    name: string;
    photo: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
  }[];
  activeMatchId?: string;
  onSelectMatch: (matchId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
}) => {
  return (
    <Card className="h-full border-love-100 flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b border-love-100 flex-shrink-0">
          <h2 className="text-xl font-display font-semibold">Messages</h2>
          {matches.length === 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              No matches yet. Start discovering!
            </p>
          )}
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="divide-y divide-love-100">
            {matches.map((match) => (
              <div
                key={match.id}
                className={cn(
                  "p-4 flex items-center gap-3 hover:bg-love-50 cursor-pointer transition-colors",
                  activeMatchId === match.id && "bg-love-50"
                )}
                onClick={() => onSelectMatch(match.id)}
              >
                <div className="relative">
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {match.unreadCount && match.unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 bg-love-500 text-white h-5 w-5 flex items-center justify-center p-0"
                    >
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{match.name}</h3>
                    {match.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {format(match.lastMessageTime, 'h:mm a')}
                      </span>
                    )}
                  </div>
                  
                  {match.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">
                      {match.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-love-500 flex items-center gap-1">
                      <Heart size={12} className="fill-love-500" />
                      New match! Say hello
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageList;
