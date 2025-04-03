export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    address?: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: number;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
  hashtags: string[];
  images: string[];
  ceramicData?: any;
}
