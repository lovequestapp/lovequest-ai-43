
import { User } from '@/context/UserContext';

export interface UserWithCoordinates extends User {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isBoosted?: boolean;
  boostLevel?: 'standard' | 'super' | 'local' | 'international';
}

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
  const d = R * c; // Distance in km
  return d;
}

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180)
}

export const filterUsersByPreferences = (currentUser: UserWithCoordinates, users: UserWithCoordinates[]): UserWithCoordinates[] => {
  if (!currentUser.matchPreferences) {
    return users;
  }

  const { ageRange, distance, interests } = currentUser.matchPreferences;

  return users.filter(user => {
    // Filter by gender preferences if available
    if (currentUser.interestedIn && currentUser.interestedIn.length > 0 && user.gender) {
      if (!currentUser.interestedIn.includes(user.gender)) {
        return false;
      }
    }
    
    if (user.gender && user.interestedIn && user.interestedIn.length > 0) {
      if (!user.interestedIn.includes(currentUser.gender || '')) {
        return false;
      }
    }

    // Filter by age
    if (ageRange && (user.age < ageRange.min || user.age > ageRange.max)) {
      return false;
    }

    // Filter by distance
    if (distance) {
      const calculatedDistance = calculateDistance(
        currentUser.coordinates.latitude,
        currentUser.coordinates.longitude,
        user.coordinates.latitude,
        user.coordinates.longitude
      );
      if (calculatedDistance > distance) {
        return false;
      }
    }

    // Filter by interests (if at least one interest matches)
    if (interests && interests.length > 0) {
      const hasMatchingInterest = user.interests.some(interest => 
        interests.includes(interest)
      );
      if (!hasMatchingInterest) {
        return false;
      }
    }

    return true;
  });
};

// Add the missing exported functions for Discover.tsx

export const getAiEnhancedMatches = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[]
): UserWithCoordinates[] => {
  // First, filter by preferences
  const filteredUsers = filterUsersByPreferences(currentUser, users);
  
  // Sort by compatibility score (descending)
  return filteredUsers.sort((a, b) => {
    const scoreA = a.compatibilityScore || 0;
    const scoreB = b.compatibilityScore || 0;
    return scoreB - scoreA;
  });
};

export const shouldBoostProfile = (popularityScore: number): boolean => {
  // Simple algorithm to determine if a profile should be boosted based on popularity
  return popularityScore >= 75; // Boost profiles with popularity score >= 75
};

export const getNearbyUsers = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[],
  maxDistance: number
): UserWithCoordinates[] => {
  if (!currentUser.coordinates) {
    return users;
  }
  
  return users.filter(user => {
    if (!user.coordinates) {
      return false;
    }
    
    const distance = calculateDistance(
      currentUser.coordinates.latitude,
      currentUser.coordinates.longitude,
      user.coordinates.latitude,
      user.coordinates.longitude
    );
    
    return distance <= maxDistance;
  });
};
