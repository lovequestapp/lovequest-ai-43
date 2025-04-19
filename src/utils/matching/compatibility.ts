import { calculateDistance } from './distance';
import type { User, UserWithCoordinates } from '@/types/user';
import { convertPremiumStatus } from '@/utils/subscription';

// Calculate interests score
export const calculateInterestsScore = (user1: User, user2: User): number => {
  const commonInterests = user1.interests.filter(interest =>
    user2.interests.includes(interest)
  );
  const maxPossibleInterests = Math.max(user1.interests.length, user2.interests.length);
  
  if (maxPossibleInterests === 0) return 50; // Avoid division by zero
  
  return (commonInterests.length / maxPossibleInterests) * 100;
};

// Calculate personality score
export const calculatePersonalityScore = (user1: User, user2: User): number => {
  const commonTraits = user1.personalityTraits.filter(trait =>
    user2.personalityTraits.includes(trait)
  );
  const maxPossibleTraits = Math.max(user1.personalityTraits.length, user2.personalityTraits.length);
  
  if (maxPossibleTraits === 0) return 50; // Avoid division by zero
  
  return (commonTraits.length / maxPossibleTraits) * 100;
};

// Calculate age score
export const calculateAgeScore = (user1: User, user2: User): number => {
  const ageDifference = Math.abs(user1.age - user2.age);
  let ageScore = 100 - (ageDifference * 2); // Reduce score by 2 points for each year of difference
  
  if (ageScore < 0) ageScore = 0; // Ensure score is not negative
  
  return ageScore;
};

// Calculate distance score
export const calculateDistanceScore = (user1: UserWithCoordinates, user2: UserWithCoordinates): number => {
  if (!user1.coordinates || !user2.coordinates) return 50; // Default mid-range score if no coordinates
  
  const distance = calculateDistance(
    user1.coordinates.latitude,
    user1.coordinates.longitude,
    user2.coordinates.latitude,
    user2.coordinates.longitude
  );
  
  let distanceScore = 100 - (distance * 2); // Reduce score by 2 points for each km of distance
  
  if (distanceScore < 0) distanceScore = 0; // Ensure score is not negative
  
  return distanceScore;
};

// Calculate overall compatibility score
export const calculateCompatibilityScore = (user1: User, user2: User): number => {
  // Initialize scores
  let interestsScore = calculateInterestsScore(user1, user2);
  let personalityScore = calculatePersonalityScore(user1, user2);
  let ageScore = calculateAgeScore(user1, user2);
  let distanceScore = 50; // Default mid-range score

  // Get priorities from user preferences or use defaults
  const priorities = {
    distance: user1.preferences?.matchingPriorities?.distance || 5,
    interests: user1.preferences?.matchingPriorities?.interests || 5,
    personality: user1.preferences?.matchingPriorities?.personality || 5,
    age: user1.preferences?.matchingPriorities?.age || 5,
  };

  // Calculate individual scores
  interestsScore = calculateInterestsScore(user1, user2);
  personalityScore = calculatePersonalityScore(user1, user2);
  ageScore = calculateAgeScore(user1, user2);
  distanceScore = 50; // Default mid-range score

  // If we have coordinates, calculate distance score
  if (
    (user1 as UserWithCoordinates).coordinates && 
    (user2 as UserWithCoordinates).coordinates
  ) {
    distanceScore = calculateDistanceScore(
      user1 as UserWithCoordinates, 
      user2 as UserWithCoordinates
    );
  }

  // Weight the scores according to user preferences
  const weightedScore = (
    (interestsScore * (priorities.interests / 10)) +
    (personalityScore * (priorities.personality / 10)) +
    (ageScore * (priorities.age / 10)) +
    (distanceScore * (priorities.distance / 10))
  ) / (
    (priorities.interests / 10) +
    (priorities.personality / 10) +
    (priorities.age / 10) +
    (priorities.distance / 10)
  );

  // Boost based on premium status
  let boostedScore = weightedScore;
  
  // Convert the premium status before comparison
  const normalizedStatus = convertPremiumStatus(user2.premiumStatus);
  
  if (normalizedStatus === 'unlimited') {
    boostedScore += (100 - weightedScore) * 0.1;
  } else if (normalizedStatus === 'vip') {
    boostedScore += (100 - weightedScore) * 0.2;
  }

  // Cap at 100
  return Math.min(Math.round(boostedScore), 100);
};

// Check if user is a location match
export const isLocationMatch = (user1: User, user2: User): boolean => {
  if (!user1.preferences?.preferredLocations || user1.preferences.preferredLocations.length === 0) {
    return true; // No preferred locations set, any location is a match
  }
  
  return user1.preferences.preferredLocations.some(location => 
    user2.location.toLowerCase().includes(location.toLowerCase())
  );
};
