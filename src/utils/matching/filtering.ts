
import { UserWithCoordinates, BoostLevelType } from '@/types/user';

// Define the boost multipliers including 'super' level
export const BOOST_MULTIPLIERS: Record<BoostLevelType, number> = {
  'none': 1,
  'local': 1.5,
  'international': 2,
  'super': 3
};

export const filterByDistance = (
  users: UserWithCoordinates[], 
  maxDistance?: number
): UserWithCoordinates[] => {
  if (!maxDistance) return users;
  
  return users.filter(user => 
    !user.distance || user.distance <= maxDistance
  );
};

export const filterByAge = (
  users: UserWithCoordinates[],
  minAge?: number,
  maxAge?: number
): UserWithCoordinates[] => {
  let filtered = [...users];
  
  if (minAge) {
    filtered = filtered.filter(user => user.age >= minAge);
  }
  
  if (maxAge) {
    filtered = filtered.filter(user => user.age <= maxAge);
  }
  
  return filtered;
};

export const filterByVerification = (
  users: UserWithCoordinates[],
  verifiedOnly: boolean = false
): UserWithCoordinates[] => {
  if (!verifiedOnly) return users;
  
  return users.filter(user => 
    user.verificationStatus === 'verified'
  );
};

export const applyBoostMultiplier = (
  score: number,
  boostLevel: BoostLevelType = 'none'
): number => {
  return score * BOOST_MULTIPLIERS[boostLevel];
};
