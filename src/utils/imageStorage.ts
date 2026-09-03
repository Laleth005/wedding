/**
 * Robust IndexedDB image storage utility.
 * IndexedDB has gigabytes of storage capacity, eliminating localStorage's strict 5MB quota errors.
 */

const DB_NAME = 'wedding_invitation_db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Save an image (dataURL or string) safely into IndexedDB.
 */
export async function saveStoredImage(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[ImageStore] Failed to save to IndexedDB for key "${key}":`, err);
    // Fallback: try localStorage with try-catch guard
    try {
      localStorage.setItem(key, dataUrl);
    } catch {
      // Storage quota exceeded in localStorage - silently ignore to prevent crash
    }
  }
}

/**
 * Retrieve an image from IndexedDB, with graceful fallback to localStorage.
 */
export async function getStoredImage(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const val = req.result as string | undefined;
        if (val) {
          resolve(val);
        } else {
          // Check localStorage as legacy fallback
          try {
            const lsVal = localStorage.getItem(key);
            resolve(lsVal || null);
          } catch {
            resolve(null);
          }
        }
      };

      req.onerror = () => {
        try {
          resolve(localStorage.getItem(key));
        } catch {
          resolve(null);
        }
      };
    });
  } catch {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

/**
 * Remove an item from IndexedDB and localStorage.
 */
export async function removeStoredImage(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[ImageStore] Failed to remove key "${key}" from IndexedDB:`, err);
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore error
  }
}

/**
 * Clean up legacy localStorage keys to free up quota.
 */
export function cleanupLegacyStorage(keys: string[]): void {
  try {
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore error
  }
}
