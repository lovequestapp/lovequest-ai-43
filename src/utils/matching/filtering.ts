
import type { User, UserWithCoordinates, UserPreferences, BoostLevelType } from '@/types/user';

export const isUserVisible = (user: User): boolean => {
  if (!user.preferences) return true;
  return user.preferences.showMeToUsers !== false;
};

export const isWithinDistance = (
  userCoordinates: { latitude: number; longitude: number } | undefined,
  targetCoordinates: { latitude: number; longitude: number } | undefined,
  maxDistance: number
): boolean => {
  if (!userCoordinates || !targetCoordinates) return true;

  const distance = calculateDistance(
    userCoordinates.latitude,
    userCoordinates.longitude,
    targetCoordinates.latitude,
    targetCoordinates.longitude
  );

  return distance <= maxDistance;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Radius of the earth in miles
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
};

export const isWithinAgeRange = (user: User, targetUser: User): boolean => {
  if (!user.preferences?.ageRange) return true;
  
  const { min, max } = user.preferences.ageRange;
  return targetUser.age >= min && targetUser.age <= max;
};

export const BOOST_MULTIPLIERS: Record<BoostLevelType, number> = {
  'none': 1,
  'local': 3,
  'international': 5,
  'super': 10
};
