/**
 * Safe storage helper to handle cases where storage access is restricted
 * This can happen in:
 * - Private/incognito browsing
 * - When cookies are blocked
 * - In iframes with different origins
 * - In sandboxed environments
 */

// In-memory fallback storage when browser storage is not available
const memoryStorage: Record<string, string> = {};

/**
 * Check if storage is available
 */
export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get item from storage with fallback to memory storage
 */
export function getStorageItem(key: string, type: 'localStorage' | 'sessionStorage' = 'localStorage'): string | null {
  try {
    if (typeof window === 'undefined') {
      return memoryStorage[key] || null;
    }
    
    if (isStorageAvailable(type)) {
      return window[type].getItem(key);
    }
    return memoryStorage[key] || null;
  } catch (error) {
    console.warn(`Error accessing ${type}:`, error);
    return memoryStorage[key] || null;
  }
}

/**
 * Set item in storage with fallback to memory storage
 */
export function setStorageItem(key: string, value: string, type: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
  try {
    if (typeof window === 'undefined') {
      memoryStorage[key] = value;
      return;
    }
    
    if (isStorageAvailable(type)) {
      window[type].setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  } catch (error) {
    console.warn(`Error setting ${type} item:`, error);
    memoryStorage[key] = value;
  }
}

/**
 * Remove item from storage with fallback to memory storage
 */
export function removeStorageItem(key: string, type: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
  try {
    if (typeof window === 'undefined') {
      delete memoryStorage[key];
      return;
    }
    
    if (isStorageAvailable(type)) {
      window[type].removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  } catch (error) {
    console.warn(`Error removing ${type} item:`, error);
    delete memoryStorage[key];
  }
}
