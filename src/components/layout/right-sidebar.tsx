"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon, FramesIcon } from "@/components/icons";

interface UserToFollowProps {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

function UserToFollow({ id, name, username, avatar }: UserToFollowProps) {
  return (
    <div className="flex items-center gap-3 mb-4 hover:bg-secondary/50 rounded-lg p-2 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-muted-foreground truncate">@{username}</div>
      </div>
      <Button size="sm" variant="outline" className="rounded-full px-4">
        Follow
      </Button>
    </div>
  );
}

export function RightSidebar() {
  return (
    <div className="w-0 lg:w-80 border-l border-border h-full py-6 px-4 hidden lg:block overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Suggested Follows</h3>
          <SettingsIcon className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>

        <div className="space-y-2">
          <UserToFollow
            id="1"
            name="John Doe"
            username="johndoe"
            avatar="https://placekitten.com/100/100"
          />
          <UserToFollow
            id="2"
            name="Jane Smith"
            username="janesmith"
            avatar="https://placekitten.com/101/101"
          />
          <UserToFollow
            id="3"
            name="Bob Johnson"
            username="bobjohnson"
            avatar="https://placekitten.com/102/102"
          />
        </div>

        <button className="w-full text-sm text-primary hover:underline mt-3 text-center">
          Show more
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trending Frames</h3>
          <SettingsIcon className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>

        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-0">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-24 flex items-center justify-center">
              <FramesIcon className="h-8 w-8 text-white" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-sm mb-2">Ball Frame</CardTitle>
            <div className="text-xs text-muted-foreground">
              12.3k views · 2.1k likes
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
        <a href="#" className="hover:underline">Support</a>
        <span>·</span>
        <a href="#" className="hover:underline">Privacy</a>
        <span>·</span>
        <a href="#" className="hover:underline">Terms</a>
        <span>·</span>
        <a href="#" className="hover:underline">Developers</a>
      </div>
    </div>
  );
}