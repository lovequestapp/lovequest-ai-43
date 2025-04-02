
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { User } from '@/types/user';

interface VideoCallProps {
  recipient: User;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ recipient, onEndCall }) => {
  // This is a simplified mock video call implementation
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Simulate connection delay
    const connectionTimer = setTimeout(() => {
      setIsConnecting(false);
      // Start call duration timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Set up fake video stream for demo
      setupFakeVideoStream();
    }, 2000);
    
    return () => {
      clearTimeout(connectionTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const setupFakeVideoStream = async () => {
    try {
      // Try to get actual camera if available (for demo purposes)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Just use the same stream for remote video in this mock
      if (remoteVideoRef.current) {
        // In a real app, this would be the remote peer's stream
        // For mock, we'll just use a placeholder
        remoteVideoRef.current.poster = recipient.photos?.[0] || '';
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // If camera access fails, just continue with placeholders
    }
  };
  
  const handleToggleAudio = () => {
    setIsAudioMuted(prev => !prev);
  };
  
  const handleToggleVideo = () => {
    setIsVideoOff(prev => !prev);
  };
  
  const handleToggleSpeaker = () => {
    setIsSpeakerMuted(prev => !prev);
  };
  
  const handleEndCall = () => {
    onEndCall();
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        {/* Remote Video (Full screen) */}
        <div className="absolute inset-0">
          <video 
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay 
            playsInline
            muted={isSpeakerMuted}
          />
          
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mb-4">
                  <img 
                    src={recipient.photos?.[0] || 'https://via.placeholder.com/150'} 
                    alt={recipient.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white text-xl font-medium">{recipient.name}</h3>
              </div>
            </div>
          )}
          
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg">Connecting...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-28 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video 
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay 
            playsInline 
            muted
          />
        </div>
        
        {/* Call Duration */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full">
          <span className="text-white">{formatTime(callDuration)}</span>
        </div>
      </div>
      
      {/* Call Controls */}
      <div className="p-4 bg-gray-900">
        <div className="flex justify-center space-x-6">
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full w-14 h-14 ${isAudioMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={handleToggleAudio}
          >
            {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full w-14 h-14 ${isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={handleToggleVideo}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full w-14 h-14 ${isSpeakerMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={handleToggleSpeaker}
          >
            {isSpeakerMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-14 h-14 bg-red-600 text-white"
            onClick={handleEndCall}
          >
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
