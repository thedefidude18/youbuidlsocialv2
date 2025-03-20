import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { usePostsStore } from '@/store/posts-store';
import { createPost as createOrbisPost } from '@/lib/orbis';

export function useCreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  const { addPost } = usePostsStore();
  const { toast } = useToast();

  const createPost = async (content: string) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Create post on Orbis first
      const orbisResult = await createOrbisPost(content);
      
      if (!orbisResult || orbisResult.status !== 200) {
        throw new Error(orbisResult?.error || 'Failed to create post on Orbis');
      }

      // Create the new post object matching the format used in HomeFeed
      const newPost = {
        id: orbisResult.doc,
        content,
        author: {
          id: address.toLowerCase(),
          name: address.slice(0, 6) + '...' + address.slice(-4),
          username: address.toLowerCase(),
          avatar: '',
          verified: true
        },
        timestamp: Date.now(),
        stats: {
          likes: 0,
          comments: 0,
          reposts: 0
        },
        stream_id: orbisResult.doc, // Add this for Orbis compatibility
        creator_details: {
          did: address.toLowerCase(),
          profile: {
            username: address.toLowerCase()
          }
        }
      };
      
      // Add to local store
      addPost(newPost);

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      return true;

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting
  };
}




