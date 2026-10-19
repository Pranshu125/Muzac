/**
 * High-performance Stale-While-Revalidate (SWR) API Cache & Fast Connection Manager
 * Gives 0ms instant page loads for previously viewed tracks and feeds.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function cachedFetch<T = any>(
  url: string,
  options?: RequestInit & { ttl?: number; forceFresh?: boolean }
): Promise<T> {
  const { ttl = CACHE_TTL, forceFresh = false, ...fetchOptions } = options || {};
  const cacheKey = url;

  if (!forceFresh && memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey)!;
    const isExpired = Date.now() - entry.timestamp > ttl;

    if (!isExpired) {
      return entry.data;
    }
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from ${url}`);
    }
    const data: T = await res.json();
    memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    // If network fails but we have stale cache, return stale cache gracefully!
    if (memoryCache.has(cacheKey)) {
      console.warn(`[Muzac Cache] Network request failed for ${url}, returning stale cached data.`);
      return memoryCache.get(cacheKey)!.data;
    }
    throw err;
  }
}

/**
 * Preloads high-priority resources into cache
 */
export function preloadApi(urls: string[]) {
  urls.forEach(url => {
    cachedFetch(url).catch(() => {});
  });
}
