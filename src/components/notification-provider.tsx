'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { orbis } from "@/lib/orbis";
import type { NotificationItem } from '@/types/notification';
import { getEthereumProvider } from "@/utils/wallet";

interface NotificationItem {
  id: string;
  type: "mention" | "like" | "recast" | "follow" | "reply" | "channel" | "system" | 
        "donation" | "points" | "withdrawal";
  user: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content?: string;
  postContent?: string;
  time: string;
  isNew?: boolean;
  channelName?: string;
  amount?: {
    value: number;
    currency: string;  // "USD" | "POINTS" | "ETH" etc.
  };
  status?: "completed" | "pending" | "failed";
}

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  fetchNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
  fetchNotifications: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeOrbis = async () => {
    try {
      if (!orbis) {
        throw new Error("Orbis not initialized");
      }

      const provider = getEthereumProvider();
      if (!provider) {
        throw new Error("No Ethereum provider available");
      }

      const res = await orbis.connect_v2({
        provider: provider,
        chain: 'ethereum'
      });

      if (!res?.status) {
        throw new Error("Failed to connect to Orbis");
      }
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Failed to initialize Orbis:", error);
      return false;
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!isInitialized) {
        const initialized = await initializeOrbis();
        if (!initialized) return [];
      }

      const result = await orbis.getNotifications();
      
      if (!result || !result.data) {
        throw new Error("Failed to fetch notifications");
      }

      // Process notifications
      const notificationsData = Array.isArray(result.data) ? result.data : [];
      const formattedNotifications = notificationsData.map(notification => {
        let type = notification.type || "system";
        let content = "";
        let postContent = notification.post_content;

        switch (type) {
          case "mention":
            content = "mentioned you";
            break;
          case "like":
            content = "liked your post";
            break;
          case "recast":
            content = "recasted your post";
            break;
          case "follow":
            content = "followed you";
            break;
          case "reply":
            content = "replied to your post";
            break;
          case "channel":
            content = `invited you to channel ${notification.channelName}`;
            break;
          case "donation":
            content = `sent you ${notification.amount?.value} ${notification.amount?.currency}`;
            break;
          case "points":
            content = `awarded you ${notification.amount?.value} points`;
            break;
          case "withdrawal":
            content = `${notification.status === "completed" ? "Completed" : "Processing"} withdrawal of ${notification.amount?.value} ${notification.amount?.currency}`;
            break;
        }

        return {
          id: notification.stream_id,
          type,
          user: {
            name: notification.user_details?.profile?.username || notification.did_details?.did,
            username: notification.user_details?.profile?.username || notification.did_details?.did,
            avatar: notification.user_details?.profile?.pfp || "",
            verified: notification.user_details?.profile?.verified || false,
          },
          content,
          postContent,
          time: new Date(notification.timestamp).toLocaleString(),
          isNew: !notification.read,
        };
      });

      setNotifications(formattedNotifications);
      return formattedNotifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      initializeOrbis().then(() => {
        fetchNotifications();
      });
    }

    const pollInterval = setInterval(() => {
      if (isInitialized) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [mounted, isInitialized]);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      if (!isInitialized) {
        await initializeOrbis();
      }
      
      const result = await orbis.markNotificationAsRead(id);
      if (!result?.status) {
        throw new Error("Failed to mark notification as read");
      }
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isNew: false }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!isInitialized) {
        await initializeOrbis();
      }
      
      const result = await orbis.markAllNotificationsAsRead();
      if (!result?.status) {
        throw new Error("Failed to mark all notifications as read");
      }
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isNew: false }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  return context;
}










