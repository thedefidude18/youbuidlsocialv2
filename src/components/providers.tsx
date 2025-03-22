'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { WalletProvider } from "@/providers/rainbow-kit-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <AuthProvider>
              <PointsProvider>
                {children}
                <Toaster />
                <MobileNav />
              </PointsProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
