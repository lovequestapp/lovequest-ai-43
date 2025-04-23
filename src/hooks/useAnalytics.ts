
import { useCallback } from 'react';

const useAnalytics = () => {
  const trackSwipe = useCallback((profileId: string, direction: 'left' | 'right') => {
    console.log(`[Analytics] User swiped ${direction} on profile ID: ${profileId}`);
    // Placeholder for real analytics integration
  }, []);

  const trackMatch = useCallback((profileId: string) => {
    console.log(`[Analytics] New match with profile ID: ${profileId}`);
    // Placeholder for real analytics integration
  }, []);

  const trackError = useCallback((error: any) => {
    console.error('[Analytics] Error tracked:', error);
    // Placeholder for real analytics integration
  }, []);

  return { trackSwipe, trackMatch, trackError };
};

export default useAnalytics;
