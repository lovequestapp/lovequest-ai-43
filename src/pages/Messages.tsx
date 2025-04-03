
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GiftModal } from '@/components/GiftModal';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import VoiceRecorder from '@/components/VoiceRecorder';
import ImageUploader from '@/components/ImageUploader';
import MessageHeader from '@/components/messaging/MessageHeader';
import MessageList from '@/components/messaging/MessageList';
import MessageInput from '@/components/messaging/MessageInput';
import MessagesPagination from '@/components/messaging/MessagesPagination';
import { useMessages } from '@/hooks/useMessages';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import ProtectedRoute from '@/components/protected-route';

const MessagesPage = () => {
  const { userId: selectedUserId } = useParams<{ userId: string }>();
  const { currentUser, allUsers } = useUser();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use our custom hook for messages handling
  const { 
    messages, 
    isLoading, 
    error, 
    hasMore, 
    sendMessage: sendMessageHandler, 
    loadMoreMessages 
  } = useMessages(selectedUserId);
  
  // Use real-time chat features
  const {
    typingStatus,
    setTyping,
    sendMessage: realtimeSendMessage
  } = useRealtimeChat(selectedUserId);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (selectedUserId) {
      // Find the user in allUsers
      const user = allUsers.find(user => user.id === selectedUserId);
      setSelectedUser(user);
    }
  }, [selectedUserId, allUsers, currentUser, navigate]);
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
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
  
  const handleStartCall = () => {
    toast.success(`Voice call started with ${selectedUser?.name}`);
  };
  
  const handleStartVideoCall = () => {
    toast.success(`Video call started with ${selectedUser?.name}`);
  };

  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!selectedUserId) return;
    
    const giftMessage = `Sent a ${giftType}`;
    sendMessageHandler(giftMessage, 'gift');
    handleCloseGiftModal();
  };

  const handleSendVoiceNote = (voiceUrl: string) => {
    if (!selectedUserId) return;
    
    sendMessageHandler('Voice note', 'voice');
  };

  const handleSendImage = (imageUrl: string) => {
    if (!selectedUserId) return;
    
    sendMessageHandler('Image', 'image');
    handleCloseImageUploader();
  };

  // Handle typing indicator for real-time feedback
  const handleMessageInputChange = (isTyping: boolean) => {
    setTyping(isTyping);
  };
  
  // Handle sending message with real-time 
  const handleSendMessage = (content: string, type: string = 'text') => {
    // Clear typing indicator when sending
    setTyping(false);
    
    // Send through the messages hook
    return sendMessageHandler(content, type);
  };
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <MessageHeader 
          selectedUser={selectedUser} 
          onStartCall={handleStartCall}
          onStartVideoCall={handleStartVideoCall}
        />
        
        {/* Load more button */}
        <MessagesPagination 
          hasMore={hasMore} 
          isLoading={isLoading} 
          onLoadMore={loadMoreMessages} 
        />
        
        {/* Message List */}
        <MessageList 
          messages={messages} 
          currentUser={currentUser} 
          selectedUser={selectedUser}
          isLoading={isLoading}
          typingStatus={typingStatus}
        />
        
        {/* Message Input */}
        <MessageInput 
          onSendMessage={handleSendMessage}
          onOpenGiftModal={handleOpenGiftModal}
          onOpenImageUploader={handleOpenImageUploader}
          onSendVoiceNote={handleSendVoiceNote}
          isLoading={isLoading}
        />
        
        {/* Gift Modal */}
        <GiftModal 
          isOpen={isGiftModalOpen} 
          onClose={handleCloseGiftModal} 
          onSendGift={handleSendGift} 
        />
        
        {/* Image Uploader Modal */}
        <ImageUploader 
          onImageUploaded={handleSendImage} 
          maxSize={5} 
          className="w-full" 
        />
      </div>
    </ProtectedRoute>
  );
};

export default MessagesPage;
