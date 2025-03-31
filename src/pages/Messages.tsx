import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import MessageList from '@/components/MessageList';
import MessageChat from '@/components/MessageChat';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from 'lucide-react';
import type { Message } from '@/types/user';

const Messages = () => {
  const { currentUser, sendMessage, markMessagesAsRead, sendGift } = useUser();
  const [matchUsers, setMatchUsers] = useState<any[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Conversation starter suggestions
  const suggestionStarters = [
    "Hi! I noticed we have similar interests. What do you enjoy most about your hobbies?",
    "Your profile caught my attention! What's your idea of a perfect first date?",
    "Hey there! How's your day going so far?",
    "I see we matched! What made you interested in my profile?",
    "Hello! If you could travel anywhere right now, where would you go?",
  ];
  
  // Mock user data - in a real app, this would come from a database
  const mockUsers = [
    {
      id: 'user-1',
      name: 'Alice',
      photo: 'https://avatar.vercel.sh/1.png?text=A',
      lastMessage: 'Would love to hear more about your travels!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 0,
      compatibilityScore: 87,
      status: 'online'
    },
    {
      id: 'user-2',
      name: 'Bob',
      photo: 'https://avatar.vercel.sh/2.png?text=B',
      lastMessage: 'When are you free this weekend?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unreadCount: 2,
      compatibilityScore: 92,
      status: 'offline'
    },
    {
      id: 'user-3',
      name: 'Charlie',
      photo: 'https://avatar.vercel.sh/3.png?text=C',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      compatibilityScore: 76,
      status: 'away'
    },
    {
      id: 'user-4',
      name: 'Dave',
      photo: 'https://avatar.vercel.sh/4.png?text=D',
      lastMessage: "Just matched! Let's chat soon!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      unreadCount: 0,
      compatibilityScore: 81,
      status: 'online'
    },
    {
      id: 'user-5',
      name: 'Eve',
      photo: 'https://avatar.vercel.sh/5.png?text=E',
      lastMessage: "I'd love to know more about your favorite books!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      unreadCount: 1,
      compatibilityScore: 95,
      status: 'online'
    },
  ];
  
  // Mock messages for demonstration - in a real app, these would come from a database
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'user-1',
      receiverId: currentUser?.id || '',
      content: 'Hey there!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true
    },
    {
      id: 'msg-2',
      senderId: currentUser?.id || '',
      receiverId: 'user-1',
      content: 'Hello! How are you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 59), // 59 minutes ago
      isRead: true
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      receiverId: currentUser?.id || '',
      content: 'I\'m good, thanks! I saw that we have a lot of common interests.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      isRead: true
    },
    {
      id: 'msg-4',
      senderId: currentUser?.id || '',
      receiverId: 'user-1',
      content: 'Yes, I noticed that too! I love hiking and photography.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true
    },
    {
      id: 'msg-5',
      senderId: 'user-1',
      receiverId: currentUser?.id || '',
      content: 'Would love to hear more about your travels!',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isRead: false
    },
  ];
  
  useEffect(() => {
    // Simulate fetching matches and messages from an API
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would fetch matches from your database
        // const { data: matchesData, error: matchesError } = await supabase
        //   .from('matches')
        //   .select('*')
        //   .or(`user1_id.eq.${currentUser?.id},user2_id.eq.${currentUser?.id}`)
        //   .eq('match_status', 'matched');
        
        // For now, use mock data
        setMatchUsers(mockUsers);
        
        // Set active match based on URL param or first match
        if (userId) {
          setActiveMatchId(userId);
        } else if (mockUsers.length > 0 && !activeMatchId) {
          setActiveMatchId(mockUsers[0].id);
        }
        
        // In a real app, fetch messages for the active match
        // if (activeMatchId) {
        //   const { data: messagesData, error: messagesError } = await supabase
        //     .from('messages')
        //     .select('*')
        //     .or(`(sender_id.eq.${currentUser?.id}.and.receiver_id.eq.${activeMatchId}),
        //          (sender_id.eq.${activeMatchId}.and.receiver_id.eq.${currentUser?.id})`)
        //     .order('created_at', { ascending: true });
        // }
        
        // For now, use mock messages
        setMessages(mockMessages);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, userId]);
  
  useEffect(() => {
    // When active match changes, fetch messages for that match
    if (activeMatchId) {
      // In a real app, fetch messages for the active match here
      // For now, just navigate to the URL with the active match ID
      if (userId !== activeMatchId) {
        navigate(`/messages/${activeMatchId}`);
      }
      
      // Mark unread messages as read
      const unreadMessages = messages.filter(
        msg => msg.receiverId === currentUser?.id && 
               msg.senderId === activeMatchId && 
               !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        markMessagesAsRead(messageIds);
        
        // Update messages to mark them as read
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            unreadMessages.some(unread => unread.id === msg.id)
              ? { ...msg, isRead: true }
              : msg
          )
        );
        
        // Update match user to clear unread count
        setMatchUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === activeMatchId
              ? { ...user, unreadCount: 0 }
              : user
          )
        );
      }
    }
  }, [activeMatchId, currentUser, messages, userId]);
  
  const handleSelectMatch = (matchId: string) => {
    setActiveMatchId(matchId);
    navigate(`/messages/${matchId}`);
  };
  
  const handleSendMessage = (content: string, type: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended' = 'text', giftType?: string) => {
    if (!currentUser || !activeMatchId) return;
    
    // Create a new message
    const newMessage: any = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      senderId: currentUser.id,
      receiverId: activeMatchId,
      content: content,
      timestamp: new Date(),
      isRead: false,
      type: type
    };
    
    if (type === 'gift' && giftType) {
      newMessage.giftType = giftType;
      sendGift(activeMatchId, giftType as 'rose' | 'heart' | 'teddy');
    } else if (type === 'text') {
      sendMessage(activeMatchId, content);
    }
    
    // Add the new message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Update the last message and time for the match
    setMatchUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === activeMatchId
          ? { 
              ...user, 
              lastMessage: type === 'text' ? content : 
                          type === 'gift' ? 'Sent a gift' : 
                          type === 'voice' ? 'Sent a voice message' : 
                          'Sent a message',
              lastMessageTime: new Date()
            }
          : user
      )
    );
    
    // In a real app, you would save the message to your database
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert([{
    //     sender_id: currentUser.id,
    //     receiver_id: activeMatchId,
    //     content: content,
    //     message_type: type,
    //     gift_type: type === 'gift' ? giftType : null,
    //     created_at: new Date().toISOString(),
    //     is_read: false
    //   }]);
    
    toast.success('Message sent!');
  };
  
  const activeMatch = matchUsers.find(user => user.id === activeMatchId) || null;
  
  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="md:hidden"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-semibold text-love-900">Messages</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            aria-label="Go to home"
          >
            <Home size={20} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Matches List */}
        <div className="md:col-span-1 h-full">
          <MessageList 
            matches={matchUsers}
            activeMatchId={activeMatchId}
            onSelectMatch={handleSelectMatch}
          />
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-2 h-full">
          {activeMatch ? (
            <MessageChat
              matchName={activeMatch.name}
              matchPhoto={activeMatch.photo}
              compatibilityScore={activeMatch.compatibilityScore}
              messages={messages.filter(msg =>
                (msg.senderId === currentUser?.id && msg.receiverId === activeMatchId) ||
                (msg.senderId === activeMatchId && msg.receiverId === currentUser?.id)
              ).map(msg => ({
                ...msg,
                sender: msg.senderId === currentUser?.id ? 'user' : 'match',
                type: (msg as any).type || 'text',
                giftType: (msg as any).giftType
              }))}
              onSendMessage={handleSendMessage}
              suggestionStarters={suggestionStarters}
            />
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Select a match to start chatting or find new matches in the Discover section
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
