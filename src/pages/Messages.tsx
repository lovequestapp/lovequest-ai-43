import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageChat from '@/components/MessageChat';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Sparkles, Heart, ChevronLeft, MessageSquare, ArrowRightLeft, Gift, Search, Info } from 'lucide-react';
import GiftSelector from '@/components/GiftSelector';
import ProfileBoostPopup from '@/components/ProfileBoostPopup';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const Messages = () => {
  const { id: activeMatchId } = useParams<{ id: string }>();
  const { currentUser, matches, messages, sendMessage, markMessagesAsRead, potentialMatches } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGiftSelectorOpen, setIsGiftSelectorOpen] = useState(false);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const getOtherUserId = (match: any) => {
    return match.userId1 === currentUser?.id ? match.userId2 : match.userId1;
  };
  
  const userId = activeMatchId ? getOtherUserId(matches.find(match => getOtherUserId(match) === activeMatchId)) : null;

  if (!currentUser) return null;

  const getMatchedUsers = () => {
    return matches.map(match => {
      const otherUserId = getOtherUserId(match);
      const matchedUser = potentialMatches.find(user => user.id === match.matchedUserId) || 
                        potentialMatches.find(user => user.id === otherUserId);
      
      const userMessages = messages[otherUserId] || [];
      const lastMessage = match.lastMessage || (userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '');
      const lastMessageTime = match.lastMessageTime || (userMessages.length > 0 ? userMessages[userMessages.length - 1].timestamp : new Date());
      
      const unreadCount = userMessages.filter(msg => !msg.read && msg.senderId !== currentUser.id).length;
      
      return {
        id: match.id,
        userId: otherUserId,
        name: matchedUser?.name || 'Unknown User',
        photo: matchedUser?.photos?.[0] || '',
        lastMessage,
        lastMessageTime,
        unreadCount
      };
    });
  };

  const filteredMatches = getMatchedUsers().filter(match => 
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMatch = activeMatchId ? matches.find(match => getOtherUserId(match) === activeMatchId) : null;
  const activeUser = activeMatchId ? potentialMatches.find(user => user.id === activeMatchId) : null;

  useEffect(() => {
    if (activeMatchId) {
      markMessagesAsRead(activeMatchId);
    }
  }, [activeMatchId, markMessagesAsRead]);

  const handleSendMessage = (content: string) => {
    if (content.trim() && userId) {
      sendMessage(userId, content);
      scrollToBottom();
    }
  };

  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (userId) {
      sendMessage(userId, `I sent you a ${giftType}! 💝`, 'gift', giftType);
      scrollToBottom();
      setShowGiftSelector(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex flex-grow overflow-hidden">
        <div className={`w-full md:w-80 border-r flex-shrink-0 ${activeMatchId ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-4">Messages</h1>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Link 
                  key={match.userId} 
                  to={`/messages/${match.userId}`}
                  className={cn(
                    "flex items-center p-3 border-b hover:bg-gray-50 transition-colors",
                    activeMatchId === match.userId && "bg-love-50"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.photo} alt={match.name} />
                      <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {match.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-love-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {match.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-3 overflow-hidden flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(match.lastMessageTime), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {match.lastMessage || 'Start a conversation!'}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Heart className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium">No matches yet</p>
                <p className="text-sm">When you match with someone, they'll appear here</p>
              </div>
            )}
          </div>
        </div>
        
        {activeMatchId && activeUser ? (
          <div className="flex-grow flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-2"
                  onClick={() => navigate('/messages')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeUser.photos[0]} alt={activeUser.name} />
                  <AvatarFallback>{activeUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="ml-3">
                  <div className="font-medium">{activeUser.name}</div>
                  <div className="text-xs text-gray-500">
                    {activeUser.location}
                    {activeUser.compatibilityScore && (
                      <Badge className="ml-2 bg-love-100 text-love-700 hover:bg-love-200" variant="secondary">
                        {activeUser.compatibilityScore}% Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsGiftSelectorOpen(true)}
                >
                  <Gift className="h-5 w-5 text-love-500" />
                </Button>
                
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {activeMatchId && (
              <MessageChat 
                messages={(messages[activeMatchId] || []) as any} 
                currentUserId={currentUser.id}
                onSendMessage={handleSendMessage}
                recipientName={activeUser.name}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="hidden md:flex flex-grow items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-8">
              <div className="mx-auto w-20 h-20 bg-love-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-10 w-10 text-love-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
              <p className="text-gray-600 mb-6">
                Select a conversation from the list or match with someone new to start chatting.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <GiftSelector 
        isOpen={isGiftSelectorOpen}
        onClose={() => setIsGiftSelectorOpen(false)}
        onSendGift={handleSendGift}
      />
      
      <Footer />
    </div>
  );
};

export default Messages;
