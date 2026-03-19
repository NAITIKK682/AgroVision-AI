import { get, set, del, clear, keys } from 'idb-keyval';

export class CacheService {
  // Cache API response
  async cacheAPIResponse(key, data, ttl = 3600000) { // Default 1 hour TTL
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      await set(key, cacheData);
      return true;
    } catch (error) {
      console.error('Cache save error:', error);
      return false;
    }
  }

  // Get cached data
  async getCachedData(key) {
    try {
      const cached = await get(key);
      if (!cached) return null;

      // Check if expired
      const now = Date.now();
      if (now - cached.timestamp > cached.ttl) {
        await del(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Cache retrieve error:', error);
      return null;
    }
  }

  // Cache scan result
  async cacheScan(scanData) {
    try {
      const key = `scan_${Date.now()}`;
      await set(key, scanData);
      
      // Keep track of scan keys
      const scanKeys = await get('scan_keys') || [];
      scanKeys.push(key);
      
      // Keep only last 20 scans
      if (scanKeys.length > 20) {
        const oldKeys = scanKeys.splice(0, scanKeys.length - 20);
        for (const oldKey of oldKeys) {
          await del(oldKey);
        }
      }
      
      await set('scan_keys', scanKeys);
      return key;
    } catch (error) {
      console.error('Scan cache error:', error);
      return null;
    }
  }

  // Get all cached scans
  async getCachedScans() {
    try {
      const scanKeys = await get('scan_keys') || [];
      const scans = [];
      
      for (const key of scanKeys) {
        const scan = await get(key);
        if (scan) {
          scans.push({ key, ...scan });
        }
      }
      
      return scans.reverse(); // Most recent first
    } catch (error) {
      console.error('Get scans error:', error);
      return [];
    }
  }

  // Delete cached scan
  async deleteCachedScan(key) {
    try {
      await del(key);
      
      // Update scan keys
      const scanKeys = await get('scan_keys') || [];
      const updatedKeys = scanKeys.filter(k => k !== key);
      await set('scan_keys', updatedKeys);
      
      return true;
    } catch (error) {
      console.error('Delete scan error:', error);
      return false;
    }
  }

  // Clear all cache
  async clearAllCache() {
    try {
      const scanKeys = await get('scan_keys') || [];
      for (const key of scanKeys) {
        await del(key);
      }
      await del('scan_keys');
      await clear();
      return true;
    } catch (error) {
      console.error('Clear cache error:', error);
      return false;
    }
  }

  // Get cache size
  async getCacheSize() {
    try {
      const allKeys = await keys();
      let totalSize = 0;
      
      for (const key of allKeys) {
        const value = await get(key);
        totalSize += new Blob([JSON.stringify(value)]).size;
      }
      
      return {
        count: allKeys.length,
        size: totalSize,
        sizeFormatted: this.formatBytes(totalSize),
      };
    } catch (error) {
      console.error('Cache size error:', error);
      return { count: 0, size: 0, sizeFormatted: '0 B' };
    }
  }

  // Format bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Prefetch critical data
  async prefetchCriticalData() {
    // Implement prefetching logic for offline mode
    console.log('Prefetching critical data...');
  }
}

export const cacheService = new CacheService();