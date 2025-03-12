
// Utility function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180)
};

// Utility function to calculate compatibility score
const calculateCompatibilityScore = (user1: User, user2: User): number => {
  let score = 0;

  // Check for common interests
  const commonInterests = user1.interests.filter(interest => user2.interests.includes(interest));
  score += commonInterests.length * 10;

  // Check for similar age
  const ageDifference = Math.abs(user1.age - user2.age);
  if (ageDifference <= 5) {
    score += 15;
  }

  // Check for same location (simplified)
  if (user1.location === user2.location) {
    score += 20;
  }

  // Check for similar personality traits
  if (user1.personalityTraits && user2.personalityTraits) {
    const commonTraits = user1.personalityTraits.filter(trait => user2.personalityTraits?.includes(trait));
    score += commonTraits.length * 8;
  }

  // Normalize the score
  const maxPossibleScore = 100;
  const normalizedScore = Math.min(score, maxPossibleScore);

  return normalizedScore;
};

// Define the specific boost level type
export type BoostLevelType = 'local' | 'international' | 'none' | 'standard' | 'super';

// Update interface to include all needed properties with correctly typed boostLevel
export interface UserWithCoordinates extends User {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isBoosted?: boolean;
  boostLevel?: BoostLevelType;
  compatibilityScore?: number;
}

import { User } from '@/context/UserContext';

// Function to get nearby users - fixed signature
export const getNearbyUsers = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[],
  maxDistance: number
): UserWithCoordinates[] => {
  if (!currentUser.coordinates) return users;
  
  return users.filter(user => {
    if (!user.coordinates) return false;
    
    const distance = calculateDistance(
      currentUser.coordinates.latitude,
      currentUser.coordinates.longitude,
      user.coordinates.latitude,
      user.coordinates.longitude
    );
    
    return distance <= maxDistance;
  });
};

// Function to determine if a profile should be boosted based on popularity
export const shouldBoostProfile = (popularityPoints: number): boolean => {
  // Logic to determine if a profile should be boosted based on popularity points
  return popularityPoints > 90;
};

// Function to enhance matches with AI scoring
export const getAiEnhancedMatches = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[]
): UserWithCoordinates[] => {
  // Apply compatibility scoring
  return users.map(user => ({
    ...user,
    compatibilityScore: calculateCompatibilityScore(currentUser, user)
  })).sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
};
