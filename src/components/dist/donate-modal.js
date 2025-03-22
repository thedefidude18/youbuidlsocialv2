"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.DonateModal = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var viem_1 = require("viem");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("@/hooks/use-toast");
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
    var contractAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
    // Add this console.log to debug
    console.log('Contract Address:', contractAddress);
    console.log('User Address:', address);
    var _e = wagmi_1.useContractWrite({
        address: contractAddress
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'donateETH', onError, function (error) {
        console.error('Contract write error:', error);
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
        });
    }), donateETH = _e.write, donationData = _e.data;
}
exports.DonateModal = DonateModal;
;
wagmi_1.useWaitForTransactionReceipt({
    hash: donationData === null || donationData === void 0 ? void 0 : donationData.hash,
    onSuccess: function () {
        setIsProcessing(false);
        toast({
            title: 'Donation successful!',
            description: "You donated " + amount + " " + token.symbol + " to " + author.name
        });
        onClose();
    },
    onError: function (error) {
        setIsProcessing(false);
        toast({
            title: 'Transaction failed',
            description: error.message || 'Failed to process donation',
            variant: 'destructive'
        });
    }
});
var handleDonate = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!address) {
            toast({
                title: 'Connect Wallet',
                description: 'Please connect your wallet to donate.',
                variant: 'destructive'
            });
            return [2 /*return*/];
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast({
                title: 'Invalid amount',
                description: 'Please enter a valid amount.',
                variant: 'destructive'
            });
            return [2 /*return*/];
        }
        if (!contractAddress) {
            toast({
                title: 'Configuration Error',
                description: 'Donation contract address not configured',
                variant: 'destructive'
            });
            return [2 /*return*/];
        }
        try {
            setIsProcessing(true);
            if (token.symbol === 'ETH') {
                donateETH === null || donateETH === void 0 ? void 0 : donateETH({
                    args: [streamId],
                    value: viem_1.parseEther(amount)
                });
            }
            else {
                throw new Error('Only ETH donations are currently supported');
            }
        }
        catch (error) {
            console.error('Donation error:', error);
            setIsProcessing(false);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to process donation.',
                variant: 'destructive'
            });
        }
        return [2 /*return*/];
    });
}); };
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
            React.createElement(input_1.Input, { type: "number", placeholder: "Amount in ETH", value: amount, onChange: function (e) { return setAmount(e.target.value); }, disabled: isProcessing }),
            React.createElement("div", { className: "flex gap-2" }, ['0.01', '0.05', '0.1'].map(function (preset) { return (React.createElement(button_1.Button, { key: preset, variant: "outline", size: "sm", onClick: function () { return setAmount(preset); }, disabled: isProcessing },
                preset,
                " ETH")); })),
            React.createElement(button_1.Button, { onClick: handleDonate, disabled: isProcessing || !amount, className: "w-full" }, isProcessing ? (React.createElement(React.Fragment, null,
                React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Processing...")) : ("Donate " + (amount || '0') + " ETH"))))));
var templateObject_1;
