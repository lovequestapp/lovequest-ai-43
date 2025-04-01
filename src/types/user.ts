
export type User = {
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
  // Additional properties needed by components
  voiceIntro: string;
  favoriteMusic: string[];
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
    accountType: string;
  };
  // Properties for Messages component
  lastMessage: string;
  lastMessageTime: Date;
  status: 'online' | 'offline' | 'away';
  // Preferences property - all properties are required
  preferences?: UserPreferences;
};

export type GiftInventory = {
  rose: number;
  heart: number;
  teddy: number;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
};

export type BoostType = 'local' | 'international' | 'super';
export type BoostLevelType = BoostType | 'none';

export type BlogPostType = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
  }[];
  tags: string[];
};

export type UserPreferences = {
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
    interests: number;
    personality: number;
    location: number;
    age: number;
    writingStyle: number;
  };
};

export type UserWithCoordinates = User & {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isBoosted?: boolean;
  boostLevel?: BoostLevelType;
  activityScore?: number;
  finalScore?: number;
};
