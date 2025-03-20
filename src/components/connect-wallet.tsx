import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useConnect } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function ConnectWalletModal({ isOpen, onClose }) {
  const { connectors, connect, isPending, error } = useConnect();
  const { toast } = useToast();

  const handleConnect = async (connector) => {
    try {
      await connect({ connector });
      onClose();
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been successfully connected.',
      });
    } catch (err) {
      toast({
        title: 'Connection Failed',
        description: err.message || 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-5 rounded-lg bg-white dark:bg-gray-900 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-gray-900 dark:text-gray-200">
            Connect Wallet
          </DialogTitle>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Choose your preferred wallet
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready || isPending}
              className="w-full py-3 justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
              variant="outline"
            >
              <span className="flex items-center gap-2">
                {connector.name}
                {!connector.ready && ' (unsupported)'}
              </span>
              {isPending && connector.id === isPending?.connector?.id && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-3 text-center">
            {error.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}