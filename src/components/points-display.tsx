"use client";

import { usePointsContract } from "@/providers/points-provider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLinkIcon } from "lucide-react";
import { useAccount } from "wagmi";

export function PointsDisplay() {
  const { points, isLoading } = usePoints();
  const contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  
  const optimismScanUrl = `https://sepolia-optimistic.etherscan.io/address/${contractAddress}`;

  if (isLoading) {
    return <Badge variant="outline">Loading points...</Badge>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary" className="ml-2">
            {points} Points
            <a 
              href={optimismScanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Points are stored on Optimism Sepolia</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}


