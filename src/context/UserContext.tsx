import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

// Gift types
interface GiftInventory {
  rose: number;
  heart: number;
  teddy: number;
}

// Bank details type
interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode?: string;
  routingNumber?: string;
}

// Blog post type
export interface BlogPost {
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
}

// Message type
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  hasGift?: boolean;
  giftType?: keyof GiftInventory;
}

// Withdrawal type
export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: Date;
  processedDate?: Date;
  date?: Date; // For backward compatibility
}

// Boost type
export type BoostType = 'local' | 'international' | 'standard' | 'super';

// User interface
export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  bio?: string;
  location?: string;
  interests: string[];
  photos: string[];
  gender?: 'male' | 'female' | 'non-binary';
  interestedIn: ('male' | 'female' | 'non-binary')[];
  popularityPoints: number;
  premiumStatus: 'basic' | 'premium' | 'vip';
  giftInventory: GiftInventory;
  receivedGifts: GiftInventory;
  compatibilityScore?: number;
  role?: 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial';
  personalityTraits?: string[];
  favoriteMusic?: string;
  bankDetails?: BankDetails;
}

// Gift benefit type
interface GiftBenefits {
  popularityPoints: number;
  premiumLikes: number;
  profileBoost: boolean;
  boostTimeRemaining?: string;
}

// Monetization details type
interface MonetizationDetails {
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  conversionRate: number;
  giftsReceived: number;
  withdrawalFee: number;
  giftValues: {
    rose: number;
    heart: number;
    teddy: number;
  };
  minimumWithdrawal: number;
  currency: string;
  exchangeRates: {
    USD: number;
    EUR: number;
    GBP: number;
    JPY: number;
    CAD: number;
    AUD: number;
    CNY: number;
    INR: number;
  };
}

// Define the context structure
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => User | null;
  purchaseGift: (giftType: keyof GiftInventory) => boolean;
  sendGift: (toUserId: string, giftType: keyof GiftInventory) => boolean;
  boostProfile: (boostType: string) => boolean;
  allUsers: User[];
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  // Blog related methods
  createBlogPost: (title: string, content: string, tags: string[]) => BlogPost;
  updateBlogPost: (postId: string, updates: Partial<BlogPost>) => boolean;
  deleteBlogPost: (postId: string) => boolean;
  likeBlogPost: (postId: string, userId: string) => boolean;
  commentOnBlogPost: (postId: string, comment: string) => boolean;
  getUserPosts: (userId: string) => BlogPost[];
  getAllPosts: () => BlogPost[];
  getFilteredPosts: (tag?: string, searchTerm?: string) => BlogPost[];
  
  // User interaction methods
  updateUserProfile: (profile: User) => void;
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  potentialMatches: User[];
  matches: User[];
  boostedProfiles: {userId: string, boostType: string, startTime: Date, endTime: Date}[];
  
  // Messaging methods
  messages: Message[];
  sendMessage: (to: string, content: string, giftType?: keyof GiftInventory) => void;
  markMessagesAsRead: (userId: string) => void;
  
  // Gift and monetization methods
  getGiftBenefits: () => GiftBenefits;
  getGiftInventory: () => GiftInventory;
  purchaseGifts: (giftType: keyof GiftInventory, quantity: number) => boolean;
  getGiftMonetizationDetails: () => MonetizationDetails;
  initiateWithdrawal: (amount: number) => boolean;
  updateBankDetails: (details: BankDetails) => boolean;
  getWithdrawalHistory: () => Withdrawal[];
  getPendingWithdrawal: () => Withdrawal | null;
}

