import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Gift, Mic, Image as ImageIcon } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import EmojiPicker from '@/components/messaging/EmojiPicker';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'voice' | 'gift') => void;
  onOpenGiftModal: () => void;
  onOpenImageUploader: () => void;
  onSendVoiceNote: (voiceUrl: string) => void;
  isLoading?: boolean;
  onTypingChange?: (isTyping: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onOpenGiftModal,
  onOpenImageUploader,
  onSendVoiceNote,
  isLoading = false,
  onTypingChange,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Cleanup recording if component unmounts during recording
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  const handleTyping = () => {
    if (onTypingChange) {
      onTypingChange(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        onTypingChange(false);
      }, 2000);
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      if (onTypingChange) {
        onTypingChange(false);
      }
      
      // Make sure textarea is focused after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const startVoiceRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert to base64 for sending
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onSendVoiceNote(base64data);
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.info("Recording voice message", {
        description: "Speak clearly into your microphone"
      });
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone", {
        description: "Please check your permissions"
      });
    }
  };
  
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Voice message recorded", {
        description: "Sending your voice message"
      });
    }
  };
  
  // Format recording time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-3 border-t relative">
      {isRecording ? (
        <div className="flex items-center space-x-2">
          <div className="flex-grow flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-sm">Recording... {formatTime(recordingTime)}</span>
          </div>
          <Button 
            onClick={stopVoiceRecording}
            size="icon" 
            variant="destructive"
            className="shrink-0"
            aria-label="Stop recording"
          >
            <span className="h-3 w-3 bg-white rounded-sm"></span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
              onClick={onOpenImageUploader}
              disabled={isLoading}
              aria-label="Upload image"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
              onClick={startVoiceRecording}
              disabled={isLoading}
              aria-label="Record voice message"
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
              onClick={onOpenGiftModal}
              disabled={isLoading}
              aria-label="Send a gift"
            >
              <Gift className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-love-400 rounded-full"></span>
            </Button>
            
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
          
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              className="min-h-10 max-h-32 border-love-100 focus:border-love-200 rounded-2xl resize-none bg-gray-50"
              disabled={isLoading}
              rows={1}
              style={{
                paddingRight: '40px', // Make room for the send button
              }}
            />
            
            <Button
              className={cn(
                "rounded-full p-0 w-12 h-12 shrink-0",
                message.trim() ? "bg-love-500 hover:bg-love-600" : "bg-gray-200 text-gray-400"
              )}
              disabled={!message.trim() || isLoading}
              onClick={handleSendMessage}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageInput;
