
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, User } from '@/types/user';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * A custom hook for real-time chat functionality
 */
export const useRealtimeChat = (chatWithUserId?: string) => {
  const { currentUser, sendMessage: contextSendMessage, markMessagesAsRead } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id || !chatWithUserId) return;
    
    // Create a real-time subscription
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          // Handle the new message
          console.log('New message received:', payload);
          
          // Mark message as read if it's from the current chat
          if (payload.new && payload.new.sender_id === chatWithUserId) {
            // In a real implementation, we would update the message in the database
            // For now, we'll use our mock implementation
            markMessagesAsRead([payload.new.id]);
          }
          
          // Show notification if the message is from someone else
          if (payload.new && payload.new.sender_id !== chatWithUserId) {
            // Get the sender's name
            const senderName = 'Someone'; // In a real app, this would come from the database
            toast.info(`New message from ${senderName}`);
          }
        }
      )
      .subscribe();
    
    setIsSubscribed(true);
    
    // Clean up the subscription when unmounting
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [currentUser?.id, chatWithUserId, markMessagesAsRead]);
  
  // Send a message
  const sendMessage = useCallback(
    async (content: string, messageType: string = 'text') => {
      if (!currentUser?.id || !chatWithUserId || !content.trim()) {
        setError('Cannot send message: missing user ID or content');
        return false;
      }
      
      try {
        contextSendMessage(chatWithUserId, content);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [currentUser?.id, chatWithUserId, contextSendMessage]
  );
  
  // Mark all messages from a user as read
  const markAllAsRead = useCallback(
    (messageIds: string[]) => {
      if (!messageIds.length) return;
      
      try {
        markMessagesAsRead(messageIds);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mark messages as read';
        setError(errorMessage);
        console.error(errorMessage);
      }
    },
    [markMessagesAsRead]
  );
  
  return {
    sendMessage,
    markAllAsRead,
    isSubscribed,
    error
  };
};
