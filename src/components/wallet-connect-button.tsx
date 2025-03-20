"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletConnectButtonProps {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function WalletConnectButton({ 
  size = "sm",
  variant = "outline",
  className = "rounded-full"
}: WalletConnectButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        
        if (!ready) {
          return null;
        }

        if (!account) {
          return (
            <Button
              onClick={openConnectModal}
              size={size}
              variant={variant}
              className={className}
            >
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button
              onClick={openChainModal}
              size={size}
              variant="destructive"
              className={className}
            >
              Wrong Network
            </Button>
          );
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={size}
                variant={variant}
                className={`${className} px-3`}
              >
                <div className="flex items-center gap-2">
                  {chain.hasIcon && (
                    <div className="w-4 h-4 overflow-hidden rounded-full">
                      {chain.iconUrl && (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  )}
                  <span className="hidden md:inline">
                    {account.displayName}
                  </span>
                  <span className="md:hidden">
                    {account.displayName.slice(0, 4)}...{account.displayName.slice(-4)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={openAccountModal}>
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openChainModal}>
                Network: {chain.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => {
                  // Add disconnect logic here if needed
                }}
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </ConnectButton.Custom>
  );
}

