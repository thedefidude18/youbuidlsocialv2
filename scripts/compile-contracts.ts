import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { artifacts } from "hardhat";

async function main() {
  // Create directories if they don't exist
  mkdirSync(resolve(process.cwd(), 'src/contracts'), { recursive: true });

  // Get PostRegistry artifact
  const PostRegistry = await artifacts.readArtifact("PostRegistry");
  const PointsContract = await artifacts.readArtifact("PointsContract");

  // Extract the ABI and add the contract addresses
  const postRegistryData = {
    abi: PostRegistry.abi,
    address: "0xEbf0d1bf0720036C739163840EF1e0FC957659B9",
    networks: {
      11155420: {
        address: "0xEbf0d1bf0720036C739163840EF1e0FC957659B9"
      }
    }
  };

  const pointsContractData = {
    abi: PointsContract.abi,
    address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS,
    networks: {
      11155420: {
        address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS
      }
    }
  };

  // Write ABIs to src/contracts
  writeFileSync(
    resolve(process.cwd(), 'src/contracts/PostRegistry.json'),
    JSON.stringify(postRegistryData, null, 2)
  );

  writeFileSync(
    resolve(process.cwd(), 'src/contracts/PointsContract.json'),
    JSON.stringify(pointsContractData, null, 2)
  );

  console.log("Contract artifacts generated successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

