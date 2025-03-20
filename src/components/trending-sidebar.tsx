"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFollow } from '@/hooks/use-follow';

type TrendingTopic = {
  id: string;
  title: string;
  category: string;
  posts: number;
  time?: string;
};

type SuggestedUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified?: boolean;
};


// Mock suggested accounts to follow
const suggestedUsers: SuggestedUser[] = [
  {
    id: "u1",
    name: "Base Official",
    username: "base",
    avatar: "https://placekitten.com/200/200",
    bio: "Official account of Base, the Ethereum L2 built by Coinbase.",
    verified: true,
  },
  {
    id: "u2",
    name: "Vitalik Buterin",
    username: "vitalik",
    avatar: "https://placekitten.com/201/201",
    bio: "Ethereum co-founder. Cryptocurrency & blockchain enthusiast.",
    verified: true,
  },
  {
    id: "u3",
    name: "DeFi Pulse",
    username: "defipulse",
    avatar: "https://placekitten.com/202/202",
    bio: "Tracking DeFi metrics & news. The go-to source for DeFi analytics.",
    verified: true,
  },
];

// Mock data for trending topics
const trendingTopics: TrendingTopic[] = [
];


// Create a separate component for the user item
function SuggestedUserItem({ user }: { user: SuggestedUser }) {
  const { isFollowing, toggleFollow } = useFollow();
  const following = isFollowing(user.id);

  return (
    <div key={user.id} className="px-4 py-3 hover:bg-secondary/80 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{user.name}</span>
              {user.verified && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
        <Button 
          variant={following ? "default" : "outline"} 
          className="rounded-full h-8" 
          size="sm"
          onClick={() => toggleFollow(user.id)}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{user.bio}</div>
    </div>
  );
}

export function TrendingSidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Add type for points earners
  type PointsEarner = {
    id: string;
    name: string;
    username: string;
    avatar: string;
    points: number;
  };
  
  // Add type for top posts
  type TopPost = {
    id: string;
    title: string;
    likes: number;
    comments: number;
    author: {
      name: string;
      avatar: string;
    };
  };
  
  // Mock data for top points earners
  const topPointsEarners: PointsEarner[] = [
    // Add mock data here
  ];
  
  // Mock data for top posts
  const topPosts: TopPost[] = [
    // Add mock data here
  ];
  
  // Create component for points earner item
  function PointsEarnerItem({ user }: { user: PointsEarner }) {
    return (
      <div className="px-4 py-3 hover:bg-secondary/80 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
          <div className="text-sm font-medium">{user.points} pts</div>
        </div>
      </div>
    );
  }
  
  // Create component for top post item
  function TopPostItem({ post }: { post: TopPost }) {
    return (
      <div className="px-4 py-3 hover:bg-secondary/80 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{post.title}</div>
            <div className="text-xs text-muted-foreground">{post.likes} likes • {post.comments} comments</div>
          </div>
        </div>
      </div>
    );
  }
  
  // In the TrendingSidebar component, add new sections
  return (
    <div className="w-80 border-l border-border overflow-y-auto h-full">
      <div className="p-4 space-y-4">
        {/* Search input for larger screens */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* What's happening section */}
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 font-bold text-xl">What's happening</div>
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="px-4 py-3 hover:bg-secondary/80 transition-colors cursor-pointer">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground">{topic.category}</span>
                  {topic.time && (
                    <>
                      <span className="text-xs text-muted-foreground mx-1">·</span>
                      <span className="text-xs text-muted-foreground">{topic.time}</span>
                    </>
                  )}
                </div>
                <div className="font-medium mt-0.5">{topic.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{topic.posts.toLocaleString()} posts</div>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 text-primary hover:bg-secondary/80 transition-colors cursor-pointer">
            <span className="text-sm">Show more</span>
          </div>
        </div>

        {/* Who to follow section */}
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 font-bold text-xl">Who to follow</div>
          {suggestedUsers.map((user) => (
            <SuggestedUserItem key={user.id} user={user} />
          ))}
        </div>

        {/* Top Points Earners section */}
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 font-bold text-xl">Top Points Earners</div>
          {topPointsEarners.map((user) => (
            <PointsEarnerItem key={user.id} user={user} />
          ))}
        </div>

        {/* Top Posts section */}
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 font-bold text-xl">Top Posts</div>
          {topPosts.map((post) => (
            <TopPostItem key={post.id} post={post} />
          ))}
        </div>

        {/* Existing sections */}
        <div className="bg-secondary rounded-xl overflow-hidden">
          <div className="p-4 font-bold text-xl">Who to follow</div>
          {suggestedUsers.map((user) => (
            <SuggestedUserItem key={user.id} user={user} />
          ))}
        </div>

        {/* Footer links */}
        <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-2">
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
          </div>
          <div className="mt-2">© 2025 GiveStation</div>
        </div>
      </div>
    </div>
  );
}
