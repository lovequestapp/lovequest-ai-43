
/**
 * Utility functions for App Store compliance and mobile optimization
 */

// App version information
export const appVersion = {
  version: '1.0.0',
  buildNumber: '1',
  releaseDate: new Date().toISOString()
};

// Required app URLs for App Store
export const appUrls = {
  supportUrl: 'https://lovequestai.com/support',
  marketingUrl: 'https://lovequestai.com',
  privacyPolicyUrl: 'https://lovequestai.com/privacy-policy',
  termsOfServiceUrl: 'https://lovequestai.com/terms-of-service'
};

// Content moderation helper
export const contentModeration = {
  /**
   * Check if text contains inappropriate content
   */
  checkTextContent: (text: string): { isAppropriate: boolean; reason?: string } => {
    // This is a simple implementation - in production you'd use a content moderation API
    const prohibitedWords = ['obscenity1', 'obscenity2', 'slur1', 'slur2'];
    const lowerText = text.toLowerCase();
    
    for (const word of prohibitedWords) {
      if (lowerText.includes(word)) {
        return { 
          isAppropriate: false, 
          reason: 'Text contains prohibited language' 
        };
      }
    }
    
    return { isAppropriate: true };
  },
  
  /**
   * Check if image is appropriate
   * In production, this would integrate with a visual moderation API
   */
  checkImageContent: (imageUrl: string): Promise<{ isAppropriate: boolean; reason?: string }> => {
    // Placeholder for image moderation API integration
    return Promise.resolve({ isAppropriate: true });
  }
};

// In-app purchase product IDs
export const iapProducts = {
  premium: 'com.lovequestai.premium',
  vip: 'com.lovequestai.vip',
  boost: 'com.lovequestai.boost',
  gifts: 'com.lovequestai.gifts'
};

// User age verification utility
export const verifyUserAge = (birthdate: Date): boolean => {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Debug mode detection
export const isDebugMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
