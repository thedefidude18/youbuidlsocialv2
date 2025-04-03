'use client';

import { useState, useEffect } from 'react';
import { orbis } from '@/lib/orbis';
import { useCreatePost } from '@/hooks/use-create-post';
import { ComposeBox } from "@/components/compose-box";
import { MainLayout } from '@/components/layout/main-layout';
import { PostCard } from '@/components/post-card';
import { formatDistanceToNow } from 'date-fns';

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
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createPost, isSubmitting } = useCreatePost();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        console.log('Fetching posts from Orbis...');
        const { data, error } = await orbis.getPosts({
          context: 'youbuidl:post'
        });

        console.log('Orbis response:', { data, error });

        if (error) {
          throw new Error(error.message || 'Failed to fetch posts');
        }

        const sortedPosts = (data || []).sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sortedPosts);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchPosts();
    }
  }, [mounted]);

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

  const transformPost = (orbisPost: any) => ({
    id: orbisPost.stream_id,
    content: orbisPost.content?.body || '',
    author: {
      id: orbisPost.creator_details?.did || '',
      name: orbisPost.creator_details?.profile?.username || 'Anonymous',
      username: orbisPost.creator_details?.profile?.username || 'anonymous',
      avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${orbisPost.creator_details?.profile?.username || 'anon'}`,
      verified: false,
    },
    timestamp: orbisPost.timestamp * 1000,
    stats: {
      likes: orbisPost.count_likes || 0,
      comments: orbisPost.count_replies || 0,
      reposts: 0,
    },
  });

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="max-w-2xl mx-auto w-full flex-1">
          {/* Compose Box - hidden on mobile */}
          <div className="hidden md:block px-4 pt-4">
            <ComposeBox 
              onSubmit={createPost}
              isSubmitting={isSubmitting}
              placeholder="What's happening?"
              maxLength={280}
            />
          </div>

          {/* Posts Display */}
          <div className="px-4">
            {loading ? (
              <div className="text-center py-4">Loading posts...</div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-4">No posts found</div>
            ) : (
              <div className="space-y-4 py-4">
                {posts.map((post) => (
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

