import { create } from 'zustand';

interface Post {
  id: string;
  content: string;
  author: {
    address: string;
    name: string;
    username: string;
  };
  content: string;
  timestamp: string;
  hashtags: string[];
  images: string[];
  stats: {
    likes: number;
    comments: 0;
    reposts: 0;
  };
  ipfsCid?: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removePost: (id: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts]
  })),
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === id ? { ...post, ...updates } : post
    ),
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),
}));