// Create context with defaults
const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: () => false,
  logout: () => {},
  updateUserData: () => null,
  purchaseGift: () => false,
  sendGift: () => false,
  boostProfile: () => false,
  allUsers: [],
  addUser: () => {},
  deleteUser: () => {},
  
  // Blog defaults
  createBlogPost: () => ({ id: '', userId: '', title: '', content: '', createdAt: new Date(), likes: 0, comments: [], tags: [] }),
  updateBlogPost: () => false,
  deleteBlogPost: () => false,
  likeBlogPost: () => false,
  commentOnBlogPost: () => false,
  getUserPosts: () => [],
  getAllPosts: () => [],
  getFilteredPosts: () => [],
  
  // User interaction defaults
  updateUserProfile: () => {},
  likeUser: () => {},
  passUser: () => {},
  potentialMatches: [],
  matches: [],
  boostedProfiles: [],
  
  // Messaging defaults
  messages: [],
  sendMessage: () => {},
  markMessagesAsRead: () => {},
  
  // Gift and monetization defaults
  getGiftBenefits: () => ({ popularityPoints: 0, premiumLikes: 0, profileBoost: false }),
  getGiftInventory: () => ({ rose: 0, heart: 0, teddy: 0 }),
  purchaseGifts: () => false,
  getGiftMonetizationDetails: () => ({ 
    totalEarned: 0, 
    availableBalance: 0, 
    pendingBalance: 0, 
    conversionRate: 0,
    giftsReceived: 0,
    withdrawalFee: 0,
    giftValues: {
      rose: 0.25,
      heart: 0.75,
      teddy: 1.5
    },
    minimumWithdrawal: 10,
    currency: 'USD',
    exchangeRates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.25,
      CAD: 1.25,
      AUD: 1.35,
      CNY: 6.5,
      INR: 73.5
    }
  }),
  initiateWithdrawal: () => false,
  updateBankDetails: () => false,
  getWithdrawalHistory: () => [],
  getPendingWithdrawal: () => null
});

// Mock user data for demo purposes
const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Jessica Parker',
    email: 'jessica@example.com',
    age: 28,
    bio: 'Adventure enthusiast and coffee lover. Looking for someone who enjoys hiking and travel.',
    location: 'New York, NY',
    interests: ['hiking', 'travel', 'photography', 'cooking'],
    photos: ['/placeholder.svg'],
    gender: 'female',
    interestedIn: ['male'],
    popularityPoints: 85,
    premiumStatus: 'basic',
    giftInventory: { rose: 3, heart: 1, teddy: 0 },
    receivedGifts: { rose: 5, heart: 2, teddy: 1 },
    compatibilityScore: 89,
    role: 'subscriber'
  },
  {
    id: 'user2',
    name: 'Michael Ross',
    email: 'michael@example.com',
    age: 32,
    bio: 'Tech entrepreneur with a passion for music and fitness. Looking for someone genuine and adventurous.',
    location: 'San Francisco, CA',
    interests: ['music', 'fitness', 'technology', 'startups'],
    photos: ['/placeholder.svg'],
    gender: 'male',
    interestedIn: ['female'],
    popularityPoints: 92,
    premiumStatus: 'premium',
    giftInventory: { rose: 10, heart: 5, teddy: 2 },
    receivedGifts: { rose: 3, heart: 1, teddy: 0 },
    compatibilityScore: 75,
    role: 'subscriber'
  },
  {
    id: 'user3',
    name: 'Admin User',
    email: 'admin@example.com',
    age: 35,
    bio: 'System administrator and platform manager.',
    location: 'San Jose, CA',
    interests: ['technology', 'management', 'security'],
    photos: ['/placeholder.svg'],
    gender: 'non-binary',
    interestedIn: ['male', 'female', 'non-binary'],
    popularityPoints: 50,
    premiumStatus: 'vip',
    giftInventory: { rose: 50, heart: 50, teddy: 50 },
    receivedGifts: { rose: 0, heart: 0, teddy: 0 },
    compatibilityScore: 50,
    role: 'admin'
  },
  {
    id: 'user4',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    age: 26,
    bio: 'Art teacher and painter. Love outdoor activities and quiet evenings with good books.',
    location: 'Portland, OR',
    interests: ['art', 'reading', 'hiking', 'teaching'],
    photos: ['/placeholder.svg'],
    gender: 'female',
    interestedIn: ['male'],
    popularityPoints: 78,
    premiumStatus: 'basic',
    giftInventory: { rose: 1, heart: 0, teddy: 0 },
    receivedGifts: { rose: 8, heart: 3, teddy: 1 },
    compatibilityScore: 82,
    role: 'subscriber'
  },
  {
    id: 'user5',
    name: 'David Chen',
    email: 'david@example.com',
    age: 30,
    bio: 'Software engineer by day, amateur chef by night. Looking for someone to share culinary adventures.',
    location: 'Seattle, WA',
    interests: ['coding', 'cooking', 'food', 'hiking'],
    photos: ['/placeholder.svg'],
    gender: 'male',
    interestedIn: ['female'],
    popularityPoints: 65,
    premiumStatus: 'premium',
    giftInventory: { rose: 5, heart: 2, teddy: 1 },
    receivedGifts: { rose: 1, heart: 0, teddy: 0 },
    compatibilityScore: 71,
    role: 'subscriber'
  }
];

