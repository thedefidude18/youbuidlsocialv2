'use client';
"use strict";
var _a;
exports.__esModule = true;
exports.WalletProvider = void 0;
var wagmi_1 = require("wagmi");
var rainbowkit_1 = require("@rainbow-me/rainbowkit");
var chains_1 = require("wagmi/chains");
var react_query_1 = require("@tanstack/react-query");
// Configure multiple RPC endpoints
var config = wagmi_1.createConfig({
    chains: [chains_1.optimismSepolia],
    transports: (_a = {},
        _a[chains_1.optimismSepolia.id] = wagmi_1.fallback([
            wagmi_1.http('https://sepolia.optimism.io'),
            wagmi_1.http('https://opt-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY'),
            wagmi_1.http('https://optimism-sepolia.infura.io/v3/YOUR_INFURA_KEY'),
            wagmi_1.http('https://rpc.ankr.com/optimism_sepolia/YOUR_ANKR_KEY'),
        ], { rank: true }),
        _a)
});
var queryClient = new react_query_1.QueryClient();
function WalletProvider(_a) {
    var children = _a.children;
    return (React.createElement(wagmi_1.WagmiProvider, { config: config },
        React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
            React.createElement(rainbowkit_1.RainbowKitProvider, null, children))));
}
exports.WalletProvider = WalletProvider;
