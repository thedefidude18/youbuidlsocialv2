const fs = require('fs');
const path = require('path');
const { artifacts } = require("hardhat");

async function main() {
  // Get PostRegistry artifact
  const PostRegistry = await artifacts.readArtifact("PostRegistry");
  const DonationContract = await artifacts.readArtifact("DonationContract");

  // Extract the ABI and add the contract address
  const contractData = {
    abi: DonationContract.abi,
    address: "0x94207105ab27a2b3eebeab7fa0c60ab674c77883",
    networks: {
      11155420: {
        address: "0x94207105ab27a2b3eebeab7fa0c60ab674c77883"
      }
    }
  };

  // Write ABI to src/contracts
  fs.writeFileSync(
    path.resolve(__dirname, '../src/contracts/DonationContract.json'),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract artifacts generated successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

