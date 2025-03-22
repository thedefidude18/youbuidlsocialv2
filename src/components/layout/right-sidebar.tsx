"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLeaderboard } from '@/lib/points-system';
import Link from "next/link";
import { formatAddress } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { usePosts } from '@/hooks/use-posts';
import { Loader2 } from "lucide-react";

type PointsEarner = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
};

function TopPost({ post }: { post: any }) {
  return (
    <Link 
      href={`/post/${post.id}`}
      className="px-4 py-3 hover:bg-secondary/80 transition-colors block"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{formatAddress(post.author.id)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-1 truncate">
            {formatAddress(post.author.id)}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>❤️ {post.stats.likes}</span>
            <span>💬 {post.stats.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RightSidebar() {
  const [mounted, setMounted] = useState(false);
  const [topEarners, setTopEarners] = useState<PointsEarner[]>([]);
  const { posts, loading, refreshPosts } = usePosts();

  useEffect(() => {
    setMounted(true);
    const leaderboard = getLeaderboard(5);
    setTopEarners(leaderboard.map(user => ({
      id: user.userId,
      name: formatAddress(user.userId),
      username: formatAddress(user.userId),
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${user.userId}`,
      points: user.points,
      level: user.level
    })));
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('Fetching posts...');
      refreshPosts();
    }
  }, [mounted, refreshPosts]);

  // Debug logs
  useEffect(() => {
    console.log('Posts state:', { posts, loading, mounted });
  }, [posts, loading, mounted]);

  const recentPosts = (posts?.slice(0, 3)) || [];

  if (!mounted) return null;

  return (
    <div className="w-0 lg:w-[320px] xl:w-[380px] h-full hidden lg:block bg-background">
      <div className="h-full flex flex-col">
        {/* Recent Posts section */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="mb-4">
            <Card className="overflow-hidden rounded-none border-x-0 bg-background">
              <div className="p-4 font-semibold text-sm border-b border-border flex items-center gap-2">
                📝 Recent Posts
              </div>
              <div>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <TopPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No recent posts
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Footer area with hidden scrollbar */}
        <div className="mt-auto pb-16 hide-scrollbar">
          {/* Your footer content here */}
        </div>
      </div>
    </div>
  );
}