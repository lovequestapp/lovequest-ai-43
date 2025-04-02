
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, Smile, ImagePlus, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, type?: string) => void;
  onOpenGiftModal: () => void;
  onOpenImageUploader: () => void;
  onSendVoiceNote: (voiceUrl: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onOpenGiftModal,
  onOpenImageUploader,
  onSendVoiceNote,
  isLoading
}) => {
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    onSendMessage(messageContent);
    setMessageContent('');
  };

  return (
    <>
      <Separator />
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenGiftModal}
            disabled={isLoading}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenImageUploader}
            disabled={isLoading}
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageContent.trim() || isLoading}
          >
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
