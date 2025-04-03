'use client';

import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { donationContractABI } from '@/contracts/DonationContract';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DonationEvent {
  args: {
    streamId: string;
    donor: string;
    token: string;
    amount: bigint;
    timestamp: bigint;
  };
  blockNumber: bigint;
  transactionHash: string;
}

interface DonationHistoryProps {
  address: string;
}

export function DonationHistory({ address }: DonationHistoryProps) {
  const [donations, setDonations] = useState<DonationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchDonationEvents() {
      if (!address) return;
      
      try {
        setIsLoading(true);
        const events = await publicClient.getContractEvents({
          address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
          abi: donationContractABI,
          eventName: 'DonationReceived',
          args: {
            streamId: address // Assuming streamId is used to identify the recipient
          },
          fromBlock: 'earliest'
        });

        // Sort events by timestamp in descending order
        const sortedEvents = (events as DonationEvent[]).sort((a, b) => 
          Number(b.args.timestamp) - Number(a.args.timestamp)
        );

        setDonations(sortedEvents);
      } catch (error) {
        console.error('Error fetching donation events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDonationEvents();
  }, [address, publicClient]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!donations.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No donations received yet
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const paginatedDonations = donations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {paginatedDonations.map((event, index) => (
        <div 
          key={`${event.transactionHash}-${index}`} 
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/9.x/bottts/svg?seed=${event.args.donor}`} />
              <AvatarFallback>{event.args.donor.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {event.args.donor.slice(0, 6)}...{event.args.donor.slice(-4)}
                </p>
                <a
                  href={`https://sepolia-optimism.etherscan.io/tx/${event.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  ↗
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(Number(event.args.timestamp) * 1000, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatEther(event.args.amount)} ETH</p>
            <p className="text-xs text-muted-foreground">
              ${(Number(formatEther(event.args.amount)) * 2000).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
      {donations.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}



