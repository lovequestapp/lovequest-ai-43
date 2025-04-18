
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
          
          // Map Supabase profile fields to our app's User interface
          const mapDatabaseRecordToUser = (record: any): User => {
            return {
              id: record.id,
              name: record.name || '',
              email: record.email || '',
              age: record.age || 18,
              photos: record.photos || [],
              bio: record.bio || '',
              location: record.location || '',
              interests: record.interests || [],
              gender: record.gender as 'male' | 'female' | 'non-binary',
              interestedIn: record.interested_in || [],
              popularityPoints: record.popularity_points || 0,
              premiumStatus: record.premium_status || 'standard',
              giftInventory: record.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
              receivedGifts: record.received_gifts || { rose: 0, heart: 0, teddy: 0 },
              compatibilityScore: 0,
              personalityTraits: record.personality_traits || [],
              role: record.role || 'subscriber',
              isBanned: record.is_banned || false,
              verificationStatus: record.verification_status || 'unverified',
              lastMessage: '',
              lastMessageTime: new Date(),
              status: 'offline',
              favoriteMusic: record.favorite_music || [],
              voiceIntro: record.voice_intro || '',
              bankDetails: {
                accountName: '',
                accountNumber: '',
                bankName: '',
                routingNumber: '',
                accountType: ''
              }
            };
          };
          
          switch(payload.eventType) {
            case 'INSERT':
              onProfileInsert?.(mapDatabaseRecordToUser(payload.new));
              break;
            
            case 'UPDATE':
              onProfileUpdate?.(mapDatabaseRecordToUser(payload.new));
              break;
            
            case 'DELETE':
              onProfileDelete?.(mapDatabaseRecordToUser(payload.old));
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
