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
  donations: string; // in USD
  isFollowing: boolean;
};

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<"points" | "donations">("points");
  const [pointsLeaderboard, setPointsLeaderboard] = useState<RankedUser[]>([]);
  const [donationsLeaderboard, setDonationsLeaderboard] = useState<RankedUser[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollow();

  // Get donations leaderboard from contract
  const { data: topDonators } = useContractRead({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'getTopDonators',
    args: [10], // Get top 10
    enabled: mounted,
  });

  // Initialize leaderboards on mount
  useEffect(() => {
    setMounted(true);

    // For the points leaderboard, we'll use our real points data
    const pointsData = getLeaderboard(10);
    const formattedPointsLeaderboard = formatLeaderboardData(pointsData, 'points');
    setPointsLeaderboard(formattedPointsLeaderboard);

    // For donations leaderboard, format the contract data
    if (topDonators) {
      const formattedDonationsLeaderboard = formatLeaderboardData(topDonators, 'donations');
      setDonationsLeaderboard(formattedDonationsLeaderboard);
    }
  }, [isFollowing, topDonators]);

  const formatLeaderboardData = (data: any[], type: 'points' | 'donations') => {
    return data.map(entry => {
      const username = `user_${entry.userId.substring(2, 8).toLowerCase()}`;
      const shortAddress = `${entry.userId.substring(0, 6)}...${entry.userId.substring(entry.userId.length - 4)}`;
      
      return {
        userId: entry.userId,
        points: type === 'points' ? entry.points : 0,
        level: entry.level || 1,
        name: shortAddress,
        username: username,
        avatar: `https://avatars.dicebear.com/api/identicon/${entry.userId}.svg`,
        posts: Math.floor(Math.random() * 300),
        donations: type === 'donations' ? formatEther(entry.amount || 0n) : "0",
        isFollowing: isFollowing(entry.userId)
      };
    });
  };

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

  // Get current leaderboard based on type
  const getCurrentLeaderboard = () => {
    switch (leaderboardType) {
      case "points":
        return pointsLeaderboard;
      case "donations":
        return donationsLeaderboard;
      default:
        return pointsLeaderboard;
    }
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
            <TabsTrigger
              value="points"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
            >
              Points
            </TabsTrigger>
            <TabsTrigger
              value="donations"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
            >
              Donations
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {!mounted ? (
              // Loading state
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
              ))
            ) : (
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
            )}

            {mounted && getCurrentLeaderboard().length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
}




