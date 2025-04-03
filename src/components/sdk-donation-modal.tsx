'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { DonationSDK } from '@/lib/donation-sdk';

interface SDKDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: {
    name: string;
    address: string;
    avatar?: string;
  };
  streamId: string;
  postExcerpt?: string;
}

export function SDKDonationModal({ isOpen, onClose, author, streamId, postExcerpt }: SDKDonationModalProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [amount, setAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);

  const donationSDK = new DonationSDK({
    projectId: process.env.NEXT_PUBLIC_DONATION_PROJECT_ID!,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || '11155420'), // Optimism Sepolia default
  });

  const handleDonate = async () => {
    if (!isConnected) {
      toast({ 
        title: 'Connect Wallet', 
        description: 'Please connect your wallet to donate.', 
        variant: 'destructive' 
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({ 
        title: 'Invalid amount', 
        description: 'Please enter a valid amount.', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const donation = await donationSDK.donate({
        recipient: author.address,
        amount,
        streamId,
        metadata: {
          postExcerpt,
          authorName: author.name
        }
      });

      toast({ 
        title: 'Donation successful!', 
        description: `Thank you for supporting ${author.name}!` 
      });
      
      onClose();
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process donation.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support {author.name}</DialogTitle>
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
              min="0.01"
            />
          </div>
          <Button
            onClick={handleDonate}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Donate ${amount} ETH`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

