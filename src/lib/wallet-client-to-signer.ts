import { WalletClient } from 'wagmi';
import { ethers } from 'ethers';

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  
  // Create provider using ethers v6 syntax
  const provider = new ethers.BrowserProvider(transport, { polling: false });
  
  return provider.getSigner(account.address);
}
