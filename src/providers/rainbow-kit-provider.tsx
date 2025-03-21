'use client';

import { WagmiProvider, createConfig, http, fallback } from 'wagmi';
import { RainbowKitProvider as RainbowKit } from '@rainbow-me/rainbowkit';
import { optimismSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getEthereumProvider } from '@/utils/wallet';

// Configure multiple RPC endpoints
const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: fallback([
      http('https://opt-sepolia.g.alchemy.com/v2/qhQA96F2O5tBz61LvCoF-ZM044FxWSKs'),
      http('https://opt-sepolia.g.alchemy.com/v2/qhQA96F2O5tBz61LvCoF-ZM044FxWSKs'),
    ], { rank: true }),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKit>
          {children}
        </RainbowKit>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

