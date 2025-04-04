'use client';

import { memoryCache } from './memory-cache';

interface CachedFetchOptions extends RequestInit {
  cacheTtl?: number;
  cacheKey?: string;
  skipCache?: boolean;
}

/**
 * Fetch with memory caching
 * @param url URL to fetch
 * @param options Fetch options with additional caching options
 * @returns Parsed JSON response
 */
export async function cachedFetch<T = any>(
  url: string,
  options: CachedFetchOptions = {}
): Promise<T> {
  const {
    cacheTtl = 60, // Default TTL: 60 seconds
    cacheKey = url,
    skipCache = false,
    ...fetchOptions
  } = options;

  // Skip cache if requested
  if (!skipCache) {
    // Try to get from cache first
    const cachedData = memoryCache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Fetch from network
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result if not skipping cache
    if (!skipCache) {
      memoryCache.set<T>(cacheKey, data, cacheTtl);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
