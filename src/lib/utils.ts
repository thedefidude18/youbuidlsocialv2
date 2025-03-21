import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOptimismVerificationUrl(hash: string): string | null {
  // Validate and handle Optimism transaction hashes
  if (hash.startsWith('0x') && hash.length === 66) {
    return `https://sepolia-optimistic.etherscan.io/tx/${hash}`;
  }
  
  // Validate and handle Ceramic stream IDs
  if (hash.startsWith('kjzl6')) {
    return `https://cerscan.com/mainnet/stream/${hash}`;
  }

  return null;
}

export function isOptimismTransaction(hash: string): boolean {
  return hash.startsWith('0x') && hash.length === 66;
}

export function isCeramicStream(hash: string): boolean {
  return hash.startsWith('kjzl6');
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}


