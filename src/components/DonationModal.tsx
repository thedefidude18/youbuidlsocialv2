'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { donationContractABI } from '@/contracts/DonationContract';
import { useToast } from './ui/use-toast';

interface DonationModalProps {
  streamId: string;
  authorAddress: string;
}

export function DonationModal({ streamId, authorAddress }: DonationModalProps) {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();

  const { write: donateETH, data: donationData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'donateETH',
    args: [streamId],
    value: amount ? parseEther(amount) : 0n,
  });

  const { isLoading } = useWaitForTransaction({
    hash: donationData?.hash,
    onSuccess: () => {
      toast({
        title: 'Donation successful!',
        description: `You donated ${amount} ETH to ${authorAddress}`,
      });
      setAmount('');
    },
  });

  const handleDonate = () => {
    if (!address) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to donate.',
        variant: 'destructive',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      donateETH?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process donation.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support this cast</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-4"
            />
          </div>
          <Button
            onClick={handleDonate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Send Donation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}