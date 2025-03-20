"use client";

import { useEffect } from 'react';
import { usePostsStore } from '@/store/posts-store';
import { useCreatePost } from '@/hooks/use-create-post';
import { PostCard } from './post-card';
import { ComposeBox } from './compose-box';
import { orbis } from '@/lib/orbis';

export function HomeFeed() {
  const { posts, setPosts, loading, setLoading, error, setError } = usePostsStore();
  const { createPost, isSubmitting } = useCreatePost();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: orbisPosts, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (orbisError) {
        throw new Error(orbisError);
      }

      // Transform and sort posts - newest first
      const transformedPosts = orbisPosts
        .map((post: any) => ({
          id: post.stream_id,
          content: post.content?.body || '',
          author: {
            id: post.creator_details?.did || '',
            name: post.creator_details?.profile?.username || post.creator_details?.did?.slice(0, 6) + '...',
            username: post.creator_details?.profile?.username || post.creator_details?.did,
            avatar: post.creator_details?.profile?.pfp || '',
            verified: post.creator_details?.profile?.verified || false
          },
          timestamp: Number(post.timestamp) * 1000, // Convert to milliseconds
          stats: {
            likes: post.count_likes || 0,
            comments: post.count_replies || 0,
            reposts: post.count_haha || 0
          }
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // Newest first

      setPosts(transformedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Run once on mount

  const handleCreatePost = async (content: string) => {
    const success = await createPost(content);
    if (success) {
      // Refresh posts after successful creation
      await fetchPosts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="hidden md:block sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <ComposeBox onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No posts yet. Be the first to post!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}




