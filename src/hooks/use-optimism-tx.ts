import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';

export function useOptimismTx(postId: string) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchTxHash = async () => {
      try {
        const hash = postId;
        setTxHash(hash);
      } catch (error) {
        console.error('Error fetching tx hash:', error);
        setTxHash(null);
      }
    };

    fetchTxHash();
  }, [postId]);

  const optimismUrl = txHash 
    ? `https://sepolia-optimistic.etherscan.io/tx/${txHash}`  // Updated URL
    : null;

  return { txHash, optimismUrl };
}
