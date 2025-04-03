import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { orbis, ensureOrbisConnection } from '@/lib/orbis';
import { usePostsStore } from '@/store/posts-store';

export function usePostInteractions(postId: string) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { isAuthenticated: authenticated, user } = useAuth();
  const { updatePost } = usePostsStore();

  // Use the imported ensureOrbisConnection function

  const checkWalletConnection = async () => {
    if (!authenticated || !user?.wallet?.address) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const like = async (isCurrentlyLiked = false) => {
    if (!await checkWalletConnection()) return false;

    try {
      setIsProcessing(true);
      await ensureOrbisConnection();

      // If already liked, we need to unlike
      const action = isCurrentlyLiked ? 'unlike' : 'like';
      const result = await orbis.react(postId, action);

      if (!result || result.status !== 200) {
        throw new Error(result?.error || `Failed to ${action} post`);
      }

      // Only record points for likes, not unlikes
      if (!isCurrentlyLiked) {
        try {
          const response = await fetch('/api/points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'LIKE',
              postId
            })
          });

          if (response.ok) {
            const data = await response.json();
            // Show a toast notification for points earned
            toast({
              title: "Points Earned!",
              description: `+${data.points} points for liking a post`,
              variant: "default"
            });
          } else {
            console.warn('Points not recorded but like successful');
          }
        } catch (pointsError) {
          console.warn('Points recording failed but like successful');
        }
      }

      // Update the post stats based on the action
      updatePost(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          likes: (post.stats?.likes || 0) + (isCurrentlyLiked ? -1 : 1)
        }
      }));

      return true;
    } catch (error) {
      console.error('Like/Unlike error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const repost = async (isCurrentlyReposted = false) => {
    if (!await checkWalletConnection()) return false;

    try {
      setIsProcessing(true);

      // For simplicity, we'll just simulate the repost action
      // In a real app, you would call the blockchain or a database

      // If already reposted, we're "unreposting"
      if (isCurrentlyReposted) {
        console.log('Unreposting post:', postId);
        // Simulate a successful unrepost
        return true;
      }

      // Simulate a successful repost
      console.log('Reposting post:', postId);

      // Record points for reposting
      try {
        const response = await fetch('/api/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'REPOST',
            postId
          })
        });

        if (response.ok) {
          const data = await response.json();
          // Show a toast notification for points earned
          toast({
            title: "Points Earned!",
            description: `+${data.points} points for reposting`,
            variant: "default"
          });
        } else {
          console.warn('Points not recorded but repost successful');
        }
      } catch (pointsError) {
        console.warn('Points recording failed but repost successful');
      }

      return true;
    } catch (error) {
      console.error('Repost error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const comment = async (content: string) => {
    if (!await checkWalletConnection()) return false;

    try {
      setIsProcessing(true);
      await ensureOrbisConnection();

      const result = await orbis.createPost({
        context: 'youbuidl:comment',
        body: content,
        master: postId,
        reply_to: postId
      });

      if (!result || result.status !== 200) {
        throw new Error(result?.error || 'Failed to create comment');
      }

      updatePost(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          comments: (post.stats?.comments || 0) + 1
        }
      }));

      return true;
    } catch (error) {
      console.error('Comment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await orbis.getPosts({
        context: 'youbuidl:comment',
        master: postId
      });

      if (error) throw new Error(error);

      return data.map(comment => ({
        id: comment.stream_id,
        content: comment.content?.body || '',
        timestamp: comment.timestamp * 1000,
        author: {
          id: comment.creator,
          name: comment.creator_details?.profile?.username ||
               comment.creator?.slice(0, 6) + '...' + comment.creator?.slice(-4),
          username: comment.creator_details?.profile?.username || comment.creator,
          avatar: comment.creator_details?.profile?.pfp || '',
        },
        likes: comment.count_likes || 0,
        isLiked: false
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };

  const fetchPost = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await orbis.getPost(postId);

      if (error) throw error;

      // Fetch comments for the post
      const { data: comments } = await orbis.getPosts({
        context: 'youbuidl:comment',
        master: postId
      });

      // Format the post data to match PostCard requirements
      const formattedPost = {
        id: data.stream_id,
        content: data.content?.body || '',
        author: {
          id: data.creator,
          name: data.creator_details?.profile?.username ||
               data.creator?.slice(0, 6) + '...' + data.creator?.slice(-4),
          username: data.creator_details?.profile?.username || data.creator,
          avatar: data.creator_details?.profile?.pfp || '',
          verified: false
        },
        timestamp: data.timestamp * 1000,
        stats: {
          likes: data.count_likes || 0,
          comments: data.count_replies || 0,
          reposts: data.count_reposts || 0
        },
        ceramicData: data.content?.data || null,
        comments: comments?.map(comment => ({
          id: comment.stream_id,
          content: comment.content?.body || '',
          author: {
            id: comment.creator,
            name: comment.creator_details?.profile?.username ||
                 comment.creator?.slice(0, 6) + '...' + comment.creator?.slice(-4),
            username: comment.creator_details?.profile?.username || comment.creator,
            avatar: comment.creator_details?.profile?.pfp || '',
            verified: false
          },
          timestamp: comment.timestamp * 1000,
          stats: {
            likes: comment.count_likes || 0,
            comments: comment.count_replies || 0,
            reposts: comment.count_reposts || 0
          }
        })) || []
      };

      return formattedPost;
    } catch (error) {
      console.error('Fetch post error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    like,
    repost,
    comment,
    fetchComments,
    fetchPost,
    isProcessing,
    setIsProcessing,
    isConnected: authenticated,
    address: user?.wallet?.address
  };
}








