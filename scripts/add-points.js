// Script to add points directly to a user
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  const userAddress = process.argv[2];
  const amount = process.argv[3] || '10';
  
  if (!userAddress) {
    console.error('Please provide a user address as an argument');
    process.exit(1);
  }

  const pointsContractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!pointsContractAddress) {
    console.error('Points contract address not configured in environment variables');
    process.exit(1);
  }

  if (!privateKey) {
    console.error('Private key not configured in environment variables');
    process.exit(1);
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io'
  );

  // Create a wallet
  const wallet = new ethers.Wallet(privateKey, provider);

  // Load the contract ABI
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "addPoints",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Create a contract instance
  const contract = new ethers.Contract(pointsContractAddress, abi, wallet);

  try {
    // Add points to the user
    console.log(`Adding ${amount} points to user ${userAddress}...`);
    const tx = await contract.addPoints(userAddress, amount, "Direct points addition");
    console.log(`Transaction hash: ${tx.hash}`);
    
    // Wait for the transaction to be mined
    console.log('Waiting for transaction to be mined...');
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    console.log(`Successfully added ${amount} points to user ${userAddress}`);
  } catch (error) {
    console.error('Error adding points:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
