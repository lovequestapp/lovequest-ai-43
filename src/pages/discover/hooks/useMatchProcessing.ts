
import { useState, useCallback, useMemo } from 'react';
import { User, UserWithCoordinates, BoostLevelType } from '@/types/user';
import { calculateDistance } from '@/utils/matching/distance';
import { BOOST_MULTIPLIERS } from '@/utils/matching/filtering';
import { calculateCompatibilityScore } from '@/utils/matching/compatibility';

// Use a memoized cache for distance calculations to improve performance
const distanceCache = new Map<string, number>();

export const calculateDistances = (
  users: UserWithCoordinates[],
  currentUser: UserWithCoordinates | null
): UserWithCoordinates[] => {
  if (!currentUser || !currentUser.coordinates) {
    return users;
  }

  return users.map(user => {
    if (!user.coordinates) {
      return { ...user, distance: undefined };
    }

    // Create a cache key based on coordinates
    const cacheKey = `${currentUser.coordinates.latitude},${currentUser.coordinates.longitude}-${user.coordinates.latitude},${user.coordinates.longitude}`;
    
    // Check if distance is already cached
    if (distanceCache.has(cacheKey)) {
      return { ...user, distance: distanceCache.get(cacheKey) };
    }
    
    // Calculate distance if not cached
    const distance = calculateDistance(
      currentUser.coordinates.latitude,
      currentUser.coordinates.longitude,
      user.coordinates.latitude,
      user.coordinates.longitude
    );
    
    // Cache the result
    distanceCache.set(cacheKey, distance);

    return { ...user, distance };
  });
};

export const filterProfiles = (
  profiles: UserWithCoordinates[],
  currentUser: User | null,
  maxDistance?: number,
  minAge?: number,
  maxAge?: number,
  verifiedOnly?: boolean
): UserWithCoordinates[] => {
  if (!currentUser) return profiles;
  
  // Use array filter once instead of multiple loops for better performance
  return profiles.filter(profile => {
    // Skip filtering the current user
    if (profile.id === currentUser.id) return false;

    // Filter by distance if specified
    if (maxDistance && profile.distance !== undefined && profile.distance > maxDistance) {
      return false;
    }

    // Filter by age range if specified
    if (minAge && profile.age < minAge) return false;
    if (maxAge && profile.age > maxAge) return false;

    // Filter by verification status if required
    if (verifiedOnly && profile.verificationStatus !== 'verified') {
      return false;
    }

    return true;
  });
};

export const sortProfiles = (
  profiles: UserWithCoordinates[],
  currentUser: User | null,
  sortBy: 'compatibility' | 'distance' | 'popularity' | 'recent' = 'compatibility',
  boostCache = new Map<string, number>()
): UserWithCoordinates[] => {
  if (!profiles.length || !currentUser) return profiles;

  const sortedProfiles = [...profiles];
  
  // Precompute scores for each profile to avoid recalculating during sort
  const profileScores = new Map<string, number>();
  
  profiles.forEach(profile => {
    // Cache the compatibility score
    if (sortBy === 'compatibility' && !profileScores.has(profile.id)) {
      const score = profile.finalScore !== undefined 
        ? profile.finalScore 
        : calculateCompatibilityScore(currentUser, profile);
        
      const boost = profile.isBoosted && profile.boostLevel 
        ? BOOST_MULTIPLIERS[profile.boostLevel] 
        : 1;
        
      profileScores.set(profile.id, score * boost);
    }
  });

  switch (sortBy) {
    case 'compatibility':
      sortedProfiles.sort((a, b) => {
        return profileScores.get(b.id) || 0 - (profileScores.get(a.id) || 0);
      });
      break;
      
    case 'distance':
      sortedProfiles.sort((a, b) => {
        // Put profiles with distance at top
        if (a.distance === undefined && b.distance !== undefined) return 1;
        if (a.distance !== undefined && b.distance === undefined) return -1;
        if (a.distance === undefined && b.distance === undefined) return 0;
        
        // Apply boost for closer profiles
        const boostA = a.isBoosted && a.boostLevel ? BOOST_MULTIPLIERS[a.boostLevel] : 1;
        const boostB = b.isBoosted && b.boostLevel ? BOOST_MULTIPLIERS[b.boostLevel] : 1;
        
        const distanceA = (a.distance || 0) / boostA;
        const distanceB = (b.distance || 0) / boostB;
        
        return distanceA - distanceB;
      });
      break;
      
    case 'popularity':
      sortedProfiles.sort((a, b) => {
        const boostA = a.isBoosted && a.boostLevel ? BOOST_MULTIPLIERS[a.boostLevel] : 1;
        const boostB = b.isBoosted && b.boostLevel ? BOOST_MULTIPLIERS[b.boostLevel] : 1;
        
        const popularityA = a.popularityPoints * boostA;
        const popularityB = b.popularityPoints * boostB;
        
        return popularityB - popularityA;
      });
      break;
      
    case 'recent':
      // Use a more efficient shuffling algorithm for random ordering
      for (let i = sortedProfiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedProfiles[i], sortedProfiles[j]] = [sortedProfiles[j], sortedProfiles[i]];
      }
      break;
  }

  return sortedProfiles;
};

export const boostProfile = (
  userId: string,
  profiles: UserWithCoordinates[],
  boostLevel: 'local' | 'international'
): UserWithCoordinates[] => {
  return profiles.map(profile => {
    if (profile.id === userId) {
      return {
        ...profile,
        isBoosted: true,
        boostLevel
      };
    }
    return profile;
  });
};

export const useMatchProcessing = (
  allUsers: UserWithCoordinates[],
  currentUser: User | null
) => {
  const [filteredUsers, setFilteredUsers] = useState<UserWithCoordinates[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined);
  const [ageRange, setAgeRange] = useState<[number, number] | undefined>(undefined);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'compatibility' | 'distance' | 'popularity' | 'recent'>('compatibility');
  
  // Cache the boost information
  const boostCache = useMemo(() => new Map<string, number>(), []);

  const usersWithDistances = useMemo(() => {
    return calculateDistances(allUsers, currentUser as UserWithCoordinates);
  }, [allUsers, currentUser]);

  const applyFilters = useCallback(() => {
    const filtered = filterProfiles(
      usersWithDistances,
      currentUser,
      maxDistance,
      ageRange?.[0],
      ageRange?.[1],
      verifiedOnly
    );
    
    const sorted = sortProfiles(filtered, currentUser, sortBy, boostCache);
    setFilteredUsers(sorted);
  }, [usersWithDistances, currentUser, maxDistance, ageRange, verifiedOnly, sortBy, boostCache]);

  const boostUserProfile = useCallback((userId: string, level: 'local' | 'international') => {
    const updated = boostProfile(userId, usersWithDistances, level);
    
    // Update the boost cache
    const boostMultiplier = level === 'local' ? BOOST_MULTIPLIERS.local : BOOST_MULTIPLIERS.international;
    boostCache.set(userId, boostMultiplier);
    
    applyFilters();
    return true;
  }, [usersWithDistances, applyFilters, boostCache]);

  return {
    filteredUsers,
    applyFilters,
    setMaxDistance,
    setAgeRange,
    setVerifiedOnly,
    setSortBy,
    boostProfile: boostUserProfile
  };
};

export default useMatchProcessing;
