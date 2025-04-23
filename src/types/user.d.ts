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
  };
};

export type BlogPostType = {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string | Date; // Accept both string and Date
  updatedAt: string | Date; // Accept both string and Date
  likes: number;
  comments: BlogComment[];
  userName?: string;
};

export type BlogComment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string | Date; // Accept both string and Date
};
