
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video } from 'lucide-react';
import { User } from '@/types/user';

interface MessageHeaderProps {
  selectedUser: User | null;
  onStartCall: () => void;
  onStartVideoCall: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  selectedUser, 
  onStartCall, 
  onStartVideoCall 
}) => {
  return (
    <div className="border-b p-4">
      <div className="flex items-center space-x-4">
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
