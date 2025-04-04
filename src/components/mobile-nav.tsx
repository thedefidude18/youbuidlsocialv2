'use client';

import { useAccount } from 'wagmi';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trophy, MessageSquare, Home as HomeIcon, Bell as BellIcon, User as UserIcon, PlusSquare as PlusSquareIcon } from 'lucide-react';

// Memoize the MobileNav component to prevent unnecessary re-renders
const MobileNavComponent = memo(function MobileNav() {
  const { address } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Only run this effect once on mount
  useEffect(() => {
    setMounted(true);

    // Prefetch common routes to improve navigation speed
    router.prefetch('/feed');
    router.prefetch('/notifications');
    router.prefetch('/leaderboard');
    router.prefetch('/messages');

    // If user is logged in, prefetch their profile page
    if (address) {
      router.prefetch(`/profile/${address}`);
    }
  }, [router, address]);

  const profilePath = mounted && address ? `/profile/${address}` : '#';

  return (
    <>
      {/* Floating Compose Button */}
      <button
        type="button"
        onClick={() => router.push('/compose')}
        className="fixed right-4 bottom-20 z-50 md:hidden bg-transparent border-none"
        aria-label="Create new post"
      >
        <Button
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <PlusSquareIcon className="h-6 w-6" />
        </Button>
      </button>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden">
        <div className="flex items-center justify-around">
          {/* Optimized navigation links with better performance */}
          <NavLink
            href="/feed"
            isActive={pathname === '/feed'}
            icon={<HomeIcon className="w-5 h-5" />}
          />

          <NavLink
            href="/messages"
            isActive={pathname === '/messages'}
            icon={<MessageSquare className="w-5 h-5" />}
          />

          <NavLink
            href="/leaderboard"
            isActive={pathname === '/leaderboard'}
            icon={<Trophy className="w-5 h-5" />}
          />

          <NavLink
            href="/notifications"
            isActive={pathname === '/notifications'}
            icon={<BellIcon className="w-5 h-5" />}
          />

          <NavLink
            href={profilePath}
            isActive={pathname?.startsWith('/profile')}
            icon={<UserIcon className="w-5 h-5" />}
            onClick={(e) => {
              if (!mounted || !address) {
                e.preventDefault();
                // Optionally show a toast or modal prompting to connect wallet
              }
            }}
          />
        </div>
      </nav>
    </>
  );
});

// Optimized NavLink component for mobile navigation
const NavLink = memo(function NavLink({ href, isActive, icon, onClick }: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Navigate to the route
    router.push(href);
  };

  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm bg-transparent border-none",
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
      onClick={handleClick}
      aria-label={href.replace('/', '')}
    >
      {icon}
      <span></span>
    </button>
  );
});

NavLink.displayName = 'NavLink';
MobileNavComponent.displayName = 'MobileNav';

// Export the optimized component
export const MobileNav = MobileNavComponent;


