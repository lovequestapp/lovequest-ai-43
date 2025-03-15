
/**
 * Utility for managing persistent storage
 * In a production app, this would be more robust with encryption and error handling
 */

// Key prefixes to avoid collisions
const APP_PREFIX = 'lovequest_';

/**
 * Get item from storage with proper error handling and type casting
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${APP_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error retrieving item ${key} from storage:`, error);
    return null;
  }
}

/**
 * Set item in storage with proper error handling
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing item ${key} in storage:`, error);
    
    // Handle storage full error specifically
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Could attempt to clear some space in a real app
      console.warn('Storage quota exceeded. Some data may not be saved.');
    }
    
    return false;
  }
}

/**
 * Remove item from storage
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from storage:`, error);
    return false;
  }
}

/**
 * Clear all app storage (but not other site storage)
 */
export function clearAppStorage(): boolean {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(APP_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing app storage:', error);
    return false;
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = `${APP_PREFIX}test`;
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}
