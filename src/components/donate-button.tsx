"use client";

import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const { toast } = useToast();

  const { sendTransaction, isPending, error } = useSendTransaction({
    onSuccess(data) {
      setTransactionHash(data.hash);
      setDonationSuccess(true);
      setIsDonating(false);
      
      toast({
        title: "Donation successful!",
        description: `You have successfully donated ${amount} ETH to ${authorName}`,
      });

      // Close dialog after 3 seconds
      setTimeout(() => {
        setIsOpen(false);

        // Reset state after dialog closes
        setTimeout(() => {
          setDonationSuccess(false);
          setTransactionHash(null);
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
      await sendTransaction({
        to: recipientAddress,
        value: parseEther(amount),
      });
    } catch (err) {
      setIsDonating(false);
      toast({
        title: "Error",
        description: "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const predefinedAmounts = ['0.01', '0.05', '0.1', '0.5', '1'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary text-muted-foreground"
                disabled={!isConnected}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Support with ETH</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {donationSuccess
              ? "Donation Successful!"
              : `Support ${authorName}`}
          </DialogTitle>
          <DialogDescription>
            {donationSuccess
              ? `Thank you for supporting @${authorUsername}!`
              : `Send ETH directly to @${authorUsername} to support their content.`}
          </DialogDescription>
        </DialogHeader>

        {donationSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-green-600 dark:text-green-400"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="text-sm text-center">Your donation has been sent successfully!</p>
            {transactionHash && (
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate max-w-[90%]"
              >
                View transaction on Etherscan
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="flex-1"
                  placeholder="Enter amount in ETH"
                />
              </div>
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

            {error && (
              <div className="text-sm text-red-500 mt-2">
                {error.message?.includes("insufficient funds")
                  ? "Insufficient funds in your wallet"
                  : "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!donationSuccess && (
            <Button
              onClick={handleDonate}
              disabled={isDonating || isPending || !sendTransaction || Number(amount) <= 0}
              className="w-full"
            >
              {isDonating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
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
