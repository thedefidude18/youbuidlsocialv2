import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import pointsContractABI from '../contracts/contracts/PointsContract.sol/PointsContract.json';

export function usePointsContract() {
  const { address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS as `0x${string}`;

  // Read user points
  const { data: points, isLoading: pointsLoading } = useContractRead({
    address: contractAddress,
    abi: pointsContractABI.abi,
    functionName: 'getUserPoints',
    args: [address],
    enabled: !!address, // Only run query if address exists
  });

  // Create post and earn points
  const { write: createPost, data: createPostData } = useContractWrite({
    address: contractAddress,
    abi: pointsContractABI.abi,
    functionName: 'createPost',
  });

  // Add like and earn points
  const { write: addLike, data: addLikeData } = useContractWrite({
    address: contractAddress,
    abi: pointsContractABI.abi,
    functionName: 'addLike',
  });

  // Add comment and earn points
  const { write: addComment, data: addCommentData } = useContractWrite({
    address: contractAddress,
    abi: pointsContractABI.abi,
    functionName: 'addComment',
  });

  return {
    points,
    pointsLoading,
    createPost,
    addLike,
    addComment,
  };
}


