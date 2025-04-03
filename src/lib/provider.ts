import { ethers } from 'ethers';

export async function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Browser environment with wallet
    return new ethers.BrowserProvider(window.ethereum);
  }

  // Fallback to read-only RPC provider
  return new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io'
  );
}

export async function getSigner() {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  }
  throw new Error('No wallet connected');
}

