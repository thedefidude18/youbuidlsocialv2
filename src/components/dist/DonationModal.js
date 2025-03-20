'use client';
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.DonationModal = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var viem_1 = require("viem");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("./ui/use-toast");
function DonationModal(_a) {
    var streamId = _a.streamId, authorAddress = _a.authorAddress;
    var _b = react_1.useState(''), amount = _b[0], setAmount = _b[1];
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var _c = wagmi_1.useContractWrite({
        address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'donateETH', args, [streamId], value, amount ? viem_1.parseEther(amount) : 0n), donateETH = _c.write, donationData = _c.data;
}
exports.DonationModal = DonationModal;
;
var isLoading = wagmi_1.useWaitForTransaction({
    hash: donationData === null || donationData === void 0 ? void 0 : donationData.hash,
    onSuccess: function () {
        toast({
            title: 'Donation successful!',
            description: "You donated " + amount + " ETH to " + authorAddress
        });
        setAmount('');
    }
}).isLoading;
var handleDonate = function () {
    if (!address) {
        toast({
            title: 'Connect Wallet',
            description: 'Please connect your wallet to donate.',
            variant: 'destructive'
        });
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        toast({
            title: 'Invalid amount',
            description: 'Please enter a valid amount.',
            variant: 'destructive'
        });
        return;
    }
    try {
        donateETH === null || donateETH === void 0 ? void 0 : donateETH();
    }
    catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to process donation.',
            variant: 'destructive'
        });
    }
};
return (React.createElement(dialog_1.Dialog, null,
    React.createElement(dialog_1.DialogTrigger, { asChild: true },
        React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Donate")),
    React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[425px]" },
        React.createElement(dialog_1.DialogHeader, null,
            React.createElement(dialog_1.DialogTitle, null, "Support this cast")),
        React.createElement("div", { className: "grid gap-4 py-4" },
            React.createElement("div", { className: "grid grid-cols-4 items-center gap-4" },
                React.createElement(input_1.Input, { id: "amount", type: "number", step: "0.0001", placeholder: "Amount in ETH", value: amount, onChange: function (e) { return setAmount(e.target.value); }, className: "col-span-4" })),
            React.createElement(button_1.Button, { onClick: handleDonate, disabled: isLoading, className: "w-full" }, isLoading ? 'Processing...' : 'Send Donation')))));
var templateObject_1;
