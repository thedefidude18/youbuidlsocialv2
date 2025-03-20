"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ExplorePage() {
  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold">Explore</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <div className="font-semibold mb-2">#{["base", "farcade", "web3", "ai", "crypto", "meme", "nft", "defi", "gaming"][i] || "topic"}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 1000)} casts today
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Trending Channels</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="font-medium">#{["basebuilders", "warpcast", "memes", "picslab", "aiart", "daos"][i] || "channel"}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 5000)} members
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
