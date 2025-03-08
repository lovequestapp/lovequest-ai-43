interface UserProfile {
  interests: string[];
  age: number;
  location: string;
  locationPreferences?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  personalStory?: string;
  popularityPoints?: number;
  personalityTraits?: string[];
  quizAnswers?: Record<string, string>;
}

const analyzeWritingStyle = (text: string): Record<string, number> => {
  if (!text) return {};
  
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
  
  const sentences = text.split(/[.!?]/);
  const wordCount = text.split(/\s+/).length;
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  metrics.formality = text.includes('professional') || text.includes('career') ? 0.8 : 0.5;
  metrics.emotionality = (text.match(/!|love|happy|sad|feel|emotion/gi) || []).length / (text.length / 100);
  metrics.complexity = avgSentenceLength / 10;
  metrics.optimism = (text.match(/love|happy|success|hope|dream|future|positive/gi) || []).length / 
                     ((text.match(/challenging|difficult|problem|issue|worry|concern/gi) || []).length + 1);
  metrics.detailOrientation = (text.match(/specifically|details|precisely|exactly|particularly/gi) || []).length > 0 ? 0.7 : 0.4;
  
  metrics.extraversion = (text.match(/party|social|friends|outgoing|energetic|group/gi) || []).length / (wordCount / 20);
  metrics.agreeableness = (text.match(/help|care|understand|support|kind|compassion/gi) || []).length / (wordCount / 20);
  metrics.conscientiousness = (text.match(/plan|organize|responsible|goal|achieve|discipline/gi) || []).length / (wordCount / 20);
  metrics.neuroticism = (text.match(/worry|anxious|stress|tension|nervous|fear/gi) || []).length / (wordCount / 20);
  metrics.openness = (text.match(/creative|explore|curious|art|music|books|culture|travel/gi) || []).length / (wordCount / 20);
  
  Object.keys(metrics).forEach(key => {
    metrics[key as keyof typeof metrics] = Math.min(Math.max(metrics[key as keyof typeof metrics], 0), 1);
  });
  
  return metrics;
};

