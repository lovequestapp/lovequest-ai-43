
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile, ImagePlus, Mic, Video, Check, Phone, PhoneOff } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { GiftModal } from '@/components/GiftModal';
import { type Message } from '@/types/user';
import VoiceRecorder from '@/components/VoiceRecorder';
import ImageUploader from '@/components/ImageUploader';

const MessagesPage = () => {
  const { userId: selectedUserId } = useParams<{ userId: string }>();
  const { currentUser, allUsers, messages: allMessages, sendMessage } = useUser();
  const [messageContent, setMessageContent] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchUser = async () => {
      if (selectedUserId) {
        // Find the user in allUsers
        const user = allUsers.find(user => user.id === selectedUserId);
        setSelectedUser(user);
      }
    };
    
    fetchUser();
  }, [selectedUserId, allUsers, currentUser, navigate]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [allMessages]);
  
  const handleOpenGiftModal = () => {
    setIsGiftModalOpen(true);
  };
  
  const handleCloseGiftModal = () => {
    setIsGiftModalOpen(false);
  };
  
  const handleOpenImageUploader = () => {
    setIsImageUploaderOpen(true);
  };
  
  const handleCloseImageUploader = () => {
    setIsImageUploaderOpen(false);
  };
  
  const handleAcceptVideoCall = (recipientId: string) => {
    toast.success(`Video call accepted with user ${recipientId}`);
  };
  
  const handleDeclineVideoCall = (recipientId: string) => {
    toast.success(`Video call declined with user ${recipientId}`);
  };

  const handleSendMessage = (content: string, messageType: string = 'text') => {
    if (!content.trim() && messageType === 'text') return;
    if (!selectedUserId) return;
    
    sendMessage(selectedUserId, content);
    setMessageContent('');
  };

  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!selectedUserId) return;
    
    const giftMessage = `Sent a ${giftType}`;
    sendMessage(selectedUserId, giftMessage);
    handleCloseGiftModal();
  };

  const handleSendVoiceNote = (voiceUrl: string) => {
    if (!selectedUserId) return;
    
    sendMessage(selectedUserId, 'Voice note');
    setIsRecording(false);
  };

  const handleSendImage = (imageUrl: string) => {
    if (!selectedUserId) return;
    
    sendMessage(selectedUserId, 'Image');
    handleCloseImageUploader();
  };

  const handleRequestVideoCall = () => {
    if (!selectedUserId) return;
    
    sendMessage(selectedUserId, 'Video call request');
  };

  // Let's create a mock for messages since we don't have the full functionality yet
  const mockMessages = allMessages || []; // Fallback to empty array if allMessages is undefined
  const messages = mockMessages.filter(
    message =>
      (message.senderId === currentUser?.id && message.recipientId === selectedUserId) ||
      (message.recipientId === currentUser?.id && message.senderId === selectedUserId)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  const isSentByMe = (message: Message) => message.senderId === currentUser?.id;
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={selectedUser?.photos?.[0]} />
            <AvatarFallback>{selectedUser?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-semibold">{selectedUser?.name}</div>
          <Button variant="outline" size="icon" className="ml-auto">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4" ref={scrollAreaRef}>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex flex-col ${isSentByMe(message) ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-gray-500">
                  {isSentByMe(message) ? 'You' : selectedUser?.name}
                </div>
                <Card className="w-fit max-w-[80%]">
                  <CardContent className="p-2 break-words">
                    <div>{message.content}</div>
                  </CardContent>
                </Card>
                <div className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <Separator />
      
      {/* Message Input */}
      <CardFooter className="p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleOpenGiftModal}>
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleOpenImageUploader}>
            <ImagePlus className="h-5 w-5" />
          </Button>
          <VoiceRecorder onRecordingComplete={handleSendVoiceNote} />
          <Input
            placeholder="Type your message..."
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage(messageContent);
              }
            }}
            className="flex-grow"
          />
          <Button onClick={() => handleSendMessage(messageContent)}>
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </div>
      </CardFooter>
      
      {/* Gift Modal */}
      <GiftModal isOpen={isGiftModalOpen} onClose={handleCloseGiftModal} onSendGift={handleSendGift} />
      
      {/* Image Uploader Modal */}
      <ImageUploader isOpen={isImageUploaderOpen} onClose={handleCloseImageUploader} onSendImage={handleSendImage} />
    </div>
  );
};

export default MessagesPage;
