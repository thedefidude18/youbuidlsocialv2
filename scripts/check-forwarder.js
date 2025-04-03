// Script to check if the forwarder is trusted
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  const pointsContractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS;
  
  if (!pointsContractAddress) {
    console.error('Points contract address not configured in environment variables');
    process.exit(1);
  }

  if (!forwarderAddress) {
    console.error('Forwarder address not configured in environment variables');
    process.exit(1);
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io'
  );

  // Load the contract ABI
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "forwarder",
          "type": "address"
        }
      ],
      "name": "isTrustedForwarder",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Create a contract instance
  const contract = new ethers.Contract(pointsContractAddress, abi, provider);

  try {
    // Check if the forwarder is trusted
    const isTrusted = await contract.isTrustedForwarder(forwarderAddress);
    console.log(`Forwarder ${forwarderAddress} is ${isTrusted ? 'trusted' : 'NOT trusted'} by the PointsContract`);
  } catch (error) {
    console.error('Error checking forwarder:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
