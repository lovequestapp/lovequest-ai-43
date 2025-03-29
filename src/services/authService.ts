
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.session.user.id)
    .single();
    
  if (profileError || !profile) {
    return null;
  }
  
  // Map Supabase profile to our User type
  const user: User = {
    id: data.session.user.id,
    name: profile.name || '',
    email: data.session.user.email || '',
    age: profile.age || 0,
    bio: profile.bio || '',
    location: profile.location || '',
    interests: profile.interests || [],
    photos: profile.photos || [],
    gender: profile.gender || 'non-binary',
    interestedIn: profile.interested_in || [],
    popularityPoints: profile.popularity_points || 0,
    premiumStatus: profile.premium_status || 'basic',
    giftInventory: { rose: 0, heart: 0, teddy: 0 },
    receivedGifts: { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 0,
    personalityTraits: profile.personality_traits || [],
    role: profile.role || 'subscriber',
    isBanned: profile.is_banned || false,
    verificationStatus: profile.verification_status || 'unverified'
  };
  
  return user;
};
