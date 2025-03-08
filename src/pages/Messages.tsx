
import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageList from '@/components/MessageList';
import MessageChat from '@/components/MessageChat';
import { useUser } from '@/context/UserContext';
import { getConversationStarters } from '@/utils/matchingAlgorithm';
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { matches, messages, potentialMatches, sendMessage, currentUser } = useUser();
  const [activeMatchId, setActiveMatchId] = useState<string | undefined>(matches[0]?.id);
  const { toast } = useToast();
  
  // Ensure we always have an active match if matches are available
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
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
