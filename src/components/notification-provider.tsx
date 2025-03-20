'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { orbis } from "@/lib/orbis";
import type { NotificationItem } from '@/types/notification';

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

  const fetchNotifications = async () => {
    try {
      // Check if orbis is initialized
      if (!orbis) {
        throw new Error("Orbis not initialized");
      }

      // Modified connection check and initialization
      let isConnected = false;
      try {
        const connectionStatus = await orbis.isConnected();
        isConnected = connectionStatus.status;
      } catch (error) {
        console.error("Connection check failed:", error);
      }

      if (!isConnected) {
        const res = await orbis.connect_v2();
        if (!res?.status) {
          throw new Error("Failed to connect to Orbis");
        }
      }

      // Get user notifications from Orbis
      const result = await orbis.getNotifications();
      
      // Properly handle the response
      if (!result) {
        throw new Error("No response from notifications service");
      }

      // Check if we have data and it's an array
      const notificationsData = Array.isArray(result.data) ? result.data : [];
      
      const formattedNotifications: NotificationItem[] = notificationsData.map((notification: any) => {
        let type: NotificationItem["type"] = "system";
        let content = "";
        let postContent = "";

        // Determine notification type and content based on Orbis notification
        switch (notification.type) {
          case "follow":
            type = "follow";
            content = "followed you";
            break;
          case "reaction":
            type = "like";
            content = "liked your cast";
            postContent = notification.post_content;
            break;
          case "mention":
            type = "mention";
            content = "mentioned you";
            postContent = notification.post_content;
            break;
          case "reply":
            type = "reply";
            content = "replied to your cast";
            postContent = notification.post_content;
            break;
          case "recast":
            type = "recast";
            content = "recasted your post";
            postContent = notification.post_content;
            break;
          case "donation":
            type = "donation";
            content = `donated ${notification.amount?.value} ${notification.amount?.currency}`;
            break;
          case "points":
            type = "points";
            content = `awarded you ${notification.amount?.value} points`;
            break;
          case "withdrawal":
            type = "withdrawal";
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
          time: new Date(notification.timestamp).toRelativeTimeString(),
          isNew: !notification.read,
        };
      });

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Don't throw here - we want to handle the error gracefully
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      // Use a more reliable initialization approach
      const initializeNotifications = async () => {
        try {
          await fetchNotifications();
        } catch (error) {
          console.error("Failed to initialize notifications:", error);
        }
      };
      
      initializeNotifications();
    }

    // Set up polling for new notifications
    const pollInterval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [mounted]);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
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







