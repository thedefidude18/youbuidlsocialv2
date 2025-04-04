'use client';

import { useState, useEffect, useCallback } from 'react';
import { orbis } from '@/lib/orbis';
import { useCreatePost } from '@/hooks/use-create-post';
import { ComposeBox } from "@/components/compose-box";
import { MainLayout } from '@/components/layout/main-layout';
import { PostCard } from '@/components/post-card';
import { formatDistanceToNow } from 'date-fns';
import { usePostsStore } from '@/store/posts-store';
import { useToast } from '@/hooks/use-toast';
import { formatAddress } from '@/lib/utils';
import { LazyLoadPosts } from '@/components/lazy-load-posts';
import { cachedFetch } from '@/lib/cached-fetch';
import { FeedSkeleton } from '@/components/feed-skeleton';

// Using the FeedSkeleton component instead of this function

export default function FeedPage() {
  // Add closing brace at the end of the file
  const [mounted, setMounted] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Use the posts store for adding new posts, but maintain local state for display
  const { addPost } = usePostsStore();
  const { toast } = useToast();
  const { createPost, isSubmitting } = useCreatePost();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a memoized fetchPosts function that can be called after post creation
  const fetchPosts = useCallback(async (forceRefresh = false) => {
    // Don't fetch if already loading or if we have posts and this isn't a forced refresh
    if (localLoading && !forceRefresh) return;
    if (localPosts.length > 0 && !forceRefresh && initialLoadDone) return;

    try {
      setLocalLoading(true);
      console.log('Fetching posts...');

      // Use cached fetch with a 30-second TTL
      const posts = await cachedFetch('/api/posts', {
        cacheTtl: 30, // Cache for 30 seconds
        cacheKey: 'feed-posts',
        // Skip cache if forcing refresh
        skipCache: forceRefresh
      }).catch(async () => {
        // If API fails, fall back to direct Orbis call
        console.log('API failed, falling back to direct Orbis call');
        const { data, error } = await orbis.getPosts({
          context: 'youbuidl:post'
        });

        if (error) {
          throw new Error(error.message || 'Failed to fetch posts');
        }

        return data || [];
      });

      // Sort posts by timestamp (newest first)
      const sortedPosts = Array.isArray(posts) ?
        posts.sort((a: any, b: any) => b.timestamp - a.timestamp) : [];

      setLocalPosts(sortedPosts);
      setInitialLoadDone(true);

      // Also update the global store for new posts
      sortedPosts.forEach((post: any) => {
        // Only add to store if it's a new post
        if (post.timestamp && post.timestamp > Date.now() / 1000 - 60) { // Posts from the last minute (timestamp is in seconds)
          try {
            const transformedPost = transformPost(post);
            // Add missing properties required by the Post interface
            const completePost = {
              ...transformedPost,
              hashtags: [],
              images: []
            };
            addPost(completePost as any);
          } catch (error) {
            console.error('Error transforming post:', error);
          }
        }
      });
    } catch (err) {
      console.error('Error:', err);
      setLocalError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLocalLoading(false);
    }
  }, [localLoading, localPosts.length, initialLoadDone, addPost]);

  // Fetch posts when component mounts - only once
  useEffect(() => {
    if (mounted && !initialLoadDone) {
      // Add a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        fetchPosts(true); // Force initial fetch
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mounted, initialLoadDone, fetchPosts]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Feed state:', { loading: localLoading, error: localError, postsCount: localPosts.length });
  }, [localLoading, localError, localPosts.length]);

  // Set up a refresh interval (but don't refresh if the user is viewing the page)
  useEffect(() => {
    if (!mounted) return;

    // Refresh posts every 30 seconds, but only if the page is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchPosts(true);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [mounted, fetchPosts]);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <div className="max-w-2xl mx-auto w-full flex-1">
            <div className="hidden md:block px-4 pt-4">
              <div className="h-24 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="px-4">
              <FeedSkeleton />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const transformPost = (orbisPost: any) => {
    // Extract the Ethereum address from the DID if possible
    let address = '';
    if (orbisPost.creator_details?.did) {
      const didParts = orbisPost.creator_details.did.split(':');
      if (didParts.length >= 4 && didParts[0] === 'did' && didParts[1] === 'pkh' && didParts[2] === 'eip155') {
        // Extract only the address part (should be the last part after eip155:1:)
        // The format is typically did:pkh:eip155:1:0x... where 1 is the chain ID
        if (didParts.length >= 5) {
          // If format is did:pkh:eip155:1:0x...
          address = didParts[4];
        } else {
          // If format is did:pkh:eip155:0x...
          address = didParts[3];
        }
      }
    }

    // Use the formatAddress utility function
    const formattedAddress = address ? formatAddress(address) : '';

    return {
      id: orbisPost.stream_id,
      content: orbisPost.content?.body || '',
      author: {
        id: orbisPost.creator_details?.did || '',
        name: orbisPost.creator_details?.profile?.username || formattedAddress || 'Anonymous',
        username: orbisPost.creator_details?.profile?.username || 'anonymous',
        address: address, // Add the address field
        avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${orbisPost.creator_details?.profile?.username || address || 'anon'}`,
        verified: false,
      },
      timestamp: orbisPost.timestamp * 1000,
      stats: {
        likes: orbisPost.count_likes || 0,
        comments: orbisPost.count_replies || 0,
        reposts: 0,
      },
      hashtags: [], // Required by the Post interface
      images: [], // Required by the Post interface
    };
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="max-w-2xl mx-auto w-full flex-1">
          {/* Compose Box - hidden on mobile */}
          <div className="hidden md:block px-4 pt-4">
            <ComposeBox
              onSubmit={async (content, media) => {
                const success = await createPost(content, media);
                if (success) {
                  // Force refresh the feed after creating a post
                  fetchPosts(true);

                  // Show success message
                  toast({
                    title: "Post created",
                    description: "Your post has been published successfully!"
                  });
                }
              }}
              isSubmitting={isSubmitting}
              placeholder="What's happening?"
              maxLength={280}
            />
          </div>

          {/* Posts Display */}
          <div className="px-4">
            {localError ? (
              <div className="text-red-500 py-4">{localError}</div>
            ) : (
              <div className="py-4">
                {/* Use LazyLoadPosts component for infinite scrolling */}
                {!mounted ? (
                  <FeedSkeleton />
                ) : (
                  <LazyLoadPosts
                    initialPosts={localPosts}
                    fetchPosts={async (page) => {
                      try {
                        // Fetch paginated posts
                        const posts = await cachedFetch(`/api/posts?page=${page}&pageSize=10`, {
                          cacheTtl: 30,
                          cacheKey: `feed-posts-page-${page}`,
                        });

                        return posts;
                      } catch (error) {
                        console.error('Error fetching more posts:', error);
                        return [];
                      }
                    }}
                    pageSize={10}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

