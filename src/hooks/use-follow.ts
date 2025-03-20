"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { usePoints } from '@/providers/points-provider';

const FOLLOWING_STORAGE_KEY = 'warpcast_following';

export function useFollow() {
  const { user } = useAuth();
  const { addUserPoints } = usePoints();
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<Record<string, string[]>>({});

  // Load following data on mount
  useEffect(() => {
    const loadFollowData = () => {
      const storedData = localStorage.getItem(FOLLOWING_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setFollowing(parsed.following || []);
        setFollowers(parsed.followers || {});
      }
    };

    loadFollowData();
    // Add event listener for storage changes
    window.addEventListener('storage', loadFollowData);
    return () => window.removeEventListener('storage', loadFollowData);
  }, []);

  // Save data to localStorage and trigger event
  const saveData = useCallback((newFollowing: string[], newFollowers: Record<string, string[]>) => {
    const data = JSON.stringify({
      following: newFollowing,
      followers: newFollowers
    });
    localStorage.setItem(FOLLOWING_STORAGE_KEY, data);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, []);

  const toggleFollow = useCallback((userId: string) => {
    if (!user?.id) return;

    setFollowing(prev => {
      const isCurrentlyFollowing = prev.includes(userId);
      const newFollowing = isCurrentlyFollowing
        ? prev.filter(id => id !== userId)
        : [...prev, userId];

      setFollowers(prev => {
        const newFollowers = { ...prev };
        if (isCurrentlyFollowing) {
          newFollowers[userId] = (newFollowers[userId] || []).filter(id => id !== user.id);
        } else {
          newFollowers[userId] = [...(newFollowers[userId] || []), user.id];
          // Add points for following
          addUserPoints(5, 'follow');
        }
        
        // Save and sync data
        saveData(newFollowing, newFollowers);
        return newFollowers;
      });

      return newFollowing;
    });
  }, [user?.id, addUserPoints, saveData]);

  const isFollowing = useCallback((userId: string) => {
    return following.includes(userId);
  }, [following]);

  const getFollowingCount = useCallback((userId: string) => {
    return following.filter(id => id === userId).length;
  }, [following]);

  const getFollowersCount = useCallback((userId: string) => {
    return followers[userId]?.length || 0;
  }, [followers]);

  return {
    following,
    followers,
    toggleFollow,
    isFollowing,
    getFollowingCount,
    getFollowersCount
  };
}

