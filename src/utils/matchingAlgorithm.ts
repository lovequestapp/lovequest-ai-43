
interface UserProfile {
  interests: string[];
  age: number;
  location: string;
  // Add more traits as needed
}

// Calculate compatibility score between two users
export const calculateCompatibility = (user1: UserProfile, user2: UserProfile): number => {
  let score = 0;
  const maxScore = 100;
  
  // Interest matching (up to 50 points)
  const interestWeight = 50;
  if (user1.interests.length && user2.interests.length) {
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * interestWeight;
    score += interestScore;
  }
  
  // Age compatibility (up to 25 points)
  const ageWeight = 25;
  const ageDifference = Math.abs(user1.age - user2.age);
  // Less difference = higher score (max 10 years difference)
  const ageScore = Math.max(0, (1 - ageDifference / 10)) * ageWeight;
  score += ageScore;
  
  // Location (up to 25 points)
  const locationWeight = 25;
  // In a real app, this would calculate distance between locations
  // For now, just check if the locations match
  if (user1.location.split(',')[1]?.trim() === user2.location.split(',')[1]?.trim()) {
    score += locationWeight;
  }
  
  // Add AI personality analysis here in a real app
  
  return Math.round(score);
};

// Advanced matching with AI factors (simulated)
export const getAiEnhancedMatches = (currentUser: UserProfile, potentialMatches: UserProfile[]): UserProfile[] => {
  // In a real app, this would use AI to analyze profiles and conversations
  // For now, we'll just sort by compatibility
  
  return potentialMatches
    .map(match => ({
      ...match,
      compatibilityScore: calculateCompatibility(currentUser, match)
    }))
    .sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
};

// Get conversation starters based on profiles
export const getConversationStarters = (user1: UserProfile, user2: UserProfile): string[] => {
  const starters: string[] = [];
  
  // Find common interests
  const commonInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  );
  
  if (commonInterests.length > 0) {
    starters.push(`I noticed we both enjoy ${commonInterests.join(' and ')}. What got you interested in that?`);
  }
  
  // Location-based starters
  if (user1.location.split(',')[0]?.trim() === user2.location.split(',')[0]?.trim()) {
    starters.push(`I see we're both in ${user1.location.split(',')[0]?.trim()}! What's your favorite spot in the city?`);
  }
  
  // Generic starters
  starters.push(
    "What's something you're passionate about that most people don't know?",
    "If you could travel anywhere tomorrow, where would you go?",
    "What's the best book you've read or show you've watched recently?"
  );
  
  return starters;
};
