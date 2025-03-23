'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: true,
        },
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
        embeddedWallets: {
          createOnLogin: 'all',
          noPromptOnSignature: false,
          requireUserPasswordOnCreate: false,
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}





