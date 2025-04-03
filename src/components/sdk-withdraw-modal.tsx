'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { DonationSDK } from '@/lib/donation-sdk';

export function SDKWithdrawModal() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const donationSDK = new DonationSDK({
    projectId: process.env.NEXT_PUBLIC_DONATION_PROJECT_ID!,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || '11155420'),
  });

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to withdraw.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      await donationSDK.withdraw();

      toast({
        title: 'Withdrawal successful!',
        description: 'Your donations have been withdrawn to your wallet.',
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to withdraw.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Withdraw Donations (SDK)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Donations</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Withdraw to Wallet'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}





