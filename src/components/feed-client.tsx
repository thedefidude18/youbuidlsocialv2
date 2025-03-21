"use client";

import { useState, useEffect } from "react";
import { FeedTabs } from "@/components/feed-tabs";

interface FeedClientProps {
  children: React.ReactNode;
}

export function FeedClient({ children }: FeedClientProps) {
  const [currentTab, setCurrentTab] = useState("home");
  const [counts, setCounts] = useState({
    forYou: 0,
    following: 0,
    latest: 0
  });

  // Function to fetch new post counts
  const fetchNewPostCounts = async () => {
    try {
      // Replace this with your actual API calls
      const forYouCount = await getNewForYouPosts();
      const followingCount = await getNewFollowingPosts();
      const latestCount = await getNewLatestPosts();

      setCounts({
        forYou: forYouCount,
        following: followingCount,
        latest: latestCount
      });
    } catch (error) {
      console.error("Error fetching post counts:", error);
    }
  };

  // Update counts periodically
  useEffect(() => {
    fetchNewPostCounts();
    
    const interval = setInterval(() => {
      fetchNewPostCounts();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset count when tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    // Reset the count for the selected tab
    setCounts(prev => ({
      ...prev,
      [value === 'home' ? 'forYou' : value]: 0
    }));
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <FeedTabs 
        currentTab={currentTab} 
        onChange={handleTabChange}
        forYouCount={counts.forYou}
        followingCount={counts.following}
        latestCount={counts.latest}
      />
      {children}
    </div>
  );
}

// Placeholder functions - replace with your actual API calls
async function getNewForYouPosts() {
  return 5; // For testing
}

async function getNewFollowingPosts() {
  return 12; // For testing
}

async function getNewLatestPosts() {
  return 3; // For testing
}




