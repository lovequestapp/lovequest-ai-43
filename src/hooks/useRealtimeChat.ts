
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, User } from '@/types/user';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

// Define interface for the typing presence data
interface TypingPresence {
  presence_ref: string;
  user_id: string;
  username: string;
  isTyping: boolean;
}

/**
 * A custom hook for real-time chat functionality
 */
export const useRealtimeChat = (chatWithUserId?: string) => {
  const { currentUser, sendMessage: contextSendMessage, markMessagesAsRead } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<{isTyping: boolean, username: string | null}>(
    {isTyping: false, username: null}
  );
  const typingTimeoutRef = useRef<number | null>(null);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser?.id || !chatWithUserId) return;
    
    // Create a real-time subscription for new messages
    const messageChannel = supabase
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
            markMessagesAsRead([payload.new.id]);
          }
          
          // Show notification if the message is from someone else
          if (payload.new && payload.new.sender_id !== chatWithUserId) {
            // Get the sender's name from context if available
            const sender = payload.new.sender_id;
            const senderUser = sender 
              ? 'Someone' // fallback
              : 'Someone';
            toast.info(`New message from ${senderUser}`);
          }
        }
      )
      .subscribe();
      
    // Real-time subscription for typing indicators using presence
    const typingChannel = supabase
      .channel(`typing:${currentUser.id}:${chatWithUserId}`)
      .on('presence', { event: 'sync' }, () => {
        // Check if the other user is typing
        const state = typingChannel.presenceState();
        const otherUserState = Object.values(state)
          .flat()
          .find((user: any) => (user as TypingPresence).user_id === chatWithUserId) as TypingPresence | undefined;
          
        if (otherUserState && otherUserState.isTyping) {
          setTypingStatus({
            isTyping: true,
            username: otherUserState.username || 'Someone'
          });
        } else {
          setTypingStatus({
            isTyping: false,
            username: null
          });
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // When a user joins with typing status
        const newUser = newPresences.find((user: any) => 
          (user as TypingPresence).user_id === chatWithUserId
        ) as TypingPresence | undefined;
        
        if (newUser && newUser.isTyping) {
          setTypingStatus({
            isTyping: true,
            username: newUser.username || 'Someone'
          });
        }
      })
      .on('presence', { event: 'leave' }, () => {
        // When a user leaves, reset typing status
        setTypingStatus({
          isTyping: false,
          username: null
        });
      })
      .subscribe();
    
    setIsSubscribed(true);
    
    // Clean up the subscriptions when unmounting
    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
      setIsSubscribed(false);
    };
  }, [currentUser?.id, chatWithUserId, markMessagesAsRead]);
  
  // Function to broadcast typing status
  const setTyping = useCallback((isTyping: boolean) => {
    if (!currentUser?.id || !chatWithUserId) return;
    
    const channel = supabase.channel(`typing:${chatWithUserId}:${currentUser.id}`);
    
    if (isTyping) {
      // Send typing status and setup timeout to reset
      channel.track({
        user_id: currentUser.id,
        username: currentUser.name,
        isTyping: true
      });
      
      // Clear previous timeout if exists
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing after 3 seconds
      typingTimeoutRef.current = window.setTimeout(() => {
        channel.track({
          user_id: currentUser.id,
          username: currentUser.name,
          isTyping: false
        });
      }, 3000);
    } else {
      // Clear timeout and send not typing
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      channel.track({
        user_id: currentUser.id,
        username: currentUser.name,
        isTyping: false
      });
    }
  }, [currentUser, chatWithUserId]);
  
  // Send a message
  const sendMessage = useCallback(
    async (content: string, messageType: string = 'text') => {
      if (!currentUser?.id || !chatWithUserId || !content.trim()) {
        setError('Cannot send message: missing user ID or content');
        return false;
      }
      
      try {
        // Reset typing indicator when sending a message
        setTyping(false);
        
        // Send the message using the context function
        await contextSendMessage(chatWithUserId, content);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [currentUser?.id, chatWithUserId, contextSendMessage, setTyping]
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
    error,
    typingStatus,
    setTyping
  };
};
