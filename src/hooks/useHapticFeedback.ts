
import { useEffect, useRef } from 'react';

const useHapticFeedback = () => {
  const supportsVibration = useRef(false);

  useEffect(() => {
    supportsVibration.current = 'vibrate' in window.navigator;
  }, []);

  const triggerFeedback = (pattern: number | number[] = 50) => {
    if (supportsVibration.current) {
      window.navigator.vibrate(pattern);
    }
  };

  return {
    triggerFeedback,
  };
};

export default useHapticFeedback;
