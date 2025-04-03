// Script to check points balance for a user
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  const userAddress = process.argv[2];
  
  if (!userAddress) {
    console.error('Please provide a user address as an argument');
    process.exit(1);
  }

  const pointsContractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  
  if (!pointsContractAddress) {
    console.error('Points contract address not configured in environment variables');
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
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserPoints",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Create a contract instance
  const contract = new ethers.Contract(pointsContractAddress, abi, provider);

  try {
    // Get the user's points
    const points = await contract.getUserPoints(userAddress);
    console.log(`Points for user ${userAddress}: ${points}`);
  } catch (error) {
    console.error('Error fetching user points:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
