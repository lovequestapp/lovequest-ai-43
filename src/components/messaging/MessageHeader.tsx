
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, ArrowLeft } from 'lucide-react';
import { User } from '@/types/user';

interface MessageHeaderProps {
  selectedUser: User | null;
  onStartCall: () => void;
  onStartVideoCall: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  selectedUser, 
  onStartCall, 
  onStartVideoCall,
  onBack,
  showBackButton = false
}) => {
  return (
    <div className="border-b p-4">
      <div className="flex items-center space-x-4">
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
        <Avatar>
          <AvatarImage src={selectedUser?.photos?.[0]} />
          <AvatarFallback>{selectedUser?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="font-semibold">{selectedUser?.name}</div>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-auto" 
          onClick={onStartCall}
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onStartVideoCall}
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageHeader;
