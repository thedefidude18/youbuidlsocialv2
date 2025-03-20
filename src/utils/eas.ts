import { EAS } from "../contracts/EAS";
import { ethers } from "ethers";

let eas: EAS;

if (typeof window !== 'undefined' && window.ethereum) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  provider.getSigner().then(signer => {
    eas = new EAS(signer);
  });
} else {
  const provider = new ethers.JsonRpcProvider("https://sepolia.optimism.io");
  eas = new EAS(provider);
}

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