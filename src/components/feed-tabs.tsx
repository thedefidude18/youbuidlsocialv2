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
  latestCount?: number;
}

export function FeedTabs({ 
  currentTab, 
  onChange, 
  forYouCount = 0, 
  followingCount = 0,
  latestCount = 0
}: FeedTabsProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "search") {
      router.push("/search");
      return;
    }
    onChange(value);
  };

  const renderBadge = (count: number) => {
    if (count <= 0) return null;
    return (
      <div className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-primary flex items-center justify-center">
        <span className="text-[11px] font-medium text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      </div>
    );
  };

  return (
    <div className="sticky top-14 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="max-w-2xl mx-auto">
          <TabsList className="w-full h-12 bg-transparent p-0 flex justify-center gap-2">
            <TabsTrigger
              value="home"
              className="relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <span className="relative">
                For you
                {renderBadge(forYouCount)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <span className="relative">
                Following
                {renderBadge(followingCount)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="latest"
              className="relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <span className="relative">
                Latest
                {renderBadge(latestCount)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Search className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}






