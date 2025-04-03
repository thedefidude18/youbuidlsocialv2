"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePointsContract } from '@/hooks/usePointsContract';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { getProvider } from '@/lib/provider';
import pointsContractABI from '@/contracts/contracts/PointsContract.sol/PointsContract.json';

interface PointsContextType {
  points: number;
  level: number;
  totalPoints: number;
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
  level: 1,
  totalPoints: 0,
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

// Calculate level based on points
function calculateLevel(points: number): number {
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  if (points < 1500) return 5;
  if (points < 2100) return 6;
  if (points < 2800) return 7;
  if (points < 3600) return 8;
  if (points < 4500) return 9;
  return 10;
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { points, pointsLoading, createPost, addLike, addComment, addRepost, isGasless } = usePointsContract();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalPointsLoading, setTotalPointsLoading] = useState<boolean>(true);

  // Calculate the user's level based on their points
  const level = calculateLevel(points || 0);

  // Fetch total points - simplified approach with fallback
  useEffect(() => {
    async function fetchTotalPoints() {
      try {
        setTotalPointsLoading(true);

        // For now, we'll use a simulated value that increases over time
        // This creates a more engaging experience while we implement the actual contract function
        const basePoints = 10000;
        const date = new Date();
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const hourOfDay = date.getHours();

        // Simulate growth based on time - this creates a sense of activity
        const simulatedTotal = basePoints + (dayOfYear * 100) + (hourOfDay * 10) + Math.floor(date.getMinutes() / 2);

        // Add some randomness to make it feel more dynamic
        const randomFactor = Math.floor(Math.random() * 50);
        const total = simulatedTotal + randomFactor;

        setTotalPoints(total);
      } catch (error) {
        console.error('Error calculating total points:', error);
        // Fallback to a default value if there's an error
        setTotalPoints(10000);
      } finally {
        setTotalPointsLoading(false);
      }
    }

    fetchTotalPoints();

    // Set up an interval to refresh total points every minute
    const intervalId = setInterval(() => {
      fetchTotalPoints();
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  const value = {
    points: points || 0,
    level,
    totalPoints: totalPoints || 0,
    isLoading: pointsLoading || totalPointsLoading,
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


