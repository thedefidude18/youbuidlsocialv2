"use client";

import React, { createContext, useContext } from 'react';
import { usePointsContract } from '@/hooks/usePointsContract';
import { useAccount } from 'wagmi';

interface PointsContextType {
  points: number;
  isLoading: boolean;
  isGasless: boolean;
  actions: {
    createPost: (streamId: string) => Promise<string>;
    addLike: (streamId: string) => Promise<string>;
    addComment: (streamId: string) => Promise<string>;
    addRepost: (streamId: string) => Promise<string>;
  };
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  isLoading: true,
  isGasless: false,
  actions: {
    createPost: async () => '0x',
    addLike: async () => '0x',
    addComment: async () => '0x',
    addRepost: async () => '0x',
  }
});

export function usePoints() {
  return useContext(PointsContext);
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { points, pointsLoading, createPost, addLike, addComment, addRepost, isGasless } = usePointsContract();

  const value = {
    points: points || 0,
    isLoading: pointsLoading,
    isGasless: isGasless || false,
    actions: {
      createPost,
      addLike,
      addComment,
      addRepost,
    }
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
}


