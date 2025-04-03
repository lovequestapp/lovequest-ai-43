
import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, ImagePlus, Mic } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

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

  const handleEmojiSelect = useCallback((emoji: string) => {
    setMessageContent(prev => prev + emoji);
  }, []);

  return (
    <>
      <Separator />
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenGiftModal}
            disabled={isLoading}
            className="h-9 w-9 rounded-full"
          >
            <span className="text-lg">🎁</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenImageUploader}
            disabled={isLoading}
            className="h-9 w-9 rounded-full"
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            disabled={isLoading}
            className="h-9 w-9 rounded-full"
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder="Type your message..."
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow"
            disabled={isLoading}
          />
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageContent.trim() || isLoading}
            className="bg-love-500 hover:bg-love-600"
          >
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
