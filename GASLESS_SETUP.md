# Gasless Transactions Setup Guide

This guide explains how to set up and use gasless transactions with your PointsContract using Alchemy's Gasless functionality.

## Overview

Gasless transactions allow users to interact with your smart contract without paying gas fees. This is achieved through meta-transactions, where users sign messages off-chain and a relayer service submits the actual transactions to the blockchain, paying the gas fees.

## Prerequisites

- Node.js and npm installed
- An Alchemy account with API key
- A wallet with some ETH for the relayer (to pay gas fees)

## Setup Steps

### 1. Deploy the Contracts

First, deploy the MinimalForwarder and updated PointsContract:

```bash
npx hardhat run scripts/deploy-gasless-points.ts --network optimisticSepolia
```

This will deploy both contracts and output their addresses. Make note of these addresses for the next steps.

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Contract addresses
NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS=your_points_contract_address
NEXT_PUBLIC_FORWARDER_ADDRESS=your_forwarder_address

# Alchemy API key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Relayer URL
NEXT_PUBLIC_RELAYER_URL=http://localhost:3001

# Enable gasless transactions
NEXT_PUBLIC_USE_GASLESS=true
```

### 3. Set Up the Relayer Service

Navigate to the relayer directory:

```bash
cd src/relayer
```

Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
PORT=3001
RELAYER_PRIVATE_KEY=your_private_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
FORWARDER_ADDRESS=your_forwarder_contract_address_here
POINTS_CONTRACT_ADDRESS=your_points_contract_address_here
```

Install dependencies and start the relayer:

```bash
npm install
npm start
```

The relayer should now be running on port 3001 (or the port you specified).

### 4. Test Gasless Transactions

With the relayer running, your frontend should now be able to send gasless transactions. Users will only need to sign messages with their wallet, but won't need to pay gas fees.

## How It Works

1. **User Action**: When a user performs an action (like creating a post or adding a like), the frontend prepares a meta-transaction.

2. **Signing**: The user signs the transaction data using their wallet (e.g., MetaMask).

3. **Relaying**: The signed transaction is sent to the relayer service.

4. **Execution**: The relayer verifies the signature and submits the transaction to the blockchain, paying the gas fees.

5. **Confirmation**: The transaction is processed on the blockchain, and the user's action is recorded without them having to pay gas.

## Troubleshooting

- **Signature Verification Fails**: Ensure that the user is signing the correct data and that the nonce is correct.
- **Relayer Errors**: Check the relayer logs for any errors. Make sure the relayer has enough ETH to pay for gas.
- **Contract Errors**: Verify that the contracts are deployed correctly and that the addresses in the environment variables are correct.

## Security Considerations

- The relayer's private key should be kept secure, as it will be used to pay for all transactions.
- Consider implementing rate limiting and other security measures to prevent abuse of the relayer service.
- Monitor the relayer's ETH balance to ensure it can continue to pay for gas fees.

## Advanced Configuration

### Using Alchemy's Defender Relayer

For production use, consider using Alchemy's Defender Relayer instead of running your own relayer service. This provides a more robust and scalable solution.

1. Create a Defender Relayer on the Alchemy Defender dashboard.
2. Update the `NEXT_PUBLIC_RELAYER_URL` in your frontend to point to the Defender Relayer URL.
3. Configure the Defender Relayer to work with your MinimalForwarder contract.

### Customizing Gas Limits

You can customize the gas limits for different types of transactions in the `meta-transaction.ts` file. Adjust the `gas` parameter in the `createRequest` function based on the complexity of the transaction.
