"use client";

import { useEffect, useState, useCallback } from 'react';
import { usePostsStore } from '@/store/posts-store';
import { useCreatePost } from '@/hooks/use-create-post';
import { PostCard } from './post-card';
import { ComposeBox } from './compose-box';
import { orbis } from '@/lib/orbis';
import { usePrivy } from '@privy-io/react-auth';
import { Spinner } from './ui/spinner';

export function HomeFeed() {
  const { posts, setPosts, loading, setLoading, error, setError } = usePostsStore();
  const { createPost, isSubmitting } = useCreatePost();
  const { authenticated } = usePrivy();
  
  const fetchPosts = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: orbisPosts, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (orbisError) {
        throw new Error(orbisError);
      }

      if (!orbisPosts) {
        setPosts([]);
        return;
      }

      const transformedPosts = orbisPosts.map(post => ({
        id: post.stream_id,
        content: post.content?.body || '',
        author: {
          id: post.creator_details?.did || '',
          name: post.creator_details?.profile?.username || 'Anonymous',
          username: post.creator_details?.profile?.username || 'anonymous',
          avatar: post.creator_details?.profile?.pfp || `https://api.dicebear.com/7.x/avatars/svg?seed=${post.creator_details?.did}`,
          verified: post.creator_details?.profile?.verified || false
        },
        timestamp: post.timestamp || Date.now(),
        stats: {
          likes: post.count_likes || 0,
          comments: post.count_replies || 0,
          reposts: 0
        }
      }));

      setPosts(transformedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [loading, setLoading, setError, setPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content: string) => {
    if (!authenticated) return;
    
    try {
      await createPost(content);
      await fetchPosts(); // Refresh posts after creating new one
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Show compose box only on desktop */}
      {authenticated && (
        <div className="hidden md:block sticky top-0 z-10 bg-background border-b border-border p-4">
          <ComposeBox onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
        </div>
      )}
      
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-4 text-destructive text-center">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
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




