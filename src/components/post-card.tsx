import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { usePointsContract } from "@/hooks/usePointsContract";
import { usePostInteractions } from "@/hooks/use-post-interactions";
import { orbis } from '@/lib/orbis';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { OptimismLink } from '@/components/optimism-link';
import { usePoints } from '@/providers/points-provider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DonationBadge } from '@/components/donation-badge';
import { 
  Heart, MessageCircle, Repeat2, Share, Twitter, 
  Mail, Link as LinkIcon, Wallet, Check, Flag, 
  Trash, MoreHorizontal, Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DonationModal } from '@/components/DonationModal';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Comment } from '@/types/comment';
import { ComposeBox } from '@/components/compose-box';
import { useAccount } from 'wagmi';
import { DonationWidget } from "@/components/donation-widget";
import { Gift } from "lucide-react";
import { useTheme } from "next-themes";

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar: string;
      verified: boolean;
    };
    timestamp: number;
    stats: {
      likes: number;
      comments: number;
      reposts: number;
    };
    ceramicData?: {
      title: string;
      body: string;
      timestamp: number;
      creator: string;
      banner?: string;
    };
    attestation?: {
      uid: string;
      attester: string;
      recipient: string;
      revoked: boolean;
      timestamp: string;
      expirationTime: string;
    };
    comments?: Comment[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addLike } = usePointsContract();
  const { 
    like, 
    repost, 
    comment, 
    isProcessing,
    isConnected
  } = usePostInteractions(post.id);
  
  const [isLiked, setIsLiked] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [likeCount, setLikeCount] = useState(post.stats?.likes || 0);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(post.stats.reposts);
  const [commentCount, setCommentCount] = useState(post.stats.comments);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDonationWidget, setShowDonationWidget] = useState(false);
  const { theme } = useTheme();
  
  const projectConfig = {
    id: post.id, // Use post ID as project ID
    name: post.author.name,
    recipients: [
      {
        address: post.author.address, // Author's wallet address
        chainId: 11155420, // Optimism Sepolia from your chain config
        share: 100 // Full share to the author
      }
    ],
    theme: {
      primaryColor: '#676FFF', // Matching your app's accent color
      buttonStyle: 'rounded',
      size: 'medium',
      darkMode: theme === 'dark'
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const handleLike = async () => {
    if (isProcessing) return;

    try {
      const success = await like();
      
      if (success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        
        if (!isLiked) {
          toast({
            title: "Success!",
            description: "Post liked successfully",
          });
        }
      }
    } catch (error) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like post",
        variant: "destructive"
      });
    }
  };

  const handleRepost = async () => {
    if (isProcessing) return;
    
    try {
      const success = await repost();
      if (success) {
        setIsReposted(!isReposted);
        setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
        
        if (!isReposted) {
          toast({
            title: "Post reposted",
            description: "Content shared to your feed"
          });
        }
      }
    } catch (error) {
      console.error('Repost error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not process repost action",
        variant: "destructive"
      });
    }
  };

  const handleDonate = () => {
    setShowDonateModal(true);
  };

  const handleShare = async (type: 'copy' | 'twitter' | 'email') => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const text = post.ceramicData?.body || post.content;

    switch (type) {
      case 'copy':
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: "Link copied",
          description: "Post link has been copied to your clipboard"
        });
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this post&body=${encodeURIComponent(text)}%0A%0A${encodeURIComponent(postUrl)}`;
        break;
    }
  };

  const formatPostDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Add this function to safely render content with iframes
  const renderContent = (content: string) => {
    // Split content into text and iframes
    const parts = content.split(/(<iframe.*?<\/iframe>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<iframe')) {
        // Create a wrapper for the iframe
        return (
          <div key={index} className="my-2 rounded-lg overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: part }} />
          </div>
        );
      }
      return <p key={index}>{part}</p>;
    });
  };

  const handleCommentClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentsOpen(!isCommentsOpen);
    
    if (!isCommentsOpen && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const fetchedComments = await fetchComments();
        setComments(fetchedComments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handleComment = async (content: string) => {
    if (!content.trim() || !isConnected) {
      if (!isConnected) {
        toast({
          title: "Connect Wallet",
          description: "Please connect your wallet to comment",
          variant: "destructive"
        });
        return;
      }
      return;
    }
    
    setIsSubmittingComment(true);
    try {
      const tx = await actions.addComment(post.id, content);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation..."
      });

      // Wait for transaction confirmation
      const provider = await getProvider();
      const receipt = await provider.waitForTransaction(tx);

      if (receipt.status === 1) {
        const updatedComments = await fetchComments();
        setComments(updatedComments);
        setCommentCount(prev => prev + 1);
        setNewComment('');
        
        toast({
          title: "Comment posted",
          description: "Transaction confirmed on Optimism"
        });
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not post comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderImage = (ipfsHash: string) => {
    if (!ipfsHash) return null;
    
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    return (
      <div className="mt-2 relative group">
        <img
          src={imageUrl}
          alt="Post attachment"
          className="rounded-lg max-h-[500px] w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if Pinata gateway fails
            const img = e.target as HTMLImageElement;
            if (!img.src.includes('ipfs.io')) {
              img.src = `https://ipfs.io/ipfs/${ipfsHash}`;
            }
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
      </div>
    );
  };

  return (
    <>
      <Card className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl overflow-hidden mb-4">
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500">
                <AvatarImage 
                  src={`https://api.dicebear.com/9.x/bottts/svg?seed=${post.author.username}`} 
                  alt={post.author.name} 
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {post.author.name}
                  </span>
                  {post.author.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Check className="w-4 h-4 text-blue-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>Verified</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {/* Add the donation badge here */}
                  <div className="ml-2">
                    <DonationBadge totalDonations={post.author.totalDonations} />
                  </div>
                </div>
                <div className="flex items-center text-sm text-zinc-500">
                  <span>{formatPostDate(post.timestamp)}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  <LinkIcon className="w-4 h-4 mr-2" />Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  <Twitter className="w-4 h-4 mr-2" />Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDonateModal(true)}>
                  <Wallet className="w-4 h-4 mr-2" />Donate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <Flag className="w-4 h-4 mr-2" />Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4" onClick={handlePostClick}>
          {renderContent(post.content)}
        </div>

        {/* Post Stats */}
        <div className="px-4 py-2 flex items-center space-x-4 text-sm text-zinc-500">
        </div>

        {/* Actions */}
        <div className="px-2 py-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-4 gap-1">
            <Button 
              variant="ghost" 
              className={cn(
                "flex items-center justify-center space-x-2 w-full",
                isLiked && "text-blue-500",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleLike}
              disabled={isProcessing}
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110",
                  isLiked && "fill-current [animation:like-button_0.45s_ease-in-out]"
                )} 
              />
              <span className={cn(
                "transition-all",
                isLiked && "animate-quick-pulse"
              )}>{likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost"
              className={cn(
                "flex items-center justify-center space-x-2 w-full group",
                isCommentsOpen && "text-blue-500"
              )}
              onClick={handleCommentClick}
            >
              <MessageCircle className="w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span>{commentCount}</span>
            </Button>
            
            <Button 
              variant="ghost"
              className={cn(
                "flex items-center justify-center space-x-2 w-full group",
                isReposted && "text-green-500"
              )}
              onClick={handleRepost}
            >
              <Repeat2 
                className={cn(
                  "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110",
                  isReposted && "[animation:repost-button_0.45s_ease-in-out]"
                )} 
              />
              <span className={cn(
                "transition-all",
                isReposted && "animate-quick-pulse"
              )}>{repostCount}</span>
            </Button>

            {/* New Donate Button */}
            <Button 
              variant="ghost"
              className="flex items-center justify-center space-x-2 w-full group hover:text-purple-500"
              onClick={() => setShowDonationWidget(true)}
            >
              <Gift className="w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span>Donate</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {isCommentsOpen && (
          <div className="border-t border-zinc-100 dark:border-zinc-800">
            {/* Comments List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                </div>
              ) : comments.length > 0 ? (
                <div className="p-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                              <Heart className="h-3.5 w-3.5" />
                              <span>{comment.likes || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  <MessageCircle className="h-5 w-5 mx-auto mb-2 opacity-50" />
                  <p>No comments yet</p>
                  <p className="text-xs">Be the first to join the conversation</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Input
                      placeholder={isConnected ? "Write a comment..." : "Connect wallet to comment"}
                      className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-sm pr-[70px]"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleComment(newComment);
                        }
                      }}
                      disabled={isSubmittingComment || !isConnected}
                    />
                    {isSubmittingComment && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      <DonationModal 
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        author={post.author}
        streamId={post.id}
        postExcerpt={post.content}
        projectConfig={{
          id: post.id,
          name: post.author.name,
          recipients: [
            {
              address: post.author.address,
              chainId: 11155420,
              share: 100
            }
          ],
          theme: {
            primaryColor: '#676FFF',
            buttonStyle: 'rounded',
            size: 'medium',
            darkMode: theme === 'dark'
          }
        }}
      />
      <DonationWidget
        isOpen={showDonationWidget}
        onClose={() => setShowDonationWidget(false)}
        projectConfig={{
          id: post.id,
          name: "Project Name" // Replace with actual project name
        }}
        author={{
          name: post.author.name,
          avatar: post.author.avatar,
          address: post.author.address
        }}
        postExcerpt={post.content}
      />
    </>
  );
}

export function PointsLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const contract = useContract({
    address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS,
    abi: pointsContractABI.abi,
  });

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const topUsers = await contract.getTopUsers(10); // Get top 10 users
        setLeaderboard(topUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-bold mb-4">Top Contributors</h2>
      <div className="space-y-2">
        {leaderboard.map((user, index) => (
          <div key={user.address} className="flex justify-between items-center">
            <span>#{index + 1} {user.address.slice(0, 6)}...{user.address.slice(-4)}</span>
            <span>{user.points} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}



