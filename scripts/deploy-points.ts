import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying PointsContract...");

  // Get the signer's address to use as the initial owner
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get the ContractFactory
  const PointsContract = await ethers.getContractFactory("PointsContract");
  
  // Deploy the contract with the initial owner
  const pointsContract = await PointsContract.deploy(deployer.address);
  
  // Wait for deployment
  await pointsContract.waitForDeployment();

  // Get the contract address
  const address = await pointsContract.getAddress();
  console.log("PointsContract deployed to:", address);

  // Wait for more block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = await pointsContract.deploymentTransaction();
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
      constructorArguments: [deployer.address],
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