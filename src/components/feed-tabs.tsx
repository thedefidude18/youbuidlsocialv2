"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedTabsProps {
  currentTab: string;
  onChange: (value: string) => void;
  forYouCount?: number;
  followingCount?: number;
}

export function FeedTabs({ 
  currentTab, 
  onChange, 
  forYouCount = 0, 
  followingCount = 0 
}: FeedTabsProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "search") {
      router.push("/search");
      return;
    }
    onChange(value);
  };

  return (
    <div className="sticky top-14 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="max-w-2xl mx-auto"> {/* Add max width and center */}
          <TabsList className="w-full h-12 bg-transparent p-0 flex justify-center gap-2">
            <TabsTrigger
              value="home"
              className={cn(
                "relative flex items-center gap-2 px-6",
                "data-[state=active]:border-b-2 data-[state=active]:border-primary",
                "data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "data-[state=active]:rounded-none rounded-none h-full",
                "text-sm font-semibold transition-all"
              )}
            >
              For you
              {forYouCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                  {forYouCount > 99 ? '99+' : forYouCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className={cn(
                "relative flex items-center gap-2 px-6",
                "data-[state=active]:border-b-2 data-[state=active]:border-primary",
                "data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "data-[state=active]:rounded-none rounded-none h-full",
                "text-sm font-semibold transition-all"
              )}
            >
              Following
              {followingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                  {followingCount > 99 ? '99+' : followingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="latest"
              className={cn(
                "relative flex items-center gap-2 px-6",
                "data-[state=active]:border-b-2 data-[state=active]:border-primary",
                "data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "data-[state=active]:rounded-none rounded-none h-full",
                "text-sm font-semibold transition-all"
              )}
            >
              Latest
            </TabsTrigger>
            <TabsTrigger
              value="home"
              className={cn(
                "relative flex items-center gap-2 px-6",
                "data-[state=active]:border-b-2 data-[state=active]:border-primary",
                "data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "data-[state=active]:rounded-none rounded-none h-full",
                "text-sm font-semibold transition-all"
              )}
            >
              For you
              {forYouCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                  {forYouCount > 99 ? '99+' : forYouCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className={cn(
                "relative flex items-center gap-2 px-6",
                "data-[state=active]:border-b-2 data-[state=active]:border-primary",
                "data-[state=active]:text-foreground data-[state=active]:shadow-none",
                "data-[state=active]:rounded-none rounded-none h-full",
                "text-sm font-semibold transition-all"
              )}
            >
              <Search className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}




