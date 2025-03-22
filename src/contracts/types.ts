export interface DonationContractConfig {
  abi: any[];
  address: string;
  networks: {
    [chainId: number]: {
      address: string;
    };
  };
}