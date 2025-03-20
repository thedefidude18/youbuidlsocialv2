"use client";

import { usePoints } from "@/providers/points-provider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function PointsDisplay() {
  const { points, isLoading } = usePoints();

  if (isLoading) {
    return <Badge variant="outline">Points: ...</Badge>;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="secondary" className="ml-2">
          {points} Points
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div>Post: 10 points</div>
          <div>Comment: 5 points</div>
          <div>Like: 2 points</div>
          <div>Repost: 3 points</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
