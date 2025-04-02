import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Message, UserPreferences, BlogPostType, BlogComment } from '@/types/user';
import { calculateCompatibilityScore } from '@/utils/matchingAlgorithm';

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updateProfileField: <K extends keyof User>(field: K, value: User[K]) => Promise<boolean>;
  isAuthenticated: boolean;
  isLookingFor: (gender: 'male' | 'female' | 'non-binary') => boolean;
  activateAccount: (activationCode: string) => Promise<boolean>;
  isAdmin: boolean;
  isModerator: boolean;
  isVIP: boolean;
  getCompatibilityScore: (user1: User, user2: User) => number;
  likeProfile: (userId: string) => void;
  passProfile: (userId: string) => void;
  allUsers: User[];
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  potentialMatches: User[];
  matches: User[];
  messages: Message[];
  sendMessage: (recipientId: string, content: string) => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  getGiftBenefits: () => Record<string, number>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  sendGift: (recipientId: string, giftType: 'rose' | 'heart' | 'teddy') => Promise<boolean>;
  uploadVoiceIntro: (audioBlob: Blob) => Promise<string>;
  getVoiceIntro: (userId: string) => Promise<string | null>;
  boostProfile: (level: 'local' | 'international' | 'super') => boolean;
  uploadProfilePhoto: (file: File) => Promise<string>;
  deleteProfilePhoto: (photoUrl: string) => Promise<boolean>;
  updateLocation: (lat: number, lng: number) => Promise<boolean>;
  reportUser: (userId: string, reason: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  sendVerificationRequest: () => Promise<boolean>;
  withdrawBalance: (amount: number, bankDetails: User['bankDetails']) => Promise<boolean>;
  getBalance: () => number;
  getWithdrawalHistory: () => Array<{ amount: number; date: Date; status: string }>;
  getPendingWithdrawal: () => { amount: number; date: Date } | null;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  getUser: (userId: string) => Promise<User | null>;
  allMessages: Message[];
  updateUserData: (userId: string, data: Partial<User>) => Promise<boolean>;
  createBlogPost: (post: Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => Promise<boolean>;
  updateBlogPost: (postId: string, data: Partial<BlogPostType>) => Promise<boolean>;
  deleteBlogPost: (postId: string) => Promise<boolean>;
  likeBlogPost: (postId: string) => Promise<boolean>;
  commentOnBlogPost: (postId: string, comment: string) => Promise<boolean>;
  getUserPosts: (userId: string) => Promise<BlogPostType[]>;
  getAllPosts: () => Promise<BlogPostType[]>;
  getFilteredPosts: (filter: string) => Promise<BlogPostType[]>;
  getGiftInventory: () => { rose: number; heart: number; teddy: number };
  purchaseGifts: (giftType: 'rose' | 'heart' | 'teddy', quantity: number) => Promise<boolean>;
  initiateVideoCall: (userId: string) => Promise<boolean>;
  endVideoCall: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  getProfileById: (userId: string) => Promise<User | null>;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  updateProfileField: async () => false,
  isAuthenticated: false,
  isLookingFor: () => false,
  activateAccount: async () => false,
  isAdmin: false,
  isModerator: false,
  isVIP: false,
  getCompatibilityScore: () => 0,
  likeProfile: () => {},
  passProfile: () => {},
  allUsers: [],
  likeUser: () => {},
  passUser: () => {},
  potentialMatches: [],
  matches: [],
  messages: [],
  sendMessage: () => {},
  markMessagesAsRead: () => {},
  updateUserProfile: async () => false,
  getGiftBenefits: () => ({}),
  resetPassword: async () => false,
  changePassword: async () => false,
  sendGift: async () => false,
  uploadVoiceIntro: async () => '',
  getVoiceIntro: async () => null,
  boostProfile: () => false,
  uploadProfilePhoto: async () => '',
  deleteProfilePhoto: async () => false,
  updateLocation: async () => false,
  reportUser: async () => false,
  blockUser: async () => false,
  unblockUser: async () => false,
  sendVerificationRequest: async () => false,
  withdrawBalance: async () => false,
  getBalance: () => 0,
  getWithdrawalHistory: () => [],
  getPendingWithdrawal: () => null,
  updatePreferences: async () => false,
  getUser: async () => null,
  allMessages: [],
  updateUserData: async () => false,
  createBlogPost: async () => false,
  updateBlogPost: async () => false,
  deleteBlogPost: async () => false,
  likeBlogPost: async () => false,
  commentOnBlogPost: async () => false,
  getUserPosts: async () => [],
  getAllPosts: async () => [],
  getFilteredPosts: async () => [],
  getGiftInventory: () => ({ rose: 0, heart: 0, teddy: 0 }),
  purchaseGifts: async () => false,
  initiateVideoCall: async () => false,
  endVideoCall: () => {},
  addUser: async () => false,
  deleteUser: async () => false,
  getProfileById: async () => null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      age: 28,
      bio: 'Software Engineer',
      location: 'New York',
      interests: ['coding', 'hiking', 'reading'],
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80'],
      gender: 'female',
      interestedIn: ['male', 'non-binary'],
      popularityPoints: 150,
      premiumStatus: 'basic',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: ['kind', 'funny'],
      role: 'subscriber',
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
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      age: 32,
      bio: 'Data Scientist',
      location: 'Los Angeles',
      interests: ['data', 'movies', 'travel'],
      photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
      gender: 'male',
      interestedIn: ['female'],
      popularityPoints: 200,
      premiumStatus: 'premium',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: ['smart', 'adventurous'],
      role: 'subscriber',
      isBanned: false,
      verificationStatus: 'unverified',
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'offline',
      favoriteMusic: [],
      voiceIntro: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    },
    {
      id: '3',
      name: 'Charlie',
      email: 'charlie@example.com',
      age: 25,
      bio: 'UX Designer',
      location: 'San Francisco',
      interests: ['design', 'music', 'yoga'],
      photos: ['https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80'],
      gender: 'non-binary',
      interestedIn: ['male', 'female', 'non-binary'],
      popularityPoints: 120,
      premiumStatus: 'vip',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: ['creative', 'friendly'],
      role: 'subscriber',
      isBanned: false,
      verificationStatus: 'pending',
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'away',
      favoriteMusic: [],
      voiceIntro: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setCurrentUser({
        id: 'mock-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        bio: 'Software Engineer',
        location: 'New York',
        interests: ['coding', 'hiking', 'reading'],
        photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
        gender: 'male',
        interestedIn: ['female'],
        popularityPoints: 100,
        premiumStatus: 'basic',
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: ['kind', 'funny'],
        role: 'subscriber',
        isBanned: false,
        verificationStatus: 'unverified',
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
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        setCurrentUser({
          id: 'mock-user-id',
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 30,
          bio: 'Software Engineer',
          location: 'New York',
          interests: ['coding', 'hiking', 'reading'],
          photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
          gender: 'male',
          interestedIn: ['female'],
          popularityPoints: 100,
          premiumStatus: 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: ['kind', 'funny'],
          role: 'subscriber',
          isBanned: false,
          verificationStatus: 'unverified',
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
        });
        toast.success('Login successful!');
        navigate('/discover');
        resolve(true);
      }, 1000);
    });
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        setCurrentUser({
          id: 'mock-user-id',
          name: name,
          email: email,
          age: 30,
          bio: 'Software Engineer',
          location: 'New York',
          interests: ['coding', 'hiking', 'reading'],
          photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'],
          gender: 'male',
          interestedIn: ['female'],
          popularityPoints: 100,
          premiumStatus: 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: ['kind', 'funny'],
          role: 'subscriber',
          isBanned: false,
          verificationStatus: 'unverified',
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
        });
        toast.success('Registration successful!');
        navigate('/discover');
        resolve(true);
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('isLoggedIn');
        setCurrentUser(null);
        toast.success('Logout successful!');
        navigate('/login');
        resolve();
      }, 500);
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser((prev) => prev ? { ...prev, ...data } : null);
        toast.success('Profile updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const updateProfileField = async <K extends keyof User>(field: K, value: User[K]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser((prev) => prev ? { ...prev, [field]: value } : null);
        toast.success('Profile updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const isAuthenticated = !!currentUser;

  const isLookingFor = (gender: 'male' | 'female' | 'non-binary'): boolean => {
    return currentUser?.interestedIn?.includes(gender) || false;
  };

  const activateAccount = async (activationCode: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Account activated with code:', activationCode);
        toast.success('Account activated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  const isVIP = currentUser?.premiumStatus === 'vip';

  const getCompatibilityScore = (user1: User, user2: User): number => {
    return calculateCompatibilityScore(user1, user2);
  };

  const likeProfile = (userId: string): void => {
    console.log('Liked profile with ID:', userId);
    toast.success('Profile liked!');
  };

  const passProfile = (userId: string): void => {
    console.log('Passed profile with ID:', userId);
    toast.success('Profile passed!');
  };

  const likeUser = (userId: string): void => {
    console.log('Liked user with ID:', userId);
  };

  const passUser = (userId: string): void => {
    console.log('Passed user with ID:', userId);
  };

  const potentialMatches = allUsers.filter(user => user.id !== currentUser?.id);
  const matches = allUsers.filter(user => user.id !== currentUser?.id).slice(0, 3);

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser((prev) => prev ? { ...prev, ...data } : null);
        toast.success('Profile updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Password reset email sent to:', email);
        toast.success('Password reset email sent!');
        resolve(true);
      }, 500);
    });
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Password changed successfully!');
        toast.success('Password changed successfully!');
        resolve(true);
      }, 500);
    });
  };

  const sendGift = async (recipientId: string, giftType: 'rose' | 'heart' | 'teddy'): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Gift ${giftType} sent to user with ID: ${recipientId}`);
        toast.success(`Gift ${giftType} sent successfully!`);
        resolve(true);
      }, 500);
    });
  };

  const uploadVoiceIntro = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = 'https://example.com/voice-intro.mp3';
        console.log('Voice intro uploaded successfully!');
        toast.success('Voice intro uploaded successfully!');
        resolve(url);
      }, 500);
    });
  };

  const getVoiceIntro = async (userId: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Voice intro retrieved for user with ID:', userId);
        resolve('https://example.com/voice-intro.mp3');
      }, 500);
    });
  };

  const boostProfile = (level: 'local' | 'international' | 'super'): boolean => {
    console.log('Profile boosted with level:', level);
    toast.success(`Profile boosted with ${level} level!`);
    return true;
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = 'https://example.com/profile-photo.jpg';
        console.log('Profile photo uploaded successfully!');
        toast.success('Profile photo uploaded successfully!');
        resolve(url);
      }, 500);
    });
  };

  const deleteProfilePhoto = async (photoUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Profile photo deleted successfully!');
        toast.success('Profile photo deleted successfully!');
        resolve(true);
      }, 500);
    });
  };

  const updateLocation = async (lat: number, lng: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Location updated successfully!');
        toast.success('Location updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const reportUser = async (userId: string, reason: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`User with ID ${userId} reported for reason: ${reason}`);
        toast.success('User reported successfully!');
        resolve(true);
      }, 500);
    });
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User blocked successfully!');
        toast.success('User blocked successfully!');
        resolve(true);
      }, 500);
    });
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User unblocked successfully!');
        toast.success('User unblocked successfully!');
        resolve(true);
      }, 500);
    });
  };

  const sendVerificationRequest = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Verification request sent successfully!');
        toast.success('Verification request sent successfully!');
        resolve(true);
      }, 500);
    });
  };

  const withdrawBalance = async (amount: number, bankDetails: User['bankDetails']): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Withdrawal request sent for amount: ${amount}`);
        toast.success('Withdrawal request sent successfully!');
        resolve(true);
      }, 500);
    });
  };

  const getBalance = (): number => {
    return 100;
  };

  const getWithdrawalHistory = (): Array<{ amount: number; date: Date; status: string }> => {
    return [
      { amount: 50, date: new Date(), status: 'pending' },
      { amount: 20, date: new Date(), status: 'completed' },
    ];
  };

  const getPendingWithdrawal = (): { amount: number; date: Date } | null => {
    return { amount: 50, date: new Date() };
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser((prev) => prev && { ...prev, preferences: { ...prev.preferences, ...preferences } });
        toast.success('Preferences updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const getUser = async (userId: string): Promise<User | null> => {
    if (currentUser && currentUser.id === userId) {
      return currentUser;
    }

    const foundUser = allUsers.find(user => user.id === userId);
    return foundUser || null;
  };

  const allMessages: Message[] = messages;

  const sendMessage = (recipientId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || '',
      recipientId: recipientId,
      content,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    console.log("Sending message:", newMessage);
    toast.success("Message sent!");
  };

  const updateUserData = async (userId: string, data: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updating user ${userId} with data:`, data);
        if (userId === currentUser?.id) {
          setCurrentUser(prev => prev ? { ...prev, ...data } : null);
        }
        toast.success('User data updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const createBlogPost = async (post: Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Creating blog post:', post);
        toast.success('Blog post created successfully!');
        resolve(true);
      }, 500);
    });
  };

  const updateBlogPost = async (postId: string, data: Partial<BlogPostType>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updating blog post ${postId} with data:`, data);
        toast.success('Blog post updated successfully!');
        resolve(true);
      }, 500);
    });
  };

  const deleteBlogPost = async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Deleting blog post ${postId}`);
        toast.success('Blog post deleted successfully!');
        resolve(true);
      }, 500);
    });
  };

  const likeBlogPost = async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Liking blog post ${postId}`);
        toast.success('Blog post liked!');
        resolve(true);
      }, 500);
    });
  };

  const commentOnBlogPost = async (postId: string, comment: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Adding comment to blog post ${postId}:`, comment);
        toast.success('Comment added successfully!');
        resolve(true);
      }, 500);
    });
  };

  const getUserPosts = async (userId: string): Promise<BlogPostType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Getting posts for user ${userId}`);
        resolve([]);
      }, 500);
    });
  };

  const getAllPosts = async (): Promise<BlogPostType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Getting all blog posts');
        resolve([]);
      }, 500);
    });
  };

  const getFilteredPosts = async (filter: string): Promise<BlogPostType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Getting blog posts with filter: ${filter}`);
        resolve([]);
      }, 500);
    });
  };

  const getGiftInventory = () => {
    return currentUser?.giftInventory || { rose: 0, heart: 0, teddy: 0 };
  };

  const purchaseGifts = async (giftType: 'rose' | 'heart' | 'teddy', quantity: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Purchasing ${quantity} ${giftType}(s)`);
        toast.success(`${quantity} ${giftType}(s) purchased successfully!`);
        resolve(true);
      }, 500);
    });
  };

  const initiateVideoCall = async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Initiating video call with user ${userId}`);
        toast.success('Video call initiated!');
        resolve(true);
      }, 500);
    });
  };

  const endVideoCall = () => {
    console.log('Ending video call');
    toast.success('Video call ended');
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Adding new user:', user);
        toast.success('User added successfully!');
        resolve(true);
      }, 500);
    });
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Deleting user ${userId}`);
        toast.success('User deleted successfully!');
        resolve(true);
      }, 500);
    });
  };

  const getProfileById = async (userId: string): Promise<User | null> => {
    if (currentUser && currentUser.id === userId) {
      return currentUser;
    }

    const foundUser = allUsers.find(user => user.id === userId);
    return foundUser || null;
  };

  const contextValue: UserContextType = {
    currentUser,
    setCurrentUser,
    login,
    register,
    logout,
    updateProfile,
    updateProfileField,
    isAuthenticated,
    isLookingFor,
    activateAccount,
    isAdmin,
    isModerator,
    isVIP,
    getCompatibilityScore,
    likeProfile,
    passProfile,
    allUsers,
    likeUser,
    passUser,
    potentialMatches,
    matches,
    messages,
    sendMessage,
    markMessagesAsRead: (messageIds: string[]) => {
      console.log("Marking messages as read:", messageIds);
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? {...msg, isRead: true} : msg
      ));
    },
    updateUserProfile,
    getGiftBenefits: () => ({}),
    resetPassword,
    changePassword,
    sendGift,
    uploadVoiceIntro,
    getVoiceIntro,
    boostProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    updateLocation,
    reportUser,
    blockUser,
    unblockUser,
    sendVerificationRequest,
    withdrawBalance,
    getBalance,
    getWithdrawalHistory,
    getPendingWithdrawal,
    updatePreferences,
    getUser,
    allMessages,
    updateUserData,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    likeBlogPost,
    commentOnBlogPost,
    getUserPosts,
    getAllPosts,
    getFilteredPosts,
    getGiftInventory,
    purchaseGifts,
    initiateVideoCall,
    endVideoCall,
    addUser,
    deleteUser,
    getProfileById,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
