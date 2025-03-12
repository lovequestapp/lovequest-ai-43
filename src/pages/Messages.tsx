
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import MessageList from '@/components/MessageList';
import MessageChat from '@/components/MessageChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GiftSelector } from '@/components/GiftSelector';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Search, Info } from 'lucide-react';

const Messages = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, potentialMatches, matches, messages, sendMessage, markMessagesAsRead } = useUser();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(paramId || null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const getOtherUserId = (match: any): string => {
    if (!currentUser) return '';
    return match.userId1 === currentUser.id ? match.userId2 : match.userId1;
  };

  // Find the active user based on the active match
  const activeMatch = matches.find(match => getOtherUserId(match) === activeMatchId);
  
  // Find the user object for the active match
  const activeUser = potentialMatches.find(user => user.id === activeMatchId) || {
    id: activeMatchId || '',
    name: 'Unknown User',
    photos: [],
    compatibilityScore: 0,
  };

  useEffect(() => {
    if (paramId) {
      setActiveMatchId(paramId);
    } else if (matches.length > 0) {
      const firstMatchId = getOtherUserId(matches[0]);
      setActiveMatchId(firstMatchId);
      navigate(`/messages/${firstMatchId}`, { replace: true });
    }
  }, [paramId, matches, navigate]);

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
  const handleGiftSelect = (giftType: string) => {
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

  if (!currentUser) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)] max-h-[800px]">
          {/* Messages List Panel */}
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
              {matches.length === 0 ? (
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
                  matches={matches} 
                  messages={messages} 
                  currentUser={currentUser}
                  activeMatchId={activeMatchId}
                  onSelectMatch={(matchId) => {
                    setActiveMatchId(matchId);
                    navigate(`/messages/${matchId}`);
                  }}
                  className={cn(
                    "divide-y max-h-[calc(100vh-350px)]",
                    "md:max-h-[calc(100vh-300px)]"
                  )}
                />
              )}
            </div>
          </div>
          
          {/* Chat View */}
          <div className="bg-white rounded-lg shadow overflow-hidden border md:col-span-2 flex flex-col">
            {activeMatchId ? (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeUser.photos[0]} alt={activeUser.name} />
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
                  
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/profile/${activeUser.id}`)}>
                    <Info size={20} className="text-gray-500" />
                  </Button>
                </div>
                
                <MessageChat 
                  messages={(messages[activeMatchId] || []) as any}
                  matchName={activeUser.name}
                  matchPhoto={activeUser.photos[0] || ''}
                  compatibilityScore={activeUser.compatibilityScore}
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
        </div>
      </main>
      
      {showGiftSelector && (
        <GiftSelector 
          onSelect={handleGiftSelect} 
          onClose={() => setShowGiftSelector(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Messages;
