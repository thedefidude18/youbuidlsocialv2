"use client";
"use strict";
exports.__esModule = true;
exports.WalletConnectButton = void 0;
var rainbowkit_1 = require("@rainbow-me/rainbowkit");
var button_1 = require("@/components/ui/button");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function WalletConnectButton(_a) {
    var _b = _a.size, size = _b === void 0 ? "sm" : _b, _c = _a.variant, variant = _c === void 0 ? "outline" : _c, _d = _a.className, className = _d === void 0 ? "rounded-full" : _d;
    return (React.createElement(rainbowkit_1.ConnectButton.Custom, null, function (_a) {
        var _b;
        var account = _a.account, chain = _a.chain, openAccountModal = _a.openAccountModal, openChainModal = _a.openChainModal, openConnectModal = _a.openConnectModal, mounted = _a.mounted;
        var ready = mounted;
        if (!ready) {
            return null;
        }
        if (!account) {
            return (React.createElement(button_1.Button, { onClick: openConnectModal, size: size, variant: variant, className: className }, "Connect Wallet"));
        }
        if (chain.unsupported) {
            return (React.createElement(button_1.Button, { onClick: openChainModal, size: size, variant: "destructive", className: className }, "Wrong Network"));
        }
        return (React.createElement(dropdown_menu_1.DropdownMenu, null,
            React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                React.createElement(button_1.Button, { size: size, variant: variant, className: className + " px-3" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        chain.hasIcon && (React.createElement("div", { className: "w-4 h-4 overflow-hidden rounded-full" }, chain.iconUrl && (React.createElement("img", { alt: (_b = chain.name) !== null && _b !== void 0 ? _b : 'Chain icon', src: chain.iconUrl, className: "w-full h-full" })))),
                        React.createElement("span", { className: "hidden md:inline" }, account.displayName),
                        React.createElement("span", { className: "md:hidden" },
                            account.displayName.slice(0, 4),
                            "...",
                            account.displayName.slice(-4))))),
            React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end", className: "w-56" },
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: openAccountModal }, "Account"),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: openChainModal },
                    "Network: ",
                    chain.name),
                React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-red-500 focus:text-red-500", onClick: function () {
                        // Add disconnect logic here if needed
                    } }, "Disconnect"))));
    }));
}
exports.WalletConnectButton = WalletConnectButton;
