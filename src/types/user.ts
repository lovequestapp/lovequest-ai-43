
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
  isBoosted?: boolean;
  boostLevel?: BoostLevelType;
}

export interface UserWithCoordinates extends User {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  isBoosted?: boolean;
  boostLevel?: BoostLevelType;
  finalScore?: number;
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

export interface BlogComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  postId: string;
  createdAt: Date;
}

export interface BlogPostType {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type BoostLevelType = 'basic' | 'premium' | 'ultra' | 'none' | 'local' | 'international' | 'super';

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
    location?: number;
    writingStyle?: number;
  };
}
