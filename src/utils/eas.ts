import { EAS } from "../contracts/EAS";
import { ethers } from "ethers";
import { getEthereumProvider } from "./wallet";

let eas: EAS | null = null;

export const initializeEAS = async () => {
  try {
    const ethereumProvider = getEthereumProvider();
    
    if (ethereumProvider) {
      const provider = new ethers.BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();
      eas = new EAS(signer);
    } else {
      const provider = new ethers.JsonRpcProvider("https://sepolia.optimism.io");
      eas = new EAS(provider);
    }
    
    return eas;
  } catch (error) {
    console.error('Error initializing EAS:', error);
    // Fallback to read-only provider
    const provider = new ethers.JsonRpcProvider("https://sepolia.optimism.io");
    eas = new EAS(provider);
    return eas;
  }
};

export const getEAS = async () => {
  if (!eas) {
    return await initializeEAS();
  }
  return eas;
};

export async function getEASAttestation(attestationUID: string) {
  try {
    const attestation = await eas.getAttestation(attestationUID);
    
    if (!attestation) {
      throw new Error('Attestation not found');
    }

    return {
      uid: attestationUID,
      attester: attestation.attester,
      recipient: attestation.recipient,
      revoked: attestation.revoked,
      timestamp: attestation.time.toString(),
      expirationTime: attestation.expirationTime.toString()
    };
  } catch (error) {
    console.error('Error fetching attestation from EAS:', error);
    throw error;
  }
}
