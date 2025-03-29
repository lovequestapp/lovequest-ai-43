
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

// Define the shape of our context
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
}

// Blog post type for the context
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

// Create the context with a default value
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
});

// Create a provider component
export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const navigate = useNavigate();
  
  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
  
  // Register a new user
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
        // Create a profile record
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
  
  // Logout the user
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
  
  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to update your profile");
        return false;
      }
      
      // Update the profile in Supabase
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
          // Add other fields as needed
        })
        .eq('id', currentUser.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile", {
          description: error.message
        });
        return false;
      }
      
      // Update the local user state
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
  
  // Upload profile photo
  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to upload a photo");
        return null;
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;
      
      // Upload the file to Supabase Storage
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
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);
        
      // Update the user's photos array
      const newPhotos = [...(currentUser.photos || []), publicUrl];
      
      // Update the profile in Supabase
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
      
      // Update the local user state
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
  
  // Like a profile
  const likeProfile = (profileId: string) => {
    setLikedProfiles(prev => new Set(prev).add(profileId));
    
    // In a real app, you would also update this on the server
    // Here we're just updating local state for demo purposes
    
    // Example Supabase code for a real implementation:
    /*
    const createLike = async () => {
      if (!currentUser) return;
      
      const { error } = await supabase
        .from('likes')
        .insert([
          {
            user_id: currentUser.id,
            liked_user_id: profileId,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (error) {
        console.error("Error creating like:", error);
        toast.error("Failed to like profile");
      }
    };
    
    createLike();
    */
  };
  
  // Pass on a profile
  const passProfile = (profileId: string) => {
    setPassedProfiles(prev => new Set(prev).add(profileId));
    
    // In a real app, you would also update this on the server
    // Here we're just updating local state for demo purposes
  };
  
  // Calculate compatibility score between two users
  const getCompatibilityScore = (user1: User, user2: User): number => {
    if (!user1 || !user2) return 0;
    
    let score = 0;
    let totalFactors = 0;
    
    // Check mutual interest in gender
    if (user1.interestedIn.includes(user2.gender) && user2.interestedIn.includes(user1.gender)) {
      score += 25;
    } else {
      // If there's no mutual gender interest, compatibility is very low
      return Math.floor(Math.random() * 20) + 5;
    }
    totalFactors += 25;
    
    // Compare interests (each shared interest adds points)
    const sharedInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    ).length;
    
    const interestScore = Math.min(25, (sharedInterests / Math.max(1, Math.min(user1.interests.length, user2.interests.length))) * 25);
    score += interestScore;
    totalFactors += 25;
    
    // Compare personality traits
    const sharedTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits.includes(trait)
    ).length;
    
    const traitScore = Math.min(25, (sharedTraits / Math.max(1, Math.min(user1.personalityTraits.length, user2.personalityTraits.length))) * 25);
    score += traitScore;
    totalFactors += 25;
    
    // Age compatibility (closer in age = higher score)
    const ageDifference = Math.abs(user1.age - user2.age);
    const ageScore = Math.max(0, 25 - (ageDifference * 2)); // Lose 2 points per year difference
    score += ageScore;
    totalFactors += 25;
    
    // Calculate final percentage
    const finalScore = Math.round((score / totalFactors) * 100);
    
    // Add a small random factor for variability
    const randomFactor = Math.floor(Math.random() * 10) - 5; // -5 to +5
    
    return Math.max(0, Math.min(100, finalScore + randomFactor));
  };
  
  // Boost profile visibility
  const boostProfile = (boostType: 'local' | 'international'): boolean => {
    // In a real app, this would integrate with a payment system and update server-side
    // For demo purposes, we'll just show a success message
    
    toast.success(`Profile boosted! Your profile will appear at the top for the next 24 hours`, {
      description: boostType === 'local' ? 'Local boost activated' : 'International boost activated'
    });
    
    return true;
  };
  
  // Get a profile by ID
  const getProfileById = (id: string): User | null => {
    // In a real app, this would fetch from the database
    // For demo purposes, we'll return null or the current user if IDs match
    
    if (currentUser && currentUser.id === id) {
      return currentUser;
    }
    
    // Later, this could be enhanced to return profiles from the explore page
    // that have been loaded into memory
    
    return null;
  };
  
  // Send a gift to another user
  const sendGift = (recipientId: string, giftType: 'rose' | 'heart' | 'teddy'): boolean => {
    if (!currentUser) {
      toast.error("You must be logged in to send gifts");
      return false;
    }
    
    // Check if user has the gift
    if (currentUser.giftInventory[giftType] <= 0) {
      toast.error(`You don't have any ${giftType}s to send`);
      return false;
    }
    
    // In a real app, this would update the database
    // For demo purposes, just update the local state
    
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
  
  // Get user's matches
  const getMatches = (): User[] => {
    // In a real app, this would fetch from the database
    // For demo purposes, return an empty array
    return [];
  };
  
  // Get posts by user ID
  const getUserPosts = (userId: string): BlogPostType[] => {
    return blogPosts.filter(post => post.userId === userId);
  };
  
  // Create a new blog post
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
  
  // Update a blog post
  const updateBlogPost = (postId: string, updates: Partial<BlogPostType>) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, ...updates };
      }
      return post;
    }));
  };
  
  // Delete a blog post
  const deleteBlogPost = (postId: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== postId));
  };
  
  // Like a blog post
  const likeBlogPost = (postId: string, userId: string) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };
  
  // Comment on a blog post
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
  
  // Export all functions and state
  const contextValue = {
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
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
