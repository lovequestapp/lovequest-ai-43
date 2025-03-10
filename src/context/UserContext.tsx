import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

type BlogPost = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: BlogComment[];
  tags: string[];
};

type BlogComment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  userName: string;
};

// Add BoostProfile type
type BoostProfile = {
  userId: string;
  boostType: 'local' | 'international';
  expiresAt: Date;
};

type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  photos: string[];
  compatibilityScore?: number;
  giftInventory?: Record<string, number>;
  popularityPoints?: number;
  premiumLikes?: number;
  profileBoost?: {
    active: boolean;
    expiresAt?: Date;
  };
  receivedGifts?: {
    rose: number;
    heart: number;
    teddy: number;
  };
  balance?: {
    amount: number;
    currency: string;
    pendingWithdrawal?: {
      amount: number;
      status: 'pending' | 'completed' | 'failed';
      date: Date;
    };
    withdrawalHistory?: Array<{
      amount: number;
      status: 'completed' | 'failed';
      date: Date;
    }>;
  };
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    swiftCode?: string;
  };
  plan?: string;
  gender?: 'male' | 'female' | 'non-binary';
  interestedIn?: ('male' | 'female' | 'non-binary')[];
  blogPosts?: BlogPost[];
  favoriteMusic?: string;
  personalityTraits?: string[];
  verificationId?: string;
  isVerified?: boolean;
};

type Match = {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
};

type Message = {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended';
  giftType?: string;
};

type UserContextType = {
  currentUser: User | null;
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  boostedProfiles: BoostProfile[]; // Add boostedProfiles
  setCurrentUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addMatch: (matchedUserId: string) => void;
  sendMessage: (matchId: string, content: string, type?: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended', giftType?: string) => void;
  getMatchedUser: (userId: string) => User | undefined;
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  purchaseGifts: (gifts: Record<string, number>) => void;
  getGiftInventory: () => Record<string, number>;
  receiveGift: (giftType: string) => void;
  getGiftBenefits: () => {
    popularityPoints: number;
    premiumLikes: number;
    profileBoost: boolean;
    boostTimeRemaining?: string;
  };
  getGiftMonetizationDetails: () => {
    giftValues: {
      rose: number;
      heart: number;
      teddy: number;
    };
    minimumWithdrawal: number;
    availableBalance: number;
    currency: string;
    exchangeRates: Record<string, number>;
  };
  initiateWithdrawal: (amount: number) => boolean;
  updateBankDetails: (details: User['bankDetails']) => void;
  getWithdrawalHistory: () => Array<{
    amount: number;
    status: 'completed' | 'failed';
    date: Date;
  }> | undefined;
  getPendingWithdrawal: () => {
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    date: Date;
  } | undefined;
  createBlogPost: (title: string, content: string, tags: string[]) => void;
  updateBlogPost: (postId: string, updates: Partial<Omit<BlogPost, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteBlogPost: (postId: string) => void;
  likeBlogPost: (postId: string, userId: string) => void;
  commentOnBlogPost: (postId: string, content: string) => void;
  getAllPosts: () => BlogPost[];
  getFilteredPosts: () => BlogPost[];
  getUserPosts: (userId: string) => BlogPost[];
  boostProfile: (boostType: 'local' | 'international') => boolean; // Add boostProfile method
};

const UserContext = createContext<UserContextType>({} as UserContextType);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 28,
    bio: 'Adventurous spirit looking for someone to explore the world with. Love hiking, photography, and trying new restaurants.',
    location: 'San Francisco, CA',
    interests: ['Hiking', 'Photography', 'Cooking', 'Travel'],
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    compatibilityScore: 92,
  },
  {
    id: '2',
    name: 'Jamie Smith',
    age: 31,
    bio: 'Creative soul with a passion for art and music. Looking for someone to share meaningful conversations and spontaneous adventures.',
    location: 'Los Angeles, CA',
    interests: ['Art', 'Music', 'Reading', 'Yoga'],
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    compatibilityScore: 87,
  },
  {
    id: '3',
    name: 'Taylor Wilson',
    age: 26,
    bio: 'Tech enthusiast by day, foodie by night. Seeking a partner who appreciates good food, good laughs, and good conversations.',
    location: 'Seattle, WA',
    interests: ['Technology', 'Food', 'Gaming', 'Movies'],
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    compatibilityScore: 78,
  },
  {
    id: '4',
    name: 'Jordan Lee',
    age: 30,
    bio: 'Fitness coach who loves the outdoors. Looking for someone active who enjoys both adventure and quiet evenings at home.',
    location: 'Denver, CO',
    interests: ['Fitness', 'Outdoors', 'Nutrition', 'Meditation'],
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    compatibilityScore: 85,
  },
  {
    id: '5',
    name: 'Casey Parker',
    age: 29,
    bio: 'Aspiring novelist with a love for travel. Seeking someone to share stories and create memories with around the world.',
    location: 'Chicago, IL',
    interests: ['Writing', 'Travel', 'Coffee', 'Museums'],
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    compatibilityScore: 90,
  },
];

const sampleBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    userId: '1',
    title: 'My Hiking Adventure in Yosemite',
    content: 'Last weekend, I finally made it to Yosemite National Park. The views were breathtaking and the trails challenged me in the best way possible. I met some fellow hikers who shared their favorite spots with me...',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likes: 24,
    comments: [
      {
        id: 'comment-1',
        postId: 'blog-1',
        userId: '3',
        userName: 'Taylor Wilson',
        content: 'This looks amazing! I\'ve been wanting to visit Yosemite for years.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['Hiking', 'Nature', 'Adventure']
  },
  {
    id: 'blog-2',
    userId: '2',
    title: 'Finding Creativity in Unexpected Places',
    content: 'As an artist, I\'m always looking for inspiration. Recently, I found it in the most unexpected place - a crowded subway car during rush hour. The diverse faces, expressions, and energies sparked a whole new series of paintings...',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    likes: 37,
    comments: [
      {
        id: 'comment-2',
        postId: 'blog-2',
        userId: '5',
        userName: 'Casey Parker',
        content: 'I love how you find beauty in everyday moments!',
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['Art', 'Creativity', 'Inspiration']
  },
  {
    id: 'blog-3',
    userId: '4',
    title: 'How Meditation Changed My Fitness Journey',
    content: 'For years, I approached fitness purely from a physical perspective. Adding meditation to my routine has transformed not just my workouts but my entire relationship with my body. Here\'s how the practice changed my approach...',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    likes: 52,
    comments: [
      {
        id: 'comment-3',
        postId: 'blog-3',
        userId: '1',
        userName: 'Alex Johnson',
        content: 'I\'ve been thinking about trying meditation. Any tips for beginners?',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['Fitness', 'Meditation', 'Wellness']
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'current-user',
    name: 'Sam Rivera',
    age: 27,
    bio: 'Passionate about technology and creativity. Looking for authentic connections and shared adventures.',
    location: 'New York, NY',
    interests: ['Technology', 'Art', 'Hiking', 'Food'],
    photos: ['/placeholder.svg', '/placeholder.svg'],
    giftInventory: { 'rose': 3, 'heart': 1, 'teddy': 2 },
    popularityPoints: 0,
    premiumLikes: 0,
    profileBoost: { active: false },
    receivedGifts: { rose: 0, heart: 0, teddy: 0 },
    balance: {
      amount: 0,
      currency: 'USD',
      withdrawalHistory: []
    },
    plan: 'free',
    gender: 'male',
    interestedIn: ['female'],
    favoriteMusic: 'Coldplay - Paradise',
    personalityTraits: ['Creative', 'Ambitious', 'Adventurous'],
    blogPosts: [
      {
        id: 'blog-current-1',
        userId: 'current-user',
        title: 'My Journey into Tech and Creativity',
        content: 'When I first started exploring the intersection of technology and art, I never imagined how deeply these seemingly different worlds would connect. In this post, I share my story of discovering digital creativity and how it\'s shaped my perspective on life and relationships...',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        likes: 18,
        comments: [
          {
            id: 'comment-current-1',
            postId: 'blog-current-1',
            userId: '2',
            userName: 'Jamie Smith',
            content: 'I relate to this so much! Technology and art have always been my two passions as well.',
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          }
        ],
        tags: ['Technology', 'Creativity', 'Digital Art']
      }
    ]
  });
  
  const [potentialMatches, setPotentialMatches] = useState<User[]>(
    mockUsers.map((user, index) => ({
      ...user,
      gender: index % 2 === 0 ? 'female' : 'male',
      interestedIn: index % 2 === 0 ? ['male'] : ['female'],
      blogPosts: sampleBlogPosts.filter(post => post.userId === user.id)
    }))
  );
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  // Add boostedProfiles state
  const [boostedProfiles, setBoostedProfiles] = useState<BoostProfile[]>([]);

  const giftValues = {
    rose: 0.50,
    heart: 2.00,
    teddy: 5.00
  };
  
  const minimumWithdrawal = 10.00;
  
  const exchangeRates = {
    USD: 1.00,
    EUR: 0.93,
    GBP: 0.78,
    JPY: 156.78,
    CAD: 1.37,
    AUD: 1.52,
    CNY: 7.24,
    INR: 83.15,
  };
  
  const getGiftMonetizationDetails = () => {
    return {
      giftValues,
      minimumWithdrawal,
      availableBalance: currentUser?.balance?.amount || 0,
      currency: currentUser?.balance?.currency || 'USD',
      exchangeRates
    };
  };
  
  const calculateGiftValue = (giftType: string, quantity: number): number => {
    switch (giftType) {
      case 'rose':
        return giftValues.rose * quantity;
      case 'heart':
        return giftValues.heart * quantity;
      case 'teddy':
        return giftValues.teddy * quantity;
      default:
        return 0;
    }
  };
  
  const updateBankDetails = (details: User['bankDetails']) => {
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      bankDetails: {
        ...currentUser.bankDetails,
        ...details
      }
    });
    
    toast({
      title: "Bank Details Updated",
      description: "Your withdrawal information has been saved",
    });
  };
  
  const initiateWithdrawal = (amount: number): boolean => {
    if (!currentUser || !currentUser.balance) return false;
    
    if (amount < minimumWithdrawal) {
      toast({
        title: "Withdrawal Failed",
        description: `Minimum withdrawal amount is $${minimumWithdrawal}`,
        variant: "destructive"
      });
      return false;
    }
    
    if (amount > currentUser.balance.amount) {
      toast({
        title: "Withdrawal Failed",
        description: "Requested amount exceeds your available balance",
        variant: "destructive"
      });
      return false;
    }
    
    if (!currentUser.bankDetails?.accountNumber || !currentUser.bankDetails?.bankName) {
      toast({
        title: "Withdrawal Failed",
        description: "Please add your bank details before withdrawing",
        variant: "destructive"
      });
      return false;
    }
    
    if (currentUser.balance.pendingWithdrawal) {
      toast({
        title: "Withdrawal Failed",
        description: "You have a pending withdrawal. Please wait for it to complete.",
        variant: "destructive"
      });
      return false;
    }
    
    const updatedUser = { ...currentUser };
    
    updatedUser.balance = {
      ...updatedUser.balance,
      amount: updatedUser.balance.amount - amount,
      pendingWithdrawal: {
        amount,
        status: 'pending',
        date: new Date()
      }
    };
    
    setCurrentUser(updatedUser);
    
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${currentUser.balance.currency} ${amount.toFixed(2)} is being processed`,
    });
    
    setTimeout(() => {
      completeWithdrawal(amount);
    }, 5000);
    
    return true;
  };
  
  const completeWithdrawal = (amount: number) => {
    if (!currentUser || !currentUser.balance?.pendingWithdrawal) return;
    
    const updatedUser = { ...currentUser };
    const withdrawal = {
      amount,
      status: 'completed' as const,
      date: new Date()
    };
    
    updatedUser.balance = {
      ...updatedUser.balance,
      withdrawalHistory: [
        ...(updatedUser.balance.withdrawalHistory || []),
        withdrawal
      ],
      pendingWithdrawal: undefined
    };
    
    setCurrentUser(updatedUser);
    
    toast({
      title: "Withdrawal Completed",
      description: `${currentUser.balance.currency} ${amount.toFixed(2)} has been sent to your bank account`,
    });
  };
  
  const getWithdrawalHistory = () => {
    return currentUser?.balance?.withdrawalHistory;
  };
  
  const getPendingWithdrawal = () => {
    return currentUser?.balance?.pendingWithdrawal;
  };
  
  const isPremiumUser = (): boolean => {
    return currentUser?.plan === 'premium' || currentUser?.plan === 'vip';
  };
  
  const receiveGift = (giftType: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser };
    
    if (!updatedUser.receivedGifts) {
      updatedUser.receivedGifts = { rose: 0, heart: 0, teddy: 0 };
    }
    
    updatedUser.receivedGifts[giftType as keyof typeof updatedUser.receivedGifts] += 1;
    
    if (!updatedUser.popularityPoints) updatedUser.popularityPoints = 0;
    if (!updatedUser.premiumLikes) updatedUser.premiumLikes = 0;
    if (!updatedUser.profileBoost) updatedUser.profileBoost = { active: false };
    
    if (!updatedUser.balance) {
      updatedUser.balance = {
        amount: 0,
        currency: 'USD',
        withdrawalHistory: []
      };
    }
    
    const giftValue = calculateGiftValue(giftType, 1);
    const isPremium = isPremiumUser();
    
    if (isPremium) {
      updatedUser.balance.amount += giftValue;
    }
    
    switch (giftType) {
      case 'rose':
        updatedUser.popularityPoints += 2;
        toast({
          title: "Rose Received!",
          description: `You gained +2 popularity points${isPremium ? ` and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value` : ''}`,
        });
        break;
      case 'heart':
        updatedUser.popularityPoints += 10;
        updatedUser.premiumLikes += 1;
        toast({
          title: "Heart Received!",
          description: `You gained +10 popularity points, 1 premium like token${isPremium ? `, and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value` : ''}`,
        });
        break;
      case 'teddy':
        updatedUser.popularityPoints += 5;
        updatedUser.profileBoost = { 
          active: true, 
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        };
        toast({
          title: "Teddy Bear Received!",
          description: `You gained +5 popularity points, a 24-hour profile boost${isPremium ? `, and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value` : ''}`,
        });
        break;
    }
    
    setCurrentUser(updatedUser);
    
    if (!isPremium && giftValue > 0) {
      setTimeout(() => {
        toast({
          title: "Upgrade to Premium!",
          description: `Upgrade to Premium or VIP to earn ${updatedUser.balance.currency} ${giftValue.toFixed(2)} for each ${giftType} you receive!`,
        });
      }, 2000);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const addMatch = (matchedUserId: string) => {
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      userId: currentUser?.id || '',
      matchedUserId,
      timestamp: new Date(),
    };
    
    setMatches([...matches, newMatch]);
    setMessages({
      ...messages,
      [newMatch.id]: [],
    });
  };

  const sendMessage = (
    matchId: string, 
    content: string, 
    type: 'text' | 'voice' | 'gift' | 'video-request' | 'video-accepted' | 'video-ended' = 'text',
    giftType?: string
  ) => {
    if (!currentUser) return;
    
    if (type === 'gift' && giftType) {
      const inventory = currentUser.giftInventory || {};
      
      if (!inventory[giftType] || inventory[giftType] <= 0) {
        return;
      }
      
      const updatedInventory = {
        ...inventory,
        [giftType]: inventory[giftType] - 1
      };
      
      setCurrentUser({
        ...currentUser,
        giftInventory: updatedInventory
      });
      
      setTimeout(() => {
        receiveGift(giftType);
      }, 2000);
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      read: false,
      type,
      giftType,
    };
    
    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage],
    }));
    
    let previewText = content;
    if (type === 'voice') {
      previewText = '🎤 Voice message';
    } else if (type === 'gift') {
      const giftNames: Record<string, string> = {
        'rose': '🌹 Rose',
        'heart': '❤️ Heart',
        'teddy': '🧸 Teddy bear',
      };
      previewText = giftNames[giftType || ''] || '🎁 Gift';
    } else if (type === 'video-request') {
      previewText = '📹 Video call request';
    } else if (type === 'video-accepted') {
      previewText = '📹 Video call started';
    } else if (type === 'video-ended') {
      previewText = '📹 Video call ended';
    }
    
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { 
              ...match, 
              lastMessage: previewText, 
              lastMessageTime: new Date() 
            } 
          : match
      )
    );
    
    if (type === 'video-request') {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const willAccept = Math.random() > 0.3;
        
        setTimeout(() => {
          const responseMessage: Message = {
            id: `msg-${Date.now()}`,
            matchId,
            senderId: match.matchedUserId,
            content: willAccept ? "Video call accepted" : "Missed your call, sorry!",
            timestamp: new Date(),
            read: false,
            type: willAccept ? 'video-accepted' : 'video-ended',
          };
          
          setMessages(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), responseMessage],
          }));
          
          const previewText = willAccept ? '📹 Video call started' : '📹 Missed call';
          setMatches(prev => 
            prev.map(m => 
              m.id === matchId 
                ? { 
                    ...m, 
                    lastMessage: previewText, 
                    lastMessageTime: new Date() 
                  } 
                : m
            )
          );
        }, 3000 + Math.random() * 2000);
      }
    }
  };

  const getMatchedUser = (userId: string) => {
    const match = matches.find(m => m.id === userId);
    if (!match) return undefined;
    
    return potentialMatches.find(user => user.id === match.matchedUserId);
  };

  const likeUser = (userId: string) => {
    addMatch(userId);
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const passUser = (userId: string) => {
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const purchaseGifts = (gifts: Record<string, number>) => {
    if (!currentUser) return;
    
    const currentInventory = currentUser.giftInventory || { 'rose': 0, 'heart': 0, 'teddy': 0 };
    
    const updatedInventory = { ...currentInventory };
    
    Object.keys(gifts).forEach(giftId => {
      updatedInventory[giftId] = (updatedInventory[giftId] || 0) + gifts[giftId];
    });
    
    setCurrentUser({
      ...currentUser,
      giftInventory: updatedInventory
    });
    
    toast({
      title: "Gifts Purchased",
      description: "Your gift inventory has been updated",
    });
  };

  const getGiftInventory = (): Record<string, number> => {
    return currentUser?.giftInventory || { 'rose': 0, 'heart': 0, 'teddy': 0 };
  };

  useEffect(() => {
    if (matches.length === 0 && mockUsers.length > 0) {
      const sampleMatch: Match = {
        id: 'sample-match-1',
        userId: currentUser?.id || '',
        matchedUserId: mockUsers[0].id,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lastMessage: 'Hi there!',
        lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      };
      
      const sampleMessages: Message[] = [
        {
          id: 'msg-1',
          matchId: 'sample-match-1',
          senderId: mockUsers[0].id,
          content: 'Hi there! I noticed we both like hiking.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          type: 'text',
        },
        {
          id: 'msg-2',
          matchId: 'sample-match-1',
          senderId: currentUser?.id || '',
          content: 'Yes! I love hiking in the mountains. What about you?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          read: true,
          type: 'text',
        },
        {
          id: 'msg-3',
          matchId: 'sample-match-1',
          senderId: mockUsers[0].id,
          content: '🌹',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: true,
          type: 'gift',
          giftType: 'rose',
        },
        {
          id: 'msg-4',
          matchId: 'sample-match-1',
          senderId: currentUser?.id || '',
          content: 'Thanks for the rose! Would you like to have a video call sometime?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: true,
          type: 'text',
        },
      ];
      
      setMatches([sampleMatch]);
      setMessages({
        'sample-match-1': sampleMessages,
      });
    }
  }, [currentUser, mockUsers, matches.length]);

  const getUserPosts = (userId: string): BlogPost[] => {
    if (userId === currentUser?.id) {
      return currentUser.blogPosts || [];
    }
    
    const user = potentialMatches.find(u => u.id === userId);
    return user?.blogPosts || [];
  };
  
  const likeBlogPost = (postId: string, userId: string) => {
    const targetUser = userId === currentUser?.id 
      ? currentUser 
      : potentialMatches.find(user => user.id === userId);
    
    if (!targetUser || !targetUser.blogPosts) return;
    
    const updatedPosts = targetUser.blogPosts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    
    if (userId === currentUser?.id && currentUser) {
      const updatedUser = { ...currentUser, blogPosts: updatedPosts };
      setCurrentUser(updatedUser);
    } else {
      const updatedMatches = potentialMatches.map(user => 
        user.id === userId ? {
          ...user,
          blogPosts: updatedPosts
        } : user
      );
      setPotentialMatches(updatedMatches);
    }
    
    toast({
      title: "Post Liked",
      description: "You liked this post!",
    });
  };
  
  const commentOnBlogPost = (postId: string, content: string) => {
    if (!currentUser) return;
    
    const allUsers = [currentUser, ...potentialMatches];
    let postOwner: User | undefined;
    let post: BlogPost | undefined;
    
    for (const user of allUsers) {
      if (user.blogPosts) {
        post = user.blogPosts.find(p => p.id === postId);
        if (post) {
          postOwner = user;
          break;
        }
      }
    }
    
    if (!postOwner || !post) return;
    
    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      content,
      createdAt: new Date(),
    };
    
    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment]
    };
    
    if (postOwner.id === currentUser.id) {
      const updatedUser = { ...currentUser };
      updatedUser.blogPosts = updatedUser.blogPosts?.map(p => 
        p.id === postId ? updatedPost : p
      ) || [];
      
      setCurrentUser(updatedUser);
    } else {
      const updatedMatches = potentialMatches.map(user => 
        user.id === postOwner?.id ? {
          ...user,
          blogPosts: user.blogPosts?.map(p => 
            p.id === postId ? updatedPost : p
          ) || []
        } : user
      );
      
      setPotentialMatches(updatedMatches);
    }
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the post!",
    });
  };
  
  const getAllPosts = (): BlogPost[] => {
    const allPosts: BlogPost[] = [];
    
    if (currentUser?.blogPosts) {
      allPosts.push(...currentUser.blogPosts);
    }
    
    potentialMatches.forEach(user => {
      if (user.blogPosts) {
        allPosts.push(...user.blogPosts);
      }
    });
    
    return allPosts.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  };
  
  const getFilteredPosts = (): BlogPost[] => {
    if (!currentUser) return [];
    
    return potentialMatches
      .filter(user => {
        if (!currentUser.interestedIn) return true;
        return user.gender ? currentUser.interestedIn.includes(user.gender) : true;
      })
      .flatMap(user => user.blogPosts || [])
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const getGiftBenefits = () => {
    if (!currentUser) return {
      popularityPoints: 0,
      premiumLikes: 0,
      profileBoost: false,
      boostTimeRemaining: undefined
    };
    
    const now = new Date();
    const boostExpiration = currentUser.profileBoost?.expiresAt;
    
    let boostTimeRemaining;
    if (boostExpiration && boostExpiration > now) {
      const diff = boostExpiration.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 *
