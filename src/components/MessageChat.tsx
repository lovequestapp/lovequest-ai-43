import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  Volume2,
  SmilePlus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Clock,
  MessageCircleHeart,
  Crown
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatFooterRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Enhanced gifts array with premium options
  const gifts = [
    { 
      id: 'rose', 
      name: 'Rose', 
      icon: <Heart className="text-rose-500" />, 
      price: 20,
      benefit: "+2 popularity points",
      isPremium: false
    },
    { 
      id: 'heart', 
      name: 'Heart', 
      icon: <Heart className="text-red-500 fill-red-500" />, 
      price: 100,
      benefit: "+10 popularity points and 1 premium like token",
      isPremium: false
    },
    { 
      id: 'teddy', 
      name: 'Teddy Bear', 
      icon: <Gift className="text-amber-700" />, 
      price: 50,
      benefit: "+5 popularity points and profile boost for 24 hours",
      isPremium: false
    },
    { 
      id: 'crown', 
      name: 'Crown', 
      icon: <Crown className="text-yellow-500 fill-yellow-400" />, 
      price: 200,
      benefit: "+20 popularity points and 3-day premium status",
      isPremium: true
    },
  ];
  
  // Emoji shortcuts for quick access
  const quickEmojis = ['❤️', '😊', '😍', '🥰', '👋', '🔥', '😘', '👀'];
  
  // Quick message suggestions
  const quickActions = [
    { icon: <Calendar size={16} />, label: "Schedule Date", action: () => handleQuickAction("schedule") },
    { icon: <MapPin size={16} />, label: "Share Location", action: () => handleQuickAction("location") },
    { icon: <ImageIcon size={16} />, label: "Send Photo", action: () => handleQuickAction("photo") },
    { icon: <Clock size={16} />, label: "Set Reminder", action: () => handleQuickAction("reminder") },
  ];

  const handleQuickAction = (type: string) => {
    setShowQuickActions(false);
    
    switch(type) {
      case "schedule":
        toast({
          title: "Schedule a Date",
          description: "This feature will be available when we launch!",
        });
        setMessageText("Would you like to meet up sometime this week?");
        setTimeout(() => inputRef.current?.focus(), 100);
        break;
      case "location":
        toast({
          title: "Share Location",
          description: "This feature will be available when we launch!",
        });
        setMessageText("I'm at a great cafe near downtown. Would you like to join me?");
        setTimeout(() => inputRef.current?.focus(), 100);
        break;
      case "photo":
        toast({
          title: "Send Photo",
          description: "This feature will be available when we launch!",
        });
        break;
      case "reminder":
        toast({
          title: "Set Reminder",
          description: "This feature will be available when we launch!",
        });
        break;
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText, 'text');
      setMessageText('');
      setTimeout(scrollToBottom, 100);
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

  const handleEmojiClick = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    inputRef.current?.focus();
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
          <audio src={message.content} controls className="h-10 max-w-[200px] rounded-full" />
          <Volume2 size={16} className="text-muted-foreground" />
        </div>
      );
    } else if (message.type === 'gift') {
      const gift = gifts.find(g => g.id === message.giftType);
      return (
        <div className="flex flex-col items-center text-center p-3 bg-love-50/50 rounded-lg">
          <div className="text-4xl mb-2 animate-bounce">{gift?.icon || <Gift className="text-love-500" />}</div>
          <p className="text-sm font-medium">{message.sender === 'user' ? 'You sent' : 'You received'} a {gift?.name || 'gift'}</p>
          {gift?.isPremium && (
            <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 border-yellow-200">
              <Crown size={10} className="mr-1 text-yellow-500" /> Premium Gift
            </Badge>
          )}
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

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleInputAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusInput();
  };
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };
  
  // Group messages by date for better display
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const dateStr = format(messageDate, 'yyyy-MM-dd');
      
      const existingGroup = groups.find(g => g.date === dateStr);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: dateStr, messages: [message] });
      }
    });
    
    return groups;
  };
  
  const getDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d');
    }
  };

  const messageGroups = groupMessagesByDate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    focusInput();
    
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
  
  useEffect(() => {
    focusInput();
  }, [matchName]);
  
  useEffect(() => {
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
    const timer = setTimeout(makeInteractive, 100);
    
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
  
  return (
    <Card className="h-full flex flex-col border-love-100 overflow-hidden bg-gradient-to-b from-white to-love-50/20">
      <CardHeader className="px-4 py-3 border-b border-love-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-love-100">
              <AvatarImage src={matchPhoto} alt={matchName} className="object-cover" />
              <AvatarFallback className="bg-love-100 text-love-800">{matchName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-display font-medium text-love-900">{matchName}</h3>
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
              className="bg-white border-love-200 hover:bg-love-50 z-10 font-medium"
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
                className="rounded-full h-12 w-12 z-10 bg-red-500 hover:bg-red-600"
                variant="destructive"
              >
                <PhoneOff size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
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
          
          <ScrollArea className="flex-grow min-h-0" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-6 mb-2 mx-auto w-20 h-20 rounded-full bg-love-100/50 flex items-center justify-center">
                    <MessageCircleHeart size={40} className="text-love-400" />
                  </div>
                  <p className="text-muted-foreground mb-4 font-medium">
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
                            className="border-love-200 hover:bg-love-50 text-sm justify-start h-auto py-2 px-3 z-10 transition-all duration-300"
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
                <>
                  {messageGroups.map((group, groupIndex) => (
                    <div key={`group-${group.date}`} className="space-y-4">
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-love-100/30 text-love-700 px-3 py-1 rounded-full text-xs font-medium">
                          {getDateDisplay(group.date)}
                        </div>
                      </div>
                      
                      {group.messages.map((message) => (
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
                                ? "bg-love-gradient text-white rounded-br-none"
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
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {showGiftMenu && (
        <div className="p-3 border-t border-love-100 bg-love-50 flex-shrink-0">
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
                    <div>
                      <span className="font-medium">{gift.name}:</span> {gift.benefit}
                      {gift.isPremium && (
                        <Badge variant="outline" className="ml-1 text-[10px] bg-yellow-50 text-yellow-700 py-0 px-1">
                          <Crown size={8} className="mr-0.5" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-2">
            {gifts.map((gift) => (
              <Button
                key={gift.id}
                variant="outline"
                className={cn(
                  "flex flex-col h-20 px-2 py-1 bg-white relative z-10 border-love-100",
                  gift.isPremium ? "bg-gradient-to-b from-yellow-50 to-white" : "",
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
                {gift.isPremium && (
                  <Badge variant="outline" className="absolute bottom-1 right-1 bg-yellow-50 text-yellow-700 text-[10px] p-0">
                    <Crown size={8} className="mr-0.5" />
                    Premium
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {showEmojiPicker && (
        <div className="p-2 border-t border-love-100 bg-love-50 flex-shrink-0">
          <div className="grid grid-cols-8 gap-2">
            {quickEmojis.map((emoji, index) => (
              <Button
                key={`emoji-${index}`}
                variant="ghost"
                className="h-10 text-xl bg-white hover:bg-love-100 border border-love-100"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {showQuickActions && (
        <div className="p-2 border-t border-love-100 bg-love-50 flex-shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={`action-${index}`}
                variant="outline"
                className="flex flex-col h-16 p-2 bg-white border-love-100 hover:bg-love-50"
                onClick={action.action}
              >
                <span className="mb-1 text-love-500">{action.icon}</span>
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {!isInVideoCall && (
        <CardFooter className="p-3 border-t border-love-100 sticky bottom-0 bg-white z-10 flex-shrink-0" ref={chatFooterRef}>
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
                className="z-20"
              >
                <Square size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between px-1">
                <div className="flex gap-1">
                  <Button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-love-400 hover:text-love-500 z-10 hover:bg-love-50"
                  >
                    <SmilePlus size={18} />
                  </Button
