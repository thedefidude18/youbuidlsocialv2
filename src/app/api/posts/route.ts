import { NextRequest, NextResponse } from 'next/server';
import { orbis } from '@/lib/orbis';
import { memoryCache } from '@/lib/memory-cache';

// Cache posts for 30 seconds
const CACHE_TTL = 30;
const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    // Get page from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || String(PAGE_SIZE), 10);
    
    // Create a cache key that includes pagination
    const cacheKey = `api-posts-page-${page}-size-${pageSize}`;
    
    // Try to get from cache first
    const cachedPosts = memoryCache.get(cacheKey);
    
    if (cachedPosts) {
      return NextResponse.json(cachedPosts, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
        },
      });
    }
    
    // Fetch from Orbis if not in cache
    const { data, error } = await orbis.getPosts({
      context: 'youbuidl:post',
      // Orbis pagination
      page,
      limit: pageSize
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to fetch posts');
    }
    
    // Sort posts by timestamp (newest first)
    const sortedPosts = (data || []).sort((a: any, b: any) => b.timestamp - a.timestamp);
    
    // Cache the result
    memoryCache.set(cacheKey, sortedPosts, CACHE_TTL);
    
    return NextResponse.json(sortedPosts, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
