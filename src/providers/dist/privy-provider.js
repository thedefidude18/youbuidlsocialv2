'use client';
"use strict";
exports.__esModule = true;
exports.PrivyClientProvider = void 0;
var react_auth_1 = require("@privy-io/react-auth");
function PrivyClientProvider(_a) {
    var children = _a.children;
    return (React.createElement(react_auth_1.PrivyProvider, { appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID, config: {
            loginMethods: ['email', 'wallet'],
            appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                showWalletLoginFirst: true
            },
            walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
            embeddedWallets: {
                createOnLogin: 'all',
                noPromptOnSignature: false,
                requireUserPasswordOnCreate: false
            }
        } }, children));
}
exports.PrivyClientProvider = PrivyClientProvider;
