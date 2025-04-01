
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Voice recording saved!');
    }
  };

  const playVoiceNote = () => {
    if (!voiceNote) return;
    
    if (!audioPlayer) {
      const player = new Audio(voiceNote);
      setAudioPlayer(player);
      
      player.onplay = () => setIsPlaying(true);
      player.onended = () => setIsPlaying(false);
      player.onpause = () => setIsPlaying(false);
      
      player.play();
    } else {
      if (isPlaying) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      } else {
        audioPlayer.play();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Voice Introduction</h3>
        <p className="text-sm text-gray-500 mb-4">
          Record a short voice message to introduce yourself. This helps potential matches get a better sense of who you are.
        </p>
      </div>
      
      <div className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 p-4">
        {voiceNote ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium">Your voice introduction is ready!</p>
              <p className="text-xs text-gray-500">Click play to listen</p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={playVoiceNote}
                className="rounded-full h-10 w-10"
              >
                {isPlaying ? (
                  <StopCircle className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onDeleteVoiceNote}
                className="rounded-full h-10 w-10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-center">
              {isRecording 
                ? "Recording in progress..." 
                : "Click the mic button to start recording"}
            </p>
            
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              className={`rounded-full h-12 w-12 ${isRecording ? 'animate-pulse' : ''}`}
            >
              {isRecording ? (
                <StopCircle className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        <p>Note: Keep your voice introduction under 30 seconds</p>
      </div>
    </div>
  );
};

export default VoiceIntroSection;
