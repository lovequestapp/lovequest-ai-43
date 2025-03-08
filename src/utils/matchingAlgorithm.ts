interface UserProfile {
  interests: string[];
  age: number;
  location: string;
  personalStory?: string;
  popularityPoints?: number;
  personalityTraits?: string[];
  quizAnswers?: Record<string, string>;
  // Add more traits as needed
}

// Text analysis functions (enhanced AI simulation)
const analyzeWritingStyle = (text: string): Record<string, number> => {
  if (!text) return {};
  
  // In a real app, this would use NLP or a real AI API
  // This is a simulated enhanced analysis for demo purposes
  const metrics = {
    formality: 0,
    emotionality: 0,
    complexity: 0,
    optimism: 0,
    detailOrientation: 0,
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    neuroticism: 0,
    openness: 0
  };
  
  // Simulated Big Five personality analysis
  const sentences = text.split(/[.!?]/);
  const wordCount = text.split(/\s+/).length;
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // Simplified analysis based on text patterns
  metrics.formality = text.includes('professional') || text.includes('career') ? 0.8 : 0.5;
  metrics.emotionality = (text.match(/!|love|happy|sad|feel|emotion/gi) || []).length / (text.length / 100);
  metrics.complexity = avgSentenceLength / 10; // Normalize to 0-1 range, assuming avg max length is 20
  metrics.optimism = (text.match(/love|happy|success|hope|dream|future|positive/gi) || []).length / 
                     ((text.match(/challenging|difficult|problem|issue|worry|concern/gi) || []).length + 1);
  metrics.detailOrientation = (text.match(/specifically|details|precisely|exactly|particularly/gi) || []).length > 0 ? 0.7 : 0.4;
  
  // Big Five personality trait simulation
  metrics.extraversion = (text.match(/party|social|friends|outgoing|energetic|group/gi) || []).length / (wordCount / 20);
  metrics.agreeableness = (text.match(/help|care|understand|support|kind|compassion/gi) || []).length / (wordCount / 20);
  metrics.conscientiousness = (text.match(/plan|organize|responsible|goal|achieve|discipline/gi) || []).length / (wordCount / 20);
  metrics.neuroticism = (text.match(/worry|anxious|stress|tension|nervous|fear/gi) || []).length / (wordCount / 20);
  metrics.openness = (text.match(/creative|explore|curious|art|music|books|culture|travel/gi) || []).length / (wordCount / 20);
  
  // Normalize values to range 0-1
  Object.keys(metrics).forEach(key => {
    metrics[key as keyof typeof metrics] = Math.min(Math.max(metrics[key as keyof typeof metrics], 0), 1);
  });
  
  return metrics;
};

const extractInterestsFromText = (text: string): string[] => {
  if (!text) return [];
  
  // Extended keywords to look for in the story
  const interestKeywords = [
    'travel', 'art', 'music', 'reading', 'books', 'hiking', 'nature',
    'cooking', 'food', 'movies', 'fitness', 'gym', 'yoga', 'meditation',
    'technology', 'coding', 'gaming', 'sports', 'photography', 'writing',
    'dance', 'singing', 'languages', 'history', 'science', 'animals', 'pets',
    'theater', 'gardening', 'fashion', 'design', 'architecture', 'astronomy',
    'cars', 'motorsports', 'fishing', 'hunting', 'camping', 'diving', 'swimming',
    'painting', 'drawing', 'sculpture', 'ceramics', 'crafts', 'diy', 'woodworking',
    'metalworking', 'knitting', 'sewing', 'podcasts', 'radio', 'television', 'streaming',
    'blogging', 'vlogging', 'social media', 'investing', 'finance', 'entrepreneurship',
    'volunteering', 'charity', 'activism', 'politics', 'philosophy', 'psychology',
    'spirituality', 'religion', 'mindfulness', 'beer', 'wine', 'cocktails', 'coffee',
    'tea', 'baking', 'vegetarian', 'vegan', 'nutrition', 'cycling', 'running',
    'climbing', 'martial arts', 'tennis', 'golf', 'soccer', 'football', 'basketball',
    'baseball', 'hockey', 'volleyball', 'board games', 'card games', 'puzzles',
    'chess', 'trivia', 'museums', 'galleries', 'concerts', 'festivals', 'nightlife',
    'dancing', 'karaoke', 'comedy', 'stand-up', 'magic', 'astrology', 'supernatural',
    'mythology', 'fantasy', 'sci-fi', 'horror', 'romance', 'thrillers', 'documentaries',
    'biographies', 'classics', 'self-help', 'education', 'languages', 'teaching',
    'mentoring', 'family', 'parenting', 'childcare', 'elder care', 'community',
    'tradition', 'cultural identity', 'heritage'
  ];
  
  return interestKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  );
};

