import { useState, useCallback } from 'react';
import { orbis } from '@/lib/orbis';

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!orbis) {
        throw new Error('Orbis client not initialized');
      }

      const result = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (!result || !result.data) {
        throw new Error('Invalid response from Orbis');
      }

      const transformedPosts = result.data.map(post => ({
        id: post.stream_id,
        content: post.content?.body || '',
        author: {
          id: post.creator,
          name: post.creator_details?.profile?.username || 
               post.creator?.slice(0, 6) + '...' + post.creator?.slice(-4),
          username: post.creator_details?.profile?.username || post.creator,
          avatar: post.creator_details?.profile?.pfp || 
                 `https://api.dicebear.com/9.x/bottts/svg?seed=${post.creator}`,
          verified: false
        },
        timestamp: new Date(post.timestamp * 1000).toISOString(),
        stats: {
          likes: post.count_likes || 0,
          comments: post.count_replies || 0,
          reposts: post.count_haha || 0
        }
      }));
      
      const sortedPosts = transformedPosts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]); // Reset posts on error
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPosts = useCallback(async (userAddress: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!orbis) {
        throw new Error('Orbis client not initialized');
      }

      const result = await orbis.getPosts({
        context: 'youbuidl:post',
        did: userAddress // Filter posts by user's DID/address
      });

      if (!result || !result.data) {
        throw new Error('Invalid response from Orbis');
      }

      const transformedPosts = result.data.map(transformPost);
      
      const sortedPosts = transformedPosts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user posts');
      setPosts([]); // Reset posts on error
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    refreshPosts,
    getUserPosts
  };
}












