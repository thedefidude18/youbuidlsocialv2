import type { DonationContractConfig } from '@/contracts/types';
import DonationContractJson from '@/contracts/DonationContract.json';

export const DONATION_CONTRACT_ADDRESS = "0x94207105ab27a2b3eebeab7fa0c60ab674c77883";
export const DONATION_CONTRACT_CONFIG: DonationContractConfig = {
  ...DonationContractJson,
  address: DONATION_CONTRACT_ADDRESS
};

export const SUPPORTED_TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18
  }
];
