"use client";

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useNotifications } from "@/components/notification-provider";
import { Home, Search, Bell, Trophy, Mail, User, Settings, Twitter, Github, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default profile path when not connected or during initial render
  const profilePath = mounted && address ? `/profile/${address}` : '/profile';

  const navigationItems = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/search", icon: Search, label: "Explore" },
    { href: "/notifications", icon: Bell, label: "Notifications", count: unreadCount },
    { href: "/messages", icon: Mail, label: "Messages" },
    { href: profilePath, icon: User, label: "Profile" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const socialItems = [
    { href: "https://twitter.com/youbuidl", icon: Twitter, label: "Twitter" },
    { href: "https://github.com/youbuidl", icon: Github, label: "GitHub" },
    { href: "https://discord.gg/youbuidl", icon: MessageSquare, label: "Discord" },
  ];

  return (
    <div className="flex flex-col h-full py-4 px-2">
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition-colors hover:bg-accent",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.count && mounted ? (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      {/* Social Media Links */}
      <div className="mt-8 border-t border-border pt-4">
        <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">Connect With Us</h3>
        <nav className="space-y-1">
          {socialItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}








