import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { createPost as createOrbisPost } from '@/lib/orbis';
import { usePostsStore } from '@/store/posts-store';
import { IPFSService } from '@/services/ipfs-service';

export function useCreatePost() {
  const { address } = useAccount();
  const { addPost } = usePostsStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ipfsService = new IPFSService();

  const createPost = async (content: string, image?: File | null) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsSubmitting(true);
      
      // Handle image upload first if present
      let imageHash = null;
      if (image) {
        try {
          imageHash = await ipfsService.uploadImage(image);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive"
          });
          return false;
        }
      }

      // Extract hashtags from content
      const hashtags = content.match(/#[\w]+/g) || [];
      
      // Create post data including image if present
      const postData = {
        content,
        images: imageHash ? [imageHash] : [],
        timestamp: new Date().toISOString(),
        hashtags: hashtags.map(tag => tag.substring(1)) // Remove # from tags
      };

      // Upload post data to IPFS
      const postHash = await ipfsService.uploadPost(postData);
      
      // Create post on Orbis with IPFS reference
      const orbisResult = await createOrbisPost(content, hashtags, postHash);
      
      if (!orbisResult || orbisResult.status !== 200) {
        throw new Error(orbisResult?.error || 'Failed to create post on Orbis');
      }

      // Create the new post object
      const newPost = {
        id: orbisResult.doc,
        content,
        images: imageHash ? [imageHash] : [],
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
        stream_id: orbisResult.doc,
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
        description: "Post created successfully"
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

