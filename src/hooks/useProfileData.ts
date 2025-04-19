
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

export const useProfileData = (userId: string | undefined) => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching profile data for user:', userId);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching profile data:', fetchError);
          throw new Error('Failed to load profile data from database.');
        }

        if (data) {
          const transformedData = transformProfileData(data);
          setProfileData(transformedData);
        } else {
          setError('Profile not found');
        }
      } catch (err: any) {
        console.error('Error in profile data fetching:', err);
        setError('An unexpected error occurred while loading your profile: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return { profileData, loading, error, setProfileData };
};

const transformProfileData = (data: any): User => {
  let giftInventory = { rose: 0, heart: 0, teddy: 0 };
  let receivedGifts = { rose: 0, heart: 0, teddy: 0 };
  
  try {
    if (data.gift_inventory) {
      const gift = typeof data.gift_inventory === 'string' 
        ? JSON.parse(data.gift_inventory) 
        : data.gift_inventory;
        
      giftInventory = {
        rose: gift.rose?.count || 0,
        heart: gift.heart?.count || 0,
        teddy: gift.teddy?.count || 0
      };
    }
    
    if (data.received_gifts) {
      const received = typeof data.received_gifts === 'string'
        ? JSON.parse(data.received_gifts)
        : data.received_gifts;
        
      receivedGifts = {
        rose: received.rose?.count || 0,
        heart: received.heart?.count || 0,
        teddy: received.teddy?.count || 0
      };
    }
  } catch (e) {
    console.error('Error parsing JSON fields:', e);
  }
  
  let bankDetails = {
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
    accountType: ''
  };
  
  try {
    const bankData = (data as any).bank_details || null;
    if (bankData) {
      const parsedBankData = typeof bankData === 'string' 
        ? JSON.parse(bankData)
        : bankData;
        
      bankDetails = {
        accountName: parsedBankData.accountName || '',
        accountNumber: parsedBankData.accountNumber || '',
        bankName: parsedBankData.bankName || '',
        routingNumber: parsedBankData.routingNumber || '',
        accountType: parsedBankData.accountType || ''
      };
    }
  } catch (e) {
    console.error('Error parsing bank details:', e);
  }
  
  const verificationStatus = (data.verification_status || 'unverified') as 'verified' | 'unverified' | 'pending' | 'rejected';
  
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    age: data.age || 18,
    bio: data.bio || '',
    location: data.location || '',
    interests: Array.isArray(data.interests) ? data.interests : [],
    photos: Array.isArray(data.photos) ? data.photos : [],
    gender: (data.gender as 'male' | 'female' | 'non-binary') || 'non-binary',
    interestedIn: Array.isArray(data.interested_in) ? 
      data.interested_in.filter(g => ['male', 'female', 'non-binary'].includes(g)) as ('male' | 'female' | 'non-binary')[] : 
      [],
    popularityPoints: data.popularity_points || 0,
    premiumStatus: data.premium_status as 'standard' | 'unlimited' | 'vip' | 'admin',
    giftInventory,
    receivedGifts,
    compatibilityScore: 0,
    personalityTraits: Array.isArray(data.personality_traits) ? data.personality_traits : [],
    role: (data.role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial') || 'subscriber',
    isBanned: !!data.is_banned,
    verificationStatus,
    lastMessage: '',
    lastMessageTime: new Date(),
    status: 'online',
    favoriteMusic: Array.isArray(data.favorite_music) ? data.favorite_music : [],
    voiceIntro: data.voice_intro || '',
    bankDetails
  };
};
