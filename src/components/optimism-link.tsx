import React from 'react';
import { Button } from './ui/button';

interface OptimismLinkProps {
  transactionHash: string;
  className?: string;
}

export function OptimismLink({ transactionHash, className = '' }: OptimismLinkProps) {
  if (!transactionHash) return null;

  const optimismUrl = `https://sepolia-optimism.etherscan.io/tx/${transactionHash}`;

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => window.open(optimismUrl, '_blank')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      View on Optimism
    </Button>
  );
}