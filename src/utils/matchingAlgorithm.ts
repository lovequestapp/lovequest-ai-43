
// Extending this file to properly type the functions for geolocation-based matching

import { useUser } from '../context/UserContext';

// Extract the User type from the context
type User = ReturnType<typeof useUser>["currentUser"] extends infer U ? NonNullable<U> : never;

// Extended User type with coordinates for geolocation features
export interface UserWithCoordinates extends User {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  // Additional fields that are used in the UI but not in the base User type
  isBoosted?: boolean;
  boostLevel?: 'standard' | 'super' | 'local' | 'international';
}

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Get nearby users based on geographic proximity
export const getNearbyUsers = (
  currentUser: UserWithCoordinates,
  potentialMatches: UserWithCoordinates[],
  radiusKm: number
): UserWithCoordinates[] => {
  if (!currentUser.coordinates) return potentialMatches;
  
  return potentialMatches.filter(match => {
    if (!match.coordinates) return false;
    
    const distance = calculateDistance(
      currentUser.coordinates.latitude,
      currentUser.coordinates.longitude,
      match.coordinates.latitude,
      match.coordinates.longitude
    );
    
    return distance <= radiusKm;
  });
};

// Mock compatibility score calculation based on interests
export const calculateCompatibilityScore = (user1: User, user2: User): number => {
  const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
  return score;
};

// Enhanced matching algorithm that considers multiple factors including geolocation
export const getAiEnhancedMatches = (
  currentUser: UserWithCoordinates,
  potentialMatches: UserWithCoordinates[]
): UserWithCoordinates[] => {
  // Filter by gender preference if set
  let matches = [...potentialMatches];
  
  if (currentUser.interestedIn && currentUser.interestedIn.length > 0) {
    matches = matches.filter(match => 
      match.gender && currentUser.interestedIn?.includes(match.gender)
    );
  }
  
  // Calculate scores and apply proximity bonus if coordinates available
  const matchesWithScores = matches.map(match => {
    let baseScore = calculateCompatibilityScore(currentUser, match);
    
    // Apply proximity boost if both users have coordinates
    if (currentUser.coordinates && match.coordinates) {
      const distance = calculateDistance(
        currentUser.coordinates.latitude,
        currentUser.coordinates.longitude,
        match.coordinates.latitude,
        match.coordinates.longitude
      );
      
      // Closer matches get a bonus (up to +15 points for very close matches)
      const proximityBonus = Math.max(0, 15 - Math.floor(distance / 10));
      baseScore += proximityBonus;
    }
    
    // Apply boost for popular profiles
    const popularityBoost = match.popularityPoints 
      ? Math.min(10, Math.floor(match.popularityPoints / 10)) 
      : 0;
    
    return {
      ...match,
      compatibilityScore: Math.min(99, baseScore + popularityBoost)
    };
  });
  
  // Sort by compatibility score (highest first)
  return matchesWithScores.sort(
    (a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0)
  );
};

// Determine if a profile should be visually boosted based on popularity
export const shouldBoostProfile = (popularityPoints: number): boolean => {
  return popularityPoints >= 20;
};

// Generate conversation starters based on user profiles
export const getConversationStarters = (currentUser: User, matchUser: User): string[] => {
  const starters: string[] = [];
  
  // Based on shared interests
  if (currentUser.interests && matchUser.interests) {
    const sharedInterests = currentUser.interests.filter(interest => 
      matchUser.interests?.includes(interest)
    );
    
    if (sharedInterests.length > 0) {
      const randomInterest = sharedInterests[Math.floor(Math.random() * sharedInterests.length)];
      starters.push(`I see we both like ${randomInterest}! What got you into that?`);
    }
  }
  
  // Based on location
  if (matchUser.location) {
    starters.push(`How do you like living in ${matchUser.location.split(',')[0]}?`);
  }
  
  // Based on profile content
  if (matchUser.bio && matchUser.bio.length > 10) {
    starters.push(`I loved reading that ${matchUser.bio.substring(0, 15)}... in your bio. Tell me more about that.`);
  }
  
  // Add some generic but effective starters
  starters.push("What's something you're looking forward to this week?");
  starters.push("What's your idea of a perfect first date?");
  starters.push("If you could travel anywhere right now, where would you go?");
  
  return starters;
};
