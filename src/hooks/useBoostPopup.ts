
import { useState, useEffect } from 'react';

// This hook manages when to show the profile boost popup
export function useBoostPopup() {
  const [showBoostPopup, setShowBoostPopup] = useState(false);
  
  useEffect(() => {
    // Check if the user has already seen the popup today
    const lastShownDate = localStorage.getItem('boostPopupLastShown');
    const hasSeenToday = lastShownDate === new Date().toDateString();
    
    if (!hasSeenToday) {
      // Randomly show the popup with a 1/3 chance after a delay
      const shouldShow = Math.random() < 0.33;
      
      if (shouldShow) {
        const timer = setTimeout(() => {
          setShowBoostPopup(true);
          localStorage.setItem('boostPopupLastShown', new Date().toDateString());
        }, 30000); // Show after 30 seconds of activity
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  // Force show the popup (for testing)
  const forceShowPopup = () => {
    setShowBoostPopup(true);
  };
  
  const closePopup = () => {
    setShowBoostPopup(false);
  };
  
  return {
    showBoostPopup,
    closePopup,
    forceShowPopup
  };
}
