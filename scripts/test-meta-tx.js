// Script to test the meta-transaction flow
const { ethers } = require('ethers');
require('dotenv').config();

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

async function main() {
  const pointsContractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS;
  const relayerUrl = process.env.NEXT_PUBLIC_RELAYER_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!pointsContractAddress || !forwarderAddress || !relayerUrl || !privateKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io'
  );

  // Create a wallet
  const wallet = new ethers.Wallet(privateKey, provider);
  const userAddress = await wallet.getAddress();

  console.log(`Testing meta-transaction flow for user: ${userAddress}`);

  // Load the contract ABIs
  const pointsContractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "streamId",
          "type": "string"
        }
      ],
      "name": "createPost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const forwarderABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        }
      ],
      "name": "getNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "gas",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct MinimalForwarder.ForwardRequest",
          "name": "req",
          "type": "tuple"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "verify",
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

  // Create contract instances
  const pointsContract = new ethers.Contract(pointsContractAddress, pointsContractABI, provider);
  const forwarder = new ethers.Contract(forwarderAddress, forwarderABI, provider);

  try {
    // 1. Encode the function call
    const streamId = "test-stream-" + Date.now();
    console.log(`Creating post with streamId: ${streamId}`);

    const data = pointsContract.interface.encodeFunctionData("createPost", [streamId]);
    console.log(`Encoded function data: ${data}`);

    // 2. Get the nonce
    const nonce = await forwarder.getNonce(userAddress);
    console.log(`Nonce for user ${userAddress}: ${nonce}`);

    // 3. Create the request
    const request = {
      from: userAddress,
      to: pointsContractAddress,
      value: 0,
      gas: 1000000,
      nonce,
      data,
      deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
    console.log(`Created request:`, request);

    // 4. Sign the request
    const chainId = (await provider.getNetwork()).chainId;
    console.log(`Chain ID: ${chainId}`);

    const domainData = {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId,
      verifyingContract: forwarderAddress,
    };

    const types = {
      ForwardRequest,
    };

    console.log(`Signing request with domain data:`, domainData);
    const signature = await wallet.signTypedData(domainData, types, request);
    console.log(`Signature: ${signature}`);

    // 5. Verify the signature
    const isValid = await forwarder.verify(request, signature);
    console.log(`Signature is ${isValid ? 'valid' : 'INVALID'}`);

    if (!isValid) {
      console.error('Signature verification failed. Aborting.');
      process.exit(1);
    }

    // 6. Send the meta-transaction to the relayer
    console.log(`Sending meta-transaction to relayer at ${relayerUrl}/relay`);
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
      console.error(`Relayer error: ${errorText}`);
      process.exit(1);
    }

    const responseData = await response.json();

    if (!responseData.success) {
      console.error(`Relayer error: ${responseData.error || 'Unknown error'}`);
      process.exit(1);
    }

    console.log(`Meta-transaction sent successfully. Transaction hash: ${responseData.txHash}`);

    // 7. Wait for the transaction to be mined
    console.log('Waiting for transaction to be mined...');
    const receipt = await provider.waitForTransaction(data.txHash);
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

    // 8. Check the points balance
    console.log('Checking points balance...');
    const pointsABI = [
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

    const pointsContractWithPoints = new ethers.Contract(pointsContractAddress, pointsABI, provider);
    const points = await pointsContractWithPoints.getUserPoints(userAddress);
    console.log(`Points for user ${userAddress}: ${points}`);

    console.log('Meta-transaction test completed successfully!');
  } catch (error) {
    console.error('Error testing meta-transaction:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
