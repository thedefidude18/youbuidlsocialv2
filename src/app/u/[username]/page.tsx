"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserLevelBadge } from "@/components/user-level-badge";
import { Button } from "@/components/ui/button";
import { DonateButton } from "@/components/donate-button";
import { getUserPoints } from "@/lib/points-system";
import { useFollow } from "@/hooks/use-follow";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post-card";
import { mockPosts } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { getOptimismVerificationUrl } from '@/lib/utils';
import { PageHeader } from "@/components/layout/page-header";

// Define the Post type based on your PostCard requirements
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    recasts: number;
  };
  hashtags?: string[];
  images?: string[];
  transactionHash?: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { isFollowing, toggleFollow, getFollowersCount, getFollowingCount } = useFollow();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const user = {
    id: "1", // Make sure this ID matches the one used in other components
    name: username,
    username: username,
    avatar: `https://source.unsplash.com/300x300/?portrait&${username}`,
    bio: "Web3 enthusiast and developer",
    joinedDate: "January 2024",
    donations: {
      total: 1.5,
      count: 23
    }
  };

  useEffect(() => {
    // Update counts whenever following status changes
    setFollowersCount(getFollowersCount(user.id));
    setFollowingCount(getFollowingCount(user.id));
  }, [user.id, getFollowersCount, getFollowingCount]);

  const handleFollow = () => {
    toggleFollow(user.id);
  };

  return (
    <MainLayout>
      <PageHeader title={user.name} />
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <button
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-secondary"
              onClick={() => window.history.back()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{userPosts.length} posts</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <UserLevelBadge level={level} />
                      <span className="text-sm text-muted-foreground">{points} points</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DonateButton userId={user.id} />
                  <Button
                    variant={isFollowing(user.id) ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    {isFollowing(user.id) ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              {/* Bio and Stats */}
              <div className="mt-4">
                <p className="text-sm mb-4">{user.bio}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{followersCount} followers</span>
                  <span>{followingCount} following</span>
                  <span>{userPosts.length} posts</span>
                  <span>{user.donations.total} ETH received</span>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="replies">Replies</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
              </TabsList>

              {/* Posts Tab Content */}
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      verificationUrl={post.transactionHash ? getOptimismVerificationUrl(post.transactionHash) : undefined}
                    />
                  ))}
                  {userPosts.length === 0 && (
                    <Card className="p-8 text-center text-muted-foreground">
                      No posts yet
                    </Card>
                  )}
                </div>
              )}

              {/* Other tabs content */}
              {activeTab !== 'posts' && (
                <Card className="p-8 text-center text-muted-foreground">
                  Coming soon
                </Card>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}






