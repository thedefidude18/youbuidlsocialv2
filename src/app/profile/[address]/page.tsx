"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { useAccount, useContractRead } from 'wagmi';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { WithdrawModal } from '@/components/WithdrawModal';
import { donationContractABI } from '@/contracts/DonationContract';
import { formatEther } from 'viem';
import { usePosts } from '@/hooks/use-posts';
import { Skeleton } from "@/components/ui/skeleton";
import { use } from 'react';
import { WithdrawDonations } from '@/components/WithdrawDonations';

// Add interface for post type
interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
}

export default function ProfilePage({ params }: { params: { address: string } }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const address = resolvedParams.address;

  // 1. All useState hooks
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // 2. All other hooks
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { address: currentUserAddress, isConnected } = useAccount();
  const { points, level, levelProgress, nextLevelThreshold, pointsBreakdown } = usePoints();
  const { following, followers, getFollowingCount, getFollowersCount } = useFollow();
  const { posts: userPosts, loading: postsLoading, getUserPosts } = usePosts();
  
  const { data: ethBalance = BigInt(0) } = useContractRead({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'getBalance',
    args: [address],
    enabled: mounted && !!address,
  });

  // 3. All useEffect hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && address) {
      getUserPosts(address); // This will now fetch only the user's posts
    }
  }, [mounted, address, getUserPosts]);

  // 4. Derived values/functions
  const isOwnProfile = currentUserAddress && address 
    ? currentUserAddress.toLowerCase() === address.toLowerCase()
    : false;

  const ethToUsd = (ethAmount: bigint): string => {
    return (Number(formatEther(ethAmount)) * 2000).toFixed(2);
  };

  // Transform posts before rendering
  const transformedPosts = userPosts?.map((post, index) => {
    // Add console.log to debug the post structure
    console.log('Original post:', post);

    // Handle the content properly
    let content = '';
    if (typeof post.content === 'string') {
      content = post.content;
    } else if (post.body?.content) {
      content = post.body.content;
    } else if (typeof post.body === 'string') {
      content = post.body;
    }

    return {
      id: post.id || `temp-${index}`,
      content: content,
      author: {
        id: post.author?.id || address,
        name: post.author?.name || 'Unknown User',
        username: post.author?.username || address,
        avatar: post.author?.avatar || `https://api.dicebear.com/9.x/bottts/svg?seed=${address}`,
        verified: post.author?.verified || false
      },
      timestamp: post.timestamp || new Date().toISOString(),
      stats: {
        likes: post.stats?.likes || 0,
        comments: post.stats?.comments || 0,
        reposts: post.stats?.reposts || 0
      }
    };
  }) || [];

  // 5. Early return for loading state
  if (!mounted) {
    return <ProfileLoadingState />;
  }

  // 6. Render
  return (
    <MainLayout>
      <PageHeader title={user?.name || 'Profile'} />
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
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
            <p className="text-muted-foreground mb-2 font-mono">{address}</p>
            
            {isOwnProfile && ethBalance && ethBalance > BigInt(0) && (
              <Button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="mb-4"
                variant="outline"
              >
                Withdraw {formatEther(ethBalance as bigint)} ETH
              </Button>
            )}

            <div className="flex gap-4 mb-4">
              <div className="text-center">
                <span className="font-bold block">{getFollowersCount(address)}</span>
                <span className="text-muted-foreground text-sm">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{getFollowingCount(address)}</span>
                <span className="text-muted-foreground text-sm">Following</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{points}</span>
                <span className="text-muted-foreground text-sm">Points</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">${ethToUsd(ethBalance)}</span>
                <span className="text-muted-foreground text-sm">Earned</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Level {level}</span>
              <span className="text-sm">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {nextLevelThreshold - points} points needed for next level
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 h-12">
            <TabsTrigger value="posts">
              Posts {userPosts?.length > 0 && `(${userPosts.length})`}
            </TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="posts" className="p-4">
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="text-center text-muted-foreground">
                    Loading posts...
                  </div>
                ) : transformedPosts.length > 0 ? (
                  transformedPosts.map((post) => (
                    <PostCard 
                      key={`post-${post.id}`}
                      post={post}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    No posts yet
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="donations" className="p-4">
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold mb-4">Available Balance</h3>
                <p className="text-2xl font-bold mb-4">
                  {ethBalance ? formatEther(ethBalance) : '0'} ETH
                </p>
                {isOwnProfile && ethBalance && Number(ethBalance) > 0 && (
                  <Button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="w-full"
                  >
                    Withdraw Funds
                  </Button>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {isWithdrawModalOpen && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          address={address}
          balance={ethBalance}
        />
      )}
    </MainLayout>
  );
}

function ProfileLoadingState() {
  return (
    <MainLayout>
      <PageHeader title="Loading Profile" />
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="absolute -bottom-1 -right-1">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96 mb-4" />
            
            <div className="flex gap-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={`stat-skeleton-${i}`} className="text-center">
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-48 mx-auto mt-2" />
          </div>

          <div className="w-full">
            <div className="flex gap-4 px-4 mb-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={`tab-skeleton-${i}`} className="h-10 w-24" />
              ))}
            </div>
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={`post-skeleton-${i}`} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}






