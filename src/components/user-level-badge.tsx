"use client";

import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { usePoints } from '@/providers/points-provider';

interface UserLevelBadgeProps {
  level?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  userId?: string;
  className?: string;
}

export function UserLevelBadge({
  level: propLevel,
  size = 'md',
  showTooltip = true,
  className = ''
}: UserLevelBadgeProps) {
  const pointsData = usePoints();
  const level = propLevel ?? pointsData.level;
  const { points, levelProgress, nextLevelThreshold } = pointsData;
  const [hover, setHover] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      badgeSize: 'h-5 w-5 text-xs',
      textSize: 'text-xs',
    },
    md: {
      badgeSize: 'h-6 w-6 text-sm',
      textSize: 'text-sm',
    },
    lg: {
      badgeSize: 'h-8 w-8 text-base',
      textSize: 'text-base',
    }
  };

  // Level color configurations (from level 1 to 15)
  const getLevelColor = (level: number) => {
    if (level <= 3) return 'bg-zinc-400'; // Bronze
    if (level <= 6) return 'bg-zinc-300'; // Silver
    if (level <= 9) return 'bg-yellow-400'; // Gold
    if (level <= 12) return 'bg-cyan-400'; // Diamond
    return 'bg-purple-500'; // Elite
  };

  const levelBadge = (
    <div
      className={`${sizeConfig[size].badgeSize} flex items-center justify-center rounded-full ${getLevelColor(level)} font-bold text-background ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {level}
    </div>
  );

  if (!showTooltip) {
    return levelBadge;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {levelBadge}
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="p-0 overflow-hidden rounded-lg border w-56">
          <div className="p-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold">Level {level}</h4>
              <div className="text-xs font-medium">{points} points</div>
            </div>

            <Progress value={levelProgress} className="h-2 mb-1" />

            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Current</span>
              <span>{levelProgress}% to Level {level + 1}</span>
            </div>
          </div>

          <div className="bg-muted p-2 px-3 flex justify-between items-center text-xs border-t">
            <span className="text-muted-foreground">Next level at {nextLevelThreshold} points</span>
            <span className="font-medium">{nextLevelThreshold - points} to go</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
