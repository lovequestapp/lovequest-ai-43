import { useState, useEffect } from 'react';
import { calculateDistance } from '@/utils/matching/distance';
import { BOOST_MULTIPLIERS } from '@/utils/matching/filtering';
import type { UserWithCoordinates, BoostLevelType } from '@/types/user';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const sortByDistance = (a: UserWithCoordinates, b: UserWithCoordinates) => {
  const distA = a.distance !== undefined ? a.distance : Infinity;
  const distB = b.distance !== undefined ? b.distance : Infinity;
  return distA - distB;
};

const sortByScore = (a: UserWithCoordinates, b: UserWithCoordinates) => {
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

      // 1. Calculate Distances
      const calculateDistances = (profiles: UserWithCoordinates[], userLocation: Coordinates): UserWithCoordinates[] => {
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

      const distancedProfiles = calculateDistances(profiles, userLocation);

      // 2. Apply Boosting
      const boostProfile = (profile: UserWithCoordinates): UserWithCoordinates => {
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

      const boostedProfiles = distancedProfiles.map(profile => boostProfile(profile));

      // 3. Calculate Final Score (Placeholder - replace with actual logic)
      const calculateFinalScore = (profile: UserWithCoordinates): number => {
        let baseScore = Math.floor(Math.random() * 50) + 50; // Random score between 50-99
        if (profile.isBoosted) {
          baseScore += baseScore * (BOOST_MULTIPLIERS[profile.boostLevel || 'none'] / 10);
        }
        return baseScore;
      };

      const scoredProfiles = boostedProfiles.map(profile => ({
        ...profile,
        finalScore: calculateFinalScore(profile)
      }));

      // 4. Sort Profiles
      const sortProfiles = (a: UserWithCoordinates, b: UserWithCoordinates) => {
        // Add finalScore property if it doesn't exist
        const scoreA = (a as any).finalScore || 0;
        const scoreB = (b as any).finalScore || 0;
        
        // First sort by boost level
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        
        // Then by score
        return scoreB - scoreA;
      };

      const sortedProfiles = [...scoredProfiles].sort(sortProfiles);

      setProcessedMatches(sortedProfiles);
      setLoading(false);
    };

    processMatches();

  }, [profiles, userLocation]);

  return { processedMatches, loading };
};

export default useMatchProcessing;
