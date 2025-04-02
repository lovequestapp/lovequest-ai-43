
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/user';

export const useRealTimeMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        recipientId: msg.receiver_id, // Changed from receiverId to recipientId
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isRead: msg.is_read,
        // Removed status property as it's not in the Message type
      }));

      setMessages(formattedMessages);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Send a message
  const sendMessage = useCallback(async (recipientId: string, content: string): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to send messages');
      return false;
    }

    try {
      const { error, data } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: recipientId,
          content,
          timestamp: new Date().toISOString(),
          is_read: false,
          status: 'sent' // This field exists in the database but not in our Message type
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // No need to manually update the messages array as the subscription will handle it
      toast.success('Message sent');
      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return false;
    }
  }, [userId]);

  // Mark messages as read
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
      toast.error('Failed to mark messages as read');
      return false;
    }
  }, []);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchMessages();

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
          recipientId: payload.new.receiver_id, // Changed from receiverId to recipientId
          content: payload.new.content,
          timestamp: new Date(payload.new.timestamp),
          isRead: payload.new.is_read,
          // Removed status property as it's not in the Message type
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
                  // Removed status property as it's not in the Message type
                } 
              : msg
          )
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markMessagesAsRead,
    refetchMessages: fetchMessages
  };
};

export default useRealTimeMessages;
