
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Video, PhoneOff } from 'lucide-react';
import { toast } from 'sonner';
import { useVideoCall } from '@/hooks/useVideoCall';

interface VideoCallActionProps {
  recipientId: string;
  recipientName: string;
}

const VideoCallAction: React.FC<VideoCallActionProps> = ({ recipientId, recipientName }) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const { isCallActive, startCall, stopCall } = useVideoCall();
  
  const handleStartCall = async () => {
    setIsCallModalOpen(true);
    const success = await startCall(recipientId);
    if (!success) {
      setIsCallModalOpen(false);
    }
  };
  
  const handleEndCall = () => {
    stopCall();
    setIsCallModalOpen(false);
  };
  
  return (
    <div className="mt-2">
      {!isCallActive ? (
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleStartCall}
        >
          <Video size={16} />
          <span>Start Video Call</span>
        </Button>
      ) : (
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleEndCall}
        >
          <PhoneOff size={16} />
          <span>End Call</span>
        </Button>
      )}
      
      {isCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {isCallActive ? `Video Call with ${recipientName}` : 'Connecting...'}
            </h3>
            <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
              {isCallActive ? (
                <video className="w-full h-full object-cover rounded-md" autoPlay muted />
              ) : (
                <div className="animate-pulse">Connecting to video call...</div>
              )}
            </div>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleEndCall}
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              End Call
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallAction;
