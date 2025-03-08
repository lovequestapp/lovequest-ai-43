import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

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
  type?: 'text' | 'voice' | 'gift';
  giftType?: string;
};

type UserContextType = {
  currentUser: User | null;
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  setCurrentUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addMatch: (matchedUserId: string) => void;
  sendMessage: (matchId: string, content: string, type?: 'text' | 'voice' | 'gift', giftType?: string) => void;
  getMatchedUser: (matchId: string) => User | undefined;
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
};

const UserContext = createContext<UserContextType | undefined>(undefined);

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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'current-user',
    name: 'Sam Rivera',
    age: 27,
    bio: 'Passionate about technology and creativity. Looking for authentic connections and shared adventures.',
    location: 'New York, NY',
    interests: ['Technology', 'Art', 'Hiking', 'Food'],
    photos: ['/placeholder.svg', '/placeholder.svg'],
    giftInventory: { 'rose': 0, 'heart': 0, 'teddy': 0 },
    popularityPoints: 0,
    premiumLikes: 0,
    profileBoost: { active: false },
    receivedGifts: { rose: 0, heart: 0, teddy: 0 },
    balance: {
      amount: 0,
      currency: 'USD',
      withdrawalHistory: []
    }
  });
  
  const [potentialMatches, setPotentialMatches] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Gift monetization details - could be fetched from an API in a real app
  const giftValues = {
    rose: 0.50,    // Each rose is worth $0.50
    heart: 2.00,    // Each heart is worth $2.00
    teddy: 5.00     // Each teddy bear is worth $5.00
  };
  
  const minimumWithdrawal = 10.00;  // Minimum $10 for withdrawal
  
  // Exchange rates for major currencies (would come from an API in a real app)
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
    
    // Validate amount against minimum and available balance
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
    
    // Check if bank details are provided
    if (!currentUser.bankDetails?.accountNumber || !currentUser.bankDetails?.bankName) {
      toast({
        title: "Withdrawal Failed",
        description: "Please add your bank details before withdrawing",
        variant: "destructive"
      });
      return false;
    }
    
    // Check for pending withdrawals
    if (currentUser.balance.pendingWithdrawal) {
      toast({
        title: "Withdrawal Failed",
        description: "You have a pending withdrawal. Please wait for it to complete.",
        variant: "destructive"
      });
      return false;
    }
    
    // Process withdrawal - in a real app, this would call an API
    const updatedUser = { ...currentUser };
    
    // Update balance and create pending withdrawal
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
    
    // Simulate processing delay (in a real app, this would be handled by a backend)
    setTimeout(() => {
      completeWithdrawal(amount);
    }, 5000); // 5 seconds for demo purposes
    
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
    
    // Add to history and clear pending
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
  
  // Modified receiveGift to update monetary balance
  const receiveGift = (giftType: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser };
    
    // Update received gifts count
    if (!updatedUser.receivedGifts) {
      updatedUser.receivedGifts = { rose: 0, heart: 0, teddy: 0 };
    }
    
    updatedUser.receivedGifts[giftType as keyof typeof updatedUser.receivedGifts] += 1;
    
    // Apply benefits based on gift type
    if (!updatedUser.popularityPoints) updatedUser.popularityPoints = 0;
    if (!updatedUser.premiumLikes) updatedUser.premiumLikes = 0;
    if (!updatedUser.profileBoost) updatedUser.profileBoost = { active: false };
    
    // Initialize balance if it doesn't exist
    if (!updatedUser.balance) {
      updatedUser.balance = {
        amount: 0,
        currency: 'USD',
        withdrawalHistory: []
      };
    }
    
    // Calculate monetary value of the gift
    const giftValue = calculateGiftValue(giftType, 1);
    updatedUser.balance.amount += giftValue;
    
    switch (giftType) {
      case 'rose':
        updatedUser.popularityPoints += 2;
        toast({
          title: "Rose Received!",
          description: `You gained +2 popularity points and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value`,
        });
        break;
      case 'heart':
        updatedUser.popularityPoints += 10;
        updatedUser.premiumLikes += 1;
        toast({
          title: "Heart Received!",
          description: `You gained +10 popularity points, 1 premium like token, and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value`,
        });
        break;
      case 'teddy':
        updatedUser.popularityPoints += 5;
        updatedUser.profileBoost = { 
          active: true, 
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };
        toast({
          title: "Teddy Bear Received!",
          description: `You gained +5 popularity points, a 24-hour profile boost, and ${updatedUser.balance.currency} ${giftValue.toFixed(2)} in cash value`,
        });
        break;
    }
    
    setCurrentUser(updatedUser);
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
    type: 'text' | 'voice' | 'gift' = 'text',
    giftType?: string
  ) => {
    if (!currentUser) return;
    
    // For gift messages, check if user has the gift in inventory
    if (type === 'gift' && giftType) {
      const inventory = currentUser.giftInventory || {};
      
      // Check if user has this gift
      if (!inventory[giftType] || inventory[giftType] <= 0) {
        return; // Cannot send gift if not in inventory
      }
      
      // Reduce inventory count
      const updatedInventory = {
        ...inventory,
        [giftType]: inventory[giftType] - 1
      };
      
      // Update user inventory
      setCurrentUser({
        ...currentUser,
        giftInventory: updatedInventory
      });
      
      // In a real app, this would call an API to handle gift receipt by the other user
      // For this demo, we'll simulate receiving the gift ourselves
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
    
    // Update last message in match
    // For voice and gift messages, use descriptive text for the preview
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
  };

  const getMatchedUser = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return undefined;
    
    return potentialMatches.find(user => user.id === match.matchedUserId);
  };

  const likeUser = (userId: string) => {
    // In a real app, this would send a request to the server
    // For now, we'll simulate a match
    addMatch(userId);
    
    // Remove from potential matches
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const passUser = (userId: string) => {
    // Remove from potential matches
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const purchaseGifts = (gifts: Record<string, number>) => {
    if (!currentUser) return;
    
    const currentInventory = currentUser.giftInventory || { 'rose': 0, 'heart': 0, 'teddy': 0 };
    
    const updatedInventory = { ...currentInventory };
    
    // Add purchased gifts to inventory
    Object.keys(gifts).forEach(giftId => {
      updatedInventory[giftId] = (updatedInventory[giftId] || 0) + gifts[giftId];
    });
    
    // Update user with new inventory
    setCurrentUser({
      ...currentUser,
      giftInventory: updatedInventory
    });
  };

  const getGiftInventory = (): Record<string, number> => {
    return currentUser?.giftInventory || { 'rose': 0, 'heart': 0, 'teddy': 0 };
  };

  useEffect(() => {
    // Only initialize if there are no matches yet
    if (matches.length === 0 && mockUsers.length > 0) {
      // Create a sample match
      const sampleMatch: Match = {
        id: 'sample-match-1',
        userId: currentUser?.id || '',
        matchedUserId: mockUsers[0].id,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        lastMessage: 'Hi there!',
        lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      };
      
      // Create some sample messages
      const sampleMessages: Message[] = [
        {
          id: 'msg-1',
          matchId: 'sample-match-1',
          senderId: mockUsers[0].id,
          content: 'Hi there! I noticed we both like hiking.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          type: 'text',
        },
        {
          id: 'msg-2',
          matchId: 'sample-match-1',
          senderId: currentUser?.id || '',
          content: 'Yes! I love hiking in the mountains. What about you?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
          read: true,
          type: 'text',
        },
        {
          id: 'msg-3',
          matchId: 'sample-match-1',
          senderId: mockUsers[0].id,
          content: '🌹',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          read: true,
          type: 'gift',
          giftType: 'rose',
        },
      ];
      
      setMatches([sampleMatch]);
      setMessages({
        'sample-match-1': sampleMessages,
      });
    }
  }, [currentUser, mockUsers, matches.length]);

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
    // Calculate time remaining
    const diff = boostExpiration.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    boostTimeRemaining = `${hours}h ${minutes}m`;
  }
  
  return {
    popularityPoints: currentUser.popularityPoints || 0,
    premiumLikes: currentUser.premiumLikes || 0,
    profileBoost: (currentUser.profileBoost?.active && boostExpiration && boostExpiration > now) || false,
    boostTimeRemaining
  };
};

  return (
    <UserContext.Provider
      value={{
        currentUser,
        potentialMatches,
        matches,
        messages,
        setCurrentUser,
        updateUserProfile,
        addMatch,
        sendMessage,
        getMatchedUser,
        likeUser,
        passUser,
        purchaseGifts,
        getGiftInventory,
        receiveGift,
        getGiftBenefits,
        getGiftMonetizationDetails,
        initiateWithdrawal,
        updateBankDetails,
        getWithdrawalHistory,
        getPendingWithdrawal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
