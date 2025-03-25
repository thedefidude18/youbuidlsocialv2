'use client';

import { useState, useEffect } from 'react';
import { orbis } from '@/lib/orbis';
import { useCreatePost } from '@/hooks/use-create-post';
import { ComposeBox } from "@/components/compose-box";
import { MainLayout } from '@/components/layout/main-layout';
import { PostCard } from '@/components/post-card';
import { formatDistanceToNow } from 'date-fns';

export default function TestHomePage() {
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

        // Sort posts by timestamp (newest first)
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
    return <div className="p-8 text-center">Initializing...</div>;
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
    // Convert Orbis timestamp (seconds) to milliseconds
    timestamp: orbisPost.timestamp * 1000,
    stats: {
      likes: orbisPost.count_likes || 0,
      comments: orbisPost.count_replies || 0,
      reposts: 0,
    },
  });

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Compose Box - Hidden on mobile */}
          <div className="hidden md:block">
            <ComposeBox 
              onSubmit={createPost}
              isSubmitting={isSubmitting}
              placeholder="What's happening?"
              maxLength={280}
            />
          </div>

          {/* Posts Display */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center p-4">Loading posts...</div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : posts.length === 0 ? (
              <div className="text-center p-4">No posts found</div>
            ) : (
              <div className="space-y-4">
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
}




