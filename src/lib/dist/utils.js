"use strict";
exports.__esModule = true;
exports.isCeramicStream = exports.isOptimismTransaction = exports.getOptimismVerificationUrl = exports.cn = void 0;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return tailwind_merge_1.twMerge(clsx_1.clsx(inputs));
}
exports.cn = cn;
function getOptimismVerificationUrl(hash) {
    // Validate and handle Optimism transaction hashes
    if (hash.startsWith('0x') && hash.length === 66) {
        return "https://sepolia-optimistic.etherscan.io/tx/" + hash;
    }
    // Validate and handle Ceramic stream IDs
    if (hash.startsWith('kjzl6')) {
        return "https://cerscan.com/mainnet/stream/" + hash;
    }
    return null;
}
exports.getOptimismVerificationUrl = getOptimismVerificationUrl;
function isOptimismTransaction(hash) {
    return hash.startsWith('0x') && hash.length === 66;
}
exports.isOptimismTransaction = isOptimismTransaction;
function isCeramicStream(hash) {
    return hash.startsWith('kjzl6');
}
exports.isCeramicStream = isCeramicStream;
