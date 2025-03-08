
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
  Square 
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'match';
  type?: 'text' | 'voice' | 'gift';
  giftType?: string;
}

interface MessageChatProps {
  matchName: string;
  matchPhoto: string;
  compatibilityScore?: number;
  messages: Message[];
  onSendMessage: (content: string, type?: 'text' | 'voice' | 'gift', giftType?: string) => void;
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
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showGiftMenu, setShowGiftMenu] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const gifts = [
    { id: 'rose', name: 'Rose', icon: <Heart className="text-rose-500" />, price: 2 },
    { id: 'heart', name: 'Heart', icon: <Heart className="text-red-500 fill-red-500" />, price: 1 },
    { id: 'teddy', name: 'Teddy Bear', icon: <Gift className="text-amber-700" />, price: 5 },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
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
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert blob to base64 for sending
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Send voice message
          onSendMessage(base64data, 'voice');
        };
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
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
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const sendGift = (giftId: string) => {
    onSendMessage(giftId, 'gift', giftId);
    setShowGiftMenu(false);
    
    toast({
      title: "Gift Sent",
      description: `You sent a ${gifts.find(g => g.id === giftId)?.name || 'gift'} to ${matchName}`,
    });
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
    } else {
      return message.content;
    }
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <Card className="h-full flex flex-col border-love-100">
      <CardHeader className="px-4 py-3 border-b border-love-100 flex-shrink-0">
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
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-hidden">
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
                          className="border-love-200 hover:bg-love-50 text-sm justify-start h-auto py-2 px-3"
                          onClick={() => {
                            setMessageText(starter);
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
      
      {showGiftMenu && (
        <div className="p-3 border-t border-love-100 bg-love-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Send a Gift</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowGiftMenu(false)}
            >
              Close
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {gifts.map((gift) => (
              <Button
                key={gift.id}
                variant="outline"
                className="flex flex-col h-20 px-2 py-1 bg-white"
                onClick={() => sendGift(gift.id)}
              >
                <span className="text-2xl">{gift.icon}</span>
                <span className="text-xs mt-1">{gift.name}</span>
                <span className="text-xs text-muted-foreground">${gift.price}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <CardFooter className="p-3 border-t border-love-100">
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
            >
              <Square size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-grow border-love-200 focus-visible:ring-love-500"
            />
            <Button
              onClick={startRecording}
              size="icon"
              variant="outline"
              className="bg-white border-love-200 hover:bg-love-50"
            >
              <Mic size={18} className="text-love-500" />
            </Button>
            <Button
              onClick={() => setShowGiftMenu(!showGiftMenu)}
              size="icon"
              variant="outline"
              className="bg-white border-love-200 hover:bg-love-50"
            >
              <Gift size={18} className="text-love-500" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              size="icon"
              className="bg-love-500 hover:bg-love-600"
            >
              <Send size={18} />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MessageChat;
