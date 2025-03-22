import type { DonationContractConfig } from '@/contracts/types';
import DonationContractJson from '@/contracts/DonationContract.json';

export const DONATION_CONTRACT_ADDRESS = "0x31a785DCF8ED15FF30Cb2170066D0a44277B0625";
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