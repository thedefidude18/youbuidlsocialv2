// Simple relayer service for gasless transactions
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3001;
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;
const POINTS_CONTRACT_ADDRESS = process.env.POINTS_CONTRACT_ADDRESS;

// Initialize Alchemy provider
const web3 = createAlchemyWeb3(
  `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);

// Load contract ABIs
const MinimalForwarderABI = require('../contracts/MinimalForwarder').MinimalForwarderABI;
const PointsContractABI = require('../contracts/contracts/PointsContract.sol/PointsContract.json').abi;

// Create contract instances
const forwarder = new web3.eth.Contract(MinimalForwarderABI, FORWARDER_ADDRESS);
const pointsContract = new web3.eth.Contract(PointsContractABI, POINTS_CONTRACT_ADDRESS);

// Endpoint to relay meta-transactions
app.post('/relay', async (req, res) => {
  try {
    const { request, signature } = req.body;
    
    // Verify the request
    const valid = await forwarder.methods.verify(request, signature).call();
    if (!valid) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
    
    // Create a wallet from the private key
    const provider = new ethers.providers.JsonRpcProvider(
      `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    );
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Execute the meta-transaction
    const forwarderWithSigner = new ethers.Contract(
      FORWARDER_ADDRESS,
      MinimalForwarderABI,
      wallet
    );
    
    const tx = await forwarderWithSigner.execute(request, signature, {
      gasLimit: 1000000, // Adjust as needed
    });
    
    const receipt = await tx.wait();
    
    return res.json({
      success: true,
      txHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error relaying transaction:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Relayer service running on port ${PORT}`);
});
