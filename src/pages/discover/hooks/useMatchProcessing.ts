
import { useState, useCallback, useMemo } from 'react';
import { User, UserWithCoordinates, BoostLevelType } from '@/types/user';
import { calculateDistance } from '@/utils/matching/distance';
import { BOOST_MULTIPLIERS } from '@/utils/matching/filtering';
import { calculateCompatibilityScore } from '@/utils/matching/compatibility';

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

    const distance = calculateDistance(
      currentUser.coordinates.latitude,
      currentUser.coordinates.longitude,
      user.coordinates.latitude,
      user.coordinates.longitude
    );

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
  sortBy: 'compatibility' | 'distance' | 'popularity' | 'recent' = 'compatibility'
): UserWithCoordinates[] => {
  if (!profiles.length || !currentUser) return profiles;

  const sortedProfiles = [...profiles];

  switch (sortBy) {
    case 'compatibility':
      sortedProfiles.sort((a, b) => {
        const scoreA = a.finalScore !== undefined ? a.finalScore : calculateCompatibilityScore(currentUser, a);
        const scoreB = b.finalScore !== undefined ? b.finalScore : calculateCompatibilityScore(currentUser, b);
        
        // Apply boost multiplier
        const boostA = a.isBoosted && a.boostLevel ? BOOST_MULTIPLIERS[a.boostLevel] : 1;
        const boostB = b.isBoosted && b.boostLevel ? BOOST_MULTIPLIERS[b.boostLevel] : 1;
        
        return (scoreB * boostB) - (scoreA * boostA);
      });
      break;
      
    case 'distance':
      sortedProfiles.sort((a, b) => {
        // Put profiles with distance at top
        if (a.distance === undefined && b.distance !== undefined) return 1;
        if (a.distance !== undefined && b.distance === undefined) return -1;
        if (a.distance === undefined && b.distance === undefined) return 0;
        
        // Apply boost for closer profiles
        const distanceA = (a.distance || 0) / (a.isBoosted && a.boostLevel ? BOOST_MULTIPLIERS[a.boostLevel] : 1);
        const distanceB = (b.distance || 0) / (b.isBoosted && b.boostLevel ? BOOST_MULTIPLIERS[b.boostLevel] : 1);
        
        return distanceA - distanceB;
      });
      break;
      
    case 'popularity':
      sortedProfiles.sort((a, b) => {
        const popularityA = a.popularityPoints * (a.isBoosted && a.boostLevel ? BOOST_MULTIPLIERS[a.boostLevel] : 1);
        const popularityB = b.popularityPoints * (b.isBoosted && b.boostLevel ? BOOST_MULTIPLIERS[b.boostLevel] : 1);
        return popularityB - popularityA;
      });
      break;
      
    case 'recent':
      // This would require a createdAt or lastActive field
      // For now, just randomize
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
    
    const sorted = sortProfiles(filtered, currentUser, sortBy);
    setFilteredUsers(sorted);
  }, [usersWithDistances, currentUser, maxDistance, ageRange, verifiedOnly, sortBy]);

  const boostUserProfile = useCallback((userId: string, level: 'local' | 'international') => {
    const updated = boostProfile(userId, usersWithDistances, level);
    applyFilters();
    return true;
  }, [usersWithDistances, applyFilters]);

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
