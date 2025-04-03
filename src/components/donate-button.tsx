'use client';

import { useState } from 'react';
import { DonationModal } from './DonationModal';
import { Button } from './ui/button';
import { useAccount } from 'wagmi';
import { useToast } from './ui/use-toast';

interface DonateButtonProps {
  streamId: string;
  authorAddress: string;
}

export function DonateButton({ streamId, authorAddress }: DonateButtonProps) {
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const handleClick = () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <DonationModal
      streamId={streamId}
      authorAddress={authorAddress}
    />
  );
}

