// Add this only if it doesn't already exist in the file, otherwise keep everything as is
export interface UserPreferences {
  maxDistance?: number;
  ageRange?: {
    min: number;
    max: number;
  };
  notificationsEnabled?: boolean;
  messagePreview?: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  showMeToUsers?: boolean;
  notificationPreferences?: {
    messages: boolean;
    matches: boolean;
    likes: boolean;
    app: boolean;
  };
  preferredLocations?: string[];
  matchingPriorities?: {
    distance: number;
    interests: number;
    personality: number;
    age: number;
  };
}

// Make sure User interface includes preferences
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
  preferences?: UserPreferences;
  isDemo?: boolean; // Add this for demo users
  finalScore?: number; // For compatibility scoring
}

export interface GiftInventory {
  rose: number;
  heart: number;
  teddy: number;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string; // Keeping this as recipientId to match the existing code
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

export interface BlogPostType {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: BlogComment[];
  tags: string[];
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export type BoostLevelType = 'none' | 'local' | 'international' | 'super';

export interface UserWithCoordinates extends User {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isBoosted?: boolean;
  boostLevel?: BoostLevelType;
}
