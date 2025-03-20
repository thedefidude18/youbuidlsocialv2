'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { donationContractABI } from '@/contracts/DonationContract';
import { useToast } from '@/hooks/use-toast';

export function WithdrawModal() {
  const { address } = useAccount();
  const { toast } = useToast();

  const { write: withdrawDonations, data: withdrawData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'withdrawDonations',
  });

  const { isLoading } = useWaitForTransactionReceipt({
    hash: withdrawData?.hash,
    onSuccess: () => {
      toast({
        title: 'Withdrawal successful!',
        description: 'Your donations have been withdrawn to your wallet.',
      });
    },
  });

  const handleWithdraw = () => {
    if (!address) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to withdraw donations.',
        variant: 'destructive',
      });
      return;
    }

    try {
      withdrawDonations?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Withdraw Donations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Your Donations</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to withdraw all your received donations to your wallet.
          </p>
          <Button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Withdraw All Donations'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}