export interface Comment {
  id: string;
  content: string;
  timestamp: number;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  isLiked?: boolean;
}