
import { useState, useEffect } from 'react';
import { calculateDistance } from '@/utils/matching/distance';
import { BOOST_MULTIPLIERS } from '@/utils/matching/filtering';
import type { UserWithCoordinates, BoostLevelType } from '@/types/user';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface FilterOptions {
  ageRange: [number, number];
  distance: number;
  genderPreference: string;
  interests: string[];
  searchTerm: string;
  currentUser: any;
}

export const sortByDistance = (a: UserWithCoordinates, b: UserWithCoordinates) => {
  const distA = a.distance !== undefined ? a.distance : Infinity;
  const distB = b.distance !== undefined ? b.distance : Infinity;
  return distA - distB;
};

export const sortByScore = (a: UserWithCoordinates, b: UserWithCoordinates) => {
  return (b.finalScore || 0) - (a.finalScore || 0);
};

export const calculateDistances = (profiles: UserWithCoordinates[], userLocation: Coordinates): UserWithCoordinates[] => {
  return profiles.map(profile => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      profile.coordinates?.latitude || 0,
      profile.coordinates?.longitude || 0
    );
    return { ...profile, distance };
  });
};

export const boostProfile = (profile: UserWithCoordinates): UserWithCoordinates => {
  // Create a new object to avoid mutating the original
  const boostedProfile = { ...profile };
  
  // Give some users boost
  const shouldBoost = Math.random() > 0.7;
  if (shouldBoost) {
    boostedProfile.isBoosted = true;
    
    // Determine boost level
    const boostRoll = Math.random();
    if (boostRoll > 0.9) {
      boostedProfile.boostLevel = 'super';
    } else if (boostRoll > 0.7) {
      boostedProfile.boostLevel = 'international';
    } else {
      boostedProfile.boostLevel = 'local';
    }
  } else {
    boostedProfile.isBoosted = false;
    boostedProfile.boostLevel = 'none';
  }
  
  return boostedProfile;
};

export const calculateFinalScore = (profile: UserWithCoordinates): number => {
  let baseScore = Math.floor(Math.random() * 50) + 50; // Random score between 50-99
  if (profile.isBoosted) {
    baseScore += baseScore * (BOOST_MULTIPLIERS[profile.boostLevel || 'none'] / 10);
  }
  return baseScore;
};

export const filterProfiles = (profiles: UserWithCoordinates[], options: FilterOptions): UserWithCoordinates[] => {
  return profiles.filter(profile => {
    // Filter by age range
    if (profile.age < options.ageRange[0] || profile.age > options.ageRange[1]) {
      return false;
    }
    
    // Filter by gender if not "all"
    if (options.genderPreference !== 'all' && profile.gender !== options.genderPreference) {
      return false;
    }
    
    // Filter by interests if any are selected
    if (options.interests.length > 0) {
      const hasMatchingInterest = profile.interests.some(interest => 
        options.interests.includes(interest)
      );
      if (!hasMatchingInterest) {
        return false;
      }
    }
    
    // Filter by search term
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      const nameMatch = profile.name.toLowerCase().includes(searchLower);
      const bioMatch = profile.bio.toLowerCase().includes(searchLower);
      const locationMatch = profile.location.toLowerCase().includes(searchLower);
      const interestsMatch = profile.interests.some(interest => 
        interest.toLowerCase().includes(searchLower)
      );
      
      if (!(nameMatch || bioMatch || locationMatch || interestsMatch)) {
        return false;
      }
    }
    
    return true;
  });
};

export const sortProfiles = (a: UserWithCoordinates, b: UserWithCoordinates) => {
  // First sort by boost level
  if (a.isBoosted && !b.isBoosted) return -1;
  if (!a.isBoosted && b.isBoosted) return 1;
  
  // Then by score
  return (b.finalScore || 0) - (a.finalScore || 0);
};

const useMatchProcessing = (
  profiles: UserWithCoordinates[],
  userLocation: Coordinates | null
) => {
  const [processedMatches, setProcessedMatches] = useState<UserWithCoordinates[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profiles.length === 0 || userLocation === null) {
      setLoading(false);
      return;
    }

    const processMatches = async () => {
      setLoading(true);

      // Calculate Distances
      const distancedProfiles = calculateDistances(profiles, userLocation);

      // Apply Boosting
      const boostedProfiles = distancedProfiles.map(profile => boostProfile(profile));

      // Calculate Final Score
      const scoredProfiles = boostedProfiles.map(profile => ({
        ...profile,
        finalScore: calculateFinalScore(profile)
      }));

      // Sort Profiles
      const sortedProfiles = [...scoredProfiles].sort(sortProfiles);

      setProcessedMatches(sortedProfiles);
      setLoading(false);
    };

    processMatches();

  }, [profiles, userLocation]);

  return { processedMatches, loading };
};

export default useMatchProcessing;
