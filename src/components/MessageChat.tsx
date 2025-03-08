
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Gift, 
  Heart, 
  Play, 
  Square,
  ShoppingCart,
  Info,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Volume,
  Volume2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'match';
  type?: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended';
  giftType?: string;
}

interface MessageChatProps {
  matchName: string;
  matchPhoto: string;
  compatibilityScore?: number;
  messages: Message[];
  onSendMessage: (content: string, type?: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended', giftType?: string) => void;
  suggestionStarters?: string[];
}

const MessageChat: React.FC<MessageChatProps> = ({
  matchName,
  matchPhoto,
  compatibilityScore,
  messages,
  onSendMessage,
  suggestionStarters = [],
}) => {
  const { getGiftInventory } = useUser();
  const giftInventory = getGiftInventory();
  
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showGiftMenu, setShowGiftMenu] = useState(false);
  const [showGiftInfo, setShowGiftInfo] = useState(false);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [isVideoCallRequested, setIsVideoCallRequested] = useState(false);
  const [incomingVideoCall, setIncomingVideoCall] = useState(false);
  
  // Video chat refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatFooterRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const gifts = [
    { 
      id: 'rose', 
      name: 'Rose', 
      icon: <Heart className="text-rose-500" />, 
      price: 20,
      benefit: "+2 popularity points"
    },
    { 
      id: 'heart', 
      name: 'Heart', 
      icon: <Heart className="text-red-500 fill-red-500" />, 
      price: 100,
      benefit: "+10 popularity points and 1 premium like token"
    },
    { 
      id: 'teddy', 
      name: 'Teddy Bear', 
      icon: <Gift className="text-amber-700" />, 
      price: 50,
      benefit: "+5 popularity points and profile boost for 24 hours"
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText, 'text');
      setMessageText('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onSendMessage(base64data, 'voice');
        };
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly to record your voice message",
      });
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast({
        title: "Voice Message Recorded",
        description: "Your voice message has been prepared for sending",
      });
    }
  };
  
  const startVideoCall = async () => {
    try {
      setIsVideoCallRequested(true);
      onSendMessage("Video call request", 'video-request');
      
      toast({
        title: "Video Call Requested",
        description: `Waiting for ${matchName} to accept your call...`,
      });
      
    } catch (error) {
      console.error("Error starting video call:", error);
      toast({
        title: "Video Call Error",
        description: "Could not initiate video call. Please try again.",
        variant: "destructive",
      });
      setIsVideoCallRequested(false);
    }
  };
  
  const acceptVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      
      stream.getTracks().forEach(track => {
        if (localStreamRef.current) {
          peerConnection.addTrack(track, localStreamRef.current);
        }
      });
      
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      setIsInVideoCall(true);
      setIncomingVideoCall(false);
      onSendMessage("Video call accepted", 'video-accepted');
      
      toast({
        title: "Video Call Connected",
        description: `You are now in a video call with ${matchName}`,
      });
      
    } catch (error) {
      console.error("Error accepting video call:", error);
      toast({
        title: "Video Call Error",
        description: "Could not connect to video call. Please check camera permissions.",
        variant: "destructive",
      });
      setIncomingVideoCall(false);
    }
  };
  
  const endVideoCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setIsInVideoCall(false);
    setIsVideoCallRequested(false);
    onSendMessage("Video call ended", 'video-ended');
    
    toast({
      title: "Video Call Ended",
      description: "Your video call has ended",
    });
  };
  
  const simulateIncomingCall = () => {
    setIncomingVideoCall(true);
    toast({
      title: "Incoming Video Call",
      description: `${matchName} is calling you`,
    });
  };
  
  const sendGift = (giftId: string) => {
    if (giftInventory[giftId] && giftInventory[giftId] > 0) {
      onSendMessage(giftId, 'gift', giftId);
      setShowGiftMenu(false);
      
      const gift = gifts.find(g => g.id === giftId);
      
      toast({
        title: "Gift Sent",
        description: `You sent a ${gift?.name || 'gift'} to ${matchName}. When they receive it, they'll gain: ${gift?.benefit}`,
      });
    } else {
      toast({
        title: "Gift Not Available",
        description: "You don't have this gift in your inventory. Please purchase it from the shop.",
        variant: "destructive"
      });
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderMessageContent = (message: Message) => {
    if (message.type === 'voice') {
      return (
        <div className="flex items-center gap-2">
          <audio src={message.content} controls className="h-10 max-w-[200px]" />
          <Volume2 size={16} className="text-muted-foreground" />
        </div>
      );
    } else if (message.type === 'gift') {
      const gift = gifts.find(g => g.id === message.giftType);
      return (
        <div className="flex flex-col items-center text-center p-2">
          <div className="text-4xl mb-2">{gift?.icon || <Gift className="text-love-500" />}</div>
          <p className="text-sm">Sent a {gift?.name || 'gift'}</p>
        </div>
      );
    } else if (message.type === 'video-request') {
      return (
        <div className="flex items-center gap-2 py-1">
          <Video size={16} className="text-love-500" />
          <span>Video call request</span>
        </div>
      );
    } else if (message.type === 'video-accepted') {
      return (
        <div className="flex items-center gap-2 py-1">
          <Video size={16} className="text-green-500" />
          <span>Video call accepted</span>
        </div>
      );
    } else if (message.type === 'video-ended') {
      return (
        <div className="flex items-center gap-2 py-1">
          <VideoOff size={16} className="text-gray-500" />
          <span>Video call ended</span>
        </div>
      );
    } else {
      return message.content;
    }
  };
  
  // Function to focus the input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Function to handle input area clicks
  const handleInputAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusInput();
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isInVideoCall, incomingVideoCall, isVideoCallRequested]);
  
  // Immediately focus the input when component mounts
  useEffect(() => {
    // Focus immediately without delay
    focusInput();
    
    // Also set a slightly delayed focus for edge cases
    const timer = setTimeout(() => {
      focusInput();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);
  
  // Ensure the input field is focused whenever the active match changes
  useEffect(() => {
    focusInput();
  }, [matchName]);
  
  // Make sure buttons are properly clickable
  useEffect(() => {
    // Create a manual focus event for the first render
    // This helps ensure that the buttons are interactive immediately
    const makeInteractive = () => {
      if (chatFooterRef.current) {
        const buttons = chatFooterRef.current.querySelectorAll('button');
        buttons.forEach(button => {
          button.style.pointerEvents = 'auto';
        });
      }
      focusInput();
    };
    
    makeInteractive();
    // Run again after a short delay to make sure it applies after all renders
    const timer = setTimeout(makeInteractive, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="h-full flex flex-col border-love-100">
      <CardHeader className="px-4 py-3 border-b border-love-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={matchPhoto}
              alt={matchName}
              className="h-10 w-10 rounded-full object-cover"
            />
            
            <div>
              <h3 className="font-medium">{matchName}</h3>
              {compatibilityScore && (
                <Badge variant="outline" className="bg-love-50 text-love-700 border-love-200">
                  <Sparkles size={12} className="mr-1 text-love-500" />
                  {compatibilityScore}% Match
                </Badge>
              )}
            </div>
          </div>
          
          {!isInVideoCall && !isVideoCallRequested && (
            <Button
              onClick={startVideoCall}
              size="sm"
              variant="outline"
              className="bg-white border-love-200 hover:bg-love-50 z-10"
            >
              <Video size={18} className="text-love-500 mr-1" />
              Video Call
            </Button>
          )}
          
          {isVideoCallRequested && !isInVideoCall && (
            <Button
              onClick={endVideoCall}
              size="sm"
              variant="outline"
              className="bg-white border-love-200 hover:bg-love-50 text-red-500 z-10"
            >
              <PhoneOff size={18} className="text-red-500 mr-1" />
              Cancel Call
            </Button>
          )}
        </div>
      </CardHeader>
      
      {isInVideoCall ? (
        <div className="flex-grow flex flex-col">
          <div className="relative flex-grow bg-black">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                onClick={endVideoCall}
                className="rounded-full h-12 w-12 z-10"
                variant="destructive"
              >
                <PhoneOff size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CardContent className="flex-grow p-0 overflow-hidden">
          {incomingVideoCall && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-pulse mb-4 mx-auto rounded-full h-20 w-20 flex items-center justify-center bg-love-100">
                  <Phone size={36} className="text-love-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Incoming Video Call</h3>
                <p className="mb-4">{matchName} is calling you...</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setIncomingVideoCall(false)}
                    variant="outline"
                    className="bg-white border-red-200 text-red-500 z-10"
                  >
                    <PhoneOff size={18} className="mr-1" />
                    Decline
                  </Button>
                  <Button
                    onClick={acceptVideoCall}
                    className="bg-love-500 hover:bg-love-600 z-10"
                  >
                    <Phone size={18} className="mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Start a conversation with {matchName}
                  </p>
                  
                  {suggestionStarters.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-love-700">Suggested starters:</p>
                      <div className="flex flex-col gap-2">
                        {suggestionStarters.map((starter, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="border-love-200 hover:bg-love-50 text-sm justify-start h-auto py-2 px-3 z-10"
                            onClick={() => {
                              setMessageText(starter);
                              focusInput();
                            }}
                          >
                            {starter}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[80%] break-words",
                      message.sender === 'user' 
                        ? "ml-auto" 
                        : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2",
                        message.sender === 'user'
                          ? "bg-love-500 text-white rounded-br-none"
                          : "bg-gray-100 rounded-bl-none"
                      )}
                    >
                      {renderMessageContent(message)}
                    </div>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.sender === 'user'
                          ? "text-right text-muted-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {format(message.timestamp, 'h:mm a')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      )}
      
      {showGiftMenu && (
        <div className="p-3 border-t border-love-100 bg-love-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Send a Gift</h4>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-love-600 z-10"
                onClick={() => setShowGiftInfo(!showGiftInfo)}
              >
                <Info size={14} className="mr-1" />
                Benefits
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-love-600 z-10"
                asChild
              >
                <a href="/profile#shop">
                  <ShoppingCart size={14} className="mr-1" />
                  Shop
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="z-10"
                onClick={() => {
                  setShowGiftMenu(false);
                  focusInput();
                }}
              >
                Close
              </Button>
            </div>
          </div>
          
          {showGiftInfo && (
            <div className="bg-white rounded-md p-3 mb-3 border border-love-200 text-sm">
              <h5 className="font-medium mb-1">Gift Benefits for Recipients:</h5>
              <ul className="space-y-1 text-xs">
                {gifts.map(gift => (
                  <li key={`info-${gift.id}`} className="flex items-start gap-1">
                    <div className="shrink-0 mt-0.5">{gift.icon}</div>
                    <div><span className="font-medium">{gift.name}:</span> {gift.benefit}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2">
            {gifts.map((gift) => (
              <Button
                key={gift.id}
                variant="outline"
                className={cn(
                  "flex flex-col h-20 px-2 py-1 bg-white relative z-10",
                  giftInventory[gift.id] <= 0 && "opacity-50"
                )}
                onClick={() => sendGift(gift.id)}
                disabled={giftInventory[gift.id] <= 0}
              >
                <span className="text-2xl">{gift.icon}</span>
                <span className="text-xs mt-1">{gift.name}</span>
                {giftInventory[gift.id] > 0 ? (
                  <Badge variant="outline" className="absolute top-1 right-1 bg-love-50 text-love-700 text-xs">
                    {giftInventory[gift.id]}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="absolute top-1 right-1 bg-gray-100 text-gray-500 text-xs">
                    0
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {!isInVideoCall && (
        <CardFooter className="p-3 border-t border-love-100" ref={chatFooterRef}>
          {isRecording ? (
            <div className="flex w-full items-center gap-2">
              <div className="flex-grow bg-red-50 text-red-500 px-4 py-2 rounded-md border border-red-200 flex items-center">
                <div className="animate-pulse mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                <span>Recording... {formatTime(recordingTime)}</span>
              </div>
              <Button
                onClick={stopRecording}
                size="icon"
                variant="destructive"
                className="z-10"
              >
                <Square size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex w-full items-center gap-2 relative" onClick={handleInputAreaClick}>
              {/* Added a transparent overlay to ensure the entire input area is clickable */}
              <div className="absolute inset-0 cursor-text" onClick={focusInput}></div>
              <Input
                ref={inputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-grow border-love-200 focus-visible:ring-love-500 z-10"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                onClick={startRecording}
                size="icon"
                variant="outline"
                className="bg-white border-love-200 hover:bg-love-50 z-10"
                type="button"
              >
                <Mic size={18} className="text-love-500" />
              </Button>
              <Button
                onClick={() => setShowGiftMenu(!showGiftMenu)}
                size="icon"
                variant="outline"
                className="bg-white border-love-200 hover:bg-love-50 z-10"
                type="button"
              >
                <Gift size={18} className="text-love-500" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                size="icon"
                className="bg-love-500 hover:bg-love-600 z-10"
                type="button"
              >
                <Send size={18} />
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageChat;
