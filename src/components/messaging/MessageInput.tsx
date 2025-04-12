
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, ImagePlus, Mic, StopCircle, X, Smile } from 'lucide-react';
import { Message } from '@/types/user';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string, type?: Message['type']) => void;
  onOpenGiftModal: () => void;
  onOpenImageUploader: () => void;
  onSendVoiceNote: (voiceUrl: string) => void;
  isLoading: boolean;
  onTypingChange?: (isTyping: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onOpenGiftModal,
  onOpenImageUploader,
  onSendVoiceNote,
  isLoading,
  onTypingChange
}) => {
  const [messageContent, setMessageContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    onSendMessage(messageContent);
    setMessageContent('');
  };

  // Handle typing indicator with debounce
  useEffect(() => {
    if (onTypingChange) {
      if (messageContent.trim().length > 0) {
        onTypingChange(true);
        
        // Clear existing timer
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
        
        // Set a new timer to stop typing indicator after 1.5 seconds of inactivity
        typingTimerRef.current = setTimeout(() => {
          onTypingChange(false);
        }, 1500);
      } else {
        onTypingChange(false);
      }
    }
    
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [messageContent, onTypingChange]);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onSendVoiceNote(base64data);
        };
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Stop at 60 seconds
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.');
      setIsRecording(false);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Cancel voice recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop the media recorder
      mediaRecorderRef.current.stop();
      
      // Clear the audio chunks
      audioChunksRef.current = [];
      
      // Reset recording state
      setIsRecording(false);
      setRecordingTime(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop all tracks from any stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [isRecording]);

  // Quick emoji selection
  const quickEmojis = ["❤️", "😊", "👋", "👍", "🎉", "😂", "🙏", "😍"];

  const handleEmojiSelect = (emoji: string) => {
    setMessageContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <Separator />
      <div className={`p-4 ${isMobile ? 'pb-20' : ''} bg-white`}>
        {isRecording ? (
          <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-rose-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-rose-700 dark:text-rose-300 font-medium">
                Recording {formatTime(recordingTime)}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                onClick={cancelRecording}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-rose-100 border-rose-200 text-rose-600 hover:bg-rose-200"
                onClick={stopRecording}
                disabled={isLoading}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {showEmojiPicker && (
              <div className="grid grid-cols-8 gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                {quickEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-9 w-9 p-0"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
                aria-label="Emoji"
              >
                <Smile className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenGiftModal}
                disabled={isLoading}
                className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
                aria-label="Send gift"
              >
                <span className="text-lg">🎁</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onOpenImageUploader}
                disabled={isLoading}
                className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
                aria-label="Upload image"
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isLoading}
                className="h-9 w-9 rounded-full text-gray-500 hover:text-love-500 hover:bg-love-50"
                onClick={startRecording}
                aria-label="Record voice message"
              >
                <Mic className="h-5 w-5" />
              </Button>
              
              <Input
                placeholder="Type your message..."
                value={messageContent}
                onChange={e => setMessageContent(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-grow bg-gray-50 border-gray-200 focus-visible:ring-love-200"
                disabled={isLoading}
                aria-label="Message input"
              />
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!messageContent.trim() || isLoading}
                className="bg-love-500 hover:bg-love-600"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageInput;
