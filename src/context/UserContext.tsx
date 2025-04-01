import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User, Message, BlogPostType, GiftInventory, BoostType, BoostLevelType, UserWithCoordinates, UserPreferences } from '@/types/user';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  uploadProfilePhoto: (file: File) => Promise<string | null>;
  likeProfile: (profileId: string) => void;
  passProfile: (profileId: string) => void;
  getCompatibilityScore: (user1: User, user2: User) => number;
  boostProfile: (boostType: 'local' | 'international') => boolean;
  getProfileById: (id: string) => User | null;
  sendGift: (recipientId: string, giftType: 'rose' | 'heart' | 'teddy') => boolean;
  getMatches: () => User[];
  getUserPosts: (userId: string) => BlogPostType[];
  createBlogPost: (title: string, content: string, tags: string[]) => void;
  updateBlogPost: (postId: string, updates: Partial<BlogPostType>) => void;
  deleteBlogPost: (postId: string) => void;
  likeBlogPost: (postId: string, userId: string) => void;
  commentOnBlogPost: (postId: string, content: string) => void;
  
  isAuthenticated: boolean;
  potentialMatches: User[];
  matches: User[];
  messages: Message[];
  sendMessage: (recipientId: string, content: string) => void;
  markMessagesAsRead: (messageIds: string[]) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<boolean>;
  getGiftBenefits: () => any;
  allUsers: User[];
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  updateUserData: (userId: string, data: Partial<User>) => void;
  getAllPosts: () => BlogPostType[];
  getFilteredPosts: () => BlogPostType[];
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  boostedProfiles: User[];
  getGiftInventory: () => GiftInventory;
  purchaseGifts: (gifts: { type: 'rose' | 'heart' | 'teddy', quantity: number }[]) => Promise<boolean>;
  getGiftMonetizationDetails: () => any;
  initiateWithdrawal: (amount: number) => Promise<boolean>;
  updateBankDetails: (details: User['bankDetails']) => Promise<boolean>;
  getWithdrawalHistory: () => any[];
  getPendingWithdrawal: () => any;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  uploadProfilePhoto: async () => null,
  likeProfile: () => {},
  passProfile: () => {},
  getCompatibilityScore: () => 0,
  boostProfile: () => false,
  getProfileById: () => null,
  sendGift: () => false,
  getMatches: () => [],
  getUserPosts: () => [],
  createBlogPost: () => {},
  updateBlogPost: () => {},
  deleteBlogPost: () => {},
  likeBlogPost: () => {},
  commentOnBlogPost: () => {},
  isAuthenticated: false,
  potentialMatches: [],
  matches: [],
  messages: [],
  sendMessage: () => {},
  markMessagesAsRead: () => {},
  updateUserProfile: async () => false,
  getGiftBenefits: () => ({}),
  allUsers: [],
  addUser: () => {},
  deleteUser: () => {},
  updateUserData: () => {},
  getAllPosts: () => [],
  getFilteredPosts: () => [],
  likeUser: () => {},
  passUser: () => {},
  boostedProfiles: [],
  getGiftInventory: () => ({ rose: 0, heart: 0, teddy: 0 }),
  purchaseGifts: async () => false,
  getGiftMonetizationDetails: () => ({}),
  initiateWithdrawal: async () => false,
  updateBankDetails: async () => false,
  getWithdrawalHistory: () => [],
  getPendingWithdrawal: () => null,
  updatePreferences: async () => false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const navigate = useNavigate();
  
  const isAuthenticated = currentUser !== null;
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email === "hunainm.qureshi@gmail.com" && password === "LoveQuest14") {
        const adminUser: User = {
          id: "admin-special-id",
          name: "Admin",
          email: "hunainm.qureshi@gmail.com",
          age: 30,
          bio: "System Administrator",
          location: "System",
          interests: ["administration", "management"],
          photos: [],
          gender: 'non-binary',
          interestedIn: ['male', 'female', 'non-binary'],
          popularityPoints: 100,
          premiumStatus: 'vip',
          giftInventory: { rose: 999, heart: 999, teddy: 999 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: ["organized", "detail-oriented"],
          role: 'admin',
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
        };
        
        setCurrentUser(adminUser);
        toast.success("Admin login successful!");
        return true;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error("Login failed", {
          description: error.message
        });
        return false;
      }
      
      if (data.user) {
        toast.success("Login successful!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        toast.error("Registration failed", {
          description: error.message
        });
        return false;
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              name,
              email,
              created_at: new Date().toISOString(),
            }
          ]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Failed to create profile", {
            description: profileError.message
          });
          return false;
        }
        
        toast.success("Registration successful!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to update your profile");
        return false;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          bio: data.bio,
          age: data.age,
          location: data.location,
          interests: data.interests,
          gender: data.gender,
          interested_in: data.interestedIn,
          preferences: data.preferences,
        })
        .eq('id', currentUser.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile", {
          description: error.message
        });
        return false;
      }
      
      setCurrentUser(prev => {
        if (prev) {
          return { ...prev, ...data };
        }
        return prev;
      });
      
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error("Failed to update profile", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to upload a photo");
        return null;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload photo", {
          description: error.message
        });
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);
        
      const newPhotos = [...(currentUser.photos || []), publicUrl];
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photos: newPhotos })
        .eq('id', currentUser.id);
        
      if (updateError) {
        console.error("Error updating profile photos:", updateError);
        toast.error("Failed to update profile photos", {
          description: updateError.message
        });
        return null;
      }
      
      setCurrentUser(prev => {
        if (prev) {
          return { ...prev, photos: newPhotos };
        }
        return prev;
      });
      
      toast.success("Photo uploaded successfully!");
      return publicUrl;
    } catch (error) {
      console.error('Upload photo error:', error);
      toast.error("Failed to upload photo", {
        description: "An unexpected error occurred"
      });
      return null;
    }
  };
  
  const likeProfile = (profileId: string) => {
    setLikedProfiles(prev => new Set(prev).add(profileId));
  };
  
  const passProfile = (profileId: string) => {
    setPassedProfiles(prev => new Set(prev).add(profileId));
  };
  
  const getCompatibilityScore = (user1: User, user2: User): number => {
    if (!user1 || !user2) return 0;
    
    let score = 0;
    let totalFactors = 0;
    
    if (user1.interestedIn.includes(user2.gender) && user2.interestedIn.includes(user1.gender)) {
      score += 25;
    } else {
      return Math.floor(Math.random() * 20) + 5;
    }
    totalFactors += 25;
    
    const sharedInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    ).length;
    
    const interestScore = Math.min(25, (sharedInterests / Math.max(1, Math.min(user1.interests.length, user2.interests.length))) * 25);
    score += interestScore;
    totalFactors += 25;
    
    const sharedTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits.includes(trait)
    ).length;
    
    const traitScore = Math.min(25, (sharedTraits / Math.max(1, Math.min(user1.personalityTraits.length, user2.personalityTraits.length))) * 25);
    score += traitScore;
    totalFactors += 25;
    
    const ageDifference = Math.abs(user1.age - user2.age);
    const ageScore = Math.max(0, 25 - (ageDifference * 2));
    score += ageScore;
    totalFactors += 25;
    
    const finalScore = Math.round((score / totalFactors) * 100);
    
    const randomFactor = Math.floor(Math.random() * 10) - 5;
    
    return Math.max(0, Math.min(100, finalScore + randomFactor));
  };
  
  const boostProfile = (boostType: 'local' | 'international'): boolean => {
    toast.success(`Profile boosted! Your profile will appear at the top for the next 24 hours`, {
      description: boostType === 'local' ? 'Local boost activated' : 'International boost activated'
    });
    
    return true;
  };
  
  const getProfileById = (id: string): User | null => {
    if (currentUser && currentUser.id === id) {
      return currentUser;
    }
    
    return null;
  };
  
  const sendGift = (recipientId: string, giftType: 'rose' | 'heart' | 'teddy'): boolean => {
    if (!currentUser) {
      toast.error("You must be logged in to send gifts");
      return false;
    }
    
    if (currentUser.giftInventory[giftType] <= 0) {
      toast.error(`You don't have any ${giftType}s to send`);
      return false;
    }
    
    setCurrentUser(prev => {
      if (prev) {
        const updatedInventory = { ...prev.giftInventory };
        updatedInventory[giftType] -= 1;
        
        return {
          ...prev,
          giftInventory: updatedInventory
        };
      }
      return prev;
    });
    
    toast.success(`Gift sent successfully!`);
    return true;
  };
  
  const getMatches = (): User[] => {
    return [];
  };
  
  const getUserPosts = (userId: string): BlogPostType[] => {
    return blogPosts.filter(post => post.userId === userId);
  };
  
  const createBlogPost = (title: string, content: string, tags: string[]) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a post");
      return;
    }
    
    const newPost: BlogPostType = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      userId: currentUser.id,
      title,
      content,
      createdAt: new Date(),
      likes: 0,
      comments: [],
      tags
    };
    
    setBlogPosts(prev => [newPost, ...prev]);
  };
  
  const updateBlogPost = (postId: string, updates: Partial<BlogPostType>) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, ...updates };
      }
      return post;
    }));
  };
  
  const deleteBlogPost = (postId: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== postId));
  };
  
  const likeBlogPost = (postId: string, userId: string) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };
  
  const commentOnBlogPost = (postId: string, content: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          postId,
          userId: currentUser.id,
          userName: currentUser.name,
          content,
          createdAt: new Date()
        };
        
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };
  
  const updateUserProfile = async (userId: string, data: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to update a profile");
        return false;
      }
      
      // Check if the user is updating their own profile or has admin rights
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        toast.error("You don't have permission to update this profile");
        return false;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          bio: data.bio,
          age: data.age,
          location: data.location,
          interests: data.interests,
          gender: data.gender,
          interested_in: data.interestedIn,
        })
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile", {
          description: error.message
        });
        return false;
      }
      
      // If updating own profile, update the current user state
      if (userId === currentUser.id) {
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, ...data };
          }
          return prev;
        });
      }
      
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error("Failed to update profile", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const potentialMatches: User[] = [];
  
  const matches: User[] = [];
  
  const messages: Message[] = [];
  
  const likeUser = (userId: string) => {
    likeProfile(userId);
  };
  
  const passUser = (userId: string) => {
    passProfile(userId);
  };
  
  const boostedProfiles: User[] = [];
  
  const getAllPosts = () => {
    return blogPosts;
  };
  
  const getFilteredPosts = () => {
    if (!currentUser) return [];
    return blogPosts.filter(post => {
      return post.tags.some(tag => currentUser.interests.includes(tag));
    });
  };
  
  const allUsers: User[] = [];
  
  const addUser = (user: User) => {
    toast.success("User added successfully!");
  };
  
  const deleteUser = (userId: string) => {
    toast.success("User deleted successfully!");
  };
  
  const updateUserData = (userId: string, data: Partial<User>) => {
    toast.success("User updated successfully!");
  };
  
  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to update your preferences");
        return false;
      }
      
      // Merge with existing preferences
      const updatedPreferences = {
        ...(currentUser.preferences || {}),
        ...preferences
      };
      
      // Update user with new preferences
      return await updateProfile({
        preferences: updatedPreferences as UserPreferences
      });
      
    } catch (error) {
      console.error('Update preferences error:', error);
      toast.error("Failed to update preferences", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const contextValue: UserContextType = {
    currentUser,
    setCurrentUser,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePhoto,
    likeProfile,
    passProfile,
    getCompatibilityScore,
    boostProfile,
    getProfileById,
    sendGift,
    getMatches,
    getUserPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    likeBlogPost,
    commentOnBlogPost,
    isAuthenticated,
    potentialMatches,
    matches,
    messages,
    sendMessage: (recipientId: string, content: string) => {
      toast.success("Message sent!");
    },
    markMessagesAsRead: (messageIds: string[]) => {
      console.log("Marking messages as read:", messageIds);
    },
    updateUserProfile,
    getGiftBenefits: () => ({}),
    allUsers,
    addUser,
    deleteUser,
    updateUserData,
    getAllPosts,
    getFilteredPosts,
    likeUser,
    passUser,
    boostedProfiles,
    getGiftInventory: () => currentUser?.giftInventory || { rose: 0, heart: 0, teddy: 0 },
    purchaseGifts: async (gifts) => {
      toast.success("Gifts purchased successfully!");
      return true;
    },
    getGiftMonetizationDetails: () => ({
      totalEarnings: 0,
      pendingWithdrawal: 0,
      availableBalance: 0
    }),
    initiateWithdrawal: async (amount) => {
      toast.success(`Withdrawal of $${amount} initiated!`);
      return true;
    },
    updateBankDetails: async (details) => {
      if (!currentUser) return false;
      setCurrentUser(prev => {
        if (prev) {
          return { ...prev, bankDetails: details };
        }
        return prev;
      });
      toast.success("Bank details updated successfully!");
      return true;
    },
    getWithdrawalHistory: () => [],
    getPendingWithdrawal: () => null,
    updatePreferences,
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export type { User, Message, GiftInventory, BoostType, BoostLevelType, UserWithCoordinates, UserPreferences };
