'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStorageItem, setStorageItem } from '@/lib/storage-helper';

interface NavigationContextType {
  isRouteChanging: boolean;
  isFirstLoad: boolean;
  prefetchRoute: (route: string) => void;
  navigateTo: (route: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isRouteChanging: false,
  isFirstLoad: true,
  prefetchRoute: () => {},
  navigateTo: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadedRoutes, setLoadedRoutes] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  // Load visited routes from storage on mount
  useEffect(() => {
    try {
      const storedRoutes = getStorageItem('visitedRoutes');
      if (storedRoutes) {
        const parsedRoutes = JSON.parse(storedRoutes);
        if (Array.isArray(parsedRoutes)) {
          setLoadedRoutes(parsedRoutes);
        }
      }
    } catch (error) {
      console.warn('Could not load visited routes from storage:', error);
    }
  }, []);

  // Track the current route
  useEffect(() => {
    // Mark first load as complete
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }

    // Add current route to loaded routes
    if (pathname) {
      setLoadedRoutes(prev => {
        if (!prev.includes(pathname)) {
          const newRoutes = [...prev, pathname];
          // Safely store visited routes
          try {
            setStorageItem('visitedRoutes', JSON.stringify(newRoutes));
          } catch (error) {
            console.warn('Could not save visited routes to storage:', error);
          }
          return newRoutes;
        }
        return prev;
      });
    }

    // Reset route changing state
    setIsRouteChanging(false);
  }, [pathname, isFirstLoad]);

  // Prefetch important routes on mount
  useEffect(() => {
    const commonRoutes = [
      '/feed',
      '/profile',
      '/notifications',
      '/messages',
      '/leaderboard',
      '/search'
    ];

    commonRoutes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  // Function to prefetch a specific route
  const prefetchRoute = (route: string) => {
    router.prefetch(route);
  };

  // Function to navigate to a route
  const navigateTo = (route: string) => {
    setIsRouteChanging(true);
    router.push(route);
  };

  return (
    <NavigationContext.Provider
      value={{
        isRouteChanging,
        isFirstLoad,
        prefetchRoute,
        navigateTo
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
