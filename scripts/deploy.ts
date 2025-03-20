import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying PostRegistry contract...");

  // Get the ContractFactory
  const PostRegistry = await ethers.getContractFactory("PostRegistry");
  
  // Deploy the contract
  const postRegistry = await PostRegistry.deploy();
  
  // Wait for deployment
  await postRegistry.waitForDeployment();

  // Get the contract address
  const address = await postRegistry.getAddress();
  console.log("PostRegistry deployed to:", address);

  // Wait for more block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = await postRegistry.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5); // Wait for 5 block confirmations
  }
  
  console.log("Deployment confirmed. Starting verification...");

  // Add delay before verification
  await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds

  // Verify the contract
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
