"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.DebugDonateModal = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var viem_1 = require("viem");
var DonationContract_1 = require("@/contracts/DonationContract");
var use_toast_1 = require("@/hooks/use-toast");
function DebugDonateModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, author = _a.author, streamId = _a.streamId, postExcerpt = _a.postExcerpt;
    var _b = wagmi_1.useAccount(), address = _b.address, isConnected = _b.isConnected;
    var chainId = wagmi_1.useChainId();
    var toast = use_toast_1.useToast().toast;
    var _c = react_1.useState('0.01'), amount = _c[0], setAmount = _c[1];
    var _d = react_1.useState(false), isProcessing = _d[0], setIsProcessing = _d[1];
    var _e = react_1.useState({}), debugInfo = _e[0], setDebugInfo = _e[1];
    var _f = react_1.useState({
        status: 'idle',
        signature: 'idle'
    }), transactionState = _f[0], setTransactionState = _f[1];
    var _g = react_1.useState([]), debugLogs = _g[0], setDebugLogs = _g[1];
    var addDebugLog = function (message) {
        setDebugLogs(function (prev) { return __spreadArrays(prev, [new Date().toISOString() + ": " + message]); });
    };
    var resetStates = function () {
        setIsProcessing(false);
        setTransactionState({
            status: 'idle',
            signature: 'idle'
        });
    };
    var contractAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;
    // Add contract configuration validation
    react_1.useEffect(function () {
        if (!contractAddress) {
            console.error('Contract address not configured in environment variables');
            addDebugLog('ERROR: Contract address not configured');
        }
        else {
            addDebugLog("Contract address configured: " + contractAddress);
        }
    }, [contractAddress]);
    // Add minimum donation constant
    var MIN_DONATION = '0.0001'; // in ETH
    // Debug information
    react_1.useEffect(function () {
        setDebugInfo({
            userAddress: address,
            isConnected: isConnected,
            chainId: chainId,
            contractAddress: contractAddress,
            streamId: streamId,
            authorAddress: author.address
        });
    }, [address, isConnected, chainId, contractAddress, streamId, author.address]);
    var _h = wagmi_1.useContractWrite({
        address: contractAddress
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'donateETH', onMutate, function () {
        addDebugLog('Contract write initiated');
    }, onError, function (error) {
        addDebugLog("Contract write error: " + error.message);
        console.error('Contract write error:', error);
        setTransactionState(function (prev) { return (__assign(__assign({}, prev), { status: 'failed', signature: 'failed', error: error.message })); });
        setIsProcessing(false);
        toast({
            title: 'Contract Error',
            description: error.message,
            variant: 'destructive'
        });
    }, onSuccess, function (data) {
        addDebugLog("Contract write success. Hash: " + data.hash);
        setTransactionState(function (prev) { return (__assign(__assign({}, prev), { signature: 'completed' })); });
    }), donateETH = _h.write, donationData = _h.data, isWriteError = _h.isError, writeError = _h.error, isWriteLoading = _h.isLoading, writeStatus = _h.status;
}
exports.DebugDonateModal = DebugDonateModal;
;
// Add contract write status to debug info
react_1.useEffect(function () {
    setDebugInfo(function (prev) { return (__assign(__assign({}, prev), { contractWrite: {
            isAvailable: !!donateETH,
            status: writeStatus,
            isLoading: isWriteLoading,
            error: writeError === null || writeError === void 0 ? void 0 : writeError.message
        } })); });
}, [donateETH, writeStatus, isWriteLoading, writeError]);
wagmi_1.useWaitForTransactionReceipt({
    hash: donationData === null || donationData === void 0 ? void 0 : donationData.hash,
    onSuccess: function (receipt) {
        addDebugLog("Transaction confirmed. Block: " + receipt.blockNumber);
        setTransactionState(function (prev) { return (__assign(__assign({}, prev), { status: 'confirmed' })); });
        setIsProcessing(false);
        toast({
            title: 'Donation successful!',
            description: "You donated " + amount + " ETH to " + author.name
        });
        onClose();
    },
    onError: function (error) {
        addDebugLog("Transaction failed: " + error.message);
        setTransactionState(function (prev) { return (__assign(__assign({}, prev), { status: 'failed', error: error.message })); });
        setIsProcessing(false);
        toast({
            title: 'Transaction failed',
            description: error.message || 'Failed to process donation',
            variant: 'destructive'
        });
    }
});
// Add immediate validation check
var _a = react_1.useState({
    isValidAmount: true,
    isValidNetwork: true,
    canDonate: false
}), validationState = _a[0], setValidationState = _a[1];
// Validate prerequisites
react_1.useEffect(function () {
    var isValidAmount = amount && parseFloat(amount) >= parseFloat(MIN_DONATION);
    var isValidNetwork = chainId === 11155420; // OP Sepolia
    var canDonate = isConnected && isValidAmount && isValidNetwork && !isProcessing;
    setValidationState({
        isValidAmount: isValidAmount,
        isValidNetwork: isValidNetwork,
        canDonate: canDonate
    });
    addDebugLog("Validation state updated: " + JSON.stringify({
        isValidAmount: isValidAmount,
        isValidNetwork: isValidNetwork,
        canDonate: canDonate,
        amount: amount,
        chainId: chainId,
        isConnected: isConnected,
        isProcessing: isProcessing
    }));
}, [amount, chainId, isConnected, isProcessing]);
var handleDonate = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            addDebugLog('Donate button clicked');
            console.log('Donate button clicked', {
                contractAddress: contractAddress,
                donateETH: !!donateETH,
                streamId: streamId,
                amount: amount
            });
            // Validation checks
            if (!contractAddress) {
                throw new Error("Contract address not configured. Current value: " + contractAddress);
            }
            if (!donateETH) {
                throw new Error("Contract write function not available. Status: " + writeStatus);
            }
            if (!isConnected) {
                throw new Error('Wallet not connected');
            }
            if (chainId !== 11155420) {
                throw new Error('Please switch to Optimism Sepolia network');
            }
            if (!amount || parseFloat(amount) < parseFloat(MIN_DONATION)) {
                throw new Error("Minimum donation amount is " + MIN_DONATION + " ETH");
            }
            if (!streamId) {
                throw new Error('Stream ID is missing');
            }
            addDebugLog('All validation checks passed');
            setIsProcessing(true);
            setTransactionState({
                status: 'pending',
                signature: 'pending'
            });
            addDebugLog("Preparing donation: " + JSON.stringify({
                streamId: streamId,
                amount: amount,
                contractAddress: contractAddress,
                authorAddress: author.address
            }));
            // Call the contract with explicit type checking
            donateETH({
                args: [streamId],
                value: viem_1.parseEther(amount)
            });
            addDebugLog('Contract write function called successfully');
        }
        catch (error) {
            addDebugLog("ERROR: " + (error instanceof Error ? error.message : 'Unknown error'));
            console.error('Donation error:', error);
            setTransactionState({
                status: 'failed',
                signature: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            setIsProcessing(false);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to process donation',
                variant: 'destructive'
            });
        }
        return [2 /*return*/];
    });
}); };
// Add network check
react_1.useEffect(function () {
    if (chainId !== 11155420) { // OP Sepolia
        toast({
            title: 'Wrong Network',
            description: 'Please switch to Optimism Sepolia testnet',
            variant: 'destructive'
        });
    }
}, [chainId]);
// Reset states when modal closes
react_1.useEffect(function () {
    if (!isOpen) {
        resetStates();
    }
}, [isOpen]);
var connect = wagmi_1.useConnect({
    onSuccess: function () {
        addDebugLog('Wallet connected successfully');
    },
    onError: function (error) {
        addDebugLog("Wallet connection error: " + error.message);
        toast({
            title: 'Connection Error',
            description: error.message,
            variant: 'destructive'
        });
    }
}).connect;
var handleConnectWallet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connect()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Connection error:', error_1);
                toast({
                    title: 'Connection Error',
                    description: error_1 instanceof Error ? error_1.message : 'Failed to connect wallet',
                    variant: 'destructive'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) {
        if (!open) {
            resetStates();
            onClose();
        }
    } },
    React.createElement(dialog_1.DialogContent, { className: "max-w-lg" },
        React.createElement(dialog_1.DialogHeader, null,
            React.createElement(dialog_1.DialogTitle, null, "Debug Donation Modal")),
        React.createElement("div", { className: "space-y-4" },
            React.createElement("div", { className: "bg-muted p-4 rounded-lg space-y-2" },
                React.createElement("h3", { className: "font-semibold" }, "Validation Status:"),
                React.createElement("div", { className: "text-sm" },
                    React.createElement("p", null,
                        "\u2713 Wallet Connected: ",
                        isConnected ? 'Yes' : 'No'),
                    React.createElement("p", null,
                        "\u2713 Valid Amount: ",
                        validationState.isValidAmount ? 'Yes' : 'No'),
                    React.createElement("p", null,
                        "\u2713 Correct Network: ",
                        validationState.isValidNetwork ? 'Yes' : 'No'),
                    React.createElement("p", null,
                        "\u2713 Can Donate: ",
                        validationState.canDonate ? 'Yes' : 'No'))),
            React.createElement("div", { className: "bg-muted p-4 rounded-lg space-y-2" },
                React.createElement("h3", { className: "font-semibold" }, "Debug Information:"),
                React.createElement("pre", { className: "text-xs overflow-x-auto" }, JSON.stringify(__assign(__assign({}, debugInfo), { transactionState: transactionState,
                    isProcessing: isProcessing, writeError: writeError === null || writeError === void 0 ? void 0 : writeError.message, donateETHAvailable: !!donateETH, logs: debugLogs.slice(-5) // Show last 5 logs
                 }), null, 2))),
            React.createElement("div", { className: "space-y-4" }, !isConnected ? (React.createElement(button_1.Button, { onClick: handleConnectWallet, className: "w-full", variant: "outline" }, "Connect Wallet")) : (React.createElement(React.Fragment, null,
                React.createElement(input_1.Input, { type: "number", value: amount, onChange: function (e) {
                        setAmount(e.target.value);
                        addDebugLog("Amount changed to: " + e.target.value);
                    }, placeholder: "Amount in ETH", step: "0.01", min: MIN_DONATION, disabled: isProcessing }),
                React.createElement(button_1.Button, { onClick: handleDonate, disabled: !validationState.canDonate, className: "w-full" }, isProcessing || transactionState.status === 'pending' ? (React.createElement(React.Fragment, null,
                    React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                    transactionState.signature === 'completed' ? 'Confirming...' : 'Processing...')) : ("Donate " + amount + " ETH")))))))));
var templateObject_1;
