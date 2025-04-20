
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

export const useProfileMonitor = (
  onProfileInsert?: (profile: User) => void,
  onProfileUpdate?: (profile: User) => void,
  onProfileDelete?: (profile: User) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Enhanced mapper with better error handling and type safety
  const mapDatabaseRecordToUser = useCallback((record: any): User => {
    try {
      // Convert premium_status to the correct value
      const premiumStatus = record.premium_status || 'standard';
      
      // Parse gift inventories safely
      let giftInventory = { rose: 0, heart: 0, teddy: 0 };
      let receivedGifts = { rose: 0, heart: 0, teddy: 0 };
      
      if (record.gift_inventory) {
        try {
          const parsedInventory = typeof record.gift_inventory === 'string' 
            ? JSON.parse(record.gift_inventory) 
            : record.gift_inventory;
            
          giftInventory = {
            rose: parsedInventory.rose?.count || 0,
            heart: parsedInventory.heart?.count || 0,
            teddy: parsedInventory.teddy?.count || 0
          };
        } catch (e) {
          console.error('Error parsing gift inventory:', e);
        }
      }
      
      if (record.received_gifts) {
        try {
          const parsedGifts = typeof record.received_gifts === 'string' 
            ? JSON.parse(record.received_gifts) 
            : record.received_gifts;
            
          receivedGifts = {
            rose: parsedGifts.rose?.count || 0,
            heart: parsedGifts.heart?.count || 0,
            teddy: parsedGifts.teddy?.count || 0
          };
        } catch (e) {
          console.error('Error parsing received gifts:', e);
        }
      }
      
      return {
        id: record.id,
        name: record.name || '',
        email: record.email || '',
        age: record.age || 18,
        photos: Array.isArray(record.photos) ? record.photos : [],
        bio: record.bio || '',
        location: record.location || '',
        interests: Array.isArray(record.interests) ? record.interests : [],
        gender: (record.gender || 'non-binary') as 'male' | 'female' | 'non-binary',
        interestedIn: Array.isArray(record.interested_in) ? 
          record.interested_in.filter(g => ['male', 'female', 'non-binary'].includes(g)) as ('male' | 'female' | 'non-binary')[] : 
          [],
        popularityPoints: record.popularity_points || 0,
        premiumStatus: premiumStatus as 'standard' | 'unlimited' | 'vip' | 'admin',
        giftInventory,
        receivedGifts,
        compatibilityScore: 0,
        personalityTraits: Array.isArray(record.personality_traits) ? record.personality_traits : [],
        role: (record.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
        isBanned: !!record.is_banned,
        verificationStatus: (record.verification_status || 'unverified') as 'verified' | 'unverified' | 'pending' | 'rejected',
        lastMessage: '',
        lastMessageTime: new Date(),
        status: 'offline',
        favoriteMusic: Array.isArray(record.favorite_music) ? record.favorite_music : [],
        voiceIntro: record.voice_intro || '',
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          routingNumber: '',
          accountType: ''
        }
      };
    } catch (error) {
      console.error('Error mapping database record to user:', error, record);
      // Return a minimal valid user object to avoid crashes
      return {
        id: record.id || 'unknown',
        name: record.name || 'Unknown User',
        email: record.email || '',
        age: 18,
        bio: '',
        location: '',
        interests: [],
        photos: [],
        gender: 'non-binary',
        interestedIn: [],
        popularityPoints: 0,
        premiumStatus: 'standard',
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: [],
        role: 'subscriber',
        isBanned: false,
        verificationStatus: 'unverified',
        lastMessage: '',
        lastMessageTime: new Date(),
        status: 'offline',
        favoriteMusic: [],
        voiceIntro: '',
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          routingNumber: '',
          accountType: ''
        }
      };
    }
  }, []);

  // Setup real-time subscription to profile changes
  useEffect(() => {
    console.log('Setting up profile monitor with enhanced error handling...');
    setConnectionError(null);
    
    const reconnectTimeout = 5000; // 5 seconds
    let reconnectTimer: ReturnType<typeof setTimeout>;
    
    const setupChannel = () => {
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
                  if (onProfileInsert) {
                    const newUser = mapDatabaseRecordToUser(payload.new);
                    onProfileInsert(newUser);
                  }
                  break;
                
                case 'UPDATE':
                  console.log('Profile updated:', payload.new);
                  if (onProfileUpdate) {
                    const updatedUser = mapDatabaseRecordToUser(payload.new);
                    onProfileUpdate(updatedUser);
                  }
                  break;
                
                case 'DELETE':
                  console.log('Profile deleted:', payload.old);
                  if (onProfileDelete && payload.old) {
                    const deletedUser = mapDatabaseRecordToUser(payload.old);
                    onProfileDelete(deletedUser);
                  }
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
          
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setConnectionError(null);
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setConnectionError('Failed to connect to real-time updates');
            
            // Attempt to reconnect
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(() => {
              console.log('Attempting to reconnect profile monitor...');
              supabase.removeChannel(channel);
              setupChannel();
            }, reconnectTimeout);
          }
        });

      return channel;
    };
    
    const channel = setupChannel();

    return () => {
      console.log('Cleaning up profile monitor...');
      clearTimeout(reconnectTimer);
      supabase.removeChannel(channel);
    };
  }, [onProfileInsert, onProfileUpdate, onProfileDelete, mapDatabaseRecordToUser]);

  return { isConnected, connectionError };
};
