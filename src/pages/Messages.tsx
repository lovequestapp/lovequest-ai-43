
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, GiftInventory, Message as UserContextMessage } from '@/context/UserContext';
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
import { cn } from '@/lib/utils';
import { Search, Info, ArrowLeft, MessageCircle } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from "@/hooks/use-toast";

// Define a local MessageType to avoid type conflicts with the imported component
type MessageType = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isRead?: boolean; // Added this field to accommodate both read and isRead properties
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

// Add a Match type definition to properly type the matches array
type Match = {
  userId1: string;
  userId2: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  status?: 'matched' | 'pending';
};

const Messages = () => {
  const { isAuthenticated } = useProtectedRoute();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, potentialMatches, matches, messages, sendMessage, markMessagesAsRead } = useUser();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(paramId || null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showMobileList, setShowMobileList] = useState(!paramId);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to safely get the other user ID from a match
  const getOtherUserId = (match: any): string => {
    if (!currentUser) return '';
    return match.userId1 === currentUser.id ? match.userId2 : match.userId1;
  };
  
  // Process matches to match MessageList expected format - with additional validation
  const processedMatches = Array.isArray(matches) ? matches.map((match, index) => {
    const otherUserId = getOtherUserId(match);
    const user = potentialMatches?.find(u => u.id === otherUserId);
    
    // Check if messages exists before trying to filter it
    const matchMessages = messages && Array.isArray(messages) 
      ? messages.filter(m => (m.senderId === otherUserId && m.receiverId === currentUser?.id) || 
                           (m.senderId === currentUser?.id && m.receiverId === otherUserId))
      : [];
      
    const unreadCount = matchMessages.filter(m => 
      m.senderId === otherUserId && m.isRead === false
    ).length || 0;
    
    // Get the most recent message for this match
    const lastMessage = matchMessages.length > 0 
      ? matchMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;
    
    return {
      id: otherUserId || '',
      name: user?.name || 'Unknown User',
      photo: user?.photos?.[0] || '/placeholder.svg',
      lastMessage: lastMessage?.content || match.lastMessage || '',
      lastMessageTime: lastMessage?.timestamp || match.lastMessageTime || new Date(),
      unreadCount,
      // Ensure each match has a unique key
      key: `message-match-${otherUserId}-${index}`
    };
  }) : [];
  
  // Filter matches by search term if provided
  const filteredMatches = searchTerm 
    ? processedMatches.filter(match => 
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : processedMatches;
  
  // Find the active user based on the active match
  const activeMatch = Array.isArray(matches) ? matches.find(match => getOtherUserId(match) === activeMatchId) : undefined;
  
  // Find the user object for the active match
  const activeUser = potentialMatches?.find(user => user.id === activeMatchId) || {
    id: activeMatchId || '',
    name: 'Unknown User',
    photos: ['/placeholder.svg'],
    compatibilityScore: 0,
  };

  // Convert context messages to MessageChat component format
  const convertMessages = (contextMessages: UserContextMessage[] | undefined): MessageChatMessageType[] => {
    if (!contextMessages || !currentUser || !Array.isArray(contextMessages)) return [];
    
    // Filter messages for the active match only
    const activeMatchMessages = contextMessages.filter(msg => 
      (msg.senderId === currentUser.id && msg.receiverId === activeMatchId) || 
      (msg.senderId === activeMatchId && msg.receiverId === currentUser.id)
    );
    
    return activeMatchMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      sender: msg.senderId === currentUser.id ? 'user' : 'match',
      type: msg.giftType ? 'gift' : 'text',
      giftType: msg.giftType
    }));
  };

  useEffect(() => {
    if (paramId) {
      setActiveMatchId(paramId);
      setShowMobileList(false);
    } else if (matches && matches.length > 0 && Array.isArray(matches)) {
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
  const handleSendMessage = (content: string, type = 'text', giftType?: keyof GiftInventory) => {
    if (!activeMatchId || !currentUser) {
      toast({
        title: "Cannot send message",
        description: "Please select a match to message",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'gift' && giftType) {
      console.log(`Sending gift ${giftType} to ${activeMatchId}: ${content}`);
      sendMessage(activeMatchId, content, giftType);
      toast({
        title: "Gift sent",
        description: `You sent a ${giftType} to ${activeUser.name}`,
      });
    } else {
      console.log(`Sending message to ${activeMatchId}: ${content}`);
      sendMessage(activeMatchId, content);
    }
    
    scrollToBottom();
  };

  // Handle gift selection
  const handleGiftSelect = (giftType: keyof GiftInventory) => {
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
          <div className="text-center">
            <MessageCircle size={48} className="mx-auto mb-4 text-love-400" />
            <p className="text-lg mb-4">Please sign in to view your messages.</p>
            <Link to="/login">
              <Button variant="love">Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get all messages and convert them for the active match
  const activeMessages = convertMessages(messages);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto my-4 md:my-8 px-2 md:px-4">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-4",
          "h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] max-h-[900px]"
        )}>
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-64px)]">
                  {(!matches || matches.length === 0 || !Array.isArray(matches)) ? (
                    <div className="p-6 text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 text-love-300" />
                      <p className="text-gray-500 mb-4">No matches yet</p>
                      <Link to="/discover">
                        <Button className="bg-gradient-love hover:opacity-90">
                          Start Discovering
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <MessageList 
                      matches={filteredMatches}
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
                
                <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                  <MessageChat 
                    messages={activeMessages}
                    matchName={activeUser?.name || ''}
                    matchPhoto={activeUser?.photos?.[0] || '/placeholder.svg'}
                    compatibilityScore={activeUser?.compatibilityScore}
                    onSendMessage={handleSendMessage}
                    suggestionStarters={["Hey, how are you?", "What's your favorite movie?", "Do you like hiking?"]}
                  />
                </div>
                <div ref={messagesEndRef} />
              </div>
            )
          ) : (
            /* Desktop view - Show both panels */
            <>
              {/* Messages List Panel for Desktop */}
              <div className="bg-white rounded-lg shadow overflow-hidden border md:col-span-1 h-full">
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-love-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100%-64px)]">
                  {(!matches || matches.length === 0 || !Array.isArray(matches)) ? (
                    <div className="p-6 text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 text-love-300" />
                      <p className="text-gray-500 mb-4">No matches yet</p>
                      <Link to="/discover">
                        <Button className="bg-gradient-love hover:opacity-90">
                          Start Discovering
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <MessageList 
                      matches={filteredMatches}
                      activeMatchId={activeMatchId}
                      onSelectMatch={handleSelectMatch}
                      className="divide-y"
                    />
                  )}
                </div>
              </div>
              
              {/* Chat View for Desktop */}
              <div className="bg-white rounded-lg shadow overflow-hidden border md:col-span-2 flex flex-col h-full">
                {activeMatchId ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={activeUser.photos?.[0] || '/placeholder.svg'} alt={activeUser.name} />
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
                    
                    <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                      <MessageChat 
                        messages={activeMessages}
                        matchName={activeUser?.name || ''}
                        matchPhoto={activeUser?.photos?.[0] || '/placeholder.svg'}
                        compatibilityScore={activeUser?.compatibilityScore}
                        onSendMessage={handleSendMessage}
                        suggestionStarters={["Hey, how are you?", "What's your favorite movie?", "Do you like hiking?"]}
                      />
                    </div>
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-6">
                      <MessageCircle size={64} className="mx-auto mb-4 text-love-300" />
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
