"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/store/messages-store";
import { UserSearch } from "./user-search";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  onThreadSelect: (threadId: string) => void;
  selectedThread: string | null;
}

export function MessageList({ onThreadSelect, selectedThread }: MessageListProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { threads, createThread } = useMessagesStore();

  const handleUserSelect = (user: any) => {
    const threadId = createThread([user.id]);
    onThreadSelect(threadId);
  };

  return (
    <>
      <div className="p-4 border-b border-border">
        <Button 
          className="w-full"
          onClick={() => setIsSearchOpen(true)}
        >
          New Message
        </Button>
      </div>

      <div className="divide-y divide-border">
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={cn(
              "w-full p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors",
              selectedThread === thread.id && "bg-secondary"
            )}
            onClick={() => onThreadSelect(thread.id)}
          >
            <Avatar>
              <AvatarImage src={thread.participants[0].avatar} />
              <AvatarFallback>{thread.participants[0].name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{thread.participants[0].name}</span>
                {thread.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.lastMessage.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>
              {thread.lastMessage && (
                <div className="text-sm text-muted-foreground truncate">
                  {thread.lastMessage.content}
                </div>
              )}
            </div>
            
            {thread.lastMessage && !thread.lastMessage.read && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            )}
          </button>
        ))}
      </div>

      <UserSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectUser={handleUserSelect}
      />
    </>
  );
}