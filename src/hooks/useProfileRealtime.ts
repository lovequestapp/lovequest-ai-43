
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

export const useProfileRealtime = () => {
  const [profiles, setProfiles] = useState<User[]>([]);

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
          console.log('Payload received:', payload);

          switch(payload.eventType) {
            case 'INSERT':
              setProfiles(prev => [...prev, payload.new as User]);
              toast.success('New profile added');
              break;
            
            case 'UPDATE':
              setProfiles(prev => 
                prev.map(profile => 
                  profile.id === (payload.new as User).id 
                    ? payload.new as User 
                    : profile
                )
              );
              toast.info('Profile updated');
              break;
            
            case 'DELETE':
              setProfiles(prev => 
                prev.filter(profile => profile.id !== (payload.old as User).id)
              );
              toast.warning('Profile deleted');
              break;
          }
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profiles };
};
