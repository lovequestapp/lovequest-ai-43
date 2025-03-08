
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  photos: string[];
  compatibilityScore?: number;
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
};

type UserContextType = {
  currentUser: User | null;
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  setCurrentUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addMatch: (matchedUserId: string) => void;
  sendMessage: (matchId: string, content: string) => void;
  getMatchedUser: (matchId: string) => User | undefined;
  likeUser: (userId: string) => void;
  passUser: (userId: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for development
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
  });
  
  const [potentialMatches, setPotentialMatches] = useState<User[]>(mockUsers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

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

  const sendMessage = (matchId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage],
    }));
    
    // Update last message in match
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { 
              ...match, 
              lastMessage: content, 
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
