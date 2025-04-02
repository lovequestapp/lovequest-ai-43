
import type { UserWithCoordinates, UserPreferences } from '@/types/user';
import { calculateDistance } from './distance';

// Filter users by preferences
export const filterUsersByPreferences = (
  currentUser: UserWithCoordinates,
  potentialMatches: UserWithCoordinates[]
): UserWithCoordinates[] => {
  if (!currentUser || !potentialMatches.length) return [];
  
  const preferences = currentUser.preferences;
  
  return potentialMatches.filter(user => {
    // Skip if user doesn't want to be shown to others
    if (user.preferences?.showMeToUsers === false) {
      return false;
    }
    
    // Check gender preference
    if (!currentUser.interestedIn.includes(user.gender)) {
      return false;
    }
    
    // Check age range if specified
    if (preferences?.ageRange) {
      if (user.age < preferences.ageRange.min || user.age > preferences.ageRange.max) {
        return false;
      }
    }
    
    // Check distance if coordinates available and max distance specified
    if (currentUser.coordinates && user.coordinates && preferences?.maxDistance) {
      const distance = calculateDistance(
        currentUser.coordinates.latitude,
        currentUser.coordinates.longitude,
        user.coordinates.latitude,
        user.coordinates.longitude
      );
      
      if (distance > preferences.maxDistance) {
        return false;
      }
    }
    
    return true;
  });
};

// BOOST_PRIORITY mapping for sorting boosted profiles
export const BOOST_PRIORITY: Record<BoostLevelType, number> = {
  'super': 1,
  'international': 2,
  'local': 3,
  'basic': 4,
  'premium': 5,
  'ultra': 6,
  'none': 7
};

// Function to determine if a profile should be boosted based on popularity
export const shouldBoostProfile = (popularityScore: number): boolean => {
  // Boost profiles with popularity over 70
  return popularityScore > 70;
};

// Enhanced matching algorithm using simulated AI features
export const getAiEnhancedMatches = (
  currentUser: UserWithCoordinates,
  potentialMatches: UserWithCoordinates[]
): UserWithCoordinates[] => {
  // Apply compatibility scoring
  const scoredMatches = potentialMatches.map(match => {
    // Import here to avoid circular dependencies
    const { calculateCompatibilityScore } = require('./compatibility');
    
    // Calculate compatibility score
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

import type { BoostLevelType } from '@/types/user';
