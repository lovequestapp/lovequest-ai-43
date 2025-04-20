
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

  const setTyping = useCallback((isTyping: boolean) => {
    if (!currentUser || !recipientId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTyping) {
      channelRef.current?.track({
        user: currentUser.id,
        typing: true,
        recipientId
      });

      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({
          user: currentUser.id,
          typing: false,
          recipientId
        });
      }, 3000);
    } else {
      channelRef.current?.track({
        user: currentUser.id,
        typing: false,
        recipientId
      });
    }
  }, [currentUser, recipientId]);

  const sendMessage = useCallback(async (
    content: string,
    type: Message['type'] = 'text'
  ): Promise<boolean> => {
    if (!currentUser?.id || !recipientId || !content) {
      toast.error('Cannot send message: missing data');
      return false;
    }

    try {
      setTyping(false);

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

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  }, [currentUser, recipientId, setTyping]);

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

  useEffect(() => {
    if (!currentUser?.id || !recipientId) return;

    console.log(`Setting up realtime chat between ${currentUser.id} and ${recipientId}`);

    const setupChatChannel = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      setConnectionStatus(prev => ({ ...prev, reconnecting: true }));

      const channel = supabase
        .channel(`chat:${currentUser.id}:${recipientId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Presence state synchronized:', state);

          // Get presence states, filtering out unexpected entries with no typing property
          const recipientState = Object.values(state)
            .flat()
            .find((presenceObj: any) =>
              presenceObj.user === recipientId &&
              presenceObj.recipientId === currentUser?.id &&
              typeof presenceObj.typing === 'boolean'
            );

          if (recipientState) {
            setTypingStatus({
              userId: recipientId,
              isTyping: Boolean(recipientState.typing),
              lastTyped: new Date()
            });

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
            setTimeout(() => {
              console.log('Attempting to reconnect chat channel...');
              setupChatChannel();
            }, 5000);
          }
        });

      channelRef.current = channel;
    };

    setupChatChannel();

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

