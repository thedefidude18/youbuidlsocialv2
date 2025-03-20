import { useState, useEffect, useCallback } from 'react';
import { orbis } from '@/lib/orbis';

export interface Post {
  stream_id: string;
  content: {
    body: string;
    title?: string;
  };
  creator_details: {
    did: string;
    profile?: {
      username: string;
      pfp: string;
    }
  };
  timestamp: number;
  count_likes: number;
  count_replies: number;
  count_haha: number;
  count_downvotes: number;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (orbisError) throw new Error(orbisError.message);
      
      // Sort posts by timestamp, newest first
      const sortedPosts = [...data].sort((a, b) => 
        b.timestamp - a.timestamp
      );
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPosts = useCallback((did: string) => {
    return posts.filter(post => post.creator_details.did === did);
  }, [posts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refreshPosts = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refreshPosts,
    getUserPosts
  };
}