// Mock blog posts
const sampleBlogPosts: BlogPost[] = [
  {
    id: 'post1',
    userId: 'user1',
    title: 'My Dating Journey',
    content: 'Dating has been an incredible journey of self-discovery. Through meeting new people, I\'ve learned so much about myself and what I truly value in relationships.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likes: 24,
    comments: [
      {
        id: 'comment1',
        postId: 'post1',
        userId: 'user2',
        userName: 'Michael Ross',
        content: 'Thanks for sharing your journey! I can relate to a lot of what you\'ve experienced.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }
    ],
    tags: ['dating', 'relationships', 'personal-growth']
  },
  {
    id: 'post2',
    userId: 'user2',
    title: '5 First Date Tips That Actually Work',
    content: 'First dates can be nerve-wracking, but with these tips, you\'ll be sure to make a great impression and possibly find your perfect match!\n\n1. Be authentic\n2. Ask open-ended questions\n3. Listen actively\n4. Choose a comfortable setting\n5. End on a positive note',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    likes: 56,
    comments: [],
    tags: ['dating-advice', 'first-date', 'tips']
  }
];

// Mock messages
const sampleMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'Hi there! I really enjoyed looking at your profile. Would you like to chat?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 'msg2',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'Hello! Thanks for reaching out. I\'d love to get to know you better. What are your interests?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: false
  }
];

// Boosted profiles
interface BoostedProfile {
  userId: string;
  boostType: string;
  startTime: Date;
  endTime: Date;
}

