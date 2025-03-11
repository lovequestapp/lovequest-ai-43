
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

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
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
};

type Match = {
  id: string;
  userId1: string;
  userId2: string;
  matchDate: Date;
  status: 'pending' | 'matched' | 'rejected';
};

export type BoostType = 'local' | 'international';

export type BoostProfile = {
  userId: string;
  boostType: BoostType;
  startTime: Date;
  endTime: Date;
};

// More comprehensive UserContextType
type UserContextType = {
  currentUser: User | null;
  potentialMatches: User[];
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
  matches: Match[];
  messages: Record<string, Message[]>;
  sendMessage: (receiverId: string, content: string) => void;
  markMessagesAsRead: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  boostProfile: (boostType: BoostType) => void;
  boostedProfiles: BoostProfile[];
  getGiftBenefits: () => { coins: number; boosts: number };
  redeemGift: (giftId: string) => void;
  updateMatchPreferences: (preferences: User['matchPreferences']) => void;
};

// Create context with default values to prevent undefined errors
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
  boostProfile: () => {},
  boostedProfiles: [], // Ensure this has a default empty array
  getGiftBenefits: () => ({ coins: 0, boosts: 0 }),
  redeemGift: () => {},
  updateMatchPreferences: () => {},
});

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  console.log("Initializing UserProvider");
  
  // Initialize state with safe defaults
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [boostedProfiles, setBoostedProfiles] = useState<BoostProfile[]>([]);

  const giftValues = {
    hearts: { coins: 50, boosts: 0 },
    flowers: { coins: 100, boosts: 1 },
    chocolates: { coins: 200, boosts: 2 },
    jewelry: { coins: 500, boosts: 5 },
  };

  // Load initial data
  useEffect(() => {
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
    };

    // Simulate fetching potential matches
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
        popularityScore: 62,
        compatibilityScore: 68,
      },
    ];

    // Simulate fetching matches
    const mockMatches: Match[] = [
      {
        id: 'match1',
        userId1: 'user1',
        userId2: 'user2',
        matchDate: new Date(),
        status: 'matched',
      },
      {
        id: 'match2',
        userId1: 'user1',
        userId2: 'user3',
        matchDate: new Date(),
        status: 'matched',
      },
    ];

    // Simulate fetching messages
    const mockMessages: Record<string, Message[]> = {
      user2: [
        {
          id: 'message1',
          senderId: 'user1',
          receiverId: 'user2',
          content: 'Hey Jamie, how are you?',
          timestamp: new Date(),
          read: true,
        },
        {
          id: 'message2',
          senderId: 'user2',
          receiverId: 'user1',
          content: 'Hi Alex, I am doing great! How about you?',
          timestamp: new Date(),
          read: true,
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
        },
      ],
    };

    // Set initial app state
    setCurrentUser(mockUser);
    setPotentialMatches(mockPotentialMatches);
    
    // Set up initial boosted profiles
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
  }, []);

  // Handler functions
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

  const sendMessage = (receiverId: string, content: string) => {
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
    };

    setMessages((prevMessages) => ({
      ...prevMessages,
      [receiverId]: [...(prevMessages[receiverId] || []), newMessage],
    }));
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
        return { ...prevUser, ...updates };
      }
      return prevUser;
    });
  };

  // Properly implement boostProfile function
  const boostProfile = (boostType: BoostType) => {
    if (!currentUser) {
      toast.error("You must be logged in to boost your profile");
      return;
    }
    
    console.log(`Boosting profile with type: ${boostType}`);
    
    const now = new Date();
    const endTime = new Date();
    
    // Set boost duration based on type
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
    
    // Add the new boost
    setBoostedProfiles(prev => {
      const newBoostedProfiles = [...(prev || []), newBoost];
      console.log("Updated boosted profiles:", newBoostedProfiles);
      return newBoostedProfiles;
    });
    
    toast.success(`Profile boosted! (${boostType})`, {
      description: `Your profile will receive extra visibility until ${endTime.toLocaleString()}`,
    });
  };
  
  // Properly implement getGiftBenefits
  const getGiftBenefits = () => {
    // For example, return the sum of all gift benefits the user has received
    // This is a placeholder implementation
    console.log("Getting gift benefits");
    return { coins: 150, boosts: 2 };
  };
  
  const redeemGift = (giftId: string) => {
    if (!giftId || !currentUser) {
      console.error("Invalid giftId or currentUser is null");
      return;
    }
    
    const giftBenefits = giftValues[giftId as keyof typeof giftValues];

    if (giftBenefits) {
      // Update user's coins
      setCurrentUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            // Add the gift's coins to popularity points
            popularityPoints: (prevUser.popularityPoints || 0) + giftBenefits.coins,
          };
        }
        return prevUser;
      });

      // Boost user's profile
      if (giftBenefits.boosts > 0) {
        boostProfile('local'); // Or implement a way to choose boost type
      }

      toast.success(`You redeemed a ${giftId}!`, {
        description: `You received ${giftBenefits.coins} coins and ${giftBenefits.boosts} boosts.`,
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

  // Create the context value with all our state and functions
  const contextValue = {
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
  };
  
  console.log("Providing UserContext with boostedProfiles:", boostedProfiles?.length || 0);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  // Provide safe fallbacks for all values
  return {
    ...context,
    currentUser: context.currentUser || null,
    potentialMatches: context.potentialMatches || [],
    matches: context.matches || [],
    messages: context.messages || {},
    boostedProfiles: context.boostedProfiles || [],
  };
};
