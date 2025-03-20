require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.optimism.io";

module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./src/contracts",
  },
  networks: {
    hardhat: {},
    optimisticSepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155420
    }
  },
  etherscan: {
    apiKey: {
      optimisticSepolia: process.env.ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "optimisticSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimistic.etherscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};
