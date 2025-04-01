
import { User } from '@/types/user';

// Convert profile data into a normalized User object
export const mapProfileToUser = (
  profile: any, 
  userId: string, 
  userEmail: string
): User => {
  const gender = profile?.gender || 'non-binary';
  const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary')
    ? gender as 'male' | 'female' | 'non-binary'
    : 'non-binary' as const;

  const interestedIn = profile?.interested_in || [];
  const validInterestedIn = Array.isArray(interestedIn)
    ? interestedIn.filter((gender: string) => 
        ['male', 'female', 'non-binary'].includes(gender)
      ) as ('male' | 'female' | 'non-binary')[]
    : [] as ('male' | 'female' | 'non-binary')[];

  const premiumStatus = profile?.premium_status || 'basic';
  const validPremiumStatus = ['basic', 'premium', 'vip', 'trial'].includes(premiumStatus)
    ? premiumStatus as 'basic' | 'premium' | 'vip' | 'trial'
    : 'basic' as const;

  const role = profile?.role || 'subscriber';
  const validRole = ['admin', 'moderator', 'subscriber', 'vip', 'trial'].includes(role)
    ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    : 'subscriber' as const;
    
  const isVerified = profile?.is_verified || false;
  const validVerificationStatus = isVerified ? 'verified' as const : 'unverified' as const;

  return {
    id: userId,
    name: profile?.name || userEmail?.split('@')[0] || 'User',
    email: userEmail || '',
    age: profile?.age || 18,
    bio: profile?.bio || '',
    location: profile?.location || '',
    interests: profile?.interests || [],
    photos: profile?.photos || [],
    gender: validGender,
    interestedIn: validInterestedIn,
    popularityPoints: profile?.popularity_points || 0,
    premiumStatus: validPremiumStatus,
    giftInventory: profile?.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
    receivedGifts: profile?.received_gifts || { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 0,
    personalityTraits: profile?.personality_traits || [],
    role: validRole,
    isBanned: profile?.is_banned || false,
    verificationStatus: validVerificationStatus,
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

// Check if a trial subscription has expired
export const checkTrialExpiration = async (
  trialEndDate: string | undefined, 
  userId: string, 
  updateProfileFn: (id: string, data: any) => Promise<any>
): Promise<boolean> => {
  if (!trialEndDate) return false;
  
  const endDate = new Date(trialEndDate);
  const now = new Date();
  
  if (now > endDate) {
    // Trial has expired, update to basic
    try {
      await updateProfileFn(userId, { premium_status: 'basic' });
      return true;
    } catch (error) {
      console.error("Error updating expired trial:", error);
      return false;
    }
  }
  
  return false;
};

// Create admin user object
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
};

// Check for admin credentials
export const isAdminCredentials = (email: string, password: string): boolean => {
  return email === "hunainm.qureshi@gmail.com" && password === "LoveQuest14";
};
