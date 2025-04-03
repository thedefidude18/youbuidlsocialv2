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

      const { data, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (orbisError) {
        throw new Error(`Orbis error: ${orbisError}`);
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected Orbis response:', data);
        throw new Error('Invalid response format from Orbis');
      }

      const transformedPosts = data.map(post => {
        if (!post || typeof post !== 'object') {
          console.warn('Invalid post data:', post);
          return null;
        }

        return {
          id: post.stream_id || '',
          content: post.content?.body || '',
          author: {
            id: post.creator || '',
            name: post.creator_details?.profile?.username || 
                 (post.creator ? `${post.creator.slice(0, 6)}...${post.creator.slice(-4)}` : ''),
            username: post.creator_details?.profile?.username || post.creator || '',
            avatar: post.creator_details?.profile?.pfp || 
                   `https://api.dicebear.com/9.x/bottts/svg?seed=${post.creator || 'default'}`,
            verified: false
          },
          timestamp: post.timestamp ? new Date(post.timestamp * 1000).toISOString() : new Date().toISOString(),
          stats: {
            likes: Number(post.count_likes) || 0,
            comments: Number(post.count_replies) || 0,
            reposts: Number(post.count_haha) || 0
          }
        };
      }).filter((post): post is Post => post !== null);
      
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

      const { data, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post',
        did: userAddress
      });

      if (orbisError) {
        throw new Error(`Orbis error: ${orbisError}`);
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected Orbis response:', data);
        throw new Error('Invalid response format from Orbis');
      }

      const transformedPosts = data
        .filter(post => post && typeof post === 'object')
        .map(post => ({
          id: post.stream_id || '',
          content: post.content?.body || '',
          author: {
            id: post.creator || '',
            name: post.creator_details?.profile?.username || 
                 (post.creator ? `${post.creator.slice(0, 6)}...${post.creator.slice(-4)}` : ''),
            username: post.creator_details?.profile?.username || post.creator || '',
            avatar: post.creator_details?.profile?.pfp || 
                   `https://api.dicebear.com/9.x/bottts/svg?seed=${post.creator || 'default'}`,
            verified: false
          },
          timestamp: post.timestamp ? new Date(post.timestamp * 1000).toISOString() : new Date().toISOString(),
          stats: {
            likes: Number(post.count_likes) || 0,
            comments: Number(post.count_replies) || 0,
            reposts: Number(post.count_haha) || 0
          }
        }));
      
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












