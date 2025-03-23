'use client';

import { createContext, useContext, useState } from 'react';
import { Orbis } from "@orbisclub/orbis-sdk";
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { usePrivy } from '@privy-io/react-auth';

interface UserProfile {
  id: string;
  address: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  posts: number;
  bio?: string;
  joinedDate: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: privyUser, isAuthenticated: privyAuthenticated, login, logout } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const orbis = new Orbis({
    useLit: false,
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    CERAMIC_NODE: "https://node2.orbis.club" 
  });

  const signIn = async () => {
    try {
      await login();
      // Add any additional sign-in logic here
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  useSessionTimeout();

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: privyAuthenticated, 
      isLoading, 
      user, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}