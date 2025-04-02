
import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * A custom hook for video call functionality
 */
export const useVideoCall = () => {
  const { initiateVideoCall, endVideoCall } = useUser();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callRecipientId, setCallRecipientId] = useState<string | null>(null);
  
  const startCall = useCallback(
    async (userId: string) => {
      setCallError(null);
      
      try {
        const success = await initiateVideoCall(userId);
        if (success) {
          setIsCallActive(true);
          setCallRecipientId(userId);
          toast.success(`Video call started with user ${userId}`);
          return true;
        } else {
          throw new Error('Failed to start video call');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setCallError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
    },
    [initiateVideoCall]
  );
  
  const stopCall = useCallback(() => {
    endVideoCall();
    setIsCallActive(false);
    setCallRecipientId(null);
    toast.success('Video call ended');
  }, [endVideoCall]);
  
  return {
    isCallActive,
    callError,
    callRecipientId,
    startCall,
    stopCall
  };
};
