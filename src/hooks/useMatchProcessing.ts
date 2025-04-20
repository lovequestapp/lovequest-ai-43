import { useState, useCallback, useMemo, useEffect } from 'react';
import { User, UserWithCoordinates, BoostLevelType, UserPreferences } from '@/types/user';
import { calculateDistance } from '@/utils/matching/distance';
import { BOOST_MULTIPLIERS } from '@/utils/matching/filtering';
import { calculateCompatibilityScore } from '@/utils/matching/compatibility';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Use a memoized cache for distance calculations to improve performance
const distanceCache = new Map<string, number>();

// Cache for compatibility scores to avoid recalculations
const compatibilityCache = new Map<string, number>();

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
  verifiedOnly?: boolean,
  onlyShowInterested?: boolean
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

    // Filter by gender interest if option is enabled
    if (onlyShowInterested && profile.interestedIn && profile.interestedIn.length > 0) {
      // Check if the profile is interested in current user's gender
      if (!profile.interestedIn.includes(currentUser.gender)) {
        return false;
      }
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
    if (sortBy === 'compatibility' && !profileScores.has(profile.id)) {
      const cacheKey = `${currentUser.id}-${profile.id}`;
      let score: number;
      
      if (profile.finalScore !== undefined) {
        score = profile.finalScore;
      } else {
        score = calculateCompatibilityScore(currentUser, profile);
      }
      
      const boost = profile.isBoosted && profile.boostLevel 
        ? BOOST_MULTIPLIERS[profile.boostLevel] 
        : 1;
        
      profileScores.set(profile.id, score * boost);
    }
  });

  switch (sortBy) {
    case 'compatibility':
      sortedProfiles.sort((a, b) => {
        return (profileScores.get(b.id) || 0) - (profileScores.get(a.id) || 0);
      });
      break;
      
    case 'distance':
      sortedProfiles.sort((a, b) => {
        if (a.distance === undefined && b.distance !== undefined) return 1;
        if (a.distance !== undefined && b.distance === undefined) return -1;
        if (a.distance === undefined && b.distance === undefined) return 0;
        
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
      // Sort by updated_at field if available, else random fallback
      sortedProfiles.sort((a, b) => {
        const aDate = (a as any).updated_at ? new Date((a as any).updated_at).getTime() : 0;
        const bDate = (b as any).updated_at ? new Date((b as any).updated_at).getTime() : 0;
        if (aDate !== 0 && bDate !== 0) {
          return bDate - aDate;
        }
        return Math.random() - 0.5;
      });
      break;
  }

  return sortedProfiles;
};

export const boostProfile = (
  userId: string,
  profiles: UserWithCoordinates[],
  boostLevel: BoostLevelType
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
  const [onlyShowInterested, setOnlyShowInterested] = useState(false);
  const [sortBy, setSortBy] = useState<'compatibility' | 'distance' | 'popularity' | 'recent'>('compatibility');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  
  // Cache the boost information
  const boostCache = useMemo(() => new Map<string, number>(), []);

  // Calculate distances for all users
  const usersWithDistances = useMemo(() => {
    return calculateDistances(allUsers, currentUser as UserWithCoordinates);
  }, [allUsers, currentUser]);

  // Load user preferences from Supabase
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!currentUser?.id) return;
      
      try {
        setIsLoadingPreferences(true);
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // Convert database format to our UserPreferences type
          const preferences: UserPreferences = {
            maxDistance: data.max_distance,
            ageRange: {
              min: data.min_age,
              max: data.max_age
            },
            notificationsEnabled: true,
            messagePreview: true,
            theme: 'light',
            language: 'en',
            showMeToUsers: true,
            notificationPreferences: {
              messages: true,
              matches: true,
              likes: true,
              app: true
            },
            preferredLocations: [],
            matchingPriorities: {
              distance: 1,
              interests: 1,
              personality: 1,
              age: 1
            }
          };
          
          setUserPreferences(preferences);
          
          // Apply loaded preferences to state
          if (preferences.maxDistance) setMaxDistance(preferences.maxDistance);
          if (preferences.ageRange) setAgeRange([preferences.ageRange.min, preferences.ageRange.max]);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        toast.error('Failed to load your preferences');
      } finally {
        setIsLoadingPreferences(false);
      }
    };
    
    loadUserPreferences();
  }, [currentUser?.id]);

  // Save user preferences to Supabase
  const saveUserPreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    if (!currentUser?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          id: currentUser.id,
          max_distance: preferences.maxDistance || maxDistance || 100,
          min_age: preferences.ageRange?.min || (ageRange ? ageRange[0] : 18),
          max_age: preferences.ageRange?.max || (ageRange ? ageRange[1] : 99),
          preferred_gender: currentUser.interestedIn || []
        });
      
      if (error) throw error;
      
      setUserPreferences(prev => prev ? { ...prev, ...preferences } : null);
      
      if (preferences.maxDistance !== undefined) setMaxDistance(preferences.maxDistance);
      if (preferences.ageRange) setAgeRange([preferences.ageRange.min, preferences.ageRange.max]);
      
      toast.success('Preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      toast.error('Failed to save your preferences');
      return false;
    }
  }, [currentUser?.id, maxDistance, ageRange]);

  // Apply filters to profiles
  const applyFilters = useCallback(() => {
    const filtered = filterProfiles(
      usersWithDistances,
      currentUser,
      maxDistance,
      ageRange?.[0],
      ageRange?.[1],
      verifiedOnly,
      onlyShowInterested
    );
    
    const sorted = sortProfiles(filtered, currentUser, sortBy, boostCache);
    setFilteredUsers(sorted);
  }, [
    usersWithDistances, 
    currentUser, 
    maxDistance, 
    ageRange, 
    verifiedOnly, 
    onlyShowInterested,
    sortBy, 
    boostCache
  ]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Boost user profile 
  const boostUserProfile = useCallback((userId: string, level: BoostLevelType) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const updated = boostProfile(userId, usersWithDistances, level);
      
      // Update the boost cache
      const boostMultiplier = BOOST_MULTIPLIERS[level];
      boostCache.set(userId, boostMultiplier);
      
      // Re-apply filters with boosted profiles
      applyFilters();
      
      toast.success(`Profile boosted with ${level} level`);
      return true;
    } catch (error) {
      console.error('Error boosting profile:', error);
      toast.error('Failed to boost profile');
      return false;
    }
  }, [usersWithDistances, applyFilters, boostCache]);

  return {
    filteredUsers,
    applyFilters,
    setMaxDistance,
    setAgeRange,
    setVerifiedOnly,
    setOnlyShowInterested,
    setSortBy,
    boostProfile: boostUserProfile,
    userPreferences,
    isLoadingPreferences,
    saveUserPreferences,
    maxDistance,
    ageRange,
    verifiedOnly,
    onlyShowInterested,
    sortBy
  };
};

export default useMatchProcessing;
