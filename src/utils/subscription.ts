
/**
 * Convert old premium status values to new standard format
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
 * Get the subscription level number (for comparisons)
 */
export const getSubscriptionLevel = (status: 'standard' | 'unlimited' | 'vip' | 'admin'): number => {
  switch (status) {
    case 'standard':
      return 0;
    case 'unlimited':
      return 1;
    case 'vip':
      return 2;
    case 'admin':
      return 3;
    default:
      return 0;
  }
};

/**
 * Check if a subscription level meets or exceeds a required level
 */
export const hasRequiredSubscription = (
  userSubscription: 'standard' | 'unlimited' | 'vip' | 'admin',
  requiredSubscription: 'standard' | 'unlimited' | 'vip' | 'admin'
): boolean => {
  const userLevel = getSubscriptionLevel(userSubscription);
  const requiredLevel = getSubscriptionLevel(requiredSubscription);
  return userLevel >= requiredLevel;
};
