"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLeaderboard } from '@/lib/points-system';

type PointsEarner = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
};

function PointsEarnerItem({ user }: { user: PointsEarner }) {
  return (
    <div className="px-4 py-3 hover:bg-secondary/80 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="text-sm font-medium flex items-center gap-2">
            {user.name}
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              Lvl {user.level}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">@{user.username}</div>
        </div>
        <div className="text-sm font-medium text-primary">{user.points.toLocaleString()} pts</div>
      </div>
    </div>
  );
}

export function TrendingSidebar() {
  const [mounted, setMounted] = useState(false);
  const [topEarners, setTopEarners] = useState<PointsEarner[]>([]);

  useEffect(() => {
    setMounted(true);
    // Get top 5 earners from the leaderboard
    const leaderboard = getLeaderboard(5);
    setTopEarners(leaderboard.map(user => ({
      id: user.userId,
      name: user.userId, // You might want to fetch actual user data here
      username: user.userId.slice(0, 8),
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${user.userId}`,
      points: user.points,
      level: user.level
    })));
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* Top Points Earners section */}
      <div className="bg-card rounded-xl overflow-hidden border border-border">
        <div className="p-4 font-bold text-xl border-b border-border">
          🏆 Top Points Earners
        </div>
        {topEarners.map((user) => (
          <PointsEarnerItem key={user.id} user={user} />
        ))}
        <Link 
          href="/leaderboard" 
          className="px-4 py-3 text-primary hover:bg-secondary/80 transition-colors cursor-pointer block text-sm"
        >
          View Full Leaderboard →
        </Link>
      </div>
    </div>
  );
}


