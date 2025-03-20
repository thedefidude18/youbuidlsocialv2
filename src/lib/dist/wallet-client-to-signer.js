"use strict";
exports.__esModule = true;
exports.walletClientToSigner = void 0;
var ethers_1 = require("ethers");
function walletClientToSigner(walletClient) {
    var account = walletClient.account, chain = walletClient.chain, transport = walletClient.transport;
    // Create provider using ethers v6 syntax
    var provider = new ethers_1.ethers.BrowserProvider(transport, { polling: false });
    return provider.getSigner(account.address);
}
exports.walletClientToSigner = walletClientToSigner;
