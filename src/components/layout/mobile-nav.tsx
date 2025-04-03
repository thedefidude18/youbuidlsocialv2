"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ExploreIcon,
  FramesIcon,
  ProfileIcon,
  WarpcastIcon,
  NotificationsIcon
} from "@/components/icons";
import { useNotifications } from "@/components/notification-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setShowBadge(unreadCount > 0);
  }, [unreadCount]);

  const navItems = [
    {
      name: "Feed",
      href: "/feed",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: <ExploreIcon className="h-6 w-6" />,
    },
    {
      name: "Rank",
      href: "/leaderboard",
      icon: <WarpcastIcon className="h-6 w-6" />,
      primary: true
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <NotificationsIcon className="h-6 w-6" />,
      badge: showBadge ? unreadCount : undefined
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <ProfileIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full relative",
              item.primary ? "text-primary" : "text-muted-foreground",
              pathname === item.href && !item.primary && "text-foreground"
            )}
          >
            {item.primary ? (
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
                {item.icon}
              </div>
            ) : (
              <div className="flex items-center justify-center h-6 relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
            )}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