// User Provider Component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.info('Initializing UserProvider');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [boostedProfiles, setBoostedProfiles] = useState<BoostedProfile[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [matches, setMatches] = useState<User[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  
  useEffect(() => {
    // Initialize from auth service or localStorage
    const loadUser = async () => {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    
    loadUser();
    
    // Load mock data for demo
    console.info('Loading mock data in UserProvider');
    const savedUsers = localStorage.getItem('allUsers');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      setAllUsers(sampleUsers);
      localStorage.setItem('allUsers', JSON.stringify(sampleUsers));
    }
    
    // Initialize blog posts
    setBlogPosts(sampleBlogPosts);
    
    // Initialize messages
    setMessages(sampleMessages);
    
    // Set up potential matches (all users except current user)
    setPotentialMatches(sampleUsers.filter(user => user.id !== currentUser?.id));
    
    // Set up matches (sample for demo)
    setMatches([sampleUsers[0], sampleUsers[2]]);
    
    // Set up some demo boosted profiles
    const boostedUsers: BoostedProfile[] = [
      {
        userId: 'user2',
        boostType: 'local',
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      },
      {
        userId: 'user4',
        boostType: 'international',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      }
    ];
    console.info('Setting boosted profiles:', boostedUsers);
    setBoostedProfiles(boostedUsers);
  }, []);
  
  // Save users when they change
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  }, [allUsers]);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;
  };
  
  // Handle logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success('You have been logged out successfully');
  };
  
  // Update user data
  const updateUserData = (userData: Partial<User>) => {
    if (!currentUser) return null;
    
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    
    // Also update in allUsers
    setAllUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    return updatedUser;
  };
  
  // Update user profile
  const updateUserProfile = (profile: User) => {
    setCurrentUser(profile);
    
    // Also update in allUsers
    setAllUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === profile.id ? profile : user
      )
    );
    
    toast.success('Profile updated successfully');
  };
  
  // Purchase a gift
  const purchaseGift = (giftType: keyof GiftInventory): boolean => {
    if (!currentUser) return false;
    
    // In a real app, this would be a payment flow
    // For demo, just add it to inventory
    const updatedInventory = { 
      ...currentUser.giftInventory,
      [giftType]: currentUser.giftInventory[giftType] + 1 
    };
    
    setCurrentUser({
      ...currentUser,
      giftInventory: updatedInventory
    });
    
    toast.success(`You purchased a ${giftType}!`);
    return true;
  };
  
  // Purchase multiple gifts
  const purchaseGifts = (giftType: keyof GiftInventory, quantity: number): boolean => {
    if (!currentUser) return false;
    
    const updatedInventory = { 
      ...currentUser.giftInventory,
      [giftType]: currentUser.giftInventory[giftType] + quantity 
    };
    
    setCurrentUser({
      ...currentUser,
      giftInventory: updatedInventory
    });
    
    toast.success(`You purchased ${quantity} ${giftType}s!`);
    return true;
  };
  
  // Get gift inventory
  const getGiftInventory = (): GiftInventory => {
    return currentUser?.giftInventory || { rose: 0, heart: 0, teddy: 0 };
  };
  
  // Send a gift to another user
  const sendGift = (toUserId: string, giftType: keyof GiftInventory): boolean => {
    if (!currentUser) return false;
    if (currentUser.giftInventory[giftType] <= 0) {
      toast.error(`You don't have any ${giftType}s to send!`);
      return false;
    }
    
    // Update sender's inventory
    const updatedSender = {
      ...currentUser,
      giftInventory: {
        ...currentUser.giftInventory,
        [giftType]: currentUser.giftInventory[giftType] - 1
      }
    };
    setCurrentUser(updatedSender);
    
    // Update recipient's received gifts
    setAllUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === toUserId) {
          return {
            ...user,
            receivedGifts: {
              ...user.receivedGifts,
              [giftType]: user.receivedGifts[giftType] + 1
            },
            popularityPoints: user.popularityPoints + 5 // Gift increases popularity
          };
        }
        return user;
      })
    );
    
    toast.success(`Gift sent successfully!`);
    return true;
  };
  
  // Get gift benefits
  const getGiftBenefits = (): GiftBenefits => {
    if (!currentUser) {
      return {
        popularityPoints: 0,
        premiumLikes: 0,
        profileBoost: false
      };
    }
    
    // Calculate based on gifts received
    const totalGifts = currentUser.receivedGifts.rose + 
                      currentUser.receivedGifts.heart * 2 + 
                      currentUser.receivedGifts.teddy * 3;
    
    const isProfileBoosted = boostedProfiles.some(profile => profile.userId === currentUser.id);
    
    const boostProfile = boostedProfiles.find(profile => profile.userId === currentUser.id);
    const timeRemaining = boostProfile ? 
      Math.max(0, Math.floor((boostProfile.endTime.getTime() - Date.now()) / (1000 * 60 * 60))) + " hours" 
      : undefined;
    
    return {
      popularityPoints: totalGifts * 5,
      premiumLikes: Math.floor(totalGifts / 3),
      profileBoost: isProfileBoosted,
      boostTimeRemaining: timeRemaining
    };
  };
  
  // Boost user profile
  const boostProfile = (boostType: string): boolean => {
    if (!currentUser) return false;
    
    // In a real app, this would involve payment processing
    // For demo, just add the boost
    const boost: BoostedProfile = {
      userId: currentUser.id,
      boostType,
      startTime: new Date(),
      endTime: new Date(Date.now() + (boostType === 'international' ? 2 : 1) * 24 * 60 * 60 * 1000)
    };
    
    setBoostedProfiles([...boostedProfiles, boost]);
    toast.success(`Your profile has been boosted!`);
    return true;
  };
  
  // Like user
  const likeUser = (userId: string) => {
    // In a real app, we would create a like in the database
    // For demo, just show a toast
    toast.success(`You liked this user!`);
    
    // Simulate a match (50% chance)
    if (Math.random() > 0.5) {
      const matchedUser = allUsers.find(user => user.id === userId);
      if (matchedUser && !matches.some(match => match.id === userId)) {
        setMatches([...matches, matchedUser]);
        toast.success(`It's a match! You and ${matchedUser.name} have liked each other.`);
      }
    }
  };
  
  // Pass on user
  const passUser = (userId: string) => {
    // In a real app, we would record this pass in the database
    // For demo, just show a toast
    toast.success(`You passed on this user.`);
  };
  
  // Send message
  const sendMessage = (to: string, content: string, giftType?: keyof GiftInventory) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: to,
      content,
      timestamp: new Date(),
      isRead: false,
      hasGift: !!giftType,
      giftType
    };
    
    setMessages([...messages, newMessage]);
    
    // If sending a gift, deduct from inventory
    if (giftType && currentUser.giftInventory[giftType] > 0) {
      sendGift(to, giftType);
    }
    
    toast.success(`Message sent!`);
  };
  
  // Mark messages as read
  const markMessagesAsRead = (userId: string) => {
    if (!currentUser) return;
    
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.senderId === userId && message.receiverId === currentUser.id && !message.isRead) {
          return { ...message, isRead: true };
        }
        return message;
      })
    );
  };
  
  // Blog functions
  const createBlogPost = (title: string, content: string, tags: string[]): BlogPost => {
    if (!currentUser) {
      toast.error('You must be logged in to create a post');
      return {
        id: '',
        userId: '',
        title: '',
        content: '',
        createdAt: new Date(),
        likes: 0,
        comments: [],
        tags: []
      };
    }
    
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      title,
      content,
      createdAt: new Date(),
      likes: 0,
      comments: [],
      tags
    };
    
    setBlogPosts([newPost, ...blogPosts]);
    return newPost;
  };
  
  const updateBlogPost = (postId: string, updates: Partial<BlogPost>): boolean => {
    if (!currentUser) return false;
    
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return false;
    
    const post = blogPosts[postIndex];
    if (post.userId !== currentUser.id) {
      toast.error('You can only edit your own posts');
      return false;
    }
    
    const updatedPost = { ...post, ...updates };
    const updatedPosts = [...blogPosts];
    updatedPosts[postIndex] = updatedPost;
    
    setBlogPosts(updatedPosts);
    return true;
  };
  
  const deleteBlogPost = (postId: string): boolean => {
    if (!currentUser) return false;
    
    const post = blogPosts.find(post => post.id === postId);
    if (!post) return false;
    
    if (post.userId !== currentUser.id && currentUser.role !== 'admin') {
      toast.error('You can only delete your own posts');
      return false;
    }
    
    setBlogPosts(blogPosts.filter(post => post.id !== postId));
    return true;
  };
  
  const likeBlogPost = (postId: string, userId: string): boolean => {
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return false;
    
    const post = blogPosts[postIndex];
    const updatedPost = { ...post, likes: post.likes + 1 };
    
    const updatedPosts = [...blogPosts];
    updatedPosts[postIndex] = updatedPost;
    
    setBlogPosts(updatedPosts);
    return true;
  };
  
  const commentOnBlogPost = (postId: string, comment: string): boolean => {
    if (!currentUser) return false;
    
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    if (postIndex === -1) return false;
    
    const post = blogPosts[postIndex];
    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: comment,
      createdAt: new Date()
    };
    
    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment]
    };
    
    const updatedPosts = [...blogPosts];
    updatedPosts[postIndex] = updatedPost;
    
    setBlogPosts(updatedPosts);
    return true;
  };
  
  const getUserPosts = (userId: string): BlogPost[] => {
    return blogPosts.filter(post => post.userId === userId);
  };
  
  const getAllPosts = (): BlogPost[] => {
    return blogPosts;
  };
  
  const getFilteredPosts = (tag?: string, searchTerm?: string): BlogPost[] => {
    let filtered = blogPosts;
    
    if (tag) {
      filtered = filtered.filter(post => post.tags.includes(tag));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post => post.title.toLowerCase().includes(term) || 
                post.content.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const getGiftMonetizationDetails = (): MonetizationDetails => {
    if (!currentUser) {
      return {
        totalEarned: 0,
        availableBalance: 0,
        pendingBalance: 0,
        conversionRate: 0,
        giftsReceived: 0,
        withdrawalFee: 0,
        giftValues: {
          rose: 0.25,
          heart: 0.75,
          teddy: 1.5
        },
        minimumWithdrawal: 10,
        currency: 'USD',
        exchangeRates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.25,
          CAD: 1.25,
          AUD: 1.35,
          CNY: 6.5,
          INR: 73.5
        }
      };
    }
    
    // Calculate based on gifts received
    const roses = currentUser.receivedGifts.rose;
    const hearts = currentUser.receivedGifts.heart;
    const teddies = currentUser.receivedGifts.teddy;
    
    const totalGifts = roses + hearts + teddies;
    const conversionRate = 0.5; // $0.50 per gift
    
    const totalEarned = roses * 0.25 + hearts * 0.75 + teddies * 1.5;
    const pendingBalance = totalEarned * 0.2; // 20% pending
    const availableBalance = totalEarned - pendingBalance;
    
    return {
      totalEarned,
      availableBalance,
      pendingBalance,
      conversionRate,
      giftsReceived: totalGifts,
      withdrawalFee: 1.0, // $1.00 fee
      giftValues: {
        rose: 0.25,
        heart: 0.75,
        teddy: 1.5
      },
      minimumWithdrawal: 10,
      currency: 'USD',
      exchangeRates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.25,
        CAD: 1.25,
        AUD: 1.35,
        CNY: 6.5,
        INR: 73.5
      }
    };
  };
  
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  
  const initiateWithdrawal = (amount: number): boolean => {
    if (!currentUser) return false;
    
    const monetizationDetails = getGiftMonetizationDetails();
    if (amount > monetizationDetails.availableBalance) {
      toast.error('Insufficient balance');
      return false;
    }
    
    const newWithdrawal: Withdrawal = {
      id: `withdrawal-${Date.now()}`,
      userId: currentUser.id,
      amount,
      status: 'pending',
      requestDate: new Date()
    };
    
    setWithdrawals([...withdrawals, newWithdrawal]);
    toast.success(`Withdrawal request for $${amount.toFixed(2)} initiated`);
    return true;
  };
  
  const updateBankDetails = (details: BankDetails): boolean => {
    if (!currentUser) return false;
    
    setCurrentUser({
      ...currentUser,
      bankDetails: details
    });
    
    toast.success('Bank details updated successfully');
    return true;
  };
  
  const getWithdrawalHistory = (): Withdrawal[] => {
    if (!currentUser) return [];
    
    return withdrawals.filter(withdrawal => withdrawal.userId === currentUser.id);
  };
  
  const getPendingWithdrawal = (): Withdrawal | null => {
    if (!currentUser) return null;
    
    return withdrawals.find(
      withdrawal => withdrawal.userId === currentUser.id && withdrawal.status === 'pending'
    ) || null;
  };
  
  // Add a new user to the system (admin function)
  const addUser = (user: User) => {
    setAllUsers(prevUsers => [...prevUsers, user]);
  };
  
  // Delete a user from the system (admin function)
  const deleteUser = (userId: string) => {
    setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAuthenticated,
      logout,
      updateUserData,
      purchaseGift,
      sendGift,
