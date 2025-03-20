"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/message/message-list";
import { MessageThread } from "@/components/message/message-thread";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  return (
    <MainLayout>
      <PageHeader title="Messages" />
      <div className="flex-1 min-h-0 flex">
        {/* Messages List Sidebar */}
        <div className="w-full md:w-80 border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Direct Messages"
                className="pl-9"
              />
            </div>
          </div>

          {/* Messages List */}
          <ScrollArea className="flex-1">
            <MessageList onThreadSelect={setSelectedThread} selectedThread={selectedThread} />
          </ScrollArea>

          {/* New Message Button */}
          <div className="p-4 border-t border-border">
            <Button className="w-full">New Message</Button>
          </div>
        </div>

        {/* Message Thread or Empty State */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedThread ? (
            <MessageThread threadId={selectedThread} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Select a message</h2>
                <p className="text-muted-foreground">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

