
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

interface ProfileRealtimeProps {
  onProfileInsert?: (profile: User) => void;
  onProfileUpdate?: (profile: User) => void;
  onProfileDelete?: (profile: User) => void;
}

const ProfileRealtime = ({ 
  onProfileInsert, 
  onProfileUpdate, 
  onProfileDelete 
}: ProfileRealtimeProps) => {
  useEffect(() => {
    // Create a channel for real-time updates
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          
          switch(payload.eventType) {
            case 'INSERT':
              onProfileInsert?.(payload.new as User);
              break;
            
            case 'UPDATE':
              onProfileUpdate?.(payload.new as User);
              break;
            
            case 'DELETE':
              onProfileDelete?.(payload.old as User);
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onProfileInsert, onProfileUpdate, onProfileDelete]);

  return null; // This is a utility component, it doesn't render anything
};

export default ProfileRealtime;
