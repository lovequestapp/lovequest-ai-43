
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  photos: string[];
  gender: 'male' | 'female' | 'non-binary';
  interestedIn: ('male' | 'female' | 'non-binary')[];
  popularityPoints: number;
  premiumStatus: 'basic' | 'premium' | 'vip' | 'trial';
  giftInventory: GiftInventory;
  receivedGifts: GiftInventory;
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
  };
  isDemo?: boolean; // Flag to indicate if this is a demo profile
  preferences?: UserPreferences;
}

export interface UserWithCoordinates extends User {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
}

export interface GiftInventory {
  rose: number;
  heart: number;
  teddy: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachmentUrl?: string;
}

export interface BlogPostType {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface BlogComment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface BoostType {
  id: string;
  userId: string;
  type: 'local' | 'international';
  level: BoostLevelType;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

export type BoostLevelType = 'basic' | 'premium' | 'ultra';

export interface UserPreferences {
  maxDistance: number;
  ageRange: {
    min: number;
    max: number;
  };
  showMeToUsers: boolean;
  notificationPreferences: {
    messages: boolean;
    matches: boolean;
    likes: boolean;
    app: boolean;
  };
  preferredLocations: string[];
  matchingPriorities: {
    distance: number;
    interests: number;
    age: number;
    personality: number;
  };
}
