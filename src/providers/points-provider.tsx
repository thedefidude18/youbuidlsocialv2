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

  // Fetch total points by getting the top users and summing their points
  useEffect(() => {
    async function fetchTotalPoints() {
      try {
        setTotalPointsLoading(true);
        const provider = await getProvider();
        const contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;

        if (!contractAddress) {
          console.error('Points contract address not configured');
          return;
        }

        const contract = new ethers.Contract(
          contractAddress,
          pointsContractABI.abi,
          provider
        );

        // Get the top users (this returns an array of addresses and their points)
        // If getTopUsers doesn't exist, we'll use a fallback value
        try {
          // Check if the getTopUsers function exists
          if (contract.getTopUsers) {
            // Get top 100 users to calculate a good approximation of total points
            const topUsers = await contract.getTopUsers(100);

            // Sum up all the points
            let total = 0;
            for (let i = 0; i < topUsers.length; i++) {
              // Each entry is [address, points]
              total += Number(topUsers[i][1]);
            }

            setTotalPoints(total);
          } else {
            // Fallback: just use a reasonable default value
            console.log('getTopUsers function not found, using fallback value');
            setTotalPoints(10000);
          }
        } catch (error) {
          console.error('Error calling getTopUsers:', error);
          // Alternative 