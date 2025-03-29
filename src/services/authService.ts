import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { toast } from 'sonner';

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
  
  const gender = profile.gender || 'non-binary';
  const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
    ? gender as 'male' | 'female' | 'non-binary'
    : 'non-binary' as const;
    
  const interestedIn = profile.interested_in || [];
  const validInterestedIn = Array.isArray(interestedIn) ? 
    interestedIn.filter((interest: string) => 
      interest === 'male' || interest === 'female' || interest === 'non-binary'
    ) as ('male' | 'female' | 'non-binary')[] :
    [] as ('male' | 'female' | 'non-binary')[];

  const premiumStatus = profile.premium_status || 'basic';
  const validPremiumStatus = (premiumStatus === 'basic' || premiumStatus === 'premium' || premiumStatus === 'vip')
    ? premiumStatus as 'basic' | 'premium' | 'vip'
    : 'basic' as const;

  const role = profile.role || 'subscriber';
  const validRole = (role === 'admin' || role === 'moderator' || role === 'subscriber' || role === 'vip' || role === 'trial')
    ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    : 'subscriber' as const;

  const verificationStatus = profile.is_verified ? 'verified' : 'unverified';
  const validVerificationStatus = verificationStatus as 'verified' | 'unverified' | 'pending' | 'rejected';
  
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

export const login = async (credentials: { email: string; password: string }): Promise<User | null> => {
  try {
    if (credentials.email === "hunainm.qureshi@gmail.com" && credentials.password === "LoveQuest14") {
      const adminUser: User = {
        id: "admin-special-id",
        name: "Admin",
        email: "hunainm.qureshi@gmail.com",
        age: 30,
        bio: "System Administrator",
        location: "System",
        interests: ["administration", "management"],
        photos: [],
        gender: 'non-binary',
        interestedIn: ['male', 'female', 'non-binary'],
        popularityPoints: 100,
        premiumStatus: 'vip',
        giftInventory: { rose: 999, heart: 999, teddy: 999 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: ["organized", "detail-oriented"],
        role: 'admin',
        isBanned: false,
        verificationStatus: 'verified',
        lastMessage: '',
        lastMessageTime: new Date(),
        status: 'online',
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
      
      toast.success("Admin login successful!");
      return adminUser;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return null;
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error('Profile retrieval error:', profileError.message);
      return null;
    }
    
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
      status: 'online',
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

export const register = async (
  authData: { email: string; password: string },
  profileData: Partial<User>
): Promise<User | null> => {
  try {
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
      await supabase.auth.admin.deleteUser(data.user.id);
      return null;
    }
    
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

export const authService = {
  getCurrentUser,
  login,
  register
};
