"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var hre = require("hardhat");

function main() {
  var _ref, _ref2, deployer, DonationContract, donationContract;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(hre.ethers.getSigners());

        case 2:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          deployer = _ref2[0];
          console.log("Deploying contracts to OP Sepolia with the account:", deployer.address); // Deploy DonationContract

          _context.next = 8;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("DonationContract"));

        case 8:
          DonationContract = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(DonationContract.deploy(deployer.address));

        case 11:
          donationContract = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(donationContract.waitForDeployment());

        case 14:
          _context.t0 = console;
          _context.next = 17;
          return regeneratorRuntime.awrap(donationContract.getAddress());

        case 17:
          _context.t1 = _context.sent;

          _context.t0.log.call(_context.t0, "DonationContract deployed to:", _context.t1);

          console.log("\nVerifying contract on OP Sepolia Explorer..."); // Wait for a few block confirmations before verification

          console.log("Waiting for block confirmations...");
          _context.next = 23;
          return regeneratorRuntime.awrap(donationContract.waitForDeployment());

        case 23:
          _context.prev = 23;
          _context.t2 = regeneratorRuntime;
          _context.t3 = hre;
          _context.next = 28;
          return regeneratorRuntime.awrap(donationContract.getAddress());

        case 28:
          _context.t4 = _context.sent;
          _context.t5 = [deployer.address];
          _context.t6 = {
            address: _context.t4,
            constructorArguments: _context.t5
          };
          _context.t7 = _context.t3.run.call(_context.t3, "verify:verify", _context.t6);
          _context.next = 34;
          return _context.t2.awrap.call(_context.t2, _context.t7);

        case 34:
          console.log("DonationContract verified successfully");
          _context.next = 40;
          break;

        case 37:
          _context.prev = 37;
          _context.t8 = _context["catch"](23);
          console.error("Error verifying DonationContract:", _context.t8);

        case 40:
          console.log("\nDeployment completed!");

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[23, 37]]);
}

main().then(function () {
  return process.exit(0);
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});