// Calculate compatibility score between two users with enhanced algorithm
export const calculateCompatibility = (user1: UserProfile, user2: UserProfile): number => {
  let score = 0;
  const maxScore = 100;
  
  // Interest matching (up to 30 points)
  const interestWeight = 30;
  if (user1.interests.length && user2.interests.length) {
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * interestWeight;
    score += interestScore;
  }
  
  // Age compatibility (up to 15 points)
  const ageWeight = 15;
  const ageDifference = Math.abs(user1.age - user2.age);
  // Less difference = higher score (max 10 years difference)
  const ageScore = Math.max(0, (1 - ageDifference / 10)) * ageWeight;
  score += ageScore;
  
  // Location (up to 10 points)
  const locationWeight = 10;
  // In a real app, this would calculate distance between locations
  // For now, just check if the locations match
  if (user1.location.split(',')[1]?.trim() === user2.location.split(',')[1]?.trim()) {
    score += locationWeight;
  }
  
  // Personality traits matching (up to 15 points)
  const personalityWeight = 15;
  if (user1.personalityTraits?.length && user2.personalityTraits?.length) {
    const commonTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits?.includes(trait)
    );
    
    // Both similar and complementary traits are important
    const traitScore = (commonTraits.length / Math.min(user1.personalityTraits.length, user2.personalityTraits.length)) * personalityWeight;
    score += traitScore;
  }
  
  // Writing style and psychological compatibility (up to 20 points)
  const writingWeight = 20;
  if (user1.personalStory && user2.personalStory) {
    const style1 = analyzeWritingStyle(user1.personalStory);
    const style2 = analyzeWritingStyle(user2.personalStory);
    
    // Calculate similarity between writing styles and personality traits
    let styleSimilarity = 0;
    let metricsCount = 0;
    
    for (const key in style1) {
      if (style2[key] !== undefined) {
        // For extraversion, agreeableness, we want similarity
        if (['formality', 'complexity', 'detailOrientation', 'agreeableness', 'conscientiousness'].includes(key)) {
          // The closer the values, the higher the similarity (1 - difference)
          styleSimilarity += 1 - Math.abs(style1[key] - style2[key]);
        } else {
          // For other traits, we look for complementary patterns (values that add to about 1)
          // This simulates "opposites attract" for some traits
          const complementaryScore = 1 - Math.abs((style1[key] + style2[key]) - 1);
          styleSimilarity += complementaryScore;
        }
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
  
  // Quiz answer compatibility (up to 15 points if available)
  if (user1.quizAnswers && user2.quizAnswers) {
    const quizWeight = 15;
    let quizSimilarity = 0;
    let questionCount = 0;
    
    // Compare answers to the same questions
    for (const questionId in user1.quizAnswers) {
      if (user2.quizAnswers[questionId]) {
        if (questionId.includes('personal-story') || questionId.includes('childhood') || questionId.includes('goals')) {
          // For free text answers, use our text analysis to compare
          const textSimilarity = compareTextAnswers(
            user1.quizAnswers[questionId],
            user2.quizAnswers[questionId]
          );
          quizSimilarity += textSimilarity;
        } else {
          // For multiple choice, direct comparison
          if (user1.quizAnswers[questionId] === user2.quizAnswers[questionId]) {
            quizSimilarity += 1; // Exact match
          }
        }
        questionCount++;
      }
    }
    
    // Calculate quiz compatibility score
    if (questionCount > 0) {
      const quizScore = (quizSimilarity / questionCount) * quizWeight;
      score += quizScore;
    }
  }
  
  return Math.round(score);
};

// Compare two text answers for similarity
const compareTextAnswers = (text1: string, text2: string): number => {
  // Get writing styles and analyze for similarity
  const style1 = analyzeWritingStyle(text1);
  const style2 = analyzeWritingStyle(text2);
  
  // Calculate similarity score
  let totalSimilarity = 0;
  let comparedMetrics = 0;
  
  for (const key in style1) {
    if (style2[key] !== undefined) {
      const similarity = 1 - Math.abs(style1[key] - style2[key]);
      totalSimilarity += similarity;
      comparedMetrics++;
    }
  }
  
  // Also check for common words and topics
  const interests1 = extractInterestsFromText(text1);
  const interests2 = extractInterestsFromText(text2);
  
  const commonInterests = interests1.filter(interest => 
    interests2.includes(interest)
  );
  
  // Weight the interest similarity heavily as it's important
  const interestSimilarity = commonInterests.length > 0 ? 
    commonInterests.length / Math.max(interests1.length, interests2.length) : 0;
  
  // Combine both metrics
  const overallSimilarity = comparedMetrics > 0 ? 
    (totalSimilarity / comparedMetrics * 0.6) + (interestSimilarity * 0.4) : interestSimilarity;
  
  return overallSimilarity;
};

// Advanced matching with AI factors (simulated)
export const getAiEnhancedMatches = (currentUser: UserProfile, potentialMatches: UserProfile[]): UserProfile[] => {
  // Calculate base compatibility scores
  const scoredMatches = potentialMatches.map(match => ({
    ...match,
    compatibilityScore: calculateCompatibility(currentUser, match)
  }));
  
  // Apply popularity boosting and other advanced factors
  return scoredMatches.sort((a, b) => {
    // Prioritize higher compatibility scores
    const compatibilityDiff = (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
    
    // If scores are close (within 10 points), consider popularity
    if (Math.abs(compatibilityDiff) < 10) {
      const aPopularity = a.popularityPoints || 0;
      const bPopularity = b.popularityPoints || 0;
      
      // If popularity points have significant difference
      if (Math.abs(aPopularity - bPopularity) > 5) {
        return bPopularity - aPopularity;
      }
    }
    
    // Otherwise fall back to compatibility score
    return compatibilityDiff;
  });
};

// Get conversation starters based on profiles
export const getConversationStarters = (user1: UserProfile, user2: UserProfile): string[] => {
  const starters: string[] = [];
  
  // Story-based starters
  if (user1.personalStory && user2.personalStory) {
    const storyInterests = extractInterestsFromText(user2.personalStory);
    
    if (storyInterests.length > 0) {
      // Pick two random interests to mention
      const randomInterests = storyInterests.sort(() => 0.5 - Math.random()).slice(0, 2);
      if (randomInterests.length === 2) {
        starters.push(`I noticed you mentioned ${randomInterests[0]} and ${randomInterests[1]} in your story. I'd love to hear more about your experience with them!`);
      } else if (randomInterests.length === 1) {
        starters.push(`I noticed you mentioned ${randomInterests[0]} in your story. What sparked your interest in that?`);
      }
    }
    
    // Writing style based starters
    const style = analyzeWritingStyle(user2.personalStory);
    
    if (style.emotionality > 0.6) {
      starters.push("Your story was really expressive. Do you consider yourself an emotional person?");
    }
    
    if (style.optimism > 0.7) {
      starters.push("I loved the positive energy in your story. What keeps you so optimistic about life?");
    }
    
    if (style.complexity > 0.7) {
      starters.push("Your writing style is quite thoughtful. Do you enjoy deep conversations about life?");
    }
    
    if (style.extraversion > 0.7) {
      starters.push("You seem like someone who really enjoys social connections. What's your idea of a perfect gathering with friends?");
    }
    
    if (style.openness > 0.7) {
      starters.push("I can tell you're curious and open to new experiences. What's something you've always wanted to try but haven't yet?");
    }
  }
  
  // Find common interests
  const commonInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  );
  
  if (commonInterests.length > 0) {
    // Randomly select up to 2 common interests
    const selectedInterests = commonInterests
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(2, commonInterests.length));
    
    starters.push(`I noticed we both enjoy ${selectedInterests.join(' and ')}. What got you interested in ${selectedInterests.length > 1 ? 'those' : 'that'}?`);
  }
  
  // Location-based starters
  if (user1.location.split(',')[0]?.trim() === user2.location.split(',')[0]?.trim()) {
    starters.push(`I see we're both in ${user1.location.split(',')[0]?.trim()}! What's your favorite spot in the city?`);
  }
  
  // Personality traits based starters
  if (user1.personalityTraits && user2.personalityTraits) {
    const commonTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits?.includes(trait)
    );
    
    if (commonTraits.length > 0) {
      const randomTrait = commonTraits[Math.floor(Math.random() * commonTraits.length)];
      starters.push(`We both identify as ${randomTrait}. How do you think that shows up in your daily life?`);
    }
  }
  
  // Add some general high-quality starters
  const generalStarters = [
    "What's something you're passionate about that most people don't know?",
    "If you could travel anywhere tomorrow, where would you go and why?",
    "What's a book or show that changed how you think about something important?",
    "What's your idea of a perfect day from morning to night?",
    "What's something you've learned recently that fascinated you?",
    "If you could have dinner with anyone, living or dead, who would it be and what would you ask them?",
    "What's something you're looking forward to in the next few months?",
    "What's a small thing that brings you joy on a regular basis?",
    "If you could instantly master any skill, what would you choose?",
    "What's something you believe that most people disagree with?"
  ];
  
  // Add 2-3 random general starters
  const shuffledGeneralStarters = generalStarters.sort(() => 0.5 - Math.random());
  starters.push(...shuffledGeneralStarters.slice(0, 3));
  
  // Filter out duplicates and return
  return [...new Set(starters)];
};

