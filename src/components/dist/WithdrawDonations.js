'use client';
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.WithdrawDonations = void 0;
var wagmi_1 = require("wagmi");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("./ui/use-toast");
function WithdrawDonations() {
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var ethBalance = wagmi_1.useContractRead({
        address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'getUserETHBalance', args, [address], enabled, !!address, watch, true).data;
}
exports.WithdrawDonations = WithdrawDonations;
;
var _a = wagmi_1.useContractWrite({
    address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS
}(templateObject_2 || (templateObject_2 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'withdrawETH'), withdrawETH = _a.write, withdrawData = _a.data;
;
var isLoading = wagmi_1.useWaitForTransaction({
    hash: withdrawData === null || withdrawData === void 0 ? void 0 : withdrawData.hash,
    onSuccess: function () {
        toast({
            title: 'Withdrawal successful!',
            description: 'Your ETH has been withdrawn to your wallet.'
        });
    }
}).isLoading;
var handleWithdraw = function () {
    if (!address) {
        toast({
            title: 'Connect Wallet',
            description: 'Please connect your wallet to withdraw.',
            variant: 'destructive'
        });
        return;
    }
    try {
        withdrawETH === null || withdrawETH === void 0 ? void 0 : withdrawETH();
    }
    catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to process withdrawal.',
            variant: 'destructive'
        });
    }
};
if (!address || !ethBalance)
    return null;
return (React.createElement("div", { className: "p-4 border rounded-lg" },
    React.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Your Donations"),
    React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("span", null, "Available ETH:"),
            React.createElement("span", null,
                viem_1.formatEther(ethBalance),
                " ETH")),
        React.createElement(button_1.Button, { onClick: handleWithdraw, disabled: isLoading || !ethBalance || ethBalance === 0n, className: "w-full" }, isLoading ? 'Processing...' : 'Withdraw ETH'))));
var templateObject_1, templateObject_2;
