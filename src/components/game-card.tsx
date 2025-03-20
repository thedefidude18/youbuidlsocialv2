"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CopyIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface GameCardProps {
  title: string;
  subtitle: string;
  count: number;
  className?: string;
}

export function GameCard({ title, subtitle, count, className }: GameCardProps) {
  return (
    <Card className={`bg-secondary/50 overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <CopyIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-3xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
}

export function AILaunchCard() {
  return (
    <Card className="bg-gradient-to-br from-blue-900 to-black overflow-hidden text-white">
      <CardHeader className="p-4 pb-0">
        <h3 className="text-xl font-bold">AI Based <span className="text-blue-400">Alpha</span> Launch</h3>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-0">
        <div className="aspect-square w-full rounded-lg border-2 border-blue-500 bg-black/70 flex items-center justify-center">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-blue-400/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between">
        <div>
          <p className="text-xs">Monday</p>
          <p className="text-xs">3/17</p>
        </div>
        <div>
          <p className="text-xs">See You There...</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export function NetworkTestCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-900 to-black overflow-hidden text-white">
      <CardHeader className="p-4 pb-2">
        <h3 className="text-xl font-bold text-center">NETWORK TESTS</h3>
        <h2 className="text-2xl font-bold text-center">SPACE JUMP</h2>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/30">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</div>
          <span className="text-sm">Testing</span>
          <span className="text-sm text-blue-400 ml-2">Telegram</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/30">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</div>
          <span className="text-sm">Testing</span>
          <span className="text-sm text-purple-400 ml-2">Warpcast</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/30">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-xs">✓</div>
          <span className="text-sm">Testing</span>
          <span className="text-sm text-blue-300 ml-2">Wechat</span>
        </div>
        <p className="text-sm mt-2">Congratulations! Your game has passed all network tests and is pending a final review.</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </Button>
        <Button className="flex-1 bg-purple-700 hover:bg-purple-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </Button>
      </CardFooter>
      <div className="p-4 pt-0 text-center">
        <Button className="w-full bg-black/50 hover:bg-black/70">Back to Studio</Button>
      </div>
    </Card>
  );
}

export function HuntTownQuizCard() {
  return (
    <Card className="bg-gradient-to-br from-orange-900 to-black overflow-hidden text-white">
      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-bold text-center">Hunt Town Quiz Frame</h3>
        <p className="text-xs text-center text-muted-foreground">Test your knowledge of HUNT TOWN</p>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-0">
        <div className="flex justify-center">
          <Button className="bg-purple-700 hover:bg-purple-800">
            Begin quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
