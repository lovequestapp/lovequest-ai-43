
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MessageList from '@/components/MessageList';
import MessageChat from '@/components/MessageChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiftSelector from '@/components/GiftSelector';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Search, Info, MenuIcon, ArrowLeft } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Define a local MessageType to avoid type conflicts with the imported component
type MessageType = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'gift';
  giftType?: string;
};

// Define the MessageChat component's expected message type
type MessageChatMessageType = {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'match';
  type?: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended';
  giftType?: string;
};

const Messages = () => {
  const { isAuthenticated } = useProtectedRoute();
  const isMobile = useIsMobile();
  
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, potentialMatches, matches, messages, sendMessage, markMessagesAsRead } = useUser();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(paramId || null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showMobileList, setShowMobileList] = useState(!paramId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Process matches to match MessageList expected format
  const processedMatches = matches?.map(match => {
    const otherUserId = getOtherUserId(match);
    const user = potentialMatches?.find(u => u.id === otherUserId);
    const unreadCount = messages && otherUserId && messages[otherUserId] ? 
      messages[otherUserId]?.filter(m => 
        m.senderId === otherUserId && !m.read
      ).length || 0 : 0;
    
    return {
      id: otherUserId || '',
      name: user?.name || 'Unknown User',
      photo: user?.photos?.[0] || '',
      lastMessage: match.lastMessage,
      lastMessageTime: match.lastMessageTime,
      unreadCount
    };
  }) || [];
  
  const getOtherUserId = (match: any): string => {
    if (!currentUser) return '';
    return match.userId1 === currentUser.id ? match.userId2 : match.userId1;
  };

  // Find the active user based on the active match
  const activeMatch = matches?.find(match => getOtherUserId(match) === activeMatchId);
  
  // Find the user object for the active match
  const activeUser = potentialMatches?.find(user => user.id === activeMatchId) || {
    id: activeMatchId || '',
    name: 'Unknown User',
    photos: [],
    compatibilityScore: 0,
  };

  // Convert context messages to MessageChat component format
  const convertMessages = (contextMessages: MessageType[] | undefined): MessageChatMessageType[] => {
    if (!contextMessages || !currentUser) return [];
    
    return contextMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.timestamp,
      sender: msg.senderId === currentUser.id ? 'user' : 'match',
      type: msg.type || 'text',
      giftType: msg.giftType
    }));
  };

  useEffect(() => {
    if (paramId) {
      setActiveMatchId(paramId);
      setShowMobileList(false);
    } else if (matches && matches.length > 0) {
      const firstMatchId = getOtherUserId(matches[0]);
      setActiveMatchId(firstMatchId);
      if (!isMobile) {
        navigate(`/messages/${firstMatchId}`, { replace: true });
      }
    }
  }, [paramId, matches, navigate, isMobile]);

  useEffect(() => {
    if (activeMatchId && currentUser) {
      markMessagesAsRead(activeMatchId);
    }
  }, [activeMatchId, currentUser, markMessagesAsRead]);

  // Function to handle sending messages
  const handleSendMessage = (content: string, type = 'text', giftType?: string) => {
    if (!activeMatchId || !currentUser) return;
    
    if (type === 'gift' && giftType) {
      sendMessage(activeMatchId, `Sent a ${giftType}`, 'gift', giftType);
    } else {
      sendMessage(activeMatchId, content);
    }
    
    scrollToBottom();
  };

  // Handle gift selection
  const handleGiftSelect = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!currentUser) return;
    
    handleSendMessage(`Sent a ${giftType}`, 'gift', giftType);
    setShowGiftSelector(false);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeMatchId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectMatch = (matchId: string) => {
    setActiveMatchId(matchId);
    navigate(`/messages/${matchId}`);
    
    if (isMobile) {
      setShowMobileList(false);
    }
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    navigate('/messages');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
          <p>Please sign in to view messages.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the messages for the active match and convert them to the format expected by MessageChat
  const activeMessages = activeMatchId && messages && messages[activeMatchId] 
    ? convertMessages(messages[activeMatchId]) 
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto my-4 md:my-8 px-2 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] max-h-[800px]">
          {/* Mobile view - Show either list or chat */}
          {isMobile ? (
            showMobileList ? (
              /* Messages List for Mobile */
              <div className="bg-white rounded-lg shadow overflow-hidden border col-span-1 h-full">
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-love-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-64px)]">
                  {(!matches || matches.length === 0) ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 mb-4">No matches yet</p>
                      <Link to="/discover">
                        <Button className="bg-gradient-love hover:opacity-90">
                          Start Discovering
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <MessageList 
                      matches={processedMatches} 
                      activeMatchId={activeMatchId}
                      onSelectMatch={handleSelectMatch}
                      className="divide-y max-h-full overflow-y-auto"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Chat View for Mobile */
              <div className="bg-white rounded-lg shadow overflow-hidden border col-span-1 flex flex-col h-full">
                <div className="p-3 border-b flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleBackToList}
                    className="mr-2"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  
                  <div className="flex items-center flex-1">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={activeUser.photos?.[0]} alt={activeUser.name} />
                      <AvatarFallback>{activeUser.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">{activeUser.name}</h3>
                      {activeUser.compatibilityScore && (
                        <Badge variant="outline" className="text-xs bg-love-50 text-love-700 border-love-200">
                          {activeUser.compatibilityScore}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/profiles/${activeUser.id}`)}
                  >
                    <Info size={18} className="text-gray-500" />
                  </Button>
                </div>
                
                <MessageChat 
                  messages={activeMessages}
                  matchName={activeUser?.name || ''}
                  matchPhoto={activeUser?.photos?.[0] || ''}
                  compatibilityScore={activeUser?.compatibilityScore}
                  onSendMessage={handleSendMessage}
                  suggestionStarters={["Hey, how are you?", "What's your favorite movie?", "Do you like hiking?"]}
                />
                <div ref={messagesEndRef} />
              </div>
            )
          ) : (
            /* Desktop view - Show both panels */
            <>
              {/* Messages List Panel for Desktop */}
              <div className="bg-white rounded-lg shadow overflow-hidden border md:col-span-1">
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-love-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-64px)]">
                  {(!matches || matches.length === 0) ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 mb-4">No matches yet</p>
                      <Link to="/discover">
                        <Button className="bg-gradient-love hover:opacity-90">
                          Start Discovering
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <MessageList 
                      matches={processedMatches} 
                      activeMatchId={activeMatchId}
                      onSelectMatch={handleSelectMatch}
                      className={cn(
                        "divide-y max-h-[calc(100vh-350px)]",
                        "md:max-h-[calc(100vh-300px)]"
                      )}
                    />
                  )}
                </div>
              </div>
              
              {/* Chat View for Desktop */}
              <div className="bg-white rounded-lg shadow overflow-hidden border md:col-span-2 flex flex-col">
                {activeMatchId ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={activeUser.photos?.[0]} alt={activeUser.name} />
                          <AvatarFallback>{activeUser.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{activeUser.name}</h3>
                          <div className="flex items-center gap-2">
                            {activeMatch?.status === 'matched' && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Matched
                              </Badge>
                            )}
                            {activeUser.compatibilityScore && (
                              <Badge variant="outline" className="text-xs bg-love-50 text-love-700 border-love-200">
                                {activeUser.compatibilityScore}% Match
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/profiles/${activeUser.id}`)}>
                        <Info size={20} className="text-gray-500" />
                      </Button>
                    </div>
                    
                    <MessageChat 
                      messages={activeMessages}
                      matchName={activeUser?.name || ''}
                      matchPhoto={activeUser?.photos?.[0] || ''}
                      compatibilityScore={activeUser?.compatibilityScore}
                      onSendMessage={handleSendMessage}
                      suggestionStarters={["Hey, how are you?", "What's your favorite movie?", "Do you like hiking?"]}
                    />
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-xl font-semibold mb-2">Welcome to Messages</h3>
                      <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
                      <Link to="/discover">
                        <Button className="bg-gradient-love hover:opacity-90">
                          Find New Matches
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      {showGiftSelector && (
        <GiftSelector 
          isOpen={showGiftSelector}
          onClose={() => setShowGiftSelector(false)} 
          onSendGift={handleGiftSelect} 
        />
      )}
      
      <Footer />
    </div>
  );
};

// Wrap the component with ErrorBoundary to prevent the entire app from crashing
const MessagesWithErrorBoundary = () => (
  <ErrorBoundary>
    <Messages />
  </ErrorBoundary>
);

export default MessagesWithErrorBoundary;
