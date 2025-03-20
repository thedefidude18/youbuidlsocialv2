"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useNotifications } from "@/components/notification-provider";
import { Loader2 } from "lucide-react";

type NotificationType = "all" | "mentions" | "likes" | "recasts" | "follows" | 
                       "donations" | "points" | "withdrawals";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationType>("all");
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchNotifications();
      } catch (err) {
        setError((err as Error).message || 'Failed to load notifications');
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    if (!mounted) {
      loadNotifications();
    }
  }, [mounted, fetchNotifications]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "mentions") return notification.type === "mention";
    if (activeTab === "likes") return notification.type === "like";
    if (activeTab === "recasts") return notification.type === "recast";
    if (activeTab === "follows") return notification.type === "follow";
    if (activeTab === "donations") return notification.type === "donation";
    if (activeTab === "points") return notification.type === "points";
    if (activeTab === "withdrawals") return notification.type === "withdrawal";
    return false;
  });

  if (!mounted || isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
          <div className="border-b border-border p-4">
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
          <div className="border-b border-border p-4">
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-destructive text-center">
              <p>Failed to load notifications</p>
              <button 
                onClick={() => fetchNotifications()}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {unreadCount} new notifications
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as NotificationType)}
          className="w-full"
        >
          <ScrollArea orientation="horizontal" className="w-full border-b border-border">
            <TabsList className="inline-flex w-full md:w-auto p-0 h-12">
              <TabsTrigger
                value="all"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="mentions"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Mentions
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Likes
              </TabsTrigger>
              <TabsTrigger
                value="recasts"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Reposts
              </TabsTrigger>
              <TabsTrigger
                value="follows"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Follows
              </TabsTrigger>
              <TabsTrigger
                value="donations"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Donations
              </TabsTrigger>
              <TabsTrigger
                value="points"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Points
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full"
              >
                Withdrawals
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <ScrollArea className="flex-1">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${notification.isNew ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Link href={`/profile/${notification.user.username}`} className="font-semibold hover:underline">
                            {notification.user.name}
                          </Link>

                          {notification.user.verified && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          )}

                          <span className="text-muted-foreground">
                            {notification.content}
                          </span>

                          <span className="text-muted-foreground text-sm">{notification.time}</span>

                          {notification.isNew && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-xs">New</Badge>
                          )}
                        </div>

                        {notification.postContent && (
                          <div className="mt-2 text-sm text-muted-foreground border-l-2 border-muted pl-3 py-1">
                            {notification.postContent}
                          </div>
                        )}

                        {notification.channelName && (
                          <div className="mt-2">
                            <Link href={`/${notification.channelName}`} className="text-primary">
                              #{notification.channelName}
                            </Link>
                          </div>
                        )}

                        {notification.type === "follow" && (
                          <button className="mt-2 text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90">
                            Follow back
                          </button>
                        )}

                        {notification.type === "donation" && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              +{notification.amount?.value} {notification.amount?.currency}
                            </span>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                              Donation
                            </Badge>
                          </div>
                        )}

                        {notification.type === "points" && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              +{notification.amount?.value} Points
                            </span>
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                              Points
                            </Badge>
                          </div>
                        )}

                        {notification.type === "withdrawal" && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {notification.amount?.value} {notification.amount?.currency}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "border-blue-200 dark:border-blue-800",
                                notification.status === "completed" 
                                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
                                  : notification.status === "pending"
                                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                              )}
                            >
                              {notification.status === "completed" ? "Completed" : 
                               notification.status === "pending" ? "Processing" : "Failed"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  When you get notifications, they'll show up here. Interact with posts and other users to start receiving notifications.
                </p>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>
    </MainLayout>
  );
}



