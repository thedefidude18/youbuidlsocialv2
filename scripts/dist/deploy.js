"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var hardhat_1 = require("hardhat");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var PostRegistry, postRegistry, address, deployTx, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deploying PostRegistry contract...");
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory("PostRegistry")];
                case 1:
                    PostRegistry = _a.sent();
                    return [4 /*yield*/, PostRegistry.deploy()];
                case 2:
                    postRegistry = _a.sent();
                    // Wait for deployment
                    return [4 /*yield*/, postRegistry.waitForDeployment()];
                case 3:
                    // Wait for deployment
                    _a.sent();
                    return [4 /*yield*/, postRegistry.getAddress()];
                case 4:
                    address = _a.sent();
                    console.log("PostRegistry deployed to:", address);
                    // Wait for more block confirmations
                    console.log("Waiting for block confirmations...");
                    return [4 /*yield*/, postRegistry.deploymentTransaction()];
                case 5:
                    deployTx = _a.sent();
                    if (!deployTx) return [3 /*break*/, 7];
                    return [4 /*yield*/, deployTx.wait(5)];
                case 6:
                    _a.sent(); // Wait for 5 block confirmations
                    _a.label = 7;
                case 7:
                    console.log("Deployment confirmed. Starting verification...");
                    // Add delay before verification
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                case 8:
                    // Add delay before verification
                    _a.sent(); // Wait 60 seconds
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, hardhat_1.run("verify:verify", {
                            address: address,
                            constructorArguments: []
                        })];
                case 10:
                    _a.sent();
                    console.log("Contract verified successfully");
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _a.sent();
                    console.error("Verification failed:", error_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return process.exit(0); })["catch"](function (error) {
    console.error(error);
    process.exit(1);
});
