
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/user';

export const useRealTimeMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const channelRef = useRef<any>(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match your Message type
      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        recipientId: msg.receiver_id,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isRead: msg.is_read,
      }));

      setMessages(formattedMessages);
      // Reset retry count on successful fetch
      setRetryCount(0);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
      
      // Implement retry logic
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMessages();
        }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        toast.error('Failed to load messages after multiple attempts');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, retryCount]);

  // Send a message with improved error handling
  const sendMessage = useCallback(async (recipientId: string, content: string): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to send messages');
      return false;
    }

    setError(null);
    
    try {
      // Optimistically add the message to state
      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        senderId: userId,
        recipientId: recipientId,
        content: content,
        timestamp: new Date(),
        isRead: false,
      };
      
      setMessages(prev => [tempMessage, ...prev]);
      
      const { error, data } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: recipientId,
          content,
          timestamp: new Date().toISOString(),
          is_read: false,
          status: 'sent'
        })
        .select()
        .single();

      if (error) {
        // Remove the temporary message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        throw error;
      }

      // Replace the temporary message with the real one
      const realMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        recipientId: data.receiver_id,
        content: data.content,
        timestamp: new Date(data.timestamp),
        isRead: data.is_read,
      };
      
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempId),
        realMessage
      ]);
      
      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      toast.error('Failed to send message', {
        description: err.message || 'Please try again',
        action: {
          label: 'Retry',
          onClick: () => sendMessage(recipientId, content),
        },
      });
      return false;
    }
  }, [userId]);

  // Mark messages as read with improved error handling
  const markMessagesAsRead = useCallback(async (messageIds: string[]): Promise<boolean> => {
    if (!messageIds.length) return true;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (error) {
        throw error;
      }

      // Update local state to reflect the changes
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );

      return true;
    } catch (err: any) {
      console.error('Error marking messages as read:', err);
      
      // Don't show toast for this error as it's not critical
      // but update the error state
      setError(err.message || 'Failed to mark messages as read');
      
      return false;
    }
  }, []);

  // Set up real-time subscription for messages with reconnection logic
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchMessages();
    
    const setupChannel = () => {
      // Clean up previous channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      // Set up real-time subscription
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},receiver_id=eq.${userId}`
        }, (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            recipientId: payload.new.receiver_id,
            content: payload.new.content,
            timestamp: new Date(payload.new.timestamp),
            isRead: payload.new.is_read,
          };

          setMessages(prev => [newMessage, ...prev]);
          
          // Notify the user about new messages if they are the receiver
          if (payload.new.receiver_id === userId) {
            toast.info('New message received', {
              description: `From: ${payload.new.sender_id}`
            });
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},receiver_id=eq.${userId}`
        }, (payload) => {
          // Update the local message state when a message is updated
          setMessages(prev => 
            prev.map(msg => 
              msg.id === payload.new.id 
                ? {
                    ...msg,
                    content: payload.new.content,
                    isRead: payload.new.is_read,
                  } 
                : msg
            )
          );
        })
        .subscribe((status) => {
          // Handle subscription status
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to messages channel');
          }
          
          if (status === 'CHANNEL_ERROR') {
            console.error('Channel error, attempting to reconnect...');
            // Attempt to reconnect after a delay
            setTimeout(() => {
              setupChannel();
            }, 5000);
          }
        });
        
      // Store the channel reference
      channelRef.current = channel;
    };
    
    // Initial channel setup
    setupChannel();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, fetchMessages]);

  // Manual retry function for the user
  const retryFetchMessages = useCallback(() => {
    setRetryCount(0); // Reset retry count
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markMessagesAsRead,
    refetchMessages: retryFetchMessages
  };
};

export default useRealTimeMessages;
