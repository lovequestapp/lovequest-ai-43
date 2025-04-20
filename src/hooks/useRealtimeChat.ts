
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Message } from '@/types/user';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  lastTyped: Date;
}

interface ChatStatus {
  isConnected: boolean;
  reconnecting: boolean;
  error: string | null;
}

export const useRealtimeChat = (recipientId: string | undefined) => {
  const { currentUser } = useUser();
  const [typingStatus, setTypingStatus] = useState<TypingIndicator | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ChatStatus>({
    isConnected: false,
    reconnecting: false,
    error: null
  });
  
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<any>(null);
  const typingIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track when the user is typing
  const setTyping = useCallback((isTyping: boolean) => {
    if (!currentUser || !recipientId) return;
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    if (isTyping) {
      // Broadcast typing status through presence
      channelRef.current?.track({
        user: currentUser.id,
        typing: true,
        recipientId
      });
      
      // Auto-clear typing status after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({
          user: currentUser.id,
          typing: false,
          recipientId
        });
      }, 3000);
    } else {
      // Immediately broadcast that user stopped typing
      channelRef.current?.track({
        user: currentUser.id,
        typing: false,
        recipientId
      });
    }
  }, [currentUser, recipientId]);

  // Send a message through the real-time channel
  const sendMessage = useCallback(async (
    content: string,
    type: Message['type'] = 'text'
  ): Promise<boolean> => {
    if (!currentUser?.id || !recipientId || !content) {
      toast.error('Cannot send message: missing data');
      return false;
    }

    try {
      // Clear typing indicator
      setTyping(false);

      // First save to database
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: currentUser.id,
          receiver_id: recipientId,
          timestamp: new Date().toISOString(),
          is_read: false,
          status: 'sent'
        });

      if (error) {
        throw new Error(`Error saving message: ${error.message}`);
      }

      // Real-time broadcast is handled by the database trigger and subscription
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  }, [currentUser, recipientId, setTyping]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]): Promise<boolean> => {
    if (!messageIds.length || !currentUser?.id) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds)
        .eq('receiver_id', currentUser.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }, [currentUser?.id]);

  // Setup real-time message channel
  useEffect(() => {
    if (!currentUser?.id || !recipientId) return;

    console.log(`Setting up realtime chat between ${currentUser.id} and ${recipientId}`);
    
    const setupChatChannel = () => {
      // Cleanup any existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      setConnectionStatus(prev => ({ ...prev, reconnecting: true }));
      
      // Create a new presence channel
      const channel = supabase
        .channel(`chat:${currentUser.id}:${recipientId}`)
        // Listen for presence events (typing indicators)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Presence state synchronized:', state);
          
          // Find state for the recipient
          const recipientState = Object.values(state)
            .flat()
            .find((presenceObj: any) => 
              presenceObj.user === recipientId && 
              presenceObj.recipientId === currentUser?.id
            );
            
          if (recipientState) {
            // Update typing status
            setTypingStatus({
              userId: recipientId,
              isTyping: recipientState.typing,
              lastTyped: new Date()
            });
            
            // Clear typing indicator after 5 seconds of no updates
            if (typingIndicatorTimeoutRef.current) {
              clearTimeout(typingIndicatorTimeoutRef.current);
            }
            
            if (recipientState.typing) {
              typingIndicatorTimeoutRef.current = setTimeout(() => {
                setTypingStatus(prev => 
                  prev && prev.userId === recipientId 
                    ? { ...prev, isTyping: false } 
                    : prev
                );
              }, 5000);
            }
          }
        })
        // Listen for all database changes to messages
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${recipientId},receiver_id=eq.${currentUser.id}`
          },
          (payload) => {
            console.log('Received message change:', payload);
          }
        )
        .subscribe(status => {
          console.log('Chat channel status:', status);
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus({
              isConnected: true,
              reconnecting: false,
              error: null
            });
            
            // Start tracking presence
            channel.track({
              user: currentUser.id,
              typing: false,
              recipientId,
              online: true,
              timestamp: new Date().toISOString()
            });
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus({
              isConnected: false,
              reconnecting: false,
              error: 'Failed to connect to chat'
            });
            
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
              console.log('Attempting to reconnect chat channel...');
              setupChatChannel();
            }, 5000);
          }
        });
        
      channelRef.current = channel;
    };
    
    setupChatChannel();
    
    // Cleanup function
    return () => {
      console.log('Cleaning up chat channel...');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      if (typingIndicatorTimeoutRef.current) {
        clearTimeout(typingIndicatorTimeoutRef.current);
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUser?.id, recipientId]);

  return {
    typingStatus,
    setTyping,
    sendMessage,
    markAsRead,
    connectionStatus
  };
};

export default useRealtimeChat;
