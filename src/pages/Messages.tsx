
import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageList from '@/components/MessageList';
import MessageChat from '@/components/MessageChat';
import { useUser } from '@/context/UserContext';
import { getConversationStarters } from '@/utils/matchingAlgorithm';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, Sparkles, Gamepad, Gift, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const { matches, messages, potentialMatches, sendMessage, currentUser } = useUser();
  const [activeMatchId, setActiveMatchId] = useState<string | undefined>(matches[0]?.id);
  const { toast } = useToast();
  
  useEffect(() => {
    if (matches.length > 0 && !activeMatchId) {
      setActiveMatchId(matches[0].id);
    }
  }, [matches, activeMatchId]);
  
  const matchListItems = useMemo(() => 
    matches.map(match => {
      const matchedUser = potentialMatches.find(user => user.id === match.matchedUserId);
      const matchMessages = messages[match.id] || [];
      
      return {
        id: match.id,
        name: matchedUser?.name || 'Unknown User',
        photo: matchedUser?.photos[0] || '/placeholder.svg',
        lastMessage: match.lastMessage,
        lastMessageTime: match.lastMessageTime,
        unreadCount: matchMessages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length,
      };
    }),
  [matches, potentialMatches, messages, currentUser]);
  
  const activeMatch = useMemo(() => 
    matches.find(match => match.id === activeMatchId),
  [matches, activeMatchId]);
  
  const activeMatchUser = useMemo(() => 
    activeMatch 
      ? potentialMatches.find(user => user.id === activeMatch.matchedUserId)
      : undefined,
  [activeMatch, potentialMatches]);
  
  const chatMessages = useMemo(() => {
    if (!activeMatchId || !currentUser) return [];
    
    const matchMessages = messages[activeMatchId] || [];
    return matchMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      timestamp: msg.timestamp,
      sender: msg.senderId === currentUser.id ? 'user' as const : 'match' as const,
      type: msg.type || 'text',
      giftType: msg.giftType,
    }));
  }, [activeMatchId, messages, currentUser]);
  
  const handleSendMessage = (
    content: string, 
    type: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended' = 'text', 
    giftType?: string
  ) => {
    if (activeMatchId) {
      if (type === 'gift') {
        toast({
          title: "Virtual Gift Sent",
          description: `You sent a ${giftType} to ${activeMatchUser?.name}. In a real app, this would connect to a payment system.`,
        });
      } else if (type === 'voice') {
        toast({
          title: "Voice Message Sent",
          description: "Your voice message has been sent.",
        });
      } else if (type === 'video-request') {
        toast({
          title: "Video Call Requested",
          description: `Waiting for ${activeMatchUser?.name} to accept your call...`,
        });
        
        setTimeout(() => {
          if (activeMatchId) {
            const responseType = Math.random() > 0.3 ? 'video-accepted' : 'video-ended';
            const responseMessage = responseType === 'video-accepted' 
              ? "Video call accepted" 
              : "Missed your call, sorry!";
              
            sendMessage(
              activeMatchId, 
              responseMessage, 
              responseType as 'video-accepted' | 'video-ended'
            );
          }
        }, 5000 + Math.random() * 5000);
      }
      
      sendMessage(activeMatchId, content, type, giftType);
    }
  };
  
  const conversationStarters = useMemo(() => {
    if (!activeMatchUser || !currentUser) return [];
    
    return getConversationStarters(currentUser, activeMatchUser);
  }, [activeMatchUser, currentUser]);
  
  const icebreakers = [
    "What's your favorite place you've ever traveled to?",
    "Do you have any hidden talents?",
    "What's your ideal weekend look like?",
    "Coffee or tea person?",
    "Beach vacation or mountain getaway?",
    "What's the last show you binged?",
    "What's a hobby you've always wanted to try?",
    "Early bird or night owl?",
  ];
  
  const games = [
    { name: "Truth or Dare", icon: <Sparkles className="text-purple-500" /> },
    { name: "Would You Rather", icon: <Gamepad className="text-green-500" /> },
    { name: "Never Have I Ever", icon: <Sparkles className="text-blue-500" /> },
    { name: "Two Truths & A Lie", icon: <Gamepad className="text-amber-500" /> },
  ];
  
  const popularGifts = [
    { name: "Virtual Rose", price: 20, icon: <Gift className="text-rose-500" /> },
    { name: "Virtual Heart", price: 100, icon: <Heart className="text-red-500 fill-red-500" /> },
    { name: "Teddy Bear", price: 50, icon: <Gift className="text-amber-700" /> },
  ];
  
  if (matches.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8 flex flex-col items-center">
              <Heart size={48} className="text-love-500 mb-6" />
              
              <h2 className="text-2xl font-display font-semibold mb-3">No matches yet</h2>
              
              <p className="text-muted-foreground mb-6">
                Start discovering and matching with people to begin conversations.
              </p>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mb-64 md:mb-48">
        <h1 className="text-3xl font-display font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-22rem)] md:h-[calc(100vh-18rem)]">
          <div className="md:col-span-1">
            <MessageList
              matches={matchListItems}
              activeMatchId={activeMatchId}
              onSelectMatch={setActiveMatchId}
            />
          </div>
          
          <div className="md:col-span-2">
            {activeMatchUser && activeMatchId ? (
              <MessageChat
                matchName={activeMatchUser.name}
                matchPhoto={activeMatchUser.photos[0]}
                compatibilityScore={activeMatchUser.compatibilityScore}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                suggestionStarters={conversationStarters}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* New visual features for better footer spacing */}
        <div className="mt-12 md:mt-16 space-y-8">
          {/* Conversation Starters */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="text-purple-600" size={24} />
              <span>Conversation Starters</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {icebreakers.slice(0, 4).map((starter, index) => (
                <Card key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-purple-800">{starter}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Games to Play */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <Gamepad className="text-green-600" size={24} />
              <span>Games to Play</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game, index) => (
                <Card key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl mb-2">{game.icon}</div>
                    <h3 className="font-medium text-green-800">{game.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Popular Gifts */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <Gift className="text-rose-600" size={24} />
              <span>Popular Gifts</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popularGifts.map((gift, index) => (
                <Card key={index} className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{gift.icon}</div>
                      <span className="font-medium text-rose-800">{gift.name}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                      ${gift.price}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
