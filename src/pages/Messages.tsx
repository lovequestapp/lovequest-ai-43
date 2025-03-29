import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import type { Message, GiftInventory } from '@/types/user';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Heart, Gift, ImagePlus, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Messages = () => {
  const { currentUser, sendMessage, markMessagesAsRead, sendGift } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Mock user data for demonstration
  const mockUsers = [
    {
      id: 'user-1',
      name: 'Alice',
      avatar: 'https://avatar.vercel.sh/1.png',
      status: 'online'
    },
    {
      id: 'user-2',
      name: 'Bob',
      avatar: 'https://avatar.vercel.sh/2.png',
      status: 'offline'
    },
    {
      id: 'user-3',
      name: 'Charlie',
      avatar: 'https://avatar.vercel.sh/3.png',
      status: 'away'
    },
    {
      id: 'user-4',
      name: 'Dave',
      avatar: 'https://avatar.vercel.sh/4.png',
      status: 'online'
    },
    {
      id: 'user-5',
      name: 'Eve',
      avatar: 'https://avatar.vercel.sh/5.png',
      status: 'offline'
    },
  ];
  
  // Mock messages for demonstration
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'user-1',
      receiverId: 'user-2',
      content: 'Hey there!',
      timestamp: new Date(),
      isRead: true
    },
    {
      id: 'msg-2',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'Hello!',
      timestamp: new Date(),
      isRead: false
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      receiverId: 'user-2',
      content: 'How are you?',
      timestamp: new Date(),
      isRead: false
    },
    {
      id: 'msg-4',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'I\'m good, how about you?',
      timestamp: new Date(),
      isRead: true
    },
  ];
  
  useEffect(() => {
    // Simulate fetching messages from an API
    setMessages(mockMessages);
    
    // Simulate setting the active chat based on the userId param
    if (userId) {
      const user = mockUsers.find(user => user.id === userId);
      setActiveChat(user || null);
    }
  }, [userId]);
  
  useEffect(() => {
    // Scroll to bottom on message change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    
    // Mark messages as read when the chat is active
    if (activeChat) {
      const unreadMessages = messages.filter(msg => msg.receiverId === currentUser?.id && msg.senderId === activeChat.id && !msg.isRead);
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        handleMessageRead(messageIds[0]);
      }
    }
  }, [messages, activeChat, currentUser?.id]);
  
  // Fix for giftType not existing on Message type
  const renderMessageContent = (message: Message) => {
    // Safely check if there are any additional props we need to handle
    const messageAny = message as any;
    
    if (messageAny.giftType) {
      if (messageAny.giftType === 'rose') {
        return (
          <div className="flex items-center space-x-2">
            <Heart className="text-rose-500" />
            <span>You received a rose!</span>
          </div>
        );
      } else if (messageAny.giftType === 'heart') {
        return (
          <div className="flex items-center space-x-2">
            <Heart className="text-red-500" />
            <span>You received a heart!</span>
          </div>
        );
      } else if (messageAny.giftType === 'teddy') {
        return (
          <div className="flex items-center space-x-2">
            <Gift className="text-amber-700" />
            <span>You received a teddy bear!</span>
          </div>
        );
      }
    }
    
    return <span>{message.content}</span>;
  };

  // Fix for string vs string[] parameter type mismatch
  const handleMessageRead = (messageId: string) => {
    markMessagesAsRead([messageId]);
  };

  // Fix for symbol conversion issues
  const handleSendGift = (type: 'rose' | 'heart' | 'teddy') => {
    if (!activeChat) return;
    
    // Convert symbol to string properly if needed
    const giftType = typeof type === 'symbol' ? String(type) : type;
    
    // Updated to correct function signature - 2 params, not 3
    sendGift(activeChat.id, giftType as 'rose' | 'heart' | 'teddy');
    
    toast.success(`Sent a ${giftType} to ${activeChat.name}!`);
  };

  // Fix for symbol conversion issues
  const handleSendMessage = () => {
    if (!currentUser || !activeChat) return;
    
    if (messageText.trim()) {
      // Convert symbol to string properly if needed
      const messageId = typeof Symbol() === 'symbol' ? String(Symbol()) : Symbol();
      
      sendMessage(activeChat.id, messageText);
      
      const newMessage: Message = {
        id: messageId as string,
        senderId: currentUser.id,
        receiverId: activeChat.id,
        content: messageText,
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageText('');
    }
  };

  // Fix for status comparison - assuming 'matched' should be handled
  const getStatusClass = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Contacts</h3>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[400px] md:h-[600px] pr-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer",
                      activeChat?.id === user.id ? "bg-gray-100" : ""
                    )}
                    onClick={() => {
                      setActiveChat(user);
                      navigate(`/messages/${user.id}`);
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-2 text-xs",
                          getStatusClass(user.status as 'online' | 'offline' | 'away')
                        )}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-2">
          {activeChat ? (
            <Card>
              <CardHeader className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile/' + activeChat.id)}>
                  <Avatar>
                    <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                    <AvatarFallback>{activeChat.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{activeChat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {activeChat.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleSendGift('rose')}>
                  <Heart className="text-rose-500" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleSendGift('heart')}>
                  <Heart className="text-red-500 fill-red-500" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleSendGift('teddy')}>
                  <Gift className="text-amber-700" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea ref={scrollRef} className="h-[300px] md:h-[500px] pr-2">
                  {messages.filter(msg =>
                    (msg.senderId === currentUser?.id && msg.receiverId === activeChat.id) ||
                    (msg.senderId === activeChat.id && msg.receiverId === currentUser?.id)
                  ).map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "mb-2 p-3 rounded-md",
                        message.senderId === currentUser?.id
                          ? "bg-blue-100 ml-auto text-right"
                          : "bg-gray-100 mr-auto text-left"
                      )}
                    >
                      {renderMessageContent(message)}
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4">
                <div className="flex items-center space-x-2 w-full">
                  <Button variant="ghost" size="icon">
                    <ImagePlus className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-gray-500">
                  Select a contact to start a chat
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
