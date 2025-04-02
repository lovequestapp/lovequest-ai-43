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
  const { currentUser, getUser, sendMessage, allMessages } = useUser();
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
        const user = await getUser(selectedUserId);
        setSelectedUser(user);
      }
    };
    
    fetchUser();
  }, [selectedUserId, getUser, currentUser, navigate]);
  
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

  // Fix the sendMessage function to use recipientId instead of receiverId
  const handleSendMessage = (content: string, type: string = 'text') => {
    if (!content.trim() && type === 'text') return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: selectedUserId, // Changed from receiverId to recipientId
      content,
      timestamp: new Date(),
      isRead: false
    };
    
    sendMessage(newMessage);
    setMessageContent('');
  };

  // Fix gift message
  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    const message: Message = {
      id: `gift-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: selectedUserId, // Changed from receiverId to recipientId
      content: `Sent a ${giftType}`,
      timestamp: new Date(),
      isRead: false,
      type: 'gift',
      giftType
    };
    
    sendMessage(message);
    handleCloseGiftModal();
  };

  // Fix voice message
  const handleSendVoiceNote = (voiceUrl: string) => {
    const message: Message = {
      id: `voice-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: selectedUserId, // Changed from receiverId to recipientId
      content: 'Voice note',
      timestamp: new Date(),
      isRead: false,
      type: 'voice',
      mediaUrl: voiceUrl
    };
    
    sendMessage(message);
    setIsRecording(false);
  };

  // Fix image message
  const handleSendImage = (imageUrl: string) => {
    const message: Message = {
      id: `img-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: selectedUserId, // Changed from receiverId to recipientId
      content: 'Image',
      timestamp: new Date(),
      isRead: false,
      type: 'image',
      mediaUrl: imageUrl
    };
    
    sendMessage(message);
    handleCloseImageUploader();
  };

  // Fix video request message
  const handleRequestVideoCall = () => {
    const message: Message = {
      id: `call-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: selectedUserId, // Changed from receiverId to recipientId
      content: 'Video call request',
      timestamp: new Date(),
      isRead: false,
      type: 'video-request'
    };
    
    sendMessage(message);
  };

  // Fix other references to recipientId
  const messages = allMessages.filter(
    message =>
      (message.senderId === currentUser?.id && message.recipientId === selectedUserId) ||
      (message.recipientId === currentUser?.id && message.senderId === selectedUserId)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  const isSentByMe = (message: Message) => message.senderId === currentUser?.id;
  const getOtherUserId = (message: Message) => isSentByMe(message) ? message.recipientId : message.senderId;
  
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
                    {message.type === 'text' && (
                      <div>{message.content}</div>
                    )}
                    {message.type === 'gift' && (
                      <div className="text-center">
                        Sent a {message.giftType} <span role="img" aria-label="gift">🎁</span>
                      </div>
                    )}
                    {message.type === 'voice' && (
                      <audio controls src={message.mediaUrl}></audio>
                    )}
                    {message.type === 'image' && (
                      <img src={message.mediaUrl} alt="Image" className="max-w-full rounded-md" />
                    )}
                    {message.type === 'video-request' && (
                      <div>Video call request</div>
                    )}
                  </CardContent>
                </Card>
                {message.type === 'video-request' && message.recipientId === currentUser?.id && (
                  <div className="flex space-x-2 mt-1">
                    <Button size="sm" variant="outline" onClick={() => handleAcceptVideoCall(message.recipientId)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeclineVideoCall(message.recipientId)}>
                      Decline
                    </Button>
                  </div>
                )}
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
