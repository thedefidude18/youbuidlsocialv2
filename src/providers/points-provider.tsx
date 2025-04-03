"use client";

import React, { createContext, useContext } from 'react';
import { usePointsContract } from '@/hooks/usePointsContract';
import { useAccount } from 'wagmi';

interface PointsContextType {
  points: number;
  isLoading: boolean;
  actions: {
    createPost: (streamId: string) => Promise<`0x${string}`>;
    addLike: (streamId: string) => Promise<`0x${string}`>;
    addComment: (streamId: string, comment: string) => Promise<`0x${string}`>;
  };
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  isLoading: true,
  actions: {
    createPost: async () => '0x',
    addLike: async () => '0x',
    addComment: async () => '0x',
  }
});

export function usePoints() {
  return useContext(PointsContext);
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { points, pointsLoading, createPost, addLike, addComment } = usePointsContract();

  const value = {
    points: points || 0,
    isLoading: pointsLoading,
    actions: {
      createPost,
      addLike,
      addComment,
    }
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
}


