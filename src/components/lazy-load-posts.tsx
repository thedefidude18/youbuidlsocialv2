'use client';

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { PostCard } from '@/components/post-card';
import { FeedSkeleton } from '@/components/feed-skeleton';

interface LazyLoadPostsProps {
  fetchPosts: (page: number) => Promise<any[]>;
  initialPosts?: any[];
  pageSize?: number;
}

export function LazyLoadPosts({
  fetchPosts,
  initialPosts = [],
  pageSize = 10
}: LazyLoadPostsProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Intersection observer for infinite scrolling
  const [loadMoreRef, isIntersecting] = useIntersectionObserver({
    rootMargin: '200px', // Load more when within 200px of the bottom
    threshold: 0.1,
  });

  // Load more posts when the load more element is visible
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMorePosts();
    }
  }, [isIntersecting]);

  // Function to load more posts
  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setLoadingError(null);

      // Fetch the next page of posts
      const nextPage = page + 1;
      const newPosts = await fetchPosts(nextPage);

      // If we got fewer posts than the page size, we've reached the end
      if (newPosts.length < pageSize) {
        setHasMore(false);
      }

      // Add the new posts to our list
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setLoadingError('Failed to load more posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Render all loaded posts */}
      {posts.map((post, index) => (
        <PostCard key={post.stream_id || post.id || index} post={post} />
      ))}

      {/* Loading indicator */}
      {loading && <FeedSkeleton />}

      {/* Error message */}
      {loadingError && (
        <div className="p-4 text-center text-red-500">
          {loadingError}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => loadMorePosts()}
            aria-label="Retry loading posts"
          >
            Retry
          </button>
        </div>
      )}

      {/* Load more trigger element */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {!loading && <div className="h-px w-full bg-border" />}
        </div>
      )}

      {/* End of posts message */}
      {!hasMore && posts.length > 0 && (
        <div className="p-4 text-center text-muted-foreground text-sm">
          You've reached the end of the feed
        </div>
      )}
    </div>
  );
}
