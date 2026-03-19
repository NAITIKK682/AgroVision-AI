import { createContext, useState, useEffect, useContext } from 'react';
import { get, set, del, clear } from 'idb-keyval';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedScans, setCachedScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCachedScans();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedScans = async () => {
    try {
      const scans = await get('cached_scans');
      setCachedScans(scans || []);
    } catch (error) {
      console.error('Failed to load cached scans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cacheScan = async (scanData) => {
    try {
      const currentScans = await get('cached_scans') || [];
      const newScans = [scanData, ...currentScans].slice(0, 10);
      await set('cached_scans', newScans);
      setCachedScans(newScans);
      return true;
    } catch (error) {
      console.error('Failed to cache scan:', error);
      return false;
    }
  };

  /**
   * FIXED DELETE FUNCTION: 
   * Ab hum 'index' ka use kar rahe hain taaki sirf wahi item delete ho jis par click kiya hai.
   */
  const deleteCachedScan = async (indexToDelete) => {
    try {
      const currentScans = [...cachedScans]; // Current state ki copy
      
      // Sirf us index wale item ko array se hatayein
      currentScans.splice(indexToDelete, 1);
      
      // Updated array ko wapas store karein
      await set('cached_scans', currentScans);
      setCachedScans(currentScans); // UI update
      return true;
    } catch (error) {
      console.error('Failed to delete specific scan:', error);
      return false;
    }
  };

  const clearCache = async () => {
    try {
      await del('cached_scans');
      setCachedScans([]);
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  };

  const syncCachedScans = async () => {
    console.log('Syncing cached scans...');
  };

  return (
    <OfflineContext.Provider 
      value={{ 
        isOnline, 
        cachedScans, 
        isLoading, 
        cacheScan, 
        deleteCachedScan, 
        clearCache,
        syncCachedScans 
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};