const extractInterestsFromText = (text: string): string[] => {
  if (!text) return [];
  
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

const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

export const calculateCompatibility = (user1: UserProfile, user2: UserProfile): number => {
  let score = 0;
  const maxScore = 100;
  
  const interestWeight = 30;
  if (user1.interests.length && user2.interests.length) {
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * interestWeight;
    score += interestScore;
  }
  
  const ageWeight = 15;
  const ageDifference = Math.abs(user1.age - user2.age);
  const ageScore = Math.max(0, (1 - ageDifference / 10)) * ageWeight;
  score += ageScore;
  
  const locationWeight = 20;
  let locationScore = 0;
  
  if (user1.coordinates && user2.coordinates) {
    const distance = calculateDistance(
      user1.coordinates.latitude,
      user1.coordinates.longitude,
      user2.coordinates.latitude,
      user2.coordinates.longitude
    );
    
    locationScore = Math.max(0, (1 - distance / 500)) * locationWeight;
  } else {
    if (user1.location.split(',')[1]?.trim() === user2.location.split(',')[1]?.trim()) {
      locationScore = 0.7 * locationWeight;
      
      if (user1.location.split(',')[0]?.trim() === user2.location.split(',')[0]?.trim()) {
        locationScore = locationWeight;
      }
    }
  }
  
  if (user1.locationPreferences && user1.locationPreferences.length > 0) {
    const user2Region = user2.location.split(',')[1]?.trim();
    
    if (user2Region && user1.locationPreferences.includes(user2Region)) {
      locationScore = Math.min(locationWeight, locationScore + 5);
    }
  }
  
  score += locationScore;
  
  const personalityWeight = 15;
  if (user1.personalityTraits?.length && user2.personalityTraits?.length) {
    const commonTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits?.includes(trait)
    );
    
    const traitScore = (commonTraits.length / Math.min(user1.personalityTraits.length, user2.personalityTraits.length)) * personalityWeight;
    score += traitScore;
  }
  
  const writingWeight = 20;
  if (user1.personalStory && user2.personalStory) {
    const style1 = analyzeWritingStyle(user1.personalStory);
    const style2 = analyzeWritingStyle(user2.personalStory);
    
    let styleSimilarity = 0;
    let metricsCount = 0;
    
    for (const key in style1) {
      if (style2[key] !== undefined) {
        if (['formality', 'complexity', 'detailOrientation', 'agreeableness', 'conscientiousness'].includes(key)) {
          styleSimilarity += 1 - Math.abs(style1[key] - style2[key]);
        } else {
          const complementaryScore = 1 - Math.abs((style1[key] + style2[key]) - 1);
          styleSimilarity += complementaryScore;
        }
        metricsCount++;
      }
    }
    
    const writingScore = metricsCount > 0 ? 
      (styleSimilarity / metricsCount) * writingWeight : 0;
    
    score += writingScore;
    
    const storyInterests1 = extractInterestsFromText(user1.personalStory);
    const storyInterests2 = extractInterestsFromText(user2.personalStory);
    
    const commonStoryInterests = storyInterests1.filter(
      interest => storyInterests2.includes(interest)
    );
    
    if (commonStoryInterests.length > 0) {
      score += Math.min(commonStoryInterests.length * 2, 10);
    }
  }
  
  if (user1.quizAnswers && user2.quizAnswers) {
    const quizWeight = 15;
    let quizSimilarity = 0;
    let questionCount = 0;
    
    for (const questionId in user1.quizAnswers) {
      if (user2.quizAnswers[questionId]) {
        if (questionId.includes('personal-story') || questionId.includes('childhood') || questionId.includes('goals')) {
          const textSimilarity = compareTextAnswers(
            user1.quizAnswers[questionId],
            user2.quizAnswers[questionId]
          );
          quizSimilarity += textSimilarity;
        } else {
          if (user1.quizAnswers[questionId] === user2.quizAnswers[questionId]) {
            quizSimilarity += 1;
          }
        }
        questionCount++;
      }
    }
    
    if (questionCount > 0) {
      const quizScore = (quizSimilarity / questionCount) * quizWeight;
      score += quizScore;
    }
  }
  
  return Math.round(score);
};

const compareTextAnswers = (text1: string, text2: string): number => {
  const style1 = analyzeWritingStyle(text1);
  const style2 = analyzeWritingStyle(text2);
  
  let totalSimilarity = 0;
  let comparedMetrics = 0;
  
  for (const key in style1) {
    if (style2[key] !== undefined) {
      const similarity = 1 - Math.abs(style1[key] - style2[key]);
      totalSimilarity += similarity;
      comparedMetrics++;
    }
  }
  
  const interests1 = extractInterestsFromText(text1);
  const interests2 = extractInterestsFromText(text2);
  
  const commonInterests = interests1.filter(interest => 
    interests2.includes(interest)
  );
  
  const interestSimilarity = commonInterests.length > 0 ? 
    commonInterests.length / Math.max(interests1.length, interests2.length) : 0;
  
  const overallSimilarity = comparedMetrics > 0 ? 
    (totalSimilarity / comparedMetrics * 0.6) + (interestSimilarity * 0.4) : interestSimilarity;
  
  return overallSimilarity;
};

export const filterMatchesByLocationPreference = (
  currentUser: UserProfile, 
  potentialMatches: UserProfile[]
): UserProfile[] => {
  if (!currentUser.locationPreferences || currentUser.locationPreferences.length === 0) {
    return potentialMatches;
  }
  
  return potentialMatches.filter(match => {
    const matchRegion = match.location.split(',')[1]?.trim();
    return matchRegion && currentUser.locationPreferences?.includes(matchRegion);
  });
};

