import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, useWaitForTransactionReceipt, useChainId, useConnect } from 'wagmi';
import { parseEther } from 'viem';
import { donationContractABI } from '@/contracts/DonationContract';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DebugDonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: {
    name: string;
    username: string;
    avatar: string;
    address: string;
  };
  streamId: string;
  postExcerpt: string;
}

export function DebugDonateModal({
  isOpen,
  onClose,
  author,
  streamId,
  postExcerpt
}: DebugDonateModalProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();
  const [amount, setAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [transactionState, setTransactionState] = useState<{
    status: 'idle' | 'pending' | 'confirmed' | 'failed';
    signature: 'idle' | 'pending' | 'completed' | 'failed';
    error?: string;
  }>({
    status: 'idle',
    signature: 'idle'
  });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const resetStates = () => {
    setIsProcessing(false);
    setTransactionState({
      status: 'idle',
      signature: 'idle'
    });
  };

  const contractAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
  
  // Add contract configuration validation
  useEffect(() => {
    if (!contractAddress) {
      console.error('Contract address not configured in environment variables');
      addDebugLog('ERROR: Contract address not configured');
    } else {
      addDebugLog(`Contract address configured: ${contractAddress}`);
    }
  }, [contractAddress]);

  // Add minimum donation constant
  const MIN_DONATION = '0.0001'; // in ETH

  // Debug information
  useEffect(() => {
    setDebugInfo({
      userAddress: address,
      isConnected,
      chainId,
      contractAddress,
      streamId,
      authorAddress: author.address,
    });
  }, [address, isConnected, chainId, contractAddress, streamId, author.address]);

  const { 
    write: donateETH, 
    data: donationData, 
    isError: isWriteError, 
    error: writeError,
    isLoading: isWriteLoading,
    status: writeStatus
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: donationContractABI,
    functionName: 'donateETH',
    onMutate: () => {
      addDebugLog('Contract write initiated');
    },
    onError: (error) => {
      addDebugLog(`Contract write error: ${error.message}`);
      console.error('Contract write error:', error);
      setTransactionState(prev => ({
        ...prev,
        status: 'failed',
        signature: 'failed',
        error: error.message
      }));
      setIsProcessing(false);
      toast({ 
        title: 'Contract Error',
        description: error.message,
        variant: 'destructive'
      });
    },
    onSuccess: (data) => {
      addDebugLog(`Contract write success. Hash: ${data.hash}`);
      setTransactionState(prev => ({
        ...prev,
        signature: 'completed'
      }));
    }
  });

  // Add contract write status to debug info
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      contractWrite: {
        isAvailable: !!donateETH,
        status: writeStatus,
        isLoading: isWriteLoading,
        error: writeError?.message
      }
    }));
  }, [donateETH, writeStatus, isWriteLoading, writeError]);

  useWaitForTransactionReceipt({
    hash: donationData?.hash,
    onSuccess: (receipt) => {
      addDebugLog(`Transaction confirmed. Block: ${receipt.blockNumber}`);
      setTransactionState(prev => ({
        ...prev,
        status: 'confirmed'
      }));
      setIsProcessing(false);
      toast({ 
        title: 'Donation successful!', 
        description: `You donated ${amount} ETH to ${author.name}` 
      });
      onClose();
    },
    onError: (error) => {
      addDebugLog(`Transaction failed: ${error.message}`);
      setTransactionState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message
      }));
      setIsProcessing(false);
      toast({ 
        title: 'Transaction failed', 
        description: error.message || 'Failed to process donation', 
        variant: 'destructive' 
      });
    }
  });

  // Add immediate validation check
  const [validationState, setValidationState] = useState({
    isValidAmount: true,
    isValidNetwork: true,
    canDonate: false
  });

  // Validate prerequisites
  useEffect(() => {
    const isValidAmount = amount && parseFloat(amount) >= parseFloat(MIN_DONATION);
    const isValidNetwork = chainId === 11155420; // OP Sepolia
    const canDonate = isConnected && isValidAmount && isValidNetwork && !isProcessing;

    setValidationState({
      isValidAmount,
      isValidNetwork,
      canDonate
    });

    addDebugLog(`Validation state updated: ${JSON.stringify({
      isValidAmount,
      isValidNetwork,
      canDonate,
      amount,
      chainId,
      isConnected,
      isProcessing
    })}`);
  }, [amount, chainId, isConnected, isProcessing]);

  const handleDonate = async () => {
    try {
      addDebugLog('Donate button clicked');
      console.log('Donate button clicked', {
        contractAddress,
        donateETH: !!donateETH,
        streamId,
        amount
      });

      // Validation checks
      if (!contractAddress) {
        throw new Error(`Contract address not configured. Current value: ${contractAddress}`);
      }

      if (!donateETH) {
        throw new Error(`Contract write function not available. Status: ${writeStatus}`);
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      if (chainId !== 11155420) {
        throw new Error('Please switch to Optimism Sepolia network');
      }

      if (!amount || parseFloat(amount) < parseFloat(MIN_DONATION)) {
        throw new Error(`Minimum donation amount is ${MIN_DONATION} ETH`);
      }

      if (!streamId) {
        throw new Error('Stream ID is missing');
      }

      addDebugLog('All validation checks passed');
      setIsProcessing(true);
      setTransactionState({
        status: 'pending',
        signature: 'pending'
      });

      addDebugLog(`Preparing donation: ${JSON.stringify({
        streamId,
        amount,
        contractAddress,
        authorAddress: author.address
      })}`);

      // Call the contract with explicit type checking
      donateETH({
        args: [streamId as string],
        value: parseEther(amount as string),
      });

      addDebugLog('Contract write function called successfully');

    } catch (error) {
      addDebugLog(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Donation error:', error);
      setTransactionState({
        status: 'failed',
        signature: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsProcessing(false);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to process donation',
        variant: 'destructive' 
      });
    }
  };

  // Add network check
  useEffect(() => {
    if (chainId !== 11155420) { // OP Sepolia
      toast({
        title: 'Wrong Network',
        description: 'Please switch to Optimism Sepolia testnet',
        variant: 'destructive'
      });
    }
  }, [chainId]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  const { connect } = useConnect({
    onSuccess: () => {
      addDebugLog('Wallet connected successfully');
    },
    onError: (error) => {
      addDebugLog(`Wallet connection error: ${error.message}`);
      toast({
        title: 'Connection Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetStates();
        onClose();
      }
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Debug Donation Modal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Validation Status */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Validation Status:</h3>
            <div className="text-sm">
              <p>✓ Wallet Connected: {isConnected ? 'Yes' : 'No'}</p>
              <p>✓ Valid Amount: {validationState.isValidAmount ? 'Yes' : 'No'}</p>
              <p>✓ Correct Network: {validationState.isValidNetwork ? 'Yes' : 'No'}</p>
              <p>✓ Can Donate: {validationState.canDonate ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Debug Information:</h3>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify({
                ...debugInfo,
                transactionState,
                isProcessing,
                writeError: writeError?.message,
                donateETHAvailable: !!donateETH,
                logs: debugLogs.slice(-5) // Show last 5 logs
              }, null, 2)}
            </pre>
          </div>

          {/* Donation Form */}
          <div className="space-y-4">
            {!isConnected ? (
              <Button 
                onClick={handleConnectWallet} 
                className="w-full"
                variant="outline"
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    addDebugLog(`Amount changed to: ${e.target.value}`);
                  }}
                  placeholder="Amount in ETH"
                  step="0.01"
                  min={MIN_DONATION}
                  disabled={isProcessing}
                />
                
                <Button
                  onClick={handleDonate}
                  disabled={!validationState.canDonate}
                  className="w-full"
                >
                  {isProcessing || transactionState.status === 'pending' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {transactionState.signature === 'completed' ? 'Confirming...' : 'Processing...'}
                    </>
                  ) : (
                    `Donate ${amount} ETH`
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


