'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useAccount, useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi';
import { formatEther } from 'viem';
import { donationContractABI } from '@/contracts/DonationContract';
import { useToast } from './ui/use-toast';

export function WithdrawDonations() {
  const { address } = useAccount();
  const { toast } = useToast();

  const { data: ethBalance } = useContractRead({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'getUserETHBalance',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  const { write: withdrawETH, data: withdrawData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: donationContractABI,
    functionName: 'withdrawETH',
  });

  const { isLoading } = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess: () => {
      toast({
        title: 'Withdrawal successful!',
        description: 'Your ETH has been withdrawn to your wallet.',
      });
    },
  });

  const handleWithdraw = () => {
    if (!address) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to withdraw.',
        variant: 'destructive',
      });
      return;
    }

    try {
      withdrawETH?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal.',
        variant: 'destructive',
      });
    }
  };

  if (!address || !ethBalance) return null;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Your Donations</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Available ETH:</span>
          <span>{formatEther(ethBalance as bigint)} ETH</span>
        </div>
        <Button
          onClick={handleWithdraw}
          disabled={isLoading || !ethBalance || ethBalance === 0n}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Withdraw ETH'}
        </Button>
      </div>
    </div>
  );
}