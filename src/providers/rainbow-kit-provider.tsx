'use client';

import { WagmiProvider, createConfig, http, fallback } from 'wagmi';
import { RainbowKitProvider as RainbowKit } from '@rainbow-me/rainbowkit';
import { optimismSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure multiple RPC endpoints
const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: fallback([
      http('https://sepolia.optimism.io'),
      http('https://opt-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY'), // Replace with your Alchemy key
      http('https://optimism-sepolia.infura.io/v3/YOUR_INFURA_KEY'), // Replace with your Infura key
      http('https://rpc.ankr.com/optimism_sepolia/YOUR_ANKR_KEY'), // Replace with your Ankr key
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
