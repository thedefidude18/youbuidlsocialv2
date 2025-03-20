import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { orbis, likePost } from '@/lib/orbis';
import { usePostsStore } from '@/store/posts-store';

export function usePostInteractions(postId: string) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { updatePost } = usePostsStore();

  const ensureOrbisConnection = async () => {
    const { status: isConnected } = await orbis.isConnected();
    
    if (!isConnected && typeof window !== 'undefined' && window.ethereum) {
      const result = await orbis.connect_v2({
        provider: window.ethereum,
        chain: 'ethereum'
      });
      
      if (!result.status) {
        throw new Error('Failed to connect to Orbis');
      }
    }
    return true;
  };

  const checkWalletConnection = async () => {
    if (!address || !isConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const like = async () => {
    if (!await checkWalletConnection()) return false;

    try {
      setIsProcessing(true);
      
      // Ensure Orbis connection before liking
      await ensureOrbisConnection();
      
      const result = await likePost(postId);

      if (!result || result.status !== 200) {
        throw new Error(result?.error || 'Failed to like post');
      }

      // Update post in local store
      updatePost(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          likes: post.stats.likes + 1
        }
      }));

      return true;
    } catch (error) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like post",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const repost = async () => {
    if (!await checkWalletConnection()) return false;

    try {
      setIsProcessing(true);
      const result = await orbis.createPost({
        context: 'youbuidl:repost',
        master: postId
      });

      if (!result || result.status !== 200) {
        throw new Error(result?.error || 'Failed to repost');
      }

      // Update post in local store
      updatePost(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          reposts: post.stats.reposts + 1
        }
      }));

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
      
      const result = await orbis.createPost({
        context: 'youbuidl:comment',
        body: content,
        master: postId,
        reply_to: postId
      });

      if (!result || result.status !== 200) {
        throw new Error(result?.error || 'Failed to create comment');
      }

      // Update post in local store
      updatePost(postId, (post) => ({
        ...post,
        stats: {
          ...post.stats,
          comments: post.stats.comments + 1
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
    comment,
    repost,
    fetchComments,
    fetchPost,
    isProcessing
  };
}







