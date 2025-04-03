export function useTransactionMonitor() {
  const publicClient = usePublicClient();
  const { toast } = useToast();

  const monitorTransaction = async (hash: string) => {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        toast({
          title: "Points recorded!",
          description: "Transaction confirmed on Optimism Sepolia",
        });
      }
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Points could not be recorded on chain",
        variant: "destructive",
      });
    }
  };

  return { monitorTransaction };
}