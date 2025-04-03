'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Home from '@/components/icons/Home';
import PlusSquare from '@/components/icons/PlusSquare';
import Bell from '@/components/icons/Bell';
import User from '@/components/icons/User';
import Search from '@/components/icons/Search';
import { MessageSquare } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react'

export function MobileNav() {
  const { address } = useAccount();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profilePath = mounted && address ? `/profile/${address}` : '#';

  return (
    <>
      {/* Floating Compose Button */}
      <Link 
        href="/compose" 
        className="fixed right-4 bottom-20 z-50 md:hidden"
      >
        <Button 
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <PlusSquare className="h-6 w-6" />
        </Button>
      </Link>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden">
        <div className="flex items-center justify-around">
          <Link 
            href="/feed" 
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm",
              pathname === '/feed' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Home className="w-5 h-5" />
            <span></span>
          </Link>

           <Link 
        href="/messages" 
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm",
          pathname === '/messages' ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <MessageSquare className="w-5 h-5" />
        <span></span>
      </Link>

          <Link 
            href="/leaderboard" 
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm",
              pathname === '/leaderboard' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Trophy className="w-5 h-5" />
            <span></span>
          </Link>

          <Link 
            href="/notifications" 
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm",
              pathname === '/notifications' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Bell className="w-5 h-5" />
            <span></span>
          </Link>

      

          <Link
            href={profilePath}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full p-4 text-sm",
              pathname?.startsWith('/profile') ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={(e) => {
              if (!mounted || !address) {
                e.preventDefault();
                // Optionally show a toast or modal prompting to connect wallet
              }
            }}
          >
            <User className="w-5 h-5" />
            <span></span>
          </Link>
        </div>
      </nav>
    </>
  );
}







