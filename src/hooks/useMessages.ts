
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { Message } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMessages = (selectedUserId: string | undefined) => {
  const { currentUser, messages: allMessages, sendMessage, markMessagesAsRead } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesPerPage = 20;

  // Load initial messages
  useEffect(() => {
    if (!selectedUserId || !currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate fetching from API with pagination
    try {
      const filteredMessages = allMessages
        .filter(
          message =>
            (message.senderId === currentUser?.id && message.recipientId === selectedUserId) ||
            (message.recipientId === currentUser?.id && message.senderId === selectedUserId)
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(0, page * messagesPerPage);
      
      setMessages(filteredMessages);
      setHasMore(filteredMessages.length === page * messagesPerPage);
      
      // Mark incoming messages as read
      const unreadMessageIds = filteredMessages
        .filter(msg => msg.senderId === selectedUserId && !msg.isRead)
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    } catch (err) {
      setError('Failed to load messages');
      toast.error('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId, currentUser, allMessages, page, markMessagesAsRead]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedUserId || !currentUser) return;
    
    // This is a simulation of real-time subscription
    // In a real app, you would use Supabase subscription
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${selectedUserId},receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          // Process the new message
          // This is mock code as we don't have actual Supabase integration
          console.log('New message received', payload);
          
          // In a real app, you would add the new message to your state
          // For now, we're just using the mock data from the context
        }
      )
      .subscribe();
    
    return () => {
      // Clean up subscription
      supabase.removeChannel(channel);
    };
  }, [selectedUserId, currentUser?.id]);

  const sendMessageHandler = useCallback(
    (content: string, messageType: string = 'text') => {
      if (!content.trim() && messageType === 'text') return;
      if (!selectedUserId || !currentUser) return;
      
      try {
        sendMessage(selectedUserId, content);
      } catch (err) {
        setError('Failed to send message');
        toast.error('Failed to send message');
        console.error(err);
      }
    },
    [selectedUserId, currentUser, sendMessage]
  );

  const loadMoreMessages = useCallback(() => {
    if (!hasMore || isLoading) return;
    setPage(prevPage => prevPage + 1);
  }, [hasMore, isLoading]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage: sendMessageHandler,
    loadMoreMessages
  };
};