// New function to calculate popularity score based on receiving gifts and engagement
export const calculatePopularityScore = (
  receivedGifts: { rose: number; heart: number; teddy: number; },
  engagementMetrics: { 
    messageCount?: number; 
    responseRate?: number; 
    profileViews?: number; 
  }
): number => {
  let score = 0;
  
  // Gift-based popularity (weighted by gift value)
  score += receivedGifts.rose * 2;    // Each rose is worth 2 points
  score += receivedGifts.heart * 10;   // Each heart is worth 10 points
  score += receivedGifts.teddy * 5;    // Each teddy is worth 5 points
  
  // Engagement-based popularity
  if (engagementMetrics.messageCount) {
    // Each message received is worth 0.5 points (capped at 50 points)
    score += Math.min(engagementMetrics.messageCount * 0.5, 50);
  }
  
  if (engagementMetrics.responseRate) {
    // Response rate from 0 to 1, scale to 0-20 points
    score += engagementMetrics.responseRate * 20;
  }
  
  if (engagementMetrics.profileViews) {
    // Each profile view is worth 0.1 points (capped at 30 points)
    score += Math.min(engagementMetrics.profileViews * 0.1, 30);
  }
  
  return Math.round(score);
};

// Function to check if a profile should get a visibility boost
export const shouldBoostProfile = (popularityScore: number): boolean => {
  // Profiles with more than 50 popularity points get boosted
  return popularityScore >= 50;
};