export const getAiEnhancedMatches = (currentUser: UserProfile, potentialMatches: UserProfile[]): UserProfile[] => {
  const locationFilteredMatches = currentUser.locationPreferences?.length ? 
    filterMatchesByLocationPreference(currentUser, potentialMatches) : 
    potentialMatches;
    
  const scoredMatches = locationFilteredMatches.map(match => ({
    ...match,
    compatibilityScore: calculateCompatibility(currentUser, match)
  }));
  
  return scoredMatches.sort((a, b) => {
    const compatibilityDiff = (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
    
    if (Math.abs(compatibilityDiff) < 10) {
      const aPopularity = a.popularityPoints || 0;
      const bPopularity = b.popularityPoints || 0;
      
      if (Math.abs(aPopularity - bPopularity) > 5) {
        return bPopularity - aPopularity;
      }
    }
    
    return compatibilityDiff;
  });
};

export const getConversationStarters = (user1: UserProfile, user2: UserProfile): string[] => {
  const starters: string[] = [];
  
  if (user1.personalStory && user2.personalStory) {
    const storyInterests = extractInterestsFromText(user2.personalStory);
    
    if (storyInterests.length > 0) {
      const randomInterests = storyInterests.sort(() => 0.5 - Math.random()).slice(0, 2);
      if (randomInterests.length === 2) {
        starters.push(`I noticed you mentioned ${randomInterests[0]} and ${randomInterests[1]} in your story. I'd love to hear more about your experience with them!`);
      } else if (randomInterests.length === 1) {
        starters.push(`I noticed you mentioned ${randomInterests[0]} in your story. What sparked your interest in that?`);
      }
    }
    
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
  
  const commonInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  );
  
  if (commonInterests.length > 0) {
    const selectedInterests = commonInterests
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(2, commonInterests.length));
    
    starters.push(`I noticed we both enjoy ${selectedInterests.join(' and ')}. What got you interested in ${selectedInterests.length > 1 ? 'those' : 'that'}?`);
  }
  
  if (user1.location.split(',')[0]?.trim() === user2.location.split(',')[0]?.trim()) {
    starters.push(`I see we're both in ${user1.location.split(',')[0]?.trim()}! What's your favorite spot in the city?`);
  }
  
  if (user1.personalityTraits && user2.personalityTraits) {
    const commonTraits = user1.personalityTraits.filter(trait => 
      user2.personalityTraits?.includes(trait)
    );
    
    if (commonTraits.length > 0) {
      const randomTrait = commonTraits[Math.floor(Math.random() * commonTraits.length)];
      starters.push(`We both identify as ${randomTrait}. How do you think that shows up in your daily life?`);
    }
  }
  
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
  
  const shuffledGeneralStarters = generalStarters.sort(() => 0.5 - Math.random());
  starters.push(...shuffledGeneralStarters.slice(0, 3));
  
  return [...new Set(starters)];
};

export const calculatePopularityScore = (
  receivedGifts: { rose: number; heart: number; teddy: number; },
  engagementMetrics: { 
    messageCount?: number; 
    responseRate?: number; 
    profileViews?: number; 
  }
): number => {
  let score = 0;
  
  score += receivedGifts.rose * 2;
  score += receivedGifts.heart * 10;
  score += receivedGifts.teddy * 5;
  
  if (engagementMetrics.messageCount) {
    score += Math.min(engagementMetrics.messageCount * 0.5, 50);
  }
  
  if (engagementMetrics.responseRate) {
    score += engagementMetrics.responseRate * 20;
  }
  
  if (engagementMetrics.profileViews) {
    score += Math.min(engagementMetrics.profileViews * 0.1, 30);
  }
  
  return Math.round(score);
};

export const shouldBoostProfile = (popularityScore: number): boolean => {
  return popularityScore >= 50;
};

export const getNearbyUsers = (
  currentUser: UserProfile,
  potentialMatches: UserProfile[],
  radiusKm: number = 50
): UserProfile[] => {
  if (!currentUser.coordinates) {
    return potentialMatches;
  }
  
  return potentialMatches.filter(match => {
    if (!match.coordinates) return false;
    
    const distance = calculateDistance(
      currentUser.coordinates!.latitude,
      currentUser.coordinates!.longitude,
      match.coordinates.latitude,
      match.coordinates.longitude
    );
    
    return distance <= radiusKm;
  });
};
