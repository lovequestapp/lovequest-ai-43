
import React, { useState } from 'react';
import MatchList from './MatchList';
import MessageHeader from './MessageHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessagesPagination from './MessagesPagination';
import { Message, User } from '@/types/user';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '../MobileContainer';
import { toast } from 'sonner';

interface MessagesLayoutProps {
  matches: any[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  selectedUser: User | null;
  messages: Message[];
  isLoading: boolean;
  typingStatus: { isTyping: boolean; username: string | null };
  currentUser: User | null;
  onSendMessage: (content: string, type?: Message['type']) => void;
  onMessageInputChange: (isTyping: boolean) => void;
  onOpenGiftModal: () => void;
  onOpenImageUploader: () => void;
  onSendVoiceNote: (voiceUrl: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
  selectedUser,
  messages,
  isLoading,
  typingStatus,
  currentUser,
  onSendMessage,
  onMessageInputChange,
  onOpenGiftModal,
  onOpenImageUploader,
  onSendVoiceNote,
  hasMore,
  onLoadMore
}) => {
  const [showMatches, setShowMatches] = useState(!activeMatchId);
  const isMobile = useIsMobile();
  
  // For mobile view, toggle between matches list and chat
  const handleBackToMatches = () => {
    setShowMatches(true);
  };
  
  const handleSelectMatch = (matchId: string) => {
    onSelectMatch(matchId);
    setShowMatches(false);
  };
  
  // On desktop, always show both columns
  // On mobile, conditionally show match list or chat based on selection
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden w-full">
      {/* Match list column */}
      {(!isMobile || (isMobile && showMatches)) && (
        <div className={`${isMobile ? 'w-full' : 'w-1/3 max-w-sm'} border-r border-gray-200 bg-white`}>
          <MobileContainer scrollable fullWidth={isMobile}>
            <div className="sticky top-0 z-10 p-3 border-b bg-white flex items-center justify-between">
              <h2 className="font-semibold text-lg">Messages</h2>
            </div>
            <MatchList 
              matches={matches} 
              activeMatchId={activeMatchId}
              onSelectMatch={handleSelectMatch}
            />
          </MobileContainer>
        </div>
      )}
      
      {/* Chat column - only shown if not showing matches on mobile */}
      {(!isMobile || (isMobile && !showMatches)) && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'} flex flex-col bg-gradient-to-b from-white to-gray-50 h-full`}>
          <MobileContainer className="flex flex-col h-full" fullWidth={isMobile}>
            {/* Chat header with back button on mobile */}
            {isMobile && (
              <MessageHeader 
                selectedUser={selectedUser}
                onStartCall={() => toast.success(`Voice call started with ${selectedUser?.name}`)}
                onStartVideoCall={() => toast.success(`Video call started with ${selectedUser?.name}`)}
                onBack={handleBackToMatches}
                showBackButton={true}
              />
            )}
            
            {/* Desktop header without back button */}
            {!isMobile && (
              <MessageHeader 
                selectedUser={selectedUser}
                onStartCall={() => toast.success(`Voice call started with ${selectedUser?.name}`)}
                onStartVideoCall={() => toast.success(`Video call started with ${selectedUser?.name}`)}
                showBackButton={false}
              />
            )}
            
            {/* Load more button */}
            <MessagesPagination 
              hasMore={hasMore} 
              isLoading={isLoading} 
              onLoadMore={onLoadMore} 
            />
            
            {/* Message list */}
            <MessageList 
              messages={messages} 
              currentUser={currentUser} 
              selectedUser={selectedUser}
              isLoading={isLoading}
              typingStatus={typingStatus}
            />
            
            {/* Message input */}
            <MessageInput 
              onSendMessage={onSendMessage}
              onOpenGiftModal={onOpenGiftModal}
              onOpenImageUploader={onOpenImageUploader}
              onSendVoiceNote={onSendVoiceNote}
              isLoading={isLoading}
              onTypingChange={onMessageInputChange}
            />
          </MobileContainer>
        </div>
      )}
    </div>
  );
};

export default MessagesLayout;
