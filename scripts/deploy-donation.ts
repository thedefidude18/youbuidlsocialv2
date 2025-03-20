import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying DonationContract...");

  // Get the signer's address to use as the initial owner
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get the ContractFactory
  const DonationContract = await ethers.getContractFactory("DonationContract");
  
  // Deploy the contract with the initial owner
  const donationContract = await DonationContract.deploy(deployer.address);
  
  // Wait for deployment
  await donationContract.waitForDeployment();

  // Get the contract address
  const address = await donationContract.getAddress();
  console.log("DonationContract deployed to:", address);

  // Wait for more block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = await donationContract.deploymentTransaction();
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