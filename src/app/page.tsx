'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileEditForm } from '@/components/profile-edit-form';
import { WithdrawModal } from '@/components/WithdrawModal';
import { ComposeBox } from "@/components/compose-box";
import { useCreatePost } from '@/hooks/use-create-post';
import { usePosts } from '@/hooks/use-posts';
import { orbis } from '@/lib/orbis';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

        {/* Stats loading state */}
        <div className="p-4 border-b border-border">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        {/* Tabs loading state */}
        <div className="border-b border-border">
          <div className="px-4">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`tab-skeleton-${index}`} className="h-9 w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function HomeLoadingState() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`post-skeleton-${index}`} className="bg-card rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
          </div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  // 1. All useState hooks
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('following');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [orbisPosts, setOrbisPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 2. All context/external hooks
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isConnected } = useAccount();
  const { points, level, nextLevelThreshold, pointsBreakdown } = usePoints();
  const { following, followers, getFollowingCount, getFollowersCount } = useFollow();
  const { posts, loading: postsLoading, refreshPosts } = usePosts();
  const { createPost, isSubmitting } = useCreatePost();

  // 3. All useMemo hooks - must be before any conditional returns
  const transformOrbisPost = useMemo(() => (post: any) => ({
    id: post.stream_id,
    content: post.content?.body || '',
    author: {
      id: post.creator,
      name: post.creator_details?.profile?.username || 
           post.creator?.slice(0, 6) + '...' + post.creator?.slice(-4),
      username: post.creator_details?.profile?.username || post.creator,
      avatar: post.creator_details?.profile?.pfp || '',
      verified: false
    },
    timestamp: post.timestamp * 1000,
    stats: {
      likes: post.count_likes || 0,
      comments: post.count_replies || 0,
      reposts: post.count_hops || 0
    },
    ceramicData: post.content?.data || null
  }), []);

  const validPosts = useMemo(() => 
    posts?.filter(post => 
      post && 
      post.id && 
      post.stats?.likes !== undefined && 
      typeof post.id === 'string'
    ) || [], 
    [posts]
  );

  const handleSearch = useMemo(() => (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const normalizedQuery = query.toLowerCase().trim();
    const matchingPosts = orbisPosts.filter(post => 
      post.content?.toLowerCase().includes(normalizedQuery) ||
      post.author.name.toLowerCase().includes(normalizedQuery) ||
      post.author.username.toLowerCase().includes(normalizedQuery)
    ).slice(0, 5);
    setSearchResults(matchingPosts);
  }, [orbisPosts]);

  // 4. All useEffect hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    refreshPosts();
  }, [mounted, refreshPosts]);

  useEffect(() => {
    if (!mounted) return;

    const fetchOrbisPosts = async () => {
      try {
        const { data, error } = await orbis.getPosts({
          context: 'youbuidl:post'
        });
        
        if (error) throw error;
        
        const transformedPosts = (data || [])
          .map(transformOrbisPost)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setOrbisPosts(transformedPosts);
      } catch (error) {
        console.error('Error fetching Orbis posts:', error);
      }
    };

    fetchOrbisPosts();
  }, [mounted, transformOrbisPost]);

  // 5. Render loading state
  if (!mounted || isLoading) {
    return <ProfileLoadingState />;
  }

  // 6. Main render
  return (
    <div>
      <MainLayout>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-border">
            <div className="max-w-2xl mx-auto">
              <TabsList className="w-full justify-center px-4 h-12">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="foryou">For You</TabsTrigger>
                <TabsTrigger value="search">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="hidden md:block p-4">
              <ComposeBox 
                onSubmit={createPost} 
                isSubmitting={isSubmitting} 
                placeholder="What's happening?"
                maxLength={280}
              />
            </div>

            <TabsContent value="latest" className="m-0 p-4">
              <div className="space-y-4">
                {postsLoading ? (
                  <HomeLoadingState />
                ) : orbisPosts.length > 0 ? (
                  orbisPosts.map((post) => (
                    <PostCard 
                      key={post.stream_id} 
                      post={{
                        id: post.stream_id,
                        content: post.content?.body || '',
                        author: {
                          id: post.creator,
                          name: post.creator_details?.profile?.username || 'Anonymous',
                          username: post.creator_details?.profile?.username || 'anonymous',
                          avatar: post.creator_details?.profile?.pfp || 
                            `https://api.dicebear.com/7.x/avatars/svg?seed=${post.creator}`,
                          verified: post.creator_details?.profile?.verified || false
                        },
                        timestamp: post.timestamp,
                        stats: {
                          likes: post.count_likes || 0,
                          comments: post.count_replies || 0,
                          reposts: post.count_haha || 0
                        }
                      }} 
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    No posts yet. Be the first to post!
                  </div>
                )}
              </div>
            </TabsContent>

          <TabsContent value="following" className="m-0 p-4">
            <div className="space-y-4">
              {postsLoading ? (
                <HomeLoadingState />
              ) : validPosts.length > 0 ? (
                validPosts.map((post, index) => (
                  <PostCard 
                    key={`following-${post.id}-${index}`} 
                    post={post} 
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  No posts from people you follow. Start following some builders!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="foryou" className="m-0 p-4">
            <div className="space-y-4">
              {postsLoading ? (
                <HomeLoadingState />
              ) : orbisPosts.length > 0 ? (
                orbisPosts.map((post, index) => (
                  <PostCard 
                    key={`foryou-${post.id}-${index}`} 
                    post={post} 
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  No recommended posts yet. Start interacting with the community!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="latest" className="m-0 p-4">
            <div className="space-y-4">
              {postsLoading ? (
                <HomeLoadingState />
              ) : orbisPosts.length > 0 ? (
                orbisPosts.map((post, index) => (
                  <PostCard 
                    key={`latest-${post.id}-${index}`} 
                    post={post} 
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  No posts yet. Be the first to post!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="m-0 p-4">
            <div className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search posts, users, and topics"
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>

              {searchQuery ? (
                // Show search results
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <PostCard 
                        key={`search-${result.id}-${index}`} 
                        post={result}
                      />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              ) : (
                // Show trending content when no search query
                <>
                  <div>
                    <h3 className="text-base font-medium mb-2">Recent Posts</h3>
                    <div className="space-y-4">
                      {orbisPosts.slice(0, 3).map((post, index) => (
                        <PostCard 
                          key={`trending-${post.id}-${index}`} 
                          post={post}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-2">Active Users</h3>
                    <div className="space-y-2">
                      {orbisPosts
                        .reduce((acc: any[], post) => {
                          if (!acc.some(p => p.author.id === post.author.id)) {
                            acc.push(post);
                          }
                          return acc;
                        }, [])
                        .slice(0, 5)
                        .map((post, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded-md hover:bg-secondary cursor-pointer"
                            onClick={() => router.push(`/profile/${post.author.id}`)}
                          >
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{post.author.name}</div>
                              <div className="text-sm text-muted-foreground">
                                @{post.author.username}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          </ScrollArea>
        </Tabs>
      </MainLayout>
    </div>
  );
}




















