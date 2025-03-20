import { useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { PostContractService } from '@/services/post-contract-service';
import { useToast } from '@/hooks/use-toast';

export function usePostEvents(onUpdate: () => void) {
  const { library } = useWeb3React();
  const { toast } = useToast();

  const contractService = library 
    ? new PostContractService(library, process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS!)
    : null;

  const handleNewPost = useCallback((author: string, postId: string) => {
    toast({
      title: "New Post",
      description: "Someone just posted something new!",
    });
    onUpdate();
  }, [onUpdate, toast]);

  const handleInteraction = useCallback((postId: string, user: string, interactionType: string) => {
    toast({
      title: "New Interaction",
      description: `New ${interactionType} on a post`,
    });
    onUpdate();
  }, [onUpdate, toast]);

  useEffect(() => {
    if (!contractService) return;

    const contract = contractService.contract;

    // Subscribe to events
    const newPostFilter = contract.filters.PostCreated();
    const interactionFilter = contract.filters.PostInteraction();

    contract.on(newPostFilter, handleNewPost);
    contract.on(interactionFilter, handleInteraction);

    // Cleanup
    return () => {
      contract.off(newPostFilter, handleNewPost);
      contract.off(interactionFilter, handleInteraction);
    };
  }, [contractService, handleNewPost, handleInteraction]);
}