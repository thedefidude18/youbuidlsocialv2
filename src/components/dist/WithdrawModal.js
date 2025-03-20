'use client';
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.WithdrawModal = void 0;
var wagmi_1 = require("wagmi");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("@/hooks/use-toast");
function WithdrawModal() {
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var _a = wagmi_1.useContractWrite({
        address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'withdrawDonations'), withdrawDonations = _a.write, withdrawData = _a.data;
}
exports.WithdrawModal = WithdrawModal;
;
var isLoading = wagmi_1.useWaitForTransactionReceipt({
    hash: withdrawData === null || withdrawData === void 0 ? void 0 : withdrawData.hash,
    onSuccess: function () {
        toast({
            title: 'Withdrawal successful!',
            description: 'Your donations have been withdrawn to your wallet.'
        });
    }
}).isLoading;
var handleWithdraw = function () {
    if (!address) {
        toast({
            title: 'Connect Wallet',
            description: 'Please connect your wallet to withdraw donations.',
            variant: 'destructive'
        });
        return;
    }
    try {
        withdrawDonations === null || withdrawDonations === void 0 ? void 0 : withdrawDonations();
    }
    catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to process withdrawal.',
            variant: 'destructive'
        });
    }
};
return (React.createElement(dialog_1.Dialog, null,
    React.createElement(dialog_1.DialogTrigger, { asChild: true },
        React.createElement(button_1.Button, { variant: "outline", size: "sm" }, "Withdraw Donations")),
    React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[425px]" },
        React.createElement(dialog_1.DialogHeader, null,
            React.createElement(dialog_1.DialogTitle, null, "Withdraw Your Donations")),
        React.createElement("div", { className: "grid gap-4 py-4" },
            React.createElement("p", { className: "text-sm text-muted-foreground" }, "Click the button below to withdraw all your received donations to your wallet."),
            React.createElement(button_1.Button, { onClick: handleWithdraw, disabled: isLoading, className: "w-full" }, isLoading ? 'Processing...' : 'Withdraw All Donations')))));
var templateObject_1;
