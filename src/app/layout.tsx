'use client';

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";
import { Inter } from 'next/font/google';
import { PrivyClientProvider } from '@/providers/privy-provider';
import { WalletProvider } from '@/providers/rainbow-kit-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <PrivyClientProvider>
              <ThemeProvider
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
            </PrivyClientProvider>
          </WalletProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export function LoginButton() {
  const { login, logout, authenticated, user, ready } = usePrivy();

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return (
      <Button 
        onClick={login}
        variant="outline"
        className="rounded-full"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          {user?.email?.address || user?.wallet?.address?.slice(0, 6) + '...' + user?.wallet?.address?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
















