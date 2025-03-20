import { PublicClient, getContract } from 'wagmi';
import { postRegistryABI } from '@/contracts/PostRegistry';

export interface Post {
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
}

export class PostContractService {
  private client: PublicClient;
  private contractAddress: string;
  public contract: any;

  constructor(client: PublicClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: postRegistryABI,
      publicClient: client,
    });
  }

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await this.contract.read.getAllPosts();
      return this.formatPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async getUserPosts(address: string): Promise<Post[]> {
    try {
      const posts = await this.contract.read.getUserPosts([address]);
      return this.formatPosts(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  }

  private formatPosts(posts: any[]): Post[] {
    return posts.map(post => ({
      id: post.id.toString(),
      content: post.content,
      author: {
        id: post.author.toLowerCase(),
        name: `${post.author.slice(0, 6)}...${post.author.slice(-4)}`,
        username: post.author.toLowerCase(),
        avatar: '',
        verified: true
      },
      timestamp: Number(post.timestamp) * 1000, // Convert to milliseconds
      stats: {
        likes: Number(post.likes),
        comments: Number(post.comments),
        reposts: Number(post.reposts)
      }
    }));
  }
}