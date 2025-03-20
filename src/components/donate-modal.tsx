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

  const { write: donateETH, data: donationData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS,
    abi: donationContractABI,
    functionName: 'donateETH',
    value: amount ? parseEther(amount) : undefined,
  });

  useWaitForTransactionReceipt({
    hash: donationData?.hash,
    onSuccess: () => {
      setIsProcessing(false);
      toast({ title: 'Donation successful!', description: `You donated ${amount} ${token.symbol} to ${author.name}` });
      onClose();
    },
  });

  const handleDonate = () => {
    if (!address) return;
    if (!amount || parseFloat(amount) <= 0) return toast({ title: 'Invalid amount', description: 'Enter a valid amount.', variant: 'destructive' });
    setIsProcessing(true);
    donateETH?.({ args: [streamId] });
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

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
              Amount <span className="text-gray-500 dark:text-gray-400">({token.symbol})</span>
            </label>
            <Input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 text-center"
            />
          </div>

          <Button disabled={isProcessing} onClick={handleDonate} className="w-full py-2 mt-2 px-4 max-w-[200px] mx-auto block truncate">
            {isProcessing ? 'Processing...' : `Donate ${token.symbol}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
