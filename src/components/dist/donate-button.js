"use client";
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
exports.DonateButton = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var viem_1 = require("viem");
var use_toast_1 = require("@/hooks/use-toast");
function DonateButton(_a) {
    var _this = this;
    var recipientAddress = _a.recipientAddress, authorName = _a.authorName, authorUsername = _a.authorUsername;
    var isConnected = wagmi_1.useAccount().isConnected;
    var _b = react_1.useState('0.01'), amount = _b[0], setAmount = _b[1];
    var _c = react_1.useState(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = react_1.useState(false), isDonating = _d[0], setIsDonating = _d[1];
    var _e = react_1.useState(false), donationSuccess = _e[0], setDonationSuccess = _e[1];
    var toast = use_toast_1.useToast().toast;
    var _f = wagmi_1.useSendTransaction({
        onSuccess: function (data) {
            setDonationSuccess(true);
            setIsDonating(false);
            toast({
                title: "Donation successful!",
                description: "You have successfully donated " + amount + " ETH to " + authorName
            });
            setTimeout(function () {
                setIsOpen(false);
                setTimeout(function () {
                    setDonationSuccess(false);
                    setAmount('0.01');
                }, 300);
            }, 3000);
        },
        onError: function (err) {
            setIsDonating(false);
            toast({
                title: "Donation failed",
                description: err.message || "There was an error processing your donation",
                variant: "destructive"
            });
        }
    }), sendTransaction = _f.sendTransaction, isPending = _f.isPending;
    var handleDonate = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!recipientAddress || !amount || !isConnected) {
                        toast({
                            title: "Error",
                            description: "Please connect your wallet first",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    setIsDonating(true);
                    if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
                        throw new Error("Invalid recipient address");
                    }
                    return [4 /*yield*/, sendTransaction({
                            to: recipientAddress
                        }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), value, viem_1.parseEther(amount))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
                case 4:
                    ;
                    return [2 /*return*/];
            }
        });
    }); };
    try { }
    catch (err) {
        setIsDonating(false);
        toast({
            title: "Error",
            description: err instanceof Error ? err.message : "Failed to send transaction",
            variant: "destructive"
        });
    }
}
exports.DonateButton = DonateButton;
;
var handleAmountChange = function (e) {
    var value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setAmount(value);
    }
};
var predefinedAmounts = ['0.01', '0.05', '0.1', '0.5', '1'];
return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen },
    React.createElement(dialog_1.DialogTrigger, { asChild: true },
        React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "rounded-full hover:bg-primary/10 hover:text-primary text-muted-foreground", disabled: !isConnected, onClick: function () {
                if (!isConnected) {
                    toast({
                        title: "Wallet not connected",
                        description: "Please connect your wallet first",
                        variant: "destructive"
                    });
                }
            } },
            React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "16" }),
                React.createElement("line", { x1: "8", y1: "12", x2: "16", y2: "12" })),
            React.createElement("span", { className: "sr-only" }, "Donate"))),
    React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[425px]" },
        React.createElement(dialog_1.DialogHeader, null,
            React.createElement(dialog_1.DialogTitle, null, donationSuccess ? "Donation Successful!" : "Support " + authorName),
            React.createElement(dialog_1.DialogDescription, null, donationSuccess
                ? "Thank you for supporting @" + authorUsername + "!"
                : "Send ETH directly to @" + authorUsername + " to support their content.")),
        React.createElement("div", { className: "grid gap-4 py-4" },
            React.createElement("div", { className: "grid gap-2" },
                React.createElement(input_1.Input, { id: "amount", type: "text", value: amount, onChange: handleAmountChange, className: "flex-1", placeholder: "Enter amount in ETH" }),
                React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" }, predefinedAmounts.map(function (presetAmount) { return (React.createElement(button_1.Button, { key: presetAmount, type: "button", variant: "outline", size: "sm", onClick: function () { return setAmount(presetAmount); }, className: amount === presetAmount ? "bg-secondary" : "" },
                    presetAmount,
                    " ETH")); })))),
        React.createElement(dialog_1.DialogFooter, null, !donationSuccess && (React.createElement(button_1.Button, { onClick: handleDonate, disabled: isDonating || isPending || !sendTransaction || Number(amount) <= 0, className: "w-full" }, isDonating ? (React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("div", { className: "h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" }),
            "Processing...")) : ("Donate " + amount + " ETH")))))));
var templateObject_1;
