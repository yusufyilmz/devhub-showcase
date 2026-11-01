/**
 * PWA Cache Management Utilities
 *
 * Client-side utilities for managing and debugging service worker caches
 */

import { useCallback, useEffect, useState } from "react";

import { createComponentLogger } from "../../../utils/src/logger/client";

const logger = createComponentLogger("CacheManager");

export interface CacheInfo {
  entries: string[];
  lastModified?: number;
  name: string;
  size: number;
}

const CACHE_PREFIX = "devhub-showcase";

/**
 * Get information about all caches
 */
export async function getCacheInfo(): Promise<CacheInfo[]> {
  if (!("caches" in window)) {
    logger.warn("Cache API not supported");
    return [];
  }

  try {
    const cacheNames = await caches.keys();
    const cacheInfo: CacheInfo[] = [];

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();

      cacheInfo.push({
        entries: keys.map((req) => req.url),
        lastModified: Date.now(), // Could be enhanced with actual timestamps
        name: cacheName,
        size: keys.length,
      });
    }

    return cacheInfo;
  } catch (error) {
    logger.error("Error getting cache info:", { error });
    return [];
  }
}

/**
 * Clear a specific cache
 */
export async function clearCache(cacheName: string): Promise<boolean> {
  if (!("caches" in window)) {
    logger.warn("Cache API not supported");
    return false;
  }

  try {
    const success = await caches.delete(cacheName);
    logger.trace(`Cache ${cacheName} cleared:`, { success });
    return success;
  } catch (error) {
    logger.error("Error clearing cache:", { error });
    return false;
  }
}

/**
 * Clear all app caches
 */
export async function clearAllCaches(): Promise<number> {
  if (!("caches" in window)) {
    logger.warn("Cache API not supported");
    return 0;
  }

  try {
    const cacheNames = await caches.keys();
    const appCaches = cacheNames.filter((name) => name.startsWith(CACHE_PREFIX));

    const deletePromises = appCaches.map((name) => caches.delete(name));
    const results = await Promise.all(deletePromises);

    const clearedCount = results.filter((result) => result).length;
    logger.trace(`Cleared ${clearedCount} caches`);
    return clearedCount;
  } catch (error) {
    logger.error("Error clearing all caches:", { error });
    return 0;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalCaches: number;
  totalEntries: number;
  cachesByType: Record<string, number>;
  oldestCache?: string;
  newestCache?: string;
}> {
  const cacheInfo = await getCacheInfo();

  const stats = {
    cachesByType: {} as Record<string, number>,
    newestCache: undefined as string | undefined,
    oldestCache: undefined as string | undefined,
    totalCaches: cacheInfo.length,
    totalEntries: cacheInfo.reduce((sum, cache) => sum + cache.size, 0),
  };

  // Group by cache type
  for (const cache of cacheInfo) {
    const type = cache.name.split("-").pop() || "unknown";
    stats.cachesByType[type] = (stats.cachesByType[type] || 0) + cache.size;
  }

  // Find oldest and newest (simplified - could use actual timestamps)
  if (cacheInfo.length > 0) {
    stats.oldestCache = cacheInfo?.[0]?.name;
    stats.newestCache = cacheInfo?.[cacheInfo.length - 1]?.name ?? undefined;
  }

  return stats;
}

/**
 * Force service worker update
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    logger.warn("Service Worker not supported");
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      logger.warn("No service worker registration found");
      return false;
    }

    await registration.update();
    logger.trace("Service worker update triggered");
    return true;
  } catch (error) {
    logger.error("Error updating service worker:", { error });
    return false;
  }
}

/**
 * Debug cache contents
 */
export async function debugCache(cacheName?: string): Promise<void> {
  const cacheInfo = await getCacheInfo();

  if (cacheName) {
    const cache = cacheInfo.find((c) => c.name === cacheName);
    if (cache) {
      logger.trace(`Cache: ${cache.name}`, {
        entries: cache.entries,
        size: cache.size,
      });
    } else {
      logger.warn(`Cache ${cacheName} not found`);
    }
  } else {
    logger.trace("All Caches");
    for (const cache of cacheInfo) {
      logger.trace(`${cache.name}: ${cache.size} entries`);
    }
  }
}

/**
 * Test cache strategies
 */
export async function testCacheStrategies(): Promise<{
  cacheFirst: boolean;
  networkFirst: boolean;
  staleWhileRevalidate: boolean;
}> {
  const results = {
    cacheFirst: false,
    networkFirst: false,
    staleWhileRevalidate: false,
  };

  try {
    // Test cache-first (static asset)
    const staticResponse = await fetch("/_next/static/css/app/layout.css");
    results.cacheFirst = staticResponse.ok;

    // Test network-first (API)
    const apiResponse = await fetch("/api/test-endpoint");
    results.networkFirst = apiResponse.status !== 404; // 404 is expected for non-existent endpoint

    // Test stale-while-revalidate (dynamic content)
    const dynamicResponse = await fetch("/dashboard");
    results.staleWhileRevalidate = dynamicResponse.ok;

    logger.trace("Cache strategy test results:", results);
    return results;
  } catch (error) {
    logger.error("Error testing cache strategies:", { error });
    return results;
  }
}

// Export as PWACache object for easier access
export const PWACache = {
  clearAllCaches,
  clearCache,
  debugCache,
  getCacheInfo,
  getCacheStats,
  testCacheStrategies,
  updateServiceWorker,
};

// React hook for cache management
export function useCacheManager() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCacheInfo = useCallback(async () => {
    setLoading(true);
    try {
      const info = await getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      logger.error("Error refreshing cache info:", { error });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCacheCallback = useCallback(
    async (cacheName: string) => {
      const success = await clearCache(cacheName);
      if (success) {
        await refreshCacheInfo();
      }
      return success;
    },
    [refreshCacheInfo],
  );

  const clearAllCachesCallback = useCallback(async () => {
    const count = await clearAllCaches();
    if (count > 0) {
      await refreshCacheInfo();
    }
    return count;
  }, [refreshCacheInfo]);

  useEffect(() => {
    refreshCacheInfo();
  }, [refreshCacheInfo]);

  return {
    cacheInfo,
    clearAllCaches: clearAllCachesCallback,
    clearCache: clearCacheCallback,
    loading,
    refreshCacheInfo,
  };
}
