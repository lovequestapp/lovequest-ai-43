
import { User } from '@/types/user';

// Helper function to create an admin user
export const createAdminUser = (): User => {
  return {
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
    premiumStatus: 'admin',
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
};

// Check if the admin credentials are provided
export const isAdminCredentials = (email: string, password: string): boolean => {
  return email === "hunainm.qureshi@gmail.com" && password === "LoveQuest14";
};

// Helper function to convert old premium status values to new ones
export const convertPremiumStatus = (status: string): 'standard' | 'unlimited' | 'vip' | 'admin' => {
  switch(status) {
    case 'basic':
      return 'standard';
    case 'premium':
      return 'unlimited';
    case 'trial':
      return 'standard';
    case 'standard':
    case 'unlimited':
    case 'vip':
    case 'admin':
      return status as 'standard' | 'unlimited' | 'vip' | 'admin';
    default:
      return 'standard';
  }
};

// Map database profile to User object
export const mapProfileToUser = (profile: any, userId: string, email: string): User => {
  // Handle type-safe gender
  const gender = profile?.gender || 'non-binary';
  const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
    ? gender as 'male' | 'female' | 'non-binary'
    : 'non-binary' as const;
    
  // Handle type-safe interestedIn
  const interestedIn = profile?.interested_in || [];
  const validInterestedIn = Array.isArray(interestedIn) ? 
    interestedIn.filter((interest: string) => 
      interest === 'male' || interest === 'female' || interest === 'non-binary'
    ) as ('male' | 'female' | 'non-binary')[] :
    [] as ('male' | 'female' | 'non-binary')[];
  
  // Handle type-safe premiumStatus  
  const premiumStatus = convertPremiumStatus(profile?.premium_status || 'standard');
    
  // Handle type-safe role
  const role = profile?.role || 'subscriber';
  const validRole = (
    role === 'admin' || 
    role === 'moderator' || 
    role === 'subscriber' || 
    role === 'vip' || 
    role === 'trial'
  )
    ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    : 'subscriber' as const;
    
  // Handle type-safe verification status
  const verificationStatus = profile?.verification_status || 'unverified';
  const validVerificationStatus = (
    verificationStatus === 'verified' || 
    verificationStatus === 'unverified' || 
    verificationStatus === 'pending' || 
    verificationStatus === 'rejected'
  )
    ? verificationStatus as 'verified' | 'unverified' | 'pending' | 'rejected'
    : 'unverified' as const;

  return {
    id: userId,
    name: profile?.name || email?.split('@')[0] || 'User',
    email: email || '',
    age: profile?.age || 18,
    bio: profile?.bio || '',
    location: profile?.location || '',
    interests: profile?.interests || [],
    photos: profile?.photos || [],
    gender: validGender,
    interestedIn: validInterestedIn,
    popularityPoints: profile?.popularity_points || 0,
    premiumStatus: premiumStatus,
    giftInventory: profile?.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
    receivedGifts: profile?.received_gifts || { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 0,
    personalityTraits: profile?.personality_traits || [],
    role: validRole,
    isBanned: profile?.is_banned || false,
    verificationStatus: validVerificationStatus,
    lastMessage: '',
    lastMessageTime: new Date(),
    status: 'offline',
    favoriteMusic: profile?.favorite_music || [],
    voiceIntro: profile?.voice_intro || '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      accountType: ''
    }
  };
};

// Check if trial has expired and update if needed
export const checkTrialExpiration = async (
  trialEndDate: string, 
  userId: string,
  updateProfileFn: (userId: string, data: any) => Promise<any>
): Promise<boolean> => {
  const endDate = new Date(trialEndDate);
  const now = new Date();
  
  if (now > endDate) {
    // Trial has expired, update to standard
    try {
      await updateProfileFn(userId, { premium_status: 'standard' });
      return true;
    } catch (error) {
      console.error('Error updating expired trial status:', error);
      return true; // Still return true as the trial has expired
    }
  }
  
  return false;
};
