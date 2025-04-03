import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying MinimalForwarder...");

  // Get the signer's address to use as the initial owner
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy the MinimalForwarder first
  const MinimalForwarder = await ethers.getContractFactory("MinimalForwarder");
  const forwarder = await MinimalForwarder.deploy();
  await forwarder.waitForDeployment();
  
  const forwarderAddress = await forwarder.getAddress();
  console.log("MinimalForwarder deployed to:", forwarderAddress);

  // Deploy the PointsContract with the forwarder address
  console.log("Deploying PointsContract...");
  const PointsContract = await ethers.getContractFactory("PointsContract");
  const pointsContract = await PointsContract.deploy(deployer.address, forwarderAddress);
  await pointsContract.waitForDeployment();

  const pointsContractAddress = await pointsContract.getAddress();
  console.log("PointsContract deployed to:", pointsContractAddress);

  // Wait for more block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = await pointsContract.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5); // Wait for 5 block confirmations
  }
  
  console.log("Deployment confirmed. Starting verification...");

  // Add delay before verification
  await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds

  // Verify the forwarder contract
  try {
    await run("verify:verify", {
      address: forwarderAddress,
      constructorArguments: [],
    });
    console.log("MinimalForwarder verified successfully");
  } catch (error) {
    console.error("MinimalForwarder verification failed:", error);
  }

  // Verify the points contract
  try {
    await run("verify:verify", {
      address: pointsContractAddress,
      constructorArguments: [deployer.address, forwarderAddress],
    });
    console.log("PointsContract verified successfully");
  } catch (error) {
    console.error("PointsContract verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
