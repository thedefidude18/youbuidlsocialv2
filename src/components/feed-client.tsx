"use client";

import { useState } from "react";
import { FeedTabs } from "@/components/feed-tabs";

interface FeedClientProps {
  children: React.ReactNode;
}

export function FeedClient({ children }: FeedClientProps) {
  const [currentTab, setCurrentTab] = useState("home"); // Make sure default is "home"

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <FeedTabs 
        currentTab={currentTab} 
        onChange={handleTabChange}
        forYouCount={0}
        followingCount={0}
      />
      {children}
    </div>
  );
}


