
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  interests: string[];
  gender: 'male' | 'female' | 'non-binary';
  interestedIn: ('male' | 'female' | 'non-binary')[];
  popularityPoints: number;
  premiumStatus: 'standard' | 'unlimited' | 'vip' | 'admin';
  giftInventory: {
    rose: number;
    heart: number;
    teddy: number;
  };
  receivedGifts: {
    rose: number;
    heart: number;
    teddy: number;
  };
  compatibilityScore: number;
  personalityTraits: string[];
  role: 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial';
  isBanned: boolean;
  verificationStatus: 'verified' | 'unverified' | 'pending' | 'rejected';
  lastMessage: string;
  lastMessageTime: Date;
  status: 'online' | 'offline' | 'away';
  favoriteMusic: string[];
  voiceIntro: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
    accountType: string;
  }
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  compatibilityScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type?: 'text' | 'voice' | 'image' | 'gift' | 'video-request' | 'video-accepted' | 'video-declined';
  mediaUrl?: string;
  giftType?: 'rose' | 'heart' | 'teddy';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  interests: string[];
  personalityTraits: string[];
  compatibilityScore: number;
  premiumStatus: 'standard' | 'unlimited' | 'vip' | 'admin';
  verificationStatus: 'verified' | 'unverified' | 'pending' | 'rejected';
}

export interface AiProfileSuggestion {
  bio: string;
  interests: string[];
  personalityTraits: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    messages: boolean;
    matches: boolean;
    likes: boolean;
    system: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastActive: boolean;
    showProfileTo: 'everyone' | 'matches' | 'nobody';
  };
  language: string;
  distanceUnit: 'km' | 'mi';
}
