
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from '@/types/user';
import { useUser } from '@/context/UserContext';

export const useMessages = (conversationUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { currentUser } = useUser();
  const channelRef = useRef<any>(null);
  const messagesPerPage = 20;

  // Fetch messages function
  const fetchMessages = useCallback(async (pageNumber = 1) => {
    if (!conversationUserId || !currentUser?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${conversationUserId}),and(sender_id.eq.${conversationUserId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: false })
        .range((pageNumber - 1) * messagesPerPage, pageNumber * messagesPerPage - 1);

      if (fetchError) throw fetchError;

      // Check if we have more messages
      setHasMore(data.length === messagesPerPage);

      // Transform data to match Message type
      const formattedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        recipientId: msg.receiver_id,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        type: msg.type || 'text',
        isRead: msg.is_read,
      }));

      // Append or replace messages based on page
      if (pageNumber === 1) {
        setMessages(formattedMessages);
      } else {
        setMessages(prev => [...prev, ...formattedMessages]);
      }
      
      // Mark received messages as read
      const unreadMessageIds = formattedMessages
        .filter(msg => msg.senderId === conversationUserId && !msg.isRead)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }

    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
      toast.error('Failed to load messages', {
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationUserId, currentUser?.id]);

  // Load more messages
  const loadMoreMessages = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Send a message
  const sendMessage = useCallback(async (content: string, type: string = 'text'): Promise<boolean> => {
    if (!conversationUserId || !currentUser?.id || !content.trim()) {
      toast.error('Cannot send message', {
        description: 'Missing recipient or content'
      });
      return false;
    }

    try {
      // Create optimistic message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        senderId: currentUser.id,
        recipientId: conversationUserId,
        content,
        timestamp: new Date(),
        type,
        isRead: false,
      };

      // Update UI immediately
      setMessages(prev => [optimisticMessage, ...prev]);

      // Send to server
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: conversationUserId,
          content,
          type,
          is_read: false,
        })
        .select()
        .single();

      if (sendError) throw sendError;

      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? {
              id: data.id,
              senderId: data.sender_id,
              recipientId: data.receiver_id,
              content: data.content,
              timestamp: new Date(data.created_at),
              type: data.type || 'text',
              isRead: data.is_read,
            }
          : msg
      ));

      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message', {
        description: err.message
      });
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.id.toString().startsWith('temp-')));
      
      return false;
    }
  }, [conversationUserId, currentUser?.id]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (messageIds: string[]): Promise<boolean> => {
    if (!messageIds.length) return true;

    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (updateError) throw updateError;

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );

      return true;
    } catch (err: any) {
      console.error('Error marking messages as read:', err);
      return false;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!conversationUserId || !currentUser?.id) return;

    // Initial fetch
    fetchMessages(1);
    
    // Set up channel for real-time updates
    const channel = supabase.channel(`messages:${currentUser.id}-${conversationUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id},sender_id=eq.${conversationUserId}`
      }, (payload) => {
        // New message received
        const newMessage: Message = {
          id: payload.new.id,
          senderId: payload.new.sender_id,
          recipientId: payload.new.receiver_id,
          content: payload.new.content,
          timestamp: new Date(payload.new.created_at),
          type: payload.new.type || 'text',
          isRead: payload.new.is_read,
        };
        
        setMessages(prev => [newMessage, ...prev.filter(msg => msg.id !== newMessage.id)]);
        
        // Mark as read automatically since we're viewing the conversation
        markMessagesAsRead([newMessage.id]);
      })
      .subscribe();
    
    // Store reference to channel
    channelRef.current = channel;
    
    // Clean up on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationUserId, currentUser?.id, fetchMessages, markMessagesAsRead]);

  // Refetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchMessages(page);
    }
  }, [page, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMoreMessages,
    markMessagesAsRead
  };
};

export default useMessages;
