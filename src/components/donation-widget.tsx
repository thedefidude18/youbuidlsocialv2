'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Star, Wallet } from "lucide-react";
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { DonationSDK } from '@/lib/donation-sdk';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface DonationWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  projectConfig: {
    id: string;
    name: string;
  };
  author: {
    name: string;
    avatar?: string;
    address: string;
  };
  postExcerpt?: string;
}

export function DonationWidget({ 
  isOpen, 
  onClose, 
  projectConfig,
  author,
  postExcerpt 
}: DonationWidgetProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [amount, setAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);
  const POINTS_REWARD = 15; // Points earned for donation

  const donationSDK = new DonationSDK({
    projectId: projectConfig.id,
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || '11155420'),
  });

  const handleDonate = async () => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      if (!projectConfig.id) {
        throw new Error('Invalid project configuration');
      }

      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Invalid donation amount');
      }

      setIsProcessing(true);
      console.log('Starting donation process:', {
        projectId: projectConfig.id,
        amount,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID
      });

      const result = await donationSDK.donate({
        amount,
        streamId: projectConfig.id
      });

      console.log('Donation successful:', result);
      
      toast({
        title: 'Success',
        description: 'Thank you for your donation!',
      });

      onClose();
    } catch (error) {
      console.error('Donation failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process donation',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 ring-2 ring-purple-500">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <DialogTitle className="text-xl font-semibold">
              Donate to {author.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
            </p>
            <div className="mt-2">
            </div>
          </div>
        </DialogHeader>

        {postExcerpt && (
          <div className="mt-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground line-clamp-3">{postExcerpt}</p>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (ETH)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Enter amount in ETH"
              className="text-lg"
            />
          </div>
          
          <Button
            onClick={handleDonate}
            disabled={isProcessing || !isConnected}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : !isConnected ? (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet to Donate
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Donate {amount} ETH
              </>
            )}
          </Button>
          <Badge 
                variant="secondary" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5"
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span> {POINTS_REWARD} Points Reward</span>
              </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}







