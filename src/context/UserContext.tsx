
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

// Define types
export type User = {
  id: string;
  name: string;
  age: number;
  email: string;
  photos: string[];
  bio: string;
  location: string;
  interests: string[];
  popularityPoints?: number;
  premiumStatus?: 'basic' | 'premium' | 'gold';
  coordinates?: { latitude: number; longitude: number };
  matchPreferences?: {
    ageRange: { min: number; max: number };
    distance: number;
    interests: string[];
  };
  compatibilityScore?: number;
  personalityTraits?: string[];
  favoriteMusic?: string;
  giftInventory?: { 
    rose: number; 
    heart: number; 
    teddy: number;
  };
  receivedGifts?: { 
    rose: number; 
    heart: number; 
    teddy: number;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
  };
  gender?: string;
  interestedIn?: string[];
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'gift';
  giftType?: string;
};

type Match = {
  id: string;
  userId1: string;
  userId2: string;
  matchDate: Date;
  status: 'pending' | 'matched' | 'rejected';
  matchedUserId?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
};

export type BoostType = 'local' | 'international';

export type BoostProfile = {
  userId: string;
  boostType: BoostType;
  startTime: Date;
  endTime: Date;
};

type BlogPostType = {
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

type WithdrawalType = {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed' | 'rejected';
};

type UserContextType = {
  currentUser: User | null;
  potentialMatches: User[];
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  matches: Match[];
  messages: Record<string, Message[]>;
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'gift', giftType?: string) => void;
  markMessagesAsRead: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  boostProfile: (boostType: BoostType) => boolean;
  boostedProfiles: BoostProfile[];
  getGiftBenefits: () => { 
    coins: number; 
    boosts: number;
    popularityPoints: number;
    premiumLikes: number;
    profileBoost: boolean;
    boostTimeRemaining: string | null;
  };
  redeemGift: (giftId: string) => void;
  updateMatchPreferences: (preferences: User['matchPreferences']) => void;
  
  // Blog functionality
  createBlogPost: (title: string, content: string, tags: string[]) => void;
  updateBlogPost: (postId: string, updates: { title?: string; content?: string; tags?: string[] }) => void;
  deleteBlogPost: (postId: string) => void;
  likeBlogPost: (postId: string, userId: string) => void;
  commentOnBlogPost: (postId: string, comment: string) => void;
  getUserPosts: (userId: string) => BlogPostType[];
  getAllPosts: () => BlogPostType[];
  getFilteredPosts: (tag?: string) => BlogPostType[];
  
  // Gift and monetization
  purchaseGifts: (gifts: Record<string, number>) => void;
  getGiftInventory: () => { rose: number; heart: number; teddy: number };
  getGiftMonetizationDetails: () => {
    giftValues: { rose: number; heart: number; teddy: number };
    minimumWithdrawal: number;
    availableBalance: number;
    currency: string;
    exchangeRates: Record<string, number>;
  };
  initiateWithdrawal: (amount: number) => boolean;
  updateBankDetails: (details: User['bankDetails']) => void;
  getWithdrawalHistory: () => WithdrawalType[];
  getPendingWithdrawal: () => WithdrawalType | null;
  
  // Auth functions
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  potentialMatches: [],
  likeUser: () => {},
  passUser: () => {},
  matches: [],
  messages: {},
  sendMessage: () => {},
  markMessagesAsRead: () => {},
  updateProfile: () => {},
  boostProfile: () => false,
  boostedProfiles: [],
  getGiftBenefits: () => ({ 
    coins: 0, 
    boosts: 0, 
    popularityPoints: 0, 
    premiumLikes: 0, 
    profileBoost: false, 
    boostTimeRemaining: null 
  }),
  redeemGift: () => {},
  updateMatchPreferences: () => {},
  
  // Add missing default values
  createBlogPost: () => {},
  updateBlogPost: () => {},
  deleteBlogPost: () => {},
  likeBlogPost: () => {},
  commentOnBlogPost: () => {},
  getUserPosts: () => [],
  getAllPosts: () => [],
  getFilteredPosts: () => [],
  
  purchaseGifts: () => {},
  getGiftInventory: () => ({ rose: 0, heart: 0, teddy: 0 }),
  getGiftMonetizationDetails: () => ({
    giftValues: { rose: 20, heart: 100, teddy: 50 },
    minimumWithdrawal: 50,
    availableBalance: 0,
    currency: 'USD',
    exchangeRates: { USD: 1, EUR: 0.85, GBP: 0.75, JPY: 110, CAD: 1.25, AUD: 1.35, CNY: 6.5, INR: 75 }
  }),
  initiateWithdrawal: () => false,
  updateBankDetails: () => {},
  getWithdrawalHistory: () => [],
  getPendingWithdrawal: () => null,
  
  updateUserProfile: () => {},
  setCurrentUser: () => {},
  
  // Auth functions default values
  login: async () => null,
  register: async () => null,
  logout: () => {},
  isAuthenticated: () => false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  console.log("Initializing UserProvider");
  
  // Initialize state with safe defaults
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [boostedProfiles, setBoostedProfiles] = useState<BoostProfile[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [pendingWithdrawal, setPendingWithdrawal] = useState<WithdrawalType | null>(null);

  const giftValues = {
    rose: 20,
    heart: 100,
    teddy: 50,
  };
  
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
    CAD: 1.25,
    AUD: 1.35,
    CNY: 6.5,
    INR: 75
  };

  useEffect(() => {
    const loadSavedUser = async () => {
      const savedUser = authService.getCurrentUser();
      
      if (savedUser) {
        console.log("Found saved user:", savedUser.name);
        setCurrentUser(savedUser);
      } else {
        // Load mock data only if no user is authenticated
        loadMockData();
      }
    };
    
    loadSavedUser();
  }, []);

  const loadMockData = () => {
    console.log("Loading mock data in UserProvider");
    
    // Simulate fetching the current user
    const mockUser: User = {
      id: 'user1',
      name: 'Alex Johnson',
      age: 28,
      email: 'alex@example.com',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
      ],
      bio: 'Passionate photographer and coffee enthusiast. Love hiking and exploring new places on weekends.',
      location: 'San Francisco, California',
      interests: ['photography', 'hiking', 'coffee', 'travel', 'cinema'],
      premiumStatus: 'basic',
      matchPreferences: {
        ageRange: { min: 24, max: 34 },
        distance: 50,
        interests: ['photography', 'outdoors', 'travel'],
      },
      personalityTraits: ['creative', 'adventurous', 'thoughtful'],
      favoriteMusic: 'Indie Rock',
      giftInventory: { rose: 5, heart: 2, teddy: 1 },
      receivedGifts: { rose: 10, heart: 5, teddy: 2 },
      gender: 'male',
      interestedIn: ['female'],
      bankDetails: {
        accountName: 'Alex Johnson',
        accountNumber: '123456789',
        bankName: 'Chase Bank',
        swiftCode: 'CHASUS33'
      },
      compatibilityScore: 0,
      popularityPoints: 75
    };

    const mockPotentialMatches: User[] = [
      {
        id: 'user2',
        name: 'Jamie Smith',
        age: 27,
        email: 'jamie@example.com',
        photos: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
        ],
        bio: 'Art director by day, painter by night. Love exploring galleries and trying new cuisines.',
        location: 'Oakland, California',
        interests: ['art', 'painting', 'food', 'museums', 'travel'],
        popularityPoints: 95,
        compatibilityScore: 92,
        gender: 'female',
        interestedIn: ['male'],
      },
      {
        id: 'user3',
        name: 'Jordan Lee',
        age: 31,
        email: 'jordan@example.com',
        photos: [
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936e63?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
        ],
        bio: 'Software engineer and avid gamer. Always up for a board game night or trying out new tech.',
        location: 'San Jose, California',
        interests: ['tech', 'gaming', 'board games', 'coding', 'movies'],
        popularityPoints: 120,
        premiumStatus: 'premium',
        compatibilityScore: 88,
        gender: 'female',
        interestedIn: ['male'],
      },
      {
        id: 'user4',
        name: 'Casey Chen',
        age: 25,
        email: 'casey@example.com',
        photos: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D%3D',
        ],
        bio: 'Marketing specialist and yoga enthusiast. Love trying new restaurants and attending live music events.',
        location: 'San Francisco, California',
        interests: ['yoga', 'food', 'music', 'travel', 'reading'],
        popularityPoints: 78,
        compatibilityScore: 75,
        gender: 'female',
        interestedIn: ['male'],
      },
      {
        id: 'user5',
        name: 'River Kim',
        age: 29,
        email: 'river@example.com',
        photos: [
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1589156280132-a597389435e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
        ],
        bio: 'Data scientist and outdoor adventurer. Love rock climbing and exploring national parks.',
        location: 'Berkeley, California',
        interests: ['data science', 'rock climbing', 'outdoors', 'travel', 'books'],
        popularityPoints: 62,
        compatibilityScore: 68,
        gender: 'female',
        interestedIn: ['male'],
      },
    ];

    const mockMatches: Match[] = [
      {
        id: 'match1',
        userId1: 'user1',
        userId2: 'user2',
        matchDate: new Date(),
        status: 'matched',
        matchedUserId: 'user2',
        lastMessage: 'Hey Jamie, how are you?',
        lastMessageTime: new Date(),
      },
      {
        id: 'match2',
        userId1: 'user1',
        userId2: 'user3',
        matchDate: new Date(),
        status: 'matched',
        matchedUserId: 'user3',
        lastMessage: 'Hey Jordan, fancy a game night this weekend?',
        lastMessageTime: new Date(),
      },
    ];

    const mockMessages: Record<string, Message[]> = {
      user2: [
        {
          id: 'message1',
          senderId: 'user1',
          receiverId: 'user2',
          content: 'Hey Jamie, how are you?',
          timestamp: new Date(),
          read: true,
          type: 'text',
        },
        {
          id: 'message2',
          senderId: 'user2',
          receiverId: 'user1',
          content: 'Hi Alex, I am doing great! How about you?',
          timestamp: new Date(),
          read: true,
          type: 'text',
        },
      ],
      user3: [
        {
          id: 'message3',
          senderId: 'user1',
          receiverId: 'user3',
          content: 'Hey Jordan, fancy a game night this weekend?',
          timestamp: new Date(),
          read: false,
          type: 'text',
        },
      ],
    };
    
    const mockBlogPosts: BlogPostType[] = [
      {
        id: 'post1',
        userId: 'user1',
        title: 'My Dating Journey',
        content: 'Here\'s my experience with online dating so far...',
        createdAt: new Date(),
        likes: 5,
        comments: [
          {
            id: 'comment1',
            postId: 'post1',
            userId: 'user2',
            userName: 'Jamie Smith',
            content: 'Great post! I can relate to this.',
            createdAt: new Date(),
          }
        ],
        tags: ['dating', 'experience', 'online']
      },
      {
        id: 'post2',
        userId: 'user1',
        title: 'Dating Tips That Worked For Me',
        content: 'These are some tips that helped me improve my dating experience...',
        createdAt: new Date(),
        likes: 12,
        comments: [],
        tags: ['tips', 'advice', 'dating']
      }
    ];

    setCurrentUser(mockUser);
    setPotentialMatches(mockPotentialMatches);
    setBlogPosts(mockBlogPosts);
    
    const mockBoostedProfiles: BoostProfile[] = [
      {
        userId: 'user2',
        boostType: 'local',
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
      {
        userId: 'user4',
        boostType: 'international',
        startTime: new Date(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      },
    ];
    
    console.log("Setting boosted profiles:", mockBoostedProfiles);
    setBoostedProfiles(mockBoostedProfiles);
    
    setMatches(mockMatches);
    setMessages(mockMessages);
    
    const mockWithdrawals: WithdrawalType[] = [
      {
        id: 'w1',
        userId: 'user1',
        amount: 100,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: 'completed'
      },
      {
        id: 'w2',
        userId: 'user1',
        amount: 50,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        status: 'completed'
      }
    ];
    
    setWithdrawals(mockWithdrawals);
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    const user = await authService.login({ email, password });
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    const user = await authService.register(
      { email, password },
      { name, email }
    );
    
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const likeUser = (userId: string) => {
    if (!userId || !currentUser) {
      console.error("Invalid userId or currentUser is null");
      return;
    }
    
    setPotentialMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== userId)
    );
    
    setMatches((prevMatches) => [
      ...prevMatches,
      {
        id: `match-${userId}-${Date.now()}`,
        userId1: currentUser.id,
        userId2: userId,
        matchDate: new Date(),
        status: 'pending',
      },
    ]);
    
    toast.success('You liked this user!');
  };

  const passUser = (userId: string) => {
    if (!userId) {
      console.error("Invalid userId");
      return;
    }
    
    setPotentialMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== userId)
    );
    
    toast.message('You passed on this user.');
  };

  const sendMessage = (receiverId: string, content: string, type = 'text', giftType?: string) => {
    if (!receiverId || !content || !currentUser) {
      console.error("Invalid receiverId, content, or currentUser is null");
      return;
    }
    
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: receiverId,
      content: content,
      timestamp: new Date(),
      read: false,
      type: type as 'text' | 'gift',
      giftType: giftType,
    };

    setMessages((prevMessages) => ({
      ...prevMessages,
      [receiverId]: [...(prevMessages[receiverId] || []), newMessage],
    }));
    
    setMatches((prevMatches) => {
      return prevMatches.map(match => {
        if ((match.userId1 === currentUser.id && match.userId2 === receiverId) ||
            (match.userId2 === currentUser.id && match.userId1 === receiverId)) {
          return {
            ...match,
            lastMessage: content,
            lastMessageTime: new Date()
          };
        }
        return match;
      });
    });
  };

  const markMessagesAsRead = (userId: string) => {
    if (!userId) {
      console.error("Invalid userId");
      return;
    }
    
    setMessages((prevMessages) => ({
      ...prevMessages,
      [userId]: prevMessages[userId]?.map((message) => ({ ...message, read: true })) || [],
    }));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!updates) {
      console.error("Invalid updates");
      return;
    }
    
    setCurrentUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...updates };
        
        authService.updateUserData(updatedUser);
        
        return updatedUser;
      }
      return prevUser;
    });
  };

  const updateUserProfile = (updates: User) => {
    if (!updates) {
      console.error("Invalid updates");
      return;
    }
    
    setCurrentUser(updates);
    
    authService.updateUserData(updates);
    
    toast.success('Profile updated successfully!');
  };

  const boostProfile = (boostType: BoostType): boolean => {
    if (!currentUser) {
      toast.error("You must be logged in to boost your profile");
      return false;
    }
    
    console.log(`Boosting profile with type: ${boostType}`);
    
    const now = new Date();
    const endTime = new Date();
    
    if (boostType === 'local') {
      endTime.setHours(endTime.getHours() + 24); // 24 hours for local boost
    } else {
      endTime.setHours(endTime.getHours() + 48); // 48 hours for international boost
    }
    
    const newBoost: BoostProfile = {
      userId: currentUser.id,
      boostType,
      startTime: now,
      endTime: endTime,
    };
    
    setBoostedProfiles(prev => {
      const newBoostedProfiles = [...(prev || []), newBoost];
      console.log("Updated boosted profiles:", newBoostedProfiles);
      return newBoostedProfiles;
    });
    
    toast.success(`Profile boosted! (${boostType})`, {
      description: `Your profile will receive extra visibility until ${endTime.toLocaleString()}`,
    });
    
    return true;
  };
  
  const getGiftBenefits = () => {
    console.log("Getting gift benefits");
    const receivedGifts = currentUser?.receivedGifts || { rose: 0, heart: 0, teddy: 0 };
    
    const userBoost = boostedProfiles.find(
      boost => boost.userId === currentUser?.id && boost.endTime > new Date()
    );
    
    const boostTimeRemaining = userBoost 
      ? formatTimeRemaining(userBoost.endTime) 
      : null;
    
    return { 
      coins: 150, 
      boosts: 2,
      popularityPoints: 75,
      premiumLikes: 5,
      profileBoost: !!userBoost,
      boostTimeRemaining,
    };
  };
  
  const formatTimeRemaining = (endTime: Date): string => {
    const now = new Date();
    const diffMs = endTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  const redeemGift = (giftId: string) => {
    if (!giftId || !currentUser) {
      console.error("Invalid giftId or currentUser is null");
      return;
    }
    
    const giftBenefits = giftValues[giftId as keyof typeof giftValues];

    if (giftBenefits) {
      setCurrentUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            popularityPoints: (prevUser.popularityPoints || 0) + giftBenefits,
          };
        }
        return prevUser;
      });

      if (giftBenefits > 50) {
        boostProfile('local'); // Or implement a way to choose boost type
      }

      toast.success(`You redeemed a ${giftId}!`, {
        description: `You received ${giftBenefits} coins and boost benefits.`,
      });
    } else {
      toast.error('Invalid gift ID.');
    }
  };
  
  const updateMatchPreferences = (preferences: User['matchPreferences']) => {
    if (!preferences || !currentUser) {
      console.error("Invalid preferences or currentUser is null");
      return;
    }
    
    setCurrentUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, matchPreferences: preferences };
      }
      return prevUser;
    });
    
    toast.success('Match preferences updated!');
  };
  
  const createBlogPost = (title: string, content: string, tags: string[]) => {
    if (!title || !content || !currentUser) {
      console.error("Invalid blog post data or currentUser is null");
      return;
    }
    
    const newPost: BlogPostType = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      title,
      content,
      tags,
      createdAt: new Date(),
      likes: 0,
      comments: []
    };
    
    setBlogPosts(prev => [...prev, newPost]);
    toast.success("Blog post created successfully!");
  };
  
  const updateBlogPost = (postId: string, updates: { title?: string; content?: string; tags?: string[] }) => {
    if (!postId || !updates || !currentUser) {
      console.error("Invalid blog post update data or currentUser is null");
      return;
    }
    
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId && post.userId === currentUser.id) {
        return { ...post, ...updates };
      }
      return post;
    }));
    
    toast.success("Blog post updated successfully!");
  };
  
  const deleteBlogPost = (postId: string) => {
    if (!postId || !currentUser) {
      console.error("Invalid postId or currentUser is null");
      return;
    }
    
    setBlogPosts(prev => prev.filter(post => !(post.id === postId && post.userId === currentUser.id)));
    toast.success("Blog post deleted successfully!");
  };
  
  const likeBlogPost = (postId: string, userId: string) => {
    if (!postId || !userId) {
      console.error("Invalid postId or userId");
      return;
    }
    
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
    
    toast.success("You liked this post!");
  };
  
  const commentOnBlogPost = (postId: string, comment: string) => {
    if (!postId || !comment || !currentUser) {
      console.error("Invalid comment data or currentUser is null");
      return;
    }
    
    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: comment,
      createdAt: new Date()
    };
    
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
    
    toast.success("Comment added successfully!");
  };
  
  const getUserPosts = (userId: string): BlogPostType[] => {
    return blogPosts.filter(post => post.userId === userId);
  };
  
  const getAllPosts = (): BlogPostType[] => {
    return [...blogPosts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };
  
  const getFilteredPosts = (tag?: string): BlogPostType[] => {
    if (!tag) return getAllPosts();
    return blogPosts.filter(post => post.tags.includes(tag))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };
  
  const purchaseGifts = (gifts: Record<string, number>) => {
    if (!gifts || !currentUser) {
      console.error("Invalid gifts data or currentUser is null");
      return;
    }
    
    setCurrentUser(prevUser => {
      if (prevUser) {
        const currentInventory = prevUser.giftInventory || { rose: 0, heart: 0, teddy: 0 };
        const updatedInventory = {
          rose: (currentInventory.rose || 0) + (gifts.rose || 0),
          heart: (currentInventory.heart || 0) + (gifts.heart || 0),
          teddy: (currentInventory.teddy || 0) + (gifts.teddy || 0),
        };
        
        return { ...prevUser, giftInventory: updatedInventory };
      }
      return prevUser;
    });
    
    toast.success("Gifts purchased successfully!");
  };
  
  const getGiftInventory = () => {
    return currentUser?.giftInventory || { rose: 0, heart: 0, teddy: 0 };
  };
  
  const getGiftMonetizationDetails = () => {
    const receivedGifts = currentUser?.receivedGifts || { rose: 0, heart: 0, teddy: 0 };
    
    // Calculate available balance based on received gifts
    const availableBalance = 
      receivedGifts.rose * giftValues.rose + 
      receivedGifts.heart * giftValues.heart + 
      receivedGifts.teddy * giftValues.teddy;
    
    return {
      giftValues,
      minimumWithdrawal: 50,
      availableBalance,
      currency: 'USD',
      exchangeRates
    };
  };
  
  const initiateWithdrawal = (amount: number): boolean => {
    if (!currentUser) {
      toast.error("You must be logged in to initiate a withdrawal");
      return false;
    }
    
    const details = getGiftMonetizationDetails();
    if (amount > details.availableBalance) {
      toast.error("Insufficient balance for withdrawal");
      return false;
    }
    
    if (amount < details.minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is ${details.minimumWithdrawal} ${details.currency}`);
      return false;
    }
    
    const newWithdrawal: WithdrawalType = {
      id: `w-${Date.now()}`,
      userId: currentUser.id,
      amount,
      date: new Date(),
      status: 'pending'
    };
    
    setPendingWithdrawal(newWithdrawal);
    setWithdrawals(prev => [...prev, newWithdrawal]);
    
    toast.success("Withdrawal request initiated!", {
      description: "You will receive your funds soon."
    });
    
    return true;
  };
  
  const updateBankDetails = (details: User['bankDetails']) => {
    if (!details || !currentUser) {
      console.error("Invalid bank details or currentUser is null");
      return;
    }
    
    setCurrentUser(prevUser => {
      if (prevUser) {
        return { ...prevUser, bankDetails: details };
      }
      return prevUser;
    });
    
    toast.success("Bank details updated successfully!");
  };
  
  const getWithdrawalHistory = (): WithdrawalType[] => {
    return withdrawals;
  };
  
  const getPendingWithdrawal = (): WithdrawalType | null => {
    return pendingWithdrawal;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        potentialMatches,
        likeUser,
        passUser,
        matches,
        messages,
        sendMessage,
        markMessagesAsRead,
        updateProfile,
        boostProfile,
        boostedProfiles,
        getGiftBenefits,
        redeemGift,
        updateMatchPreferences,
        
        // Blog functions
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        likeBlogPost,
        commentOnBlogPost,
        getUserPosts,
        getAllPosts,
        getFilteredPosts,
        
        // Gift and monetization
        purchaseGifts,
        getGiftInventory,
        getGiftMonetizationDetails,
        initiateWithdrawal,
        updateBankDetails,
        getWithdrawalHistory,
        getPendingWithdrawal,
        
        // Auth functions
        setCurrentUser,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
