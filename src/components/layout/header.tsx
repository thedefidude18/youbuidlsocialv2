"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { usePoints } from "@/providers/points-provider";
import { useAuth } from "@/providers/auth-provider";
import { Search, Github, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const { points, level } = usePoints();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const showBackButton = pathname !== "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-4 w-[200px]">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <img src="/youlogo.svg" alt="Logo" className="h-6 w-6" />
              <span className="font-semibold">youBuidl</span>
            </Link>
          )}
        </div>

        {/* Points display - mobile only */}
        <div className="md:hidden flex-1 flex justify-center">
          <Button variant="ghost" className="text-sm">
            {points} pts • Level {level}
          </Button>
        </div>

        {/* Search Bar - centered */}
        <div className="hidden md:flex justify-center max-w-[400px] w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search posts, users, and topics"
              className="w-full pl-9 pr-4 bg-muted/50 border-none"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 w-[200px] justify-end">
          <Button variant="ghost" className="text-sm hidden md:inline-flex">
            {points} pts • Level {level}
          </Button>
          <Link 
            href="https://github.com/youbuidl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-flex"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
          <WalletConnectButton size="sm" variant="outline" className="!h-9 min-w-[120px]" />
        </div>
      </div>
    </header>
  );
}














