
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash2, Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: string) => void;
  initialAudio?: string;
  onDelete?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  initialAudio,
  onDelete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(initialAudio || null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up any MediaRecorder if component unmounts during recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setLoading(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Handle dataavailable event (fired when data is available)
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      // Handle stop event (fired when recording stops)
      mediaRecorder.addEventListener('stop', () => {
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convert to base64 for storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onRecordingComplete(base64data);
        };
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        setLoading(false);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setLoading(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Stop at 60 seconds
          if (prev >= 60) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
            }
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.');
      setLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      setAudioURL(null);
      onDelete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {!isRecording && !audioURL && (
          <Button 
            onClick={startRecording} 
            disabled={loading} 
            type="button"
            variant="outline" 
            className="flex items-center gap-2 border-love-300 text-love-700 hover:bg-love-50"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            Record Voice Intro
          </Button>
        )}
        
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-700">Recording {formatTime(recordingTime)}</span>
            </div>
            <Button 
              onClick={stopRecording} 
              variant="outline" 
              type="button"
              size="icon" 
              className="w-8 h-8 rounded-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {audioURL && !isRecording && (
          <div className="flex items-center gap-2">
            <audio src={audioURL} controls className={`h-10 ${isMobile ? 'w-40 sm:w-56' : 'w-64'}`} />
            <Button 
              onClick={handleDelete} 
              variant="outline" 
              size="icon" 
              type="button"
              className="w-8 h-8 rounded-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isRecording && recordingTime >= 50 && (
        <p className="text-xs text-red-500">
          Recording will automatically stop at 60 seconds
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;
