'use client';

import { usePrivy } from '@privy-io/react-auth';
import { toast } from '@/components/ui/use-toast';

export function useAuth() {
  const { 
    ready,
    authenticated,
    user,
    login,
    logout,
    sendTransaction
  } = usePrivy();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isLoading: !ready,
    isAuthenticated: authenticated,
    user,
    login: handleLogin,
    logout: handleLogout,
    sendTransaction,
    address: user?.wallet?.address
  };
}
