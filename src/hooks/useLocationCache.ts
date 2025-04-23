
import { useState, useEffect } from 'react';

const LOCATION_CACHE_KEY = 'cachedUserLocation';
const LOCATION_CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface CachedLocation {
  timestamp: number;
  location: string;
}

const useLocationCache = () => {
  const [cachedLocation, setCachedLocation] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedData) {
        const parsed: CachedLocation = JSON.parse(cachedData);
        if (Date.now() - parsed.timestamp < LOCATION_CACHE_EXPIRY_MS) {
          setCachedLocation(parsed.location);
          return;
        }
      }
      setCachedLocation(null);
    } catch (e) {
      setCachedLocation(null);
    }
  }, []);

  const cacheLocation = (location: string) => {
    try {
      const data: CachedLocation = {
        timestamp: Date.now(),
        location,
      };
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(data));
      setCachedLocation(location);
    } catch { /* fail silently */ }
  };

  return { cachedLocation, cacheLocation };
};

export default useLocationCache;
