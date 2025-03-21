import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { WalletProvider } from "@/providers/rainbow-kit-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "youBuidl",
  description: "Explore, Connect and Buidl",
  icons: {
    icon: '/youlogo.svg'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <WalletProvider>
              <AuthProvider>
                <PointsProvider>
                  {children}
                  <Toaster />
                  <MobileNav />
                </PointsProvider>
              </AuthProvider>
            </WalletProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}






