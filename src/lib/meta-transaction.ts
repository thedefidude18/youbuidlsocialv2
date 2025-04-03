import { ethers } from 'ethers';
import { MinimalForwarderABI } from '@/contracts/MinimalForwarder';

// The domain data for EIP-712 signing
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

// The ForwardRequest type for EIP-712 signing
const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
];

/**
 * A class for handling meta-transactions
 */
export class MetaTransactionHandler {
  private forwarderAddress: string;
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer | null = null;
  private chainId: number;

  constructor(forwarderAddress: string, provider: ethers.providers.Provider, chainId: number) {
    this.forwarderAddress = forwarderAddress;
    this.provider = provider;
    this.chainId = chainId;
  }

  /**
   * Set the signer for signing meta-transactions
   * @param signer The signer to use
   */
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }

  /**
   * Get the domain data for EIP-712 signing
   * @returns The domain data
   */
  private getDomainData() {
    return {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId: this.chainId,
      verifyingContract: this.forwarderAddress,
    };
  }

  /**
   * Get the nonce for a user
   * @param userAddress The user's address
   * @returns The nonce
   */
  async getNonce(userAddress: string): Promise<number> {
    const forwarder = new ethers.Contract(
      this.forwarderAddress,
      MinimalForwarderABI,
      this.provider
    );
    return await forwarder.getNonce(userAddress);
  }

  /**
   * Create a request to be forwarded
   * @param from The user's address
   * @param to The target contract address
   * @param data The encoded function call data
   * @returns The request object
   */
  async createRequest(from: string, to: string, data: string): Promise<any> {
    const nonce = await this.getNonce(from);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    return {
      from,
      to,
      value: 0,
      gas: 1000000, // Gas limit
      nonce,
      data,
      deadline,
    };
  }

  /**
   * Sign a request using EIP-712
   * @param request The request to sign
   * @returns The signature
   */
  async signRequest(request: any): Promise<string> {
    if (!this.signer) {
      throw new Error('No signer set');
    }

    const domainData = this.getDomainData();
    const types = {
      ForwardRequest,
    };

    const signature = await this.signer._signTypedData(
      domainData,
      types,
      request
    );

    return signature;
  }

  /**
   * Send a meta-transaction to the relayer
   * @param request The request to send
   * @param signature The signature of the request
   * @param relayerUrl The URL of the relayer
   * @returns The transaction hash
   */
  async sendMetaTransaction(
    request: any,
    signature: string,
    relayerUrl: string
  ): Promise<string> {
    console.log('Sending meta-transaction to relayer:', {
      request,
      signature,
      relayerUrl
    });

    try {
      const response = await fetch(`${relayerUrl}/relay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request,
          signature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Relayer error response:', errorText);
        throw new Error(`Relayer error: ${errorText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Relayer error: ${data.error || 'Unknown error'}`);
      }

      console.log('Meta-transaction sent successfully:', data.txHash);
      return data.txHash;
    } catch (error) {
      console.error('Error sending meta-transaction:', error);
      throw error;
    }
  }

  /**
   * Verify a request and signature
   * @param request The request to verify
   * @param signature The signature to verify
   * @returns Whether the signature is valid
   */
  async verifyRequest(request: any, signature: string): Promise<boolean> {
    const forwarder = new ethers.Contract(
      this.forwarderAddress,
      MinimalForwarderABI,
      this.provider
    );
    return await forwarder.verify(request, signature);
  }
}
