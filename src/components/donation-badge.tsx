'use client';

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Gift } from "lucide-react";
import { formatEther } from "viem";

interface DonationBadgeProps {
  totalDonations: bigint | null;
}

export function DonationBadge({ totalDonations }: DonationBadgeProps) {
  if (!totalDonations || totalDonations === BigInt(0)) {
    return null;
  }

  const formattedAmount = formatEther(totalDonations);
  // Round to 3 decimal places
  const displayAmount = Number(formattedAmount).toFixed(3);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/30"
        >
          <Gift className="w-3 h-3" />
          <span>{displayAmount} ETH</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Total donations received</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface Author {
  id: string;
  name: string;
  username: string;
  verified?: boolean;
  address: string;
  avatar?: string;
  totalDonations?: bigint | null;
}

interface Post {
  id: string;
  content: string;
  timestamp: number;
  author: Author;
  // ... other post fields
}


