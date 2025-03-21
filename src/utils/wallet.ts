export const getEthereumProvider = () => {
  if (typeof window === 'undefined') return null;

  // Check for injected ethereum provider
  if (window.ethereum) {
    // Handle multiple wallets
    const providers = (window as any).ethereum.providers;
    if (providers) {
      // Prioritize MetaMask if available
      const metaMaskProvider = providers.find((p: any) => p.isMetaMask);
      if (metaMaskProvider) return metaMaskProvider;
      // Fallback to first available provider
      return providers[0];
    }
    return window.ethereum;
  }
  return null;
};

export const isWalletConnected = async () => {
  try {
    const provider = getEthereumProvider();
    if (!provider) return false;

    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};
