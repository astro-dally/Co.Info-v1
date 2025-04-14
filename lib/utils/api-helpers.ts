import { config } from "../config";

// Helper function to handle API responses
export async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  options?: RequestInit
): Promise<T> {
  if (!config.useRealApis) {
    return fallbackData;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    return fallbackData;
  }
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string): T | null {
  const cachedItem = cache.get(key);

  if (!cachedItem) {
    return null;
  }

  // Check if cache is still valid
  if (Date.now() - cachedItem.timestamp > config.cacheDuration) {
    cache.delete(key);
    return null;
  }

  return cachedItem.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Clear cache for a specific key or pattern
export function clearCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear();
    return;
  }

  // Delete keys that match the pattern
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}

// Get cache stats
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
