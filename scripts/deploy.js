const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts to OP Sepolia with the account:", deployer.address);

  // Deploy DonationContract
  const DonationContract = await hre.ethers.getContractFactory("DonationContract");
  const donationContract = await DonationContract.deploy(deployer.address);
  await donationContract.waitForDeployment();
  console.log("DonationContract deployed to:", await donationContract.getAddress());

  console.log("\nVerifying contract on OP Sepolia Explorer...");

  // Wait for a few block confirmations before verification
  console.log("Waiting for block confirmations...");
  await donationContract.waitForDeployment();

  // Verify DonationContract
  try {
    await hre.run("verify:verify", {
      address: await donationContract.getAddress(),
      constructorArguments: [deployer.address],
    });
    console.log("DonationContract verified successfully");
  } catch (error) {
    console.error("Error verifying DonationContract:", error);
  }

  console.log("\nDeployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });