'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/providers/navigation-provider';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isRouteChanging, isFirstLoad } = useNavigation();
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const [content, setContent] = useState<React.ReactNode>(children);
  const pathname = usePathname();

  // Update content when pathname changes
  useEffect(() => {
    // Don't update on first load to avoid flicker
    if (isFirstLoad) {
      return;
    }

    // If route is changing, keep previous content visible
    if (pathname !== prevPathname) {
      // Only update content when we have new children
      if (!isRouteChanging) {
        setContent(children);
        setPrevPathname(pathname);
      }
    }
  }, [children, pathname, prevPathname, isRouteChanging, isFirstLoad]);

  return (
    <div className={cn(
      "transition-opacity duration-200",
      isFirstLoad ? "opacity-0" : "opacity-100"
    )}>
      {content}
    </div>
  );
}
