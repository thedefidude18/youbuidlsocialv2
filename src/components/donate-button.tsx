"use client";

import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface DonateButtonProps {
  recipientAddress: string;
  authorName: string;
  authorUsername: string;
}

export function DonateButton({ recipientAddress, authorName, authorUsername }: DonateButtonProps) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState<string>('0.01');
  const [isOpen, setIsOpen] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const { toast } = useToast();

  const { sendTransaction, isPending } = useSendTransaction({
    onSuccess(data) {
      setDonationSuccess(true);
      setIsDonating(false);
      
      toast({
        title: "Donation successful!",
        description: `You have successfully donated ${amount} ETH to ${authorName}`,
      });

      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setDonationSuccess(false);
          setAmount('0.01');
        }, 300);
      }, 3000);
    },
    onError(err) {
      setIsDonating(false);
      toast({
        title: "Donation failed",
        description: err.message || "There was an error processing your donation",
        variant: "destructive",
      });
    }
  });

  const handleDonate = async () => {
    if (!recipientAddress || !amount || !isConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDonating(true);
      if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid recipient address");
      }
      
      await sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      setIsDonating(false);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const predefinedAmounts = ['0.01', '0.05', '0.1', '0.5', '1'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10 hover:text-primary text-muted-foreground"
          disabled={!isConnected}
          onClick={() => {
            if (!isConnected) {
              toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                variant: "destructive",
              });
            }
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="sr-only">Donate</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {donationSuccess ? "Donation Successful!" : `Support ${authorName}`}
          </DialogTitle>
          <DialogDescription>
            {donationSuccess
              ? `Thank you for supporting @${authorUsername}!`
              : `Send ETH directly to @${authorUsername} to support their content.`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="flex-1"
              placeholder="Enter amount in ETH"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(presetAmount)}
                  className={amount === presetAmount ? "bg-secondary" : ""}
                >
                  {presetAmount} ETH
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          {!donationSuccess && (
            <Button
              onClick={handleDonate}
              disabled={isDonating || isPending || !sendTransaction || Number(amount) <= 0}
              className="w-full"
            >
              {isDonating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                  Processing...
                </div>
              ) : (
                `Donate ${amount} ETH`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


