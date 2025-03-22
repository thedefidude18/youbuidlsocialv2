"use strict";

var fs = require('fs');

var path = require('path');

var _require = require("hardhat"),
    artifacts = _require.artifacts;

function main() {
  var PostRegistry, DonationContract, contractData;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(artifacts.readArtifact("PostRegistry"));

        case 2:
          PostRegistry = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(artifacts.readArtifact("DonationContract"));

        case 5:
          DonationContract = _context.sent;
          // Extract the ABI and add the contract address
          contractData = {
            abi: DonationContract.abi,
            address: "0x31a785DCF8ED15FF30Cb2170066D0a44277B0625",
            networks: {
              11155420: {
                address: "0x31a785DCF8ED15FF30Cb2170066D0a44277B0625"
              }
            }
          }; // Write ABI to src/contracts

          fs.writeFileSync(path.resolve(__dirname, '../src/contracts/DonationContract.json'), JSON.stringify(contractData, null, 2));
          console.log("Contract artifacts generated successfully");

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

main().then(function () {
  return process.exit(0);
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});