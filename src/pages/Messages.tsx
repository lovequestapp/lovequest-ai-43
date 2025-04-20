
// Add fix to pass typingStatus prop with username property to MessagesLayout for typing indicator
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

  const { 
    messages, 
    isLoading, 
    error, 
    hasMore, 
    sendMessage: sendMessageHandler, 
    loadMoreMessages 
  } = useMessages(selectedUserId);

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

    if (allUsers && allUsers.length > 0) {
      const matchData = allUsers
        .filter(user => user.id !== currentUser.id)
        .map(user => ({
          id: user.id,
          name: user.name,
          photo: user.photos?.[0] || '',
          status: Math.random() > 0.5 ? 'online' : 'offline', 
          lastMessage: 'Hello there!', 
          lastMessageTime: new Date(Date.now() - Math.random() * 86400000), 
          unreadCount: Math.floor(Math.random() * 3)
        }));
      setMatches(matchData);
    }

    if (selectedUserId) {
      const user = allUsers.find(user => user.id === selectedUserId);
      setSelectedUser(user);
    }
  }, [selectedUserId, allUsers, currentUser, navigate]);

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

    toast.success(`Gift Sent!`, {
      description: `You sent a ${giftType} to ${selectedUser?.name}`,
      duration: 3000
    });
  };

  const handleSendVoiceNote = (voiceUrl: string) => {
    if (!selectedUserId) return;
    sendMessageHandler(voiceUrl, 'voice');
    toast.success('Voice note sent');
  };

  const handleSendImage = (imageUrl: string) => {
    if (!selectedUserId) return;
    sendMessageHandler(imageUrl, 'image');
    handleCloseImageUploader();
    toast.success('Image sent');
  };

  const handleMessageInputChange = (isTyping: boolean) => {
    setTyping(isTyping);
  };

  const handleSendMessage = (content: string, type: Message['type'] = 'text') => {
    setTyping(false);
    return sendMessageHandler(content, type);
  };

  const handleSelectMatch = (userId: string) => {
    navigate(`/messages/${userId}`);
  };

  // Fix typingStatus here to provide correct shape for MessagesLayout props
  const typingIndicator = typingStatus
    ? {
        isTyping: typingStatus.isTyping,
        username: selectedUser?.name || 'Someone'
      }
    : { isTyping: false, username: '' };

  return (
    <Layout hideFooter>
      <MessagesLayout
        matches={matches}
        activeMatchId={selectedUserId || null}
        onSelectMatch={handleSelectMatch}
        selectedUser={selectedUser}
        messages={messages}
        isLoading={isLoading}
        typingStatus={typingIndicator}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onMessageInputChange={handleMessageInputChange}
        onOpenGiftModal={handleOpenGiftModal}
        onOpenImageUploader={handleOpenImageUploader}
        onSendVoiceNote={handleSendVoiceNote}
        hasMore={hasMore}
        onLoadMore={loadMoreMessages}
      />

      <GiftModal 
        isOpen={isGiftModalOpen} 
        onClose={handleCloseGiftModal} 
        onSendGift={handleSendGift} 
      />

      <ImageUploader 
        isOpen={isImageUploaderOpen}
        onClose={handleCloseImageUploader}
        onImageUploaded={handleSendImage} 
        maxSize={5} 
        className="w-full" 
      />
    </Layout>
  );
};

export default MessagesPage;

