
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

// Gift types
interface GiftInventory {
  rose: number;
  heart: number;
  teddy: number;
}

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
      boostProfile,
      allUsers,
      addUser,
      deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for using the user context
export const useUser = () => useContext(UserContext);
