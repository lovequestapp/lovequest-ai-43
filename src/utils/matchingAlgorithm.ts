
import { User } from '@/types/user';
import type { UserWithCoordinates, BoostLevelType } from '@/types/user';

// BOOST_PRIORITY mapping for sorting boosted profiles
export const BOOST_PRIORITY: Record<BoostLevelType, number> = {
  'super': 1,
  'international': 2,
  'local': 3,
  'none': 4
};

// Function to determine if a profile should be boosted based on popularity
export const shouldBoostProfile = (popularityScore: number): boolean => {
  // Boost profiles with popularity over 70
  return popularityScore > 70;
};

// Calculate distance between two points in km using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
};

// Filter users by proximity (within specified radius)
export const getNearbyUsers = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[],
  radius: number
): UserWithCoordinates[] => {
  if (!currentUser.coordinates) return users;
  
  const { latitude, longitude } = currentUser.coordinates;
  
  return users
    .map(user => {
      if (user.coordinates) {
        const distance = calculateDistance(
          latitude,
          longitude,
          user.coordinates.latitude,
          user.coordinates.longitude
        );
        
        return {
          ...user,
          distance
        };
      }
      
      // If no coordinates, assume a random distance
      return {
        ...user,
        distance: Math.floor(Math.random() * radius * 1.5)
      };
    })
    .filter(user => (user.distance || 0) <= radius);
};

// Enhanced matching algorithm using simulated AI features
export const getAiEnhancedMatches = (
  currentUser: UserWithCoordinates,
  potentialMatches: UserWithCoordinates[]
): UserWithCoordinates[] => {
  // Apply compatibility scoring
  const scoredMatches = potentialMatches.map(match => {
    // Calculate compatibility and other factors
    const compatibilityScore = calculateCompatibilityScore(currentUser, match);
    
    return {
      ...match,
      compatibilityScore
    };
  });
  
  // Apply more advanced sorting by multiple factors
  return scoredMatches.sort((a, b) => {
    // Sort primarily by compatibility score
    return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
  });
};

// Calculate compatibility score between two users
export const calculateCompatibilityScore = (
  user1: UserWithCoordinates,
  user2: UserWithCoordinates
): number => {
  // Implement using the same logic as in UserContext's getCompatibilityScore
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

// Export the types to be used elsewhere
export type { User, UserWithCoordinates, BoostLevelType };
