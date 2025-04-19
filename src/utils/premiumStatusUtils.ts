
/**
 * Convert old premium status values to new ones
 */
export const convertPremiumStatus = (status: string): 'standard' | 'unlimited' | 'vip' | 'admin' => {
  switch(status) {
    case 'basic':
      return 'standard';
    case 'premium':
      return 'unlimited';
    case 'trial':
      return 'standard';
    case 'standard':
    case 'unlimited':
    case 'vip':
    case 'admin':
      return status as 'standard' | 'unlimited' | 'vip' | 'admin';
    default:
      return 'standard';
  }
};

/**
 * Map numeric levels to subscription status
 */
export const getSubscriptionLevel = (status: 'standard' | 'unlimited' | 'vip' | 'admin'): number => {
  switch(status) {
    case 'standard': return 0;
    case 'unlimited': return 1;
    case 'vip': return 2;
    case 'admin': return 3;
    default: return 0;
  }
};

/**
 * Check if user subscription meets or exceeds required level
 */
export const hasRequiredSubscription = (
  userStatus: 'standard' | 'unlimited' | 'vip' | 'admin', 
  requiredStatus: 'standard' | 'unlimited' | 'vip' | 'admin'
): boolean => {
  return getSubscriptionLevel(userStatus) >= getSubscriptionLevel(requiredStatus);
};

/**
 * Get a display name for a subscription level
 */
export const getSubscriptionDisplayName = (status: string): string => {
  const normalizedStatus = convertPremiumStatus(status);
  
  switch(normalizedStatus) {
    case 'standard': return 'Standard';
    case 'unlimited': return 'Unlimited';
    case 'vip': return 'VIP';
    case 'admin': return 'Admin';
    default: return 'Standard';
  }
};
