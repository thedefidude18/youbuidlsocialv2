'use client';
"use strict";
var _a;
exports.__esModule = true;
exports.WalletProvider = void 0;
var rainbowkit_1 = require("@rainbow-me/rainbowkit");
var wagmi_1 = require("wagmi");
var chains_1 = require("wagmi/chains");
var viem_1 = require("viem");
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var config = wagmi_1.createConfig({
    chains: [chains_1.optimismSepolia],
    transports: (_a = {},
        _a[chains_1.optimismSepolia.id] = viem_1.http(),
        _a)
});
var wallets = rainbowkit_1.getDefaultWallets({
    appName: 'youBuidl',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    chains: [chains_1.optimismSepolia]
}).wallets;
var queryClient = new react_query_1.QueryClient();
function WalletProvider(_a) {
    var children = _a.children;
    return (react_1["default"].createElement(wagmi_1.WagmiConfig, { config: config },
        react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
            react_1["default"].createElement(rainbowkit_1.RainbowKitProvider, { chains: [chains_1.optimismSepolia] }, children))));
}
exports.WalletProvider = WalletProvider;
