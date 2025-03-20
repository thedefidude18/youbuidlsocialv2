import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { WalletProvider } from "@/providers/rainbow-kit-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <AuthProvider>
              <NotificationProvider>
                <PointsProvider>
                  {children}
                  <Toaster />
                  <MobileNav />
                </PointsProvider>
              </NotificationProvider>
            </AuthProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



