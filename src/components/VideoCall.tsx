
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

interface VideoCallProps {
  callId: string;
  recipientId: string;
  initiator: boolean;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ callId, recipientId, initiator, onClose }) => {
  const { currentUser, endVideoCall } = useUser();
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Simulate connection after a short delay
    const connectionTimer = setTimeout(() => {
      setCallStatus('connected');
      
      // Start call duration timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // In a real app, we would establish a WebRTC connection here
      // and get access to the user's camera and microphone
      
      // For the demo, let's just simulate the camera streams with sample videos
      if (localVideoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.error("Error accessing media devices:", err);
            // Fallback if camera access is denied
            if (localVideoRef.current) {
              localVideoRef.current.poster = "https://i.pravatar.cc/300?u=" + currentUser?.id;
            }
          });
      }
      
      if (remoteVideoRef.current) {
        // In a real app, this would be the remote user's stream
        // For now, just show a placeholder
        remoteVideoRef.current.poster = "https://i.pravatar.cc/300?u=" + recipientId;
      }
      
    }, initiator ? 1000 : 200);
    
    return () => {
      clearTimeout(connectionTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recipientId, currentUser, initiator]);
  
  const handleEndCall = () => {
    setCallStatus('ended');
    
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Stop the video streams
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    // In a real app, we would close the WebRTC connection here
    endVideoCall(callId);
    
    // Close the video call component after a delay
    setTimeout(onClose, 1000);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real app, we would mute/unmute the audio track here
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle from the current state
      });
    }
    
    toast.success(isMuted ? "Microphone unmuted" : "Microphone muted");
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    
    // In a real app, we would enable/disable the video track here
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // Toggle from the current state
      });
    }
    
    toast.success(isVideoOff ? "Camera turned on" : "Camera turned off");
  };
  
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote video (larger) */}
      <div className="relative flex-1">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted={false}
          className={`w-full h-full object-cover ${callStatus !== 'connected' ? 'opacity-50' : ''}`}
        />
        
        {/* Call status overlay */}
        {callStatus === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-t-primary animate-spin mb-4"></div>
              <p className="text-white text-lg font-medium">Connecting...</p>
            </div>
          </div>
        )}
        
        {callStatus === 'ended' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <p className="text-white text-xl font-medium">Call Ended</p>
          </div>
        )}
        
        {/* Call duration */}
        {callStatus === 'connected' && (
          <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1">
            <p className="text-white text-sm">{formatCallDuration(callDuration)}</p>
          </div>
        )}
        
        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-20 right-4 w-1/3 max-w-[160px] aspect-[3/4] rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted={true}
            className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="text-white/60" />
            </div>
          )}
        </div>
      </div>
      
      {/* Call controls */}
      <div className="bg-black/90 p-4 flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 h-12 w-12"
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 h-12 w-12"
          onClick={toggleVideo}
        >
          {isVideoOff ? (
            <VideoOff className="h-6 w-6 text-white" />
          ) : (
            <Video className="h-6 w-6 text-white" />
          )}
        </Button>
        
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full h-14 w-14"
          onClick={handleEndCall}
        >
          <Phone className="h-6 w-6 rotate-[135deg]" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
