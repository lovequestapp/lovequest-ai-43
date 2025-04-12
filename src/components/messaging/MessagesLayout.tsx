
import React from 'react';
import MatchList from './MatchList';
import MessageHeader from './MessageHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessagesPagination from './MessagesPagination';
import { Message, User } from '@/types/user';

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
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Left sidebar - Match list */}
      <div className="w-1/3 max-w-sm border-r border-gray-200 bg-white">
        <MatchList 
          matches={matches} 
          activeMatchId={activeMatchId}
          onSelectMatch={onSelectMatch}
        />
      </div>
      
      {/* Right side - Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <MessageHeader 
          selectedUser={selectedUser} 
          onStartCall={() => toast.success(`Voice call started with ${selectedUser?.name}`)}
          onStartVideoCall={() => toast.success(`Video call started with ${selectedUser?.name}`)}
        />
        
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
      </div>
    </div>
  );
};

import { toast } from 'sonner';
export default MessagesLayout;
