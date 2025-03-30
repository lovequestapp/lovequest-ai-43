
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import ImagePreview from './message-actions/ImagePreview';

interface Match {
  id: string;
  name: string;
  photo: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  compatibilityScore?: number;
  status?: 'online' | 'offline' | 'away';
}

interface MessageListProps {
  matches: Match[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleMatchClick = (matchId: string) => {
    onSelectMatch(matchId);
  };
  
  const handleMessagePreview = (message: string | undefined) => {
    if (!message) return message;
    
    // If it's an image message (starts with data:image)
    if (message.startsWith('data:image')) {
      return '📷 Photo';
    }
    
    // If it's a gift message
    if (message === 'Sent a gift') {
      return '🎁 Gift';
    }
    
    // If it's a voice message
    if (message === 'Sent a voice message') {
      return '🎤 Voice';
    }
    
    return message;
  };
  
  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setPreviewImage(imageUrl);
  };

  return (
    <>
      <Card className="h-full border-love-100">
        <CardHeader className="px-4 py-3 border-b border-love-100">
          <h2 className="text-xl font-semibold text-love-900">Your Matches</h2>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="py-2">
              {matches.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No matches yet. Start discovering new people!
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                      activeMatchId === match.id && "bg-love-50"
                    )}
                    onClick={() => handleMatchClick(match.id)}
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
                          {match.lastMessage && match.lastMessage.startsWith('data:image') ? (
                            <span 
                              className="text-love-600 cursor-pointer" 
                              onClick={(e) => handleImageClick(e, match.lastMessage || '')}
                            >
                              📷 View Photo
                            </span>
                          ) : (
                            handleMessagePreview(match.lastMessage)
                          )}
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
      
      {previewImage && (
        <ImagePreview 
          imageUrl={previewImage}
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
};

export default MessageList;
