
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GiftModal } from '@/components/GiftModal';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import VoiceRecorder from '@/components/VoiceRecorder';
import ImageUploader from '@/components/ImageUploader';
import { Layout } from '@/components/layout';
import MessagesLayout from '@/components/messaging/MessagesLayout';
import { Message } from '@/types/user';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useMessages } from '@/hooks/useMessages';

const MessagesPage = () => {
  const { userId: selectedUserId } = useParams<{ userId: string }>();
  const { currentUser, allUsers } = useUser();
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
  
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Filter and format users to populate the match list
    if (allUsers && allUsers.length > 0) {
      const matchData = allUsers
        .filter(user => user.id !== currentUser.id)
        .map(user => ({
          id: user.id,
          name: user.name,
          photo: user.photos?.[0] || '',
          status: Math.random() > 0.5 ? 'online' : 'offline', // Mock status
          lastMessage: 'Hello there!', // Mock message
          lastMessageTime: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
          unreadCount: Math.floor(Math.random() * 3) // Mock unread count
        }));
      setMatches(matchData);
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
  
  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!selectedUserId) return;
    
    const giftMessage = `Sent a ${giftType}`;
    sendMessageHandler(giftMessage, 'gift');
    handleCloseGiftModal();
  };

  const handleSendVoiceNote = (voiceUrl: string) => {
    if (!selectedUserId) return;
    
    // Pass the actual voice URL data to the sendMessageHandler
    sendMessageHandler(voiceUrl, 'voice');
    toast.success('Voice note sent');
  };

  const handleSendImage = (imageUrl: string) => {
    if (!selectedUserId) return;
    
    // Pass the actual image URL data to the sendMessageHandler
    sendMessageHandler(imageUrl, 'image');
    handleCloseImageUploader();
    toast.success('Image sent');
  };

  // Handle typing indicator for real-time feedback
  const handleMessageInputChange = (isTyping: boolean) => {
    setTyping(isTyping);
  };
  
  // Handle sending message with real-time 
  const handleSendMessage = (content: string, type: Message['type'] = 'text') => {
    // Clear typing indicator when sending
    setTyping(false);
    
    // Send through the messages hook
    return sendMessageHandler(content, type);
  };

  // Handle selecting a user from the match list
  const handleSelectMatch = (userId: string) => {
    navigate(`/messages/${userId}`);
  };
  
  return (
    <Layout hideFooter>
      <MessagesLayout
        matches={matches}
        activeMatchId={selectedUserId || null}
        onSelectMatch={handleSelectMatch}
        selectedUser={selectedUser}
        messages={messages}
        isLoading={isLoading}
        typingStatus={typingStatus}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onMessageInputChange={handleMessageInputChange}
        onOpenGiftModal={handleOpenGiftModal}
        onOpenImageUploader={handleOpenImageUploader}
        onSendVoiceNote={handleSendVoiceNote}
        hasMore={hasMore}
        onLoadMore={loadMoreMessages}
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
    </Layout>
  );
};

export default MessagesPage;
