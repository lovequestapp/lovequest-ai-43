
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Video } from 'lucide-react';
import VideoCall from '@/components/VideoCall';

interface VideoCallActionProps {
  recipientId: string;
}

const VideoCallAction: React.FC<VideoCallActionProps> = ({ recipientId }) => {
  const { currentUser, initiateVideoCall } = useUser();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId, setCallId] = useState<string>("");
  
  const handleStartCall = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to start a video call");
      return;
    }
    
    try {
      const newCallId = await initiateVideoCall(recipientId);
      if (newCallId) {
        setCallId(newCallId);
        setIsCallActive(true);
      }
    } catch (error) {
      console.error("Error starting video call:", error);
      toast.error("Failed to start video call");
    }
  };
  
  const handleCloseCall = () => {
    setIsCallActive(false);
    setCallId("");
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleStartCall}
        className="rounded-full h-10 w-10"
      >
        <Video className="h-5 w-5" />
      </Button>
      
      <Dialog open={isCallActive} onOpenChange={(open) => !open && handleCloseCall()}>
        <DialogContent className="p-0 max-w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-[90vw] md:w-auto">
          {callId && (
            <VideoCall 
              callId={callId}
              recipientId={recipientId}
              initiator={true}
              onClose={handleCloseCall}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCallAction;
