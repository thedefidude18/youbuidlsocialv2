"use strict";
exports.__esModule = true;
exports.DonateModal = void 0;
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var wagmi_1 = require("wagmi");
var viem_1 = require("viem");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("@/hooks/use-toast");
var select_1 = require("@/components/ui/select");
var TOKENS = [
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠', decimals: 18 },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮', decimals: 6 },
    { symbol: 'OP', name: 'Optimism', icon: '⚡', decimals: 18 }
];
function DonateModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, author = _a.author, streamId = _a.streamId, postExcerpt = _a.postExcerpt;
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var _b = react_1.useState(''), amount = _b[0], setAmount = _b[1];
    var _c = react_1.useState(TOKENS[0]), token = _c[0], setToken = _c[1];
    var _d = react_1.useState(false), isProcessing = _d[0], setIsProcessing = _d[1];
    var _e = wagmi_1.useContractWrite({
        address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS,
        abi: DonationContract_1.donationContractABI,
        functionName: 'donateETH',
        value: amount ? viem_1.parseEther(amount) : undefined
    }), donateETH = _e.write, donationData = _e.data;
    wagmi_1.useWaitForTransactionReceipt({
        hash: donationData === null || donationData === void 0 ? void 0 : donationData.hash,
        onSuccess: function () {
            setIsProcessing(false);
            toast({ title: 'Donation successful!', description: "You donated " + amount + " " + token.symbol + " to " + author.name });
            onClose();
        }
    });
    var handleDonate = function () {
        if (!address)
            return;
        if (!amount || parseFloat(amount) <= 0)
            return toast({ title: 'Invalid amount', description: 'Enter a valid amount.', variant: 'destructive' });
        setIsProcessing(true);
        donateETH === null || donateETH === void 0 ? void 0 : donateETH({ args: [streamId] });
    };
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: onClose },
        React.createElement(dialog_1.DialogContent, { className: "max-w-sm p-5 rounded-lg bg-white dark:bg-gray-900 shadow-xl" },
            React.createElement(dialog_1.DialogHeader, { className: "flex flex-col items-center space-y-2" },
                React.createElement(avatar_1.Avatar, { className: "w-14 h-14 ring-2 ring-purple-500" },
                    React.createElement(avatar_1.AvatarImage, { src: author.avatar, alt: author.name })),
                React.createElement(dialog_1.DialogTitle, { className: "text-lg font-semibold text-center text-gray-900 dark:text-gray-200 max-w-[200px] truncate mx-auto" },
                    "Support ",
                    author.name),
                React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate" },
                    "@",
                    author.username)),
            React.createElement("div", { className: "bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 mb-4 max-h-20 overflow-y-auto" }, postExcerpt),
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300" }, "Select Token"),
                    React.createElement(select_1.Select, { value: token.symbol, onValueChange: function (value) { return setToken(TOKENS.find(function (t) { return t.symbol === value; })); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-full mt-1" },
                            React.createElement(select_1.SelectValue, { placeholder: "Select token" })),
                        React.createElement(select_1.SelectContent, null, TOKENS.map(function (_a) {
                            var symbol = _a.symbol, icon = _a.icon;
                            return (React.createElement(select_1.SelectItem, { key: symbol, value: symbol, className: "flex items-center space-x-2" },
                                React.createElement("span", null, icon),
                                React.createElement("span", null, symbol)));
                        })))),
                React.createElement("div", null,
                    React.createElement("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between" },
                        "Amount ",
                        React.createElement("span", { className: "text-gray-500 dark:text-gray-400" },
                            "(",
                            token.symbol,
                            ")")),
                    React.createElement(input_1.Input, { type: "number", step: "0.001", min: "0", placeholder: "0.00", value: amount, onChange: function (e) { return setAmount(e.target.value); }, className: "mt-1 text-center" })),
                React.createElement(button_1.Button, { disabled: isProcessing, onClick: handleDonate, className: "w-full py-2 mt-2 px-4 max-w-[200px] mx-auto block truncate" }, isProcessing ? 'Processing...' : "Donate " + token.symbol)))));
}
exports.DonateModal = DonateModal;
