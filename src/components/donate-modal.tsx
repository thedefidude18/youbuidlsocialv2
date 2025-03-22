import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { donationContractABI } from '@/contracts/DonationContract';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', decimals: 18 },
  { symbol: 'USDT', name: 'Tether USD', icon: '₮', decimals: 6 },
  { symbol: 'OP', name: 'Optimism', icon: '⚡', decimals: 18 }
];

export function DonateModal({ isOpen, onClose, author, streamId, postExcerpt }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState(TOKENS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;

  // Add this console.log to debug
  console.log('Contract Address:', contractAddress);
  console.log('User Address:', address);

  const { write: donateETH, data: donationData } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: donationContractABI,
    functionName: 'donateETH',
    onError: (error) => {
      console.error('Contract write error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  useWaitForTransactionReceipt({
    hash: donationData?.hash,
    onSuccess: () => {
      setIsProcessing(false);
      toast({ 
        title: 'Donation successful!', 
        description: `You donated ${amount} ${token.symbol} to ${author.name}` 
      });
      onClose();
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({ 
        title: 'Transaction failed', 
        description: error.message || 'Failed to process donation', 
        variant: 'destructive' 
      });
    }
  });

  const handleDonate = async () => {
    if (!address) {
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

    if (!contractAddress) {
      toast({
        title: 'Configuration Error',
        description: 'Donation contract address not configured',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      if (token.symbol === 'ETH') {
        donateETH?.({
          args: [streamId],
          value: parseEther(amount),
        });
      } else {
        throw new Error('Only ETH donations are currently supported');
      }

    } catch (error) {
      console.error('Donation error:', error);
      setIsProcessing(false);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to process donation.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-5 rounded-lg bg-white dark:bg-gray-900 shadow-xl">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <Avatar className="w-14 h-14 ring-2 ring-purple-500">
            <AvatarImage src={author.avatar} alt={author.name} />
          </Avatar>
          <DialogTitle className="text-lg font-semibold text-center text-gray-900 dark:text-gray-200 max-w-[200px] truncate mx-auto">
            Support {author.name}
          </DialogTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">@{author.username}</p>
        </DialogHeader>

        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 mb-4 max-h-20 overflow-y-auto">
          {postExcerpt}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Token</label>
            <Select value={token.symbol} onValueChange={(value) => setToken(TOKENS.find(t => t.symbol === value))}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {TOKENS.map(({ symbol, icon }) => (
                  <SelectItem key={symbol} value={symbol} className="flex items-center space-x-2">
                    <span>{icon}</span>
                    <span>{symbol}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
          />
          <div className="flex gap-2">
            {['0.01', '0.05', '0.1'].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset)}
                disabled={isProcessing}
              >
                {preset} ETH
              </Button>
            ))}
          </div>
          <Button 
            onClick={handleDonate} 
            disabled={isProcessing || !amount}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Donate ${amount || '0'} ETH`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}















