
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

export const useProfileMonitor = (
  onProfileInsert?: (profile: User) => void,
  onProfileUpdate?: (profile: User) => void,
  onProfileDelete?: (profile: User) => void
) => {
  useEffect(() => {
    console.log('Setting up profile monitor...');
    
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
          
          try {
            switch(payload.eventType) {
              case 'INSERT':
                console.log('New profile created:', payload.new);
                onProfileInsert?.(payload.new as User);
                break;
              
              case 'UPDATE':
                console.log('Profile updated:', payload.new);
                onProfileUpdate?.(payload.new as User);
                break;
              
              case 'DELETE':
                console.log('Profile deleted:', payload.old);
                onProfileDelete?.(payload.old as User);
                break;
            }
          } catch (error) {
            console.error('Error handling profile change:', error);
            toast.error('Error syncing profile changes');
          }
        }
      )
      .subscribe((status) => {
        console.log('Profile monitor subscription status:', status);
      });

    return () => {
      console.log('Cleaning up profile monitor...');
      supabase.removeChannel(channel);
    };
  }, [onProfileInsert, onProfileUpdate, onProfileDelete]);
};
