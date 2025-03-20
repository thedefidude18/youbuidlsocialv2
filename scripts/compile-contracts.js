const fs = require('fs');
const path = require('path');
const { artifacts } = require("hardhat");

async function main() {
  // Get PostRegistry artifact
  const PostRegistry = await artifacts.readArtifact("PostRegistry");

  // Extract the ABI and add the contract address
  const contractData = {
    abi: PostRegistry.abi,
    address: "0x31a785DCF8ED15FF30Cb2170066D0a44277B0625",
    networks: {
      11155420: {
        address: "0x31a785DCF8ED15FF30Cb2170066D0a44277B0625"
      }
    }
  };

  // Write ABI to src/contracts
  fs.writeFileSync(
    path.resolve(__dirname, '../src/contracts/PostRegistry.json'),
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