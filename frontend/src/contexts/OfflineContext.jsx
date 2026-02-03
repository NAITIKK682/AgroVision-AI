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
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached scans
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
      const newScans = [scanData, ...currentScans].slice(0, 10); // Keep last 10
      await set('cached_scans', newScans);
      setCachedScans(newScans);
      return true;
    } catch (error) {
      console.error('Failed to cache scan:', error);
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
    // Implement sync logic when back online
    console.log('Syncing cached scans...');
  };

  return (
    <OfflineContext.Provider 
      value={{ 
        isOnline, 
        cachedScans, 
        isLoading, 
        cacheScan, 
        clearCache,
        syncCachedScans 
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};