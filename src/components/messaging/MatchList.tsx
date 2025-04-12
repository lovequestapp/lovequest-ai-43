
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Search, MessageCircle } from 'lucide-react';

interface Match {
  id: string;
  name: string;
  photo: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  status?: 'online' | 'offline' | 'away';
}

interface MatchListProps {
  matches: Match[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleMessagePreview = (message: string | undefined) => {
    if (!message) return message;
    
    // If it's an image message (starts with data:image)
    if (message.startsWith('data:image')) {
      return '📷 Photo';
    }
    
    // If it's a gift message
    if (message.startsWith('Sent a ')) {
      return '🎁 Gift';
    }
    
    // If it's a voice message
    if (message.startsWith('data:audio')) {
      return '🎤 Voice';
    }
    
    return message;
  };

  return (
    <Card className="h-full border-love-100">
      <CardHeader className="px-4 py-3 border-b border-love-100">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-love-600" />
          <h2 className="text-xl font-semibold text-love-900">Messages</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search matches..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="py-2">
            {filteredMatches.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? 'No matches found' : 'No matches yet. Start discovering new people!'}
              </div>
            ) : (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                    activeMatchId === match.id && "bg-love-50"
                  )}
                  onClick={() => onSelectMatch(match.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-love-100">
                      <AvatarImage src={match.photo} alt={match.name} />
                      <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {match.status && (
                      <div className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                        match.status === 'online' && "bg-green-500",
                        match.status === 'offline' && "bg-gray-400",
                        match.status === 'away' && "bg-yellow-500"
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm text-love-900 truncate">{match.name}</h3>
                      {match.lastMessageTime && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(match.lastMessageTime, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground truncate max-w-[80%]">
                        {handleMessagePreview(match.lastMessage)}
                      </p>
                      
                      {!!match.unreadCount && match.unreadCount > 0 && (
                        <span className="rounded-full bg-love-500 text-white text-xs px-2 py-0.5 min-w-5 text-center">
                          {match.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MatchList;
