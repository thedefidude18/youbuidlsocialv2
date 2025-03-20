'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useSignMessage, useChainId, useConfig } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Orbis } from "@orbisclub/orbis-sdk";

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
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const config = useConfig();
  const orbis = new Orbis({
    useLit: false,
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    CERAMIC_NODE: "https://node2.orbis.club" 
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check session when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      checkSession();
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (session.authenticated && session.address === address) {
        setIsAuthenticated(true);
        await fetchUserProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/users/${address}`);
      if (response.ok) {
        const userData = await response.json();
        setUser({
          ...userData,
          address: address,
          joinedDate: userData.joinedDate || new Date().toISOString(),
        });
      } else if (response.status === 404) {
        // Create new profile for first-time users
        const newProfile = await createUserProfile(address);
        setUser(newProfile);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const createUserProfile = async (walletAddress: string): Promise<UserProfile> => {
  const randomAvatar = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${walletAddress}`;
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress,
          name: `User_${walletAddress.substring(2, 8)}`,
          username: `user_${walletAddress.substring(2, 8)}`.toLowerCase(),
          avatar: randomAvatar,
          verified: false,
          posts: 0,
          joinedDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  };

  const signIn = async () => {
    if (!address || isAuthenticating || !config) return;

    try {
      setIsAuthenticating(true);
      
      // Get nonce
      const nonceRes = await fetch('/api/auth/nonce');
      const nonce = await nonceRes.text();

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the application.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      // Sign message using wagmi v2 syntax
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
        account: address
      });

      // Verify signature
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });

      if (verifyRes.ok) {
        const result = await verifyRes.json();
        if (result.success) {
          setIsAuthenticated(true);
          await fetchUserProfile();
          return;
        }
      }
      throw new Error('Verification failed');
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
