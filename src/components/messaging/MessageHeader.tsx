
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, ArrowLeft, Heart, Gift } from 'lucide-react';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';

interface MessageHeaderProps {
  selectedUser: User | null;
  onStartCall: () => void;
  onStartVideoCall: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  onSendGift?: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  selectedUser, 
  onStartCall, 
  onStartVideoCall,
  onBack,
  showBackButton = false,
  onSendGift
}) => {
  const userStatus = selectedUser?.status || 'offline';
  
  return (
    <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex items-center p-3">
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-1" 
            onClick={onBack}
            aria-label="Back to matches"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center flex-1">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src={selectedUser?.photos?.[0]} />
              <AvatarFallback className="bg-love-100 text-love-800">
                {selectedUser?.name?.slice(0, 2).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                userStatus === 'online' ? 'bg-green-500' : 'bg-gray-300'
              )}
            />
          </div>
          
          <div className="ml-3">
            <div className="font-medium text-base">{selectedUser?.name}</div>
            <div className="text-xs text-gray-500">
              {userStatus === 'online' ? 'Active now' : 'Offline'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-love-50 hover:text-love-600 text-gray-500"
            onClick={onStartCall}
            aria-label="Start voice call"
          >
            <Phone className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-love-50 hover:text-love-600 text-gray-500"
            onClick={onStartVideoCall}
            aria-label="Start video call"
          >
            <Video className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-love-50 hover:text-love-600 text-gray-500"
            aria-label="View profile"
            onClick={() => window.location.href = `/profile/${selectedUser?.id}`}
          >
            <Heart className="h-5 w-5" />
          </Button>

          {onSendGift && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-love-50 hover:text-love-600 text-gray-500"
              onClick={onSendGift}
              aria-label="Send gift"
            >
              <Gift className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
