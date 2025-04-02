
import { User } from '@/types/user';
import type { UserWithCoordinates, UserPreferences } from '@/types/user';
import { calculateDistance } from './distance';

// Calculate interest overlap with weighted importance
export const calculateInterestOverlap = (user1: User, user2: User): number => {
  if (!user1.interests || !user2.interests) return 0;
  
  // Count common interests
  const sharedInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  ).length;
  
  // Calculate percentage of shared interests relative to user's total interests
  const percentageShared = Math.min(25, (sharedInterests / Math.max(1, Math.min(user1.interests.length, user2.interests.length))) * 25);
  
  return percentageShared;
};

// Calculate personality trait compatibility
export const calculateTraitCompatibility = (user1: User, user2: User): number => {
  if (!user1.personalityTraits || !user2.personalityTraits) return 0;
  
  // Some traits work better as complements, others as similarities
  const complementaryTraits = [
    ['Introvert', 'Extrovert'],
    ['Planner', 'Spontaneous'],
    ['Analytical', 'Creative']
  ];
  
  // Count matching traits
  const sharedTraits = user1.personalityTraits.filter(trait => 
    user2.personalityTraits.includes(trait)
  );
  
  // Check for complementary traits
  let complementaryScore = 0;
  complementaryTraits.forEach(pair => {
    if (
      (user1.personalityTraits.includes(pair[0]) && user2.personalityTraits.includes(pair[1])) ||
      (user1.personalityTraits.includes(pair[1]) && user2.personalityTraits.includes(pair[0]))
    ) {
      complementaryScore += 5;
    }
  });
  
  // Calculate base score from shared traits
  const sharedScore = Math.min(20, (sharedTraits.length / Math.max(1, Math.min(user1.personalityTraits.length, user2.personalityTraits.length))) * 20);
  
  return sharedScore + complementaryScore;
};

// Text similarity analysis for bio and writing style matching
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and remove special characters
  const normalizedText1 = text1.toLowerCase().replace(/[^\w\s]/g, '');
  const normalizedText2 = text2.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words
  const words1 = normalizedText1.split(/\s+/).filter(word => word.length > 2);
  const words2 = normalizedText2.split(/\s+/).filter(word => word.length > 2);
  
  // Count common words
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate Jaccard similarity coefficient
  const uniqueWords = new Set([...words1, ...words2]);
  const similarity = uniqueWords.size > 0 ? commonWords.length / uniqueWords.size : 0;
  
  return similarity * 100;
};

// Calculate writing style similarity based on sentence structure, word usage patterns
export const analyzeWritingStyle = (bio1: string, bio2: string): number => {
  if (!bio1 || !bio2) return 0;
  
  // Average sentence length comparison
  const sentences1 = bio1.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentences2 = bio2.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const avgLength1 = sentences1.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / Math.max(1, sentences1.length);
  const avgLength2 = sentences2.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / Math.max(1, sentences2.length);
  
  // Sentence length similarity (0-100)
  const lengthSimilarity = 100 - Math.min(100, Math.abs(avgLength1 - avgLength2) * 20);
  
  // Vocabulary richness comparison
  const uniqueWords1 = new Set(bio1.toLowerCase().split(/\s+/));
  const uniqueWords2 = new Set(bio2.toLowerCase().split(/\s+/));
  
  const vocabRichness1 = uniqueWords1.size / Math.max(1, bio1.split(/\s+/).length);
  const vocabRichness2 = uniqueWords2.size / Math.max(1, bio2.split(/\s+/).length);
  
  const vocabSimilarity = 100 - Math.min(100, Math.abs(vocabRichness1 - vocabRichness2) * 100);
  
  // Return weighted average
  return (lengthSimilarity * 0.5) + (vocabSimilarity * 0.5);
};

// Calculate compatibility score between two users with enhanced factors
export const calculateCompatibilityScore = (
  user1: UserWithCoordinates,
  user2: UserWithCoordinates
): number => {
  if (!user1 || !user2) return 0;
  
  let score = 0;
  
  // Get matching priorities or use defaults
  const priorities = user1.preferences?.matchingPriorities || {
    distance: 5,
    interests: 5,
    age: 2,
    personality: 4
  };
  
  // Normalize priorities to sum to 1
  const totalPriority = Object.values(priorities).reduce((sum, val) => sum + val, 0);
  const normalizedPriorities: Record<string, number> = {
    interests: priorities.interests / totalPriority,
    personality: priorities.personality / totalPriority,
    distance: priorities.distance / totalPriority,
    age: priorities.age / totalPriority
  };

  // Add optional properties if they exist
  if (priorities.location !== undefined) {
    normalizedPriorities.location = priorities.location / totalPriority;
  }
  
  if (priorities.writingStyle !== undefined) {
    normalizedPriorities.writingStyle = priorities.writingStyle / totalPriority;
  }
  
  // Gender preference match (essential factor)
  if (user1.interestedIn.includes(user2.gender) && user2.interestedIn.includes(user1.gender)) {
    score += 25;
  } else {
    // If gender preferences don't match, return a very low score
    return Math.floor(Math.random() * 20) + 5;
  }
  
  // Interest overlap (weighted by priority)
  const interestScore = calculateInterestOverlap(user1, user2) * normalizedPriorities.interests * 25;
  score += interestScore;
  
  // Personality traits (weighted by priority)
  const traitScore = calculateTraitCompatibility(user1, user2) * normalizedPriorities.personality * 25;
  score += traitScore;
  
  // Age compatibility (weighted by priority)
  const ageDifference = Math.abs(user1.age - user2.age);
  const ageScore = Math.max(0, 15 - (ageDifference * 0.75)) * normalizedPriorities.age;
  score += ageScore;
  
  // Writing style/bio similarity (weighted by priority) - only if the writingStyle priority exists
  if (user1.bio && user2.bio && normalizedPriorities.writingStyle !== undefined) {
    const textSimilarity = calculateTextSimilarity(user1.bio, user2.bio) * 0.05 * normalizedPriorities.writingStyle;
    const writingStyleSimilarity = analyzeWritingStyle(user1.bio, user2.bio) * 0.05 * normalizedPriorities.writingStyle;
    score += textSimilarity + writingStyleSimilarity;
  }
  
  // Location proximity (if available) - only if the location priority exists
  if (user1.coordinates && user2.coordinates && normalizedPriorities.location !== undefined) {
    const distance = calculateDistance(
      user1.coordinates.latitude,
      user1.coordinates.longitude,
      user2.coordinates.latitude,
      user2.coordinates.longitude
    );
    
    // Check if user has max distance preference
    const maxDistance = user1.preferences?.maxDistance || 100;
    
    if (distance <= maxDistance) {
      // Within maxDistance is full score, decreasing linearly
      const locationScore = Math.max(0, 5 - (distance / (maxDistance / 5))) * normalizedPriorities.location;
      score += locationScore;
    } else {
      // Beyond max distance, but don't completely exclude
      score += 1 * normalizedPriorities.location;
    }
  }
  
  // Preferred locations match
  if (user1.preferences?.preferredLocations?.length && user2.location && normalizedPriorities.location !== undefined) {
    const locationMatches = user1.preferences.preferredLocations.some(
      loc => user2.location.toLowerCase().includes(loc.toLowerCase())
    );
    
    if (locationMatches) {
      score += 5 * normalizedPriorities.location;
    }
  }
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(100, score);
  
  // Add a small random factor for diversity in results (±5%)
  const randomFactor = Math.floor(Math.random() * 10) - 5;
  
  return Math.max(0, Math.min(100, normalizedScore + randomFactor));
};
