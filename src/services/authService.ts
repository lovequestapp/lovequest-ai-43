
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

// Export the User type from types/user.ts instead of UserContext
// so it can be directly imported by this file

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
  
  // Ensure gender is properly typed
  const gender = profile.gender || 'non-binary';
  const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
    ? gender as 'male' | 'female' | 'non-binary'
    : 'non-binary' as const;
    
  // Ensure interestedIn is properly typed
  const interestedIn = profile.interested_in || [];
  const validInterestedIn = Array.isArray(interestedIn) ? 
    interestedIn.filter((interest: string) => 
      interest === 'male' || interest === 'female' || interest === 'non-binary'
    ) as ('male' | 'female' | 'non-binary')[] :
    [] as ('male' | 'female' | 'non-binary')[];

  // Ensure premium status is properly typed
  const premiumStatus = profile.premium_status || 'basic';
  const validPremiumStatus = (premiumStatus === 'basic' || premiumStatus === 'premium' || premiumStatus === 'vip')
    ? premiumStatus as 'basic' | 'premium' | 'vip'
    : 'basic' as const;

  // Ensure role is properly typed
  const role = profile.role || 'subscriber';
  const validRole = (role === 'admin' || role === 'moderator' || role === 'subscriber' || role === 'vip' || role === 'trial')
    ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    : 'subscriber' as const;

  // Ensure verification status is properly typed
  const verificationStatus = profile.is_verified ? 'verified' : 'unverified';
  const validVerificationStatus = verificationStatus as 'verified' | 'unverified' | 'pending' | 'rejected';
  
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
    gender: validGender,
    interestedIn: validInterestedIn,
    popularityPoints: profile.popularity_points || 0,
    premiumStatus: validPremiumStatus,
    giftInventory: { rose: 0, heart: 0, teddy: 0 },
    receivedGifts: { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 0,
    personalityTraits: profile.personality_traits || [],
    role: validRole,
    isBanned: profile.is_banned || false,
    verificationStatus: validVerificationStatus,
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
  
  return user;
};

// Create login function
export const login = async (credentials: { email: string; password: string }): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return null;
    }
    
    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error('Profile retrieval error:', profileError.message);
      return null;
    }
    
    // Create user object from profile
    const user: User = {
      id: data.user.id,
      name: profile?.name || '',
      email: data.user.email || '',
      age: profile?.age || 25,
      bio: profile?.bio || '',
      location: profile?.location || '',
      interests: profile?.interests || [],
      photos: profile?.photos || [],
      gender: (profile?.gender || 'non-binary') as 'male' | 'female' | 'non-binary',
      interestedIn: (profile?.interested_in || []) as ('male' | 'female' | 'non-binary')[],
      popularityPoints: profile?.popularity_points || 0,
      premiumStatus: (profile?.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: profile?.personality_traits || [],
      role: (profile?.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
      isBanned: profile?.is_banned || false,
      verificationStatus: (profile?.is_verified ? 'verified' : 'unverified') as 'verified' | 'unverified' | 'pending' | 'rejected',
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
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

// Create register function
export const register = async (
  authData: { email: string; password: string },
  profileData: Partial<User>
): Promise<User | null> => {
  try {
    // Create auth account
    const { data, error } = await supabase.auth.signUp({
      email: authData.email,
      password: authData.password,
      options: {
        data: {
          name: profileData.name,
        }
      }
    });
    
    if (error || !data.user) {
      console.error('Registration error:', error?.message);
      return null;
    }
    
    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          name: profileData.name || '',
          email: profileData.email || '',
          age: profileData.age || 25,
          bio: profileData.bio || '',
          location: profileData.location || '',
          interests: profileData.interests || [],
          photos: profileData.photos || [],
          gender: profileData.gender || 'non-binary',
          interested_in: profileData.interestedIn || [],
          popularity_points: 0,
          premium_status: 'basic',
          role: 'subscriber',
          is_banned: false,
          is_verified: false,
          personality_traits: []
        }
      ]);
      
    if (profileError) {
      console.error('Profile creation error:', profileError.message);
      // Attempt to clean up auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      return null;
    }
    
    // Return user object
    const user: User = {
      id: data.user.id,
      name: profileData.name || '',
      email: authData.email,
      age: profileData.age || 25,
      bio: profileData.bio || '',
      location: profileData.location || '',
      interests: profileData.interests || [],
      photos: profileData.photos || [],
      gender: profileData.gender || 'non-binary',
      interestedIn: profileData.interestedIn || [],
      popularityPoints: 0,
      premiumStatus: 'basic',
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
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};

// Export as an object named authService
export const authService = {
  getCurrentUser,
  login,
  register
};
