
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Trash2, Clock3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";

interface VoiceIntroSectionProps {
  profileData: any;
  voiceNote: string | null;
  isRecording: boolean;
  toggleRecording: () => void;
  onVoiceRecordingComplete: (audioUrl: string) => void;
  onDeleteVoiceNote: () => void;
}

const VoiceIntroSection = ({
  profileData,
  voiceNote,
  isRecording,
  toggleRecording,
  onVoiceRecordingComplete,
  onDeleteVoiceNote
}: VoiceIntroSectionProps) => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 30; // 30 seconds max

  // Set up audio recording
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      stopRecording();
    }
    
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      setAudioChunks(chunks);
      
      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onVoiceRecordingComplete(base64data);
        };
      };
      
      recorder.start();
      setRecordingTime(0);
      
      // Start timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      toggleRecording(); // Turn off recording state
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success('Voice recording saved!');
    }
  };

  const playVoiceNote = () => {
    if (!voiceNote) return;
    
    if (!audioPlayer) {
      const player = new Audio(voiceNote);
      setAudioPlayer(player);
      
      player.onplay = () => {
        setIsPlaying(true);
        // Start updating progress
        const interval = setInterval(() => {
          if (player.duration) {
            setPlaybackProgress((player.currentTime / player.duration) * 100);
          }
        }, 100);
        
        // Store interval ID so we can clear it later
        player.dataset.progressInterval = String(interval);
      };
      
      player.onended = () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
        clearInterval(Number(player.dataset.progressInterval));
      };
      
      player.onpause = () => {
        setIsPlaying(false);
        clearInterval(Number(player.dataset.progressInterval));
      };
      
      player.play();
    } else {
      if (isPlaying) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        setPlaybackProgress(0);
      } else {
        audioPlayer.play();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Voice Introduction</h3>
        <p className="text-sm text-gray-500 mb-4">
          Record a short voice message to introduce yourself. This helps potential matches get a better sense of who you are.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {voiceNote ? (
            <motion.div 
              className="flex flex-col items-center space-y-3 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key="voice-ready"
            >
              <div className="text-center mb-1">
                <p className="text-sm font-medium">Your voice introduction is ready!</p>
                <p className="text-xs text-gray-500 mt-1">Click play to listen</p>
              </div>
              
              <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={playVoiceNote}
                    className="rounded-full h-10 w-10 bg-white dark:bg-gray-700"
                  >
                    {isPlaying ? (
                      <StopCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Play className="h-5 w-5 text-love-500" />
                    )}
                  </Button>
                  
                  <div className="flex-1 mx-3">
                    <Progress value={playbackProgress} className="h-2" />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onDeleteVoiceNote}
                    className="rounded-full h-10 w-10 bg-white dark:bg-gray-700"
                  >
                    <Trash2 className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col items-center space-y-4 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key="voice-record"
            >
              {isRecording && (
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-500">Recording...</span>
                    <span className="text-sm font-medium flex items-center">
                      <Clock3 className="w-4 h-4 mr-1" />
                      {formatTime(recordingTime)}/{formatTime(MAX_RECORDING_TIME)}
                    </span>
                  </div>
                  <Progress 
                    value={(recordingTime / MAX_RECORDING_TIME) * 100} 
                    className="h-2" 
                    indicatorClassName="bg-red-500" 
                  />
                </div>
              )}
              
              <p className="text-sm text-center max-w-xs">
                {isRecording 
                  ? "Recording in progress... Tap stop when you're finished." 
                  : "Tap the mic button to start recording your voice introduction."}
              </p>
              
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                onClick={toggleRecording}
                className={`rounded-full h-20 w-20 ${isRecording ? 'animate-pulse' : ''}`}
              >
                {isRecording ? (
                  <StopCircle className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10 text-love-500" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        <p>Note: Keep your voice introduction under 30 seconds</p>
      </div>
    </div>
  );
};

export default VoiceIntroSection;
