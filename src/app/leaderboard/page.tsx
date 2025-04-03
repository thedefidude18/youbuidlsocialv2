"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLeaderboard } from "@/lib/points-system";
import { Button } from "@/components/ui/button";
import { UserLevelBadge } from "@/components/user-level-badge";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useFollow } from "@/hooks/use-follow";
import { PageHeader } from "@/components/layout/page-header";
import { useContractRead } from 'wagmi';
import { donationContractABI } from '@/contracts/DonationContract';
import { formatEther } from 'viem';

type RankedUser = {
  userId: string;
  points: number;
  level: number;
  name: string;
  username: string;
  avatar: string;
  posts: number;
  donations: string;
  isFollowing: boolean;
};

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<"points" | "donations">("points");
  const [pointsLeaderboard, setPointsLeaderboard] = useState<RankedUser[]>([]);
  const [donationsLeaderboard, setDonationsLeaderboard] = useState<RankedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollow();

  // Get donations leaderboard from contract
  const { data: topDonators } = useContractRead({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'getTopDonators',
    args: [10],
    enabled: mounted, // Only enable the query when component is mounted
  });

  const formatLeaderboardData = (data: any[], type: 'points' | 'donations'): RankedUser[] => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format:', data);
      return [];
    }

    return data.map(entry => {
      if (!entry?.userId) {
        console.error('Invalid entry format:', entry);
        return null;
      }

      const username = `user_${entry.userId.substring(2, 8).toLowerCase()}`;
      const shortAddress = `${entry.userId.substring(0, 6)}...${entry.userId.substring(entry.userId.length - 4)}`;
      
      return {
        userId: entry.userId,
        points: type === 'points' ? Number(entry.points) || 0 : 0,
        level: Number(entry.level) || 1,
        name: shortAddress,
        username: username,
        avatar: `https://avatars.dicebear.com/api/identicon/${entry.userId}.svg`,
        posts: Math.floor(Math.random() * 300),
        donations: type === 'donations' ? formatEther(entry.amount || 0n) : "0",
        isFollowing: isFollowing(entry.userId)
      };
    }).filter(Boolean) as RankedUser[];
  };

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Initialize leaderboards on mount
  useEffect(() => {
    async function fetchLeaderboards() {
      if (!mounted) return;
      
      setIsLoading(true);
      try {
        // Fetch points leaderboard
        const pointsData = await getLeaderboard(10);
        console.log('Points data received:', pointsData); // Debug log

        if (pointsData && Array.isArray(pointsData)) {
          const formattedPointsLeaderboard = formatLeaderboardData(pointsData, 'points');
          console.log('Formatted points leaderboard:', formattedPointsLeaderboard); // Debug log
          setPointsLeaderboard(formattedPointsLeaderboard);
        }

        // Format donations leaderboard if available
        if (topDonators) {
          console.log('Donations data received:', topDonators); // Debug log
          const formattedDonationsLeaderboard = formatLeaderboardData(topDonators, 'donations');
          console.log('Formatted donations leaderboard:', formattedDonationsLeaderboard); // Debug log
          setDonationsLeaderboard(formattedDonationsLeaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboards();
  }, [mounted, isFollowing, topDonators]);

  // Get current leaderboard based on type
  const getCurrentLeaderboard = () => {
    const leaderboard = leaderboardType === "points" ? pointsLeaderboard : donationsLeaderboard;
    console.log('Current leaderboard:', leaderboardType, leaderboard); // Debug log
    return leaderboard;
  };

  if (!mounted || isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-6">
          <PageHeader
            heading="Leaderboard"
            text="Top contributors and donors in the community"
          />
          <div className="mt-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Handle follow/unfollow
  const handleToggleFollow = (userId: string) => {
    toggleFollow(userId);
    updateLeaderboardFollowStatus(userId);
  };

  const updateLeaderboardFollowStatus = (userId: string) => {
    const updateBoard = (prev: RankedUser[]) =>
      prev.map(user =>
        user.userId === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      );

    setPointsLeaderboard(updateBoard);
    setDonationsLeaderboard(updateBoard);
  };

  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <PageHeader title="Leaderboard" />
        
        {/* Tabs */}
        <Tabs
          value={leaderboardType}
          onValueChange={(value) => setLeaderboardType(value as "points" | "donations")}
          className="w-full border-b border-border"
        >
          <TabsList className="grid w-full grid-cols-2 h-12 bg-transparent">
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {getCurrentLeaderboard().length > 0 ? (
              getCurrentLeaderboard().map((user, index) => (
                <div key={user.userId} className="p-4 flex items-center">
                  <div className="w-8 text-center font-bold text-muted-foreground">
                    {index + 1}
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <Link href={`/profile/${user.username}`} className="relative block">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="absolute -bottom-1 -right-1">
                        <UserLevelBadge level={user.level} size="sm" />
                      </div>
                    </Link>

                    <div className="overflow-hidden">
                      <Link href={`/profile/${user.username}`} className="font-semibold hover:underline block truncate">
                        {user.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">@{user.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right mr-2">
                      <div className="font-semibold">
                        {leaderboardType === "points" && `${user.points.toLocaleString()} pts`}
                        {leaderboardType === "donations" && `$${user.donations}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Level {user.level}
                      </div>
                    </div>

                    {user.userId !== user?.id && (
                      <Button
                        variant={user.isFollowing ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleToggleFollow(user.userId)}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    No {leaderboardType} data available yet.
                    {leaderboardType === "points" && " Start interacting with the platform to earn points!"}
                    {leaderboardType === "donations" && " Be the first to make a donation!"}
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
}









