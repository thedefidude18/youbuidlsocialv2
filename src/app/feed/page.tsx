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

function FeedLoadingState() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`feed-skeleton-${index}`} className="bg-card rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
          </div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  );
}

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
      console.log('Fetching posts from Orbis...');
      const { data, error } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      console.log('Orbis response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Failed to fetch posts');
      }

      const sortedPosts = (data || []).sort((a, b) => b.timestamp - a.timestamp);
      setLocalPosts(sortedPosts);
      setInitialLoadDone(true);

      // Also update the global store for new posts
      sortedPosts.forEach(post => {
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
            addPost(completePost);
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
            <FeedLoadingState />
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
            {localLoading && localPosts.length === 0 ? (
              <div className="text-center py-4">Loading posts...</div>
            ) : localError ? (
              <div className="text-red-500 py-4">{localError}</div>
            ) : localPosts.length === 0 ? (
              <div className="text-center py-4">No posts found</div>
            ) : (
              <div className="space-y-4 py-4">
                {localPosts.map((post) => (
                  <PostCard
                    key={post.stream_id}
                    post={transformPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

