
interface UserProfile {
  interests: string[];
  age: number;
  location: string;
  personalStory?: string;
  // Add more traits as needed
}

// Text analysis functions (simplified AI simulation)
const analyzeWritingStyle = (text: string): Record<string, number> => {
  if (!text) return {};
  
  // In a real app, this would use NLP or a real AI API
  // This is a simplified simulation for demo purposes
  const metrics = {
    formality: 0,
    emotionality: 0,
    complexity: 0,
    optimism: 0,
    detailOrientation: 0
  };
  
  // Simplified analysis based on text patterns
  metrics.formality = text.includes('professional') || text.includes('career') ? 0.8 : 0.5;
  metrics.emotionality = (text.match(/!|love|happy|sad|feel/gi) || []).length / (text.length / 100);
  metrics.complexity = text.split(/[.!?]/).reduce((sum, sentence) => sum + sentence.split(' ').length, 0) / 
                       (text.split(/[.!?]/).length || 1);
  metrics.optimism = (text.match(/love|happy|success|hope|dream|future/gi) || []).length / 
                     ((text.match(/challenging|difficult|problem|issue/gi) || []).length + 1);
  metrics.detailOrientation = (text.match(/specifically|details|precisely/gi) || []).length > 0 ? 0.7 : 0.4;
  
  return metrics;
};

const extractInterestsFromText = (text: string): string[] => {
  if (!text) return [];
  
  // Keywords to look for in the story
  const interestKeywords = [
    'travel', 'art', 'music', 'reading', 'books', 'hiking', 'nature',
    'cooking', 'food', 'movies', 'fitness', 'gym', 'yoga', 'meditation',
    'technology', 'coding', 'gaming', 'sports', 'photography', 'writing',
    'dance', 'singing', 'languages', 'history', 'science', 'animals', 'pets'
  ];
  
  return interestKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  );
};

// Calculate compatibility score between two users
export const calculateCompatibility = (user1: UserProfile, user2: UserProfile): number => {
  let score = 0;
  const maxScore = 100;
  
  // Interest matching (up to 35 points)
  const interestWeight = 35;
  if (user1.interests.length && user2.interests.length) {
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * interestWeight;
    score += interestScore;
  }
  
  // Age compatibility (up to 20 points)
  const ageWeight = 20;
  const ageDifference = Math.abs(user1.age - user2.age);
  // Less difference = higher score (max 10 years difference)
  const ageScore = Math.max(0, (1 - ageDifference / 10)) * ageWeight;
  score += ageScore;
  
  // Location (up to 15 points)
  const locationWeight = 15;
  // In a real app, this would calculate distance between locations
  // For now, just check if the locations match
  if (user1.location.split(',')[1]?.trim() === user2.location.split(',')[1]?.trim()) {
    score += locationWeight;
  }
  
  // Writing style and psychological compatibility (up to 30 points)
  const writingWeight = 30;
  if (user1.personalStory && user2.personalStory) {
    const style1 = analyzeWritingStyle(user1.personalStory);
    const style2 = analyzeWritingStyle(user2.personalStory);
    
    // Calculate similarity between writing styles (simplified)
    let styleSimilarity = 0;
    let metricsCount = 0;
    
    for (const key in style1) {
      if (style2[key] !== undefined) {
        // The closer the values, the higher the similarity (1 - difference)
        styleSimilarity += 1 - Math.abs(style1[key] - style2[key]);
        metricsCount++;
      }
    }
    
    // Average similarity across all metrics
    const writingScore = metricsCount > 0 ? 
      (styleSimilarity / metricsCount) * writingWeight : 0;
    
    score += writingScore;
    
    // Extract additional interests from personal stories
    const storyInterests1 = extractInterestsFromText(user1.personalStory);
    const storyInterests2 = extractInterestsFromText(user2.personalStory);
    
    // Add bonus points for matching interests found in stories
    const commonStoryInterests = storyInterests1.filter(
      interest => storyInterests2.includes(interest)
    );
    
    if (commonStoryInterests.length > 0) {
      // Bonus points (up to 10) for shared interests detected in stories
      score += Math.min(commonStoryInterests.length * 2, 10);
    }
  }
  
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
  
  // Story-based starters
  if (user1.personalStory && user2.personalStory) {
    const storyInterests = extractInterestsFromText(user2.personalStory);
    
    if (storyInterests.length > 0) {
      starters.push(`I noticed you mentioned ${storyInterests[0]} in your story. What sparked your interest in that?`);
    }
    
    // Writing style based starters
    const style = analyzeWritingStyle(user2.personalStory);
    
    if (style.emotionality > 0.6) {
      starters.push("Your story was really expressive. Do you consider yourself an emotional person?");
    }
    
    if (style.optimism > 0.7) {
      starters.push("I loved the positive energy in your story. What keeps you so optimistic?");
    }
    
    if (style.complexity > 10) {
      starters.push("Your writing style is quite sophisticated. Do you enjoy literature or writing?");
    }
  }
  
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
