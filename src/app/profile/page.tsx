"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { useAuth } from '@/providers/auth-provider';
import { usePoints } from '@/providers/points-provider';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from '@/components/ui/progress';
import { UserLevelBadge } from '@/components/user-level-badge';
import { PageHeader } from "@/components/layout/page-header";
import { useFollow } from "@/hooks/use-follow";
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileEditForm } from '@/components/profile-edit-form';
import { WithdrawModal } from '@/components/WithdrawModal';
import { usePosts } from '@/hooks/use-posts';
import { WithdrawDonations } from '@/components/WithdrawDonations';

// ProfileLoadingState component
function ProfileLoadingState() {
  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        {/* Profile header loading state */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Profile info loading state */}
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="relative">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="absolute -bottom-1 -right-1">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { address, isConnected } = useAccount();
  const { points, level, levelProgress, nextLevelThreshold, pointsBreakdown } = usePoints();
  const { following, followers, getFollowingCount, getFollowersCount } = useFollow();
  const { posts: userPosts, loading: postsLoading, getUserPosts } = usePosts();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes' | 'points'>('posts');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Memoized values
  const followingCount = useMemo(() => getFollowingCount(user?.id || ''), [user?.id, getFollowingCount]);
  const followersCount = useMemo(() => getFollowersCount(user?.id || ''), [user?.id, getFollowersCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && address) {
      getUserPosts(address); // This will now fetch only the current user's posts
    }
  }, [mounted, address, getUserPosts]);

  if (!mounted) {
    return <ProfileLoadingState />;
  }

  return (
    <MainLayout>
      <PageHeader title={user?.name || 'Profile'} />
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        {/* Profile info */}
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <UserLevelBadge level={level} size="lg" />
              </div>
            </div>
            <h2 className="font-bold text-xl mb-2">{user?.name}</h2>
            {address && (
              <p className="text-muted-foreground mb-2 font-mono">{address}</p>
            )}
            <p className="text-muted-foreground mb-4">{user?.bio || 'No bio yet'}</p>
            
            <div className="flex gap-4 mb-6">
              <div className="text-center">
                <span className="font-bold block">{followersCount}</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{followingCount}</span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{userPosts?.length || 0}</span>
                <span className="text-muted-foreground">Posts</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {address && <WithdrawDonations />}
              <ProfileEditForm user={user} />
            </div>
          </div>

          {/* Points and Level Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>{points} points</span>
              <span>Level {level}</span>
            </div>
            <Progress value={levelProgress} max={nextLevelThreshold} />
          </div>

          {/* Posts Tab Content */}
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="posts" key="posts-tab">Posts</TabsTrigger>
              <TabsTrigger value="replies" key="replies-tab">Replies</TabsTrigger>
              <TabsTrigger value="media" key="media-tab">Media</TabsTrigger>
              <TabsTrigger value="likes" key="likes-tab">Likes</TabsTrigger>
              <TabsTrigger value="points" key="points-tab">Points</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    No posts yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        points={points}
      />
    </MainLayout>
  );
}




