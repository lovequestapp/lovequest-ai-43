import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/user';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 50;
const OFFLINE_QUEUE_KEY = 'offlineMessageQueue';

export const useMessages = (recipientId: string | undefined) => {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const getOfflineQueue = useCallback((): Array<{message: Message, recipientId: string}> => {
    try {
      const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (e) {
      console.error('Error reading offline message queue:', e);
      return [];
    }
  }, []);

  const saveToOfflineQueue = useCallback((message: Message, recipient: string) => {
    try {
      const queue = getOfflineQueue();
      queue.push({message, recipientId: recipient});
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      return true;
    } catch (e) {
      console.error('Error saving to offline message queue:', e);
      return false;
    }
  }, [getOfflineQueue]);

  const processOfflineQueue = useCallback(async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;
    
    const processedIds = [];
    
    for (const item of queue) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert({
            content: item.message.content,
            sender_id: item.message.senderId,
            receiver_id: item.recipientId,
            timestamp: new Date().toISOString(),
            is_read: false,
            status: 'sent'
          });
          
        if (!error) {
          processedIds.push(item.message.id);
        }
      } catch (e) {
        console.error('Error processing offline message:', e);
      }
    }
    
    if (processedIds.length > 0) {
      const newQueue = queue.filter(item => !processedIds.includes(item.message.id));
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));
      
      if (processedIds.length === queue.length) {
        toast.success('All pending messages sent');
      } else {
        toast.success(`Sent ${processedIds.length} of ${queue.length} pending messages`);
      }
      
      fetchMessages(true);
    }
  }, [getOfflineQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online');
      processOfflineQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Messages will be sent when you reconnect.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processOfflineQueue]);

  const sendMessage = useCallback(async (
    content: string,
    type: Message['type'] = 'text'
  ): Promise<boolean> => {
    if (!currentUser?.id || !recipientId) {
      toast.error('Cannot send message: Missing user data');
      return false;
    }
    
    try {
      const tempId = `temp-${Date.now()}`;
      
      const newMessage: Message = {
        id: tempId,
        senderId: currentUser.id,
        recipientId,
        content,
        timestamp: new Date(),
        isRead: false,
        type
      };
      
      setMessages(prev => [newMessage, ...prev]);
      
      if (!isOnline) {
        const saved = saveToOfflineQueue(newMessage, recipientId);
        if (!saved) {
          throw new Error('Failed to save message for offline sending');
        }
        return true;
      }
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: currentUser.id,
          receiver_id: recipientId,
          timestamp: new Date().toISOString(),
          is_read: false,
          status: 'sent'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? {
                  id: data.id,
                  senderId: data.sender_id,
                  recipientId: data.receiver_id,
                  content: data.content,
                  timestamp: new Date(data.timestamp),
                  isRead: data.is_read,
                  type
                }
              : msg
          )
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (!navigator.onLine || error instanceof TypeError) {
        setIsOnline(false);
        toast.error('You appear to be offline. Message will be sent when connection is restored.');
        return true;
      }
      
      toast.error('Failed to send message');
      
      setMessages(prev => prev.filter(msg => !msg.id.toString().startsWith('temp-')));
      
      return false;
    }
  }, [currentUser, recipientId, isOnline, saveToOfflineQueue]);

  const fetchMessages = useCallback(async (reset: boolean = false) => {
    if (!currentUser?.id || !recipientId) return;
    
    try {
      if (reset) {
        setPage(0);
        setHasMore(true);
      }
      
      if (!hasMore && !reset) return;
      
      setIsLoading(true);
      setError(null);
      
      const currentPage = reset ? 0 : page;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .or(`sender_id.eq.${recipientId},receiver_id.eq.${recipientId}`)
        .order('timestamp', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);
      
      if (error) throw error;
      
      const transformedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        senderId: msg.sender_id || '',
        recipientId: msg.receiver_id || '',
        content: msg.content || '',
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        isRead: msg.is_read || false,
        type: 'text',
        mediaUrl: undefined,
      }));
      
      if (reset) {
        setMessages(transformedMessages);
      } else {
        setMessages(prev => [...prev, ...transformedMessages]);
      }
      
      setHasMore(data.length === PAGE_SIZE);
      
      if (!reset && data.length > 0) {
        setPage(prev => prev + 1);
      }
      
      const unreadMessages = data
        .filter(msg => 
          msg.receiver_id === currentUser.id && 
          !msg.is_read && 
          msg.sender_id === recipientId
        )
        .map(msg => msg.id);
        
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, recipientId, page, hasMore]);

  const loadMoreMessages = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchMessages();
    }
  }, [fetchMessages, isLoading, hasMore]);

  useEffect(() => {
    if (!currentUser?.id || !recipientId) return;
    
    fetchMessages(true);
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id},sender_id=eq.${recipientId}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          const newMsg = payload.new;
          
          const message: Message = {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            recipientId: newMsg.receiver_id,
            content: newMsg.content,
            timestamp: new Date(newMsg.timestamp),
            isRead: false,
            type: newMsg.type || 'text',
            mediaUrl: newMsg.media_url
          };
          
          setMessages(prev => [message, ...prev]);
          
          try {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, recipientId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMoreMessages,
    isOnline
  };
};

export default useMessages;
