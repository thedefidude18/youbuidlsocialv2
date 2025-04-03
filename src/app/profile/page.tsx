'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute as ProtectedRouteComponent } from '@/components/protected-route';

// This is a local wrapper for the profile page
export function ProfileProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null; // or your loading component
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}


