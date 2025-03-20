"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var theme_provider_1 = require("@/components/theme-provider");
var notification_provider_1 = require("@/components/notification-provider");
var rainbow_kit_provider_1 = require("@/providers/rainbow-kit-provider");
var auth_provider_1 = require("@/providers/auth-provider");
var points_provider_1 = require("@/providers/points-provider");
var toaster_1 = require("@/components/ui/toaster");
var mobile_nav_1 = require("@/components/mobile-nav");
var inter = google_1.Inter({ subsets: ["latin"] });
exports.metadata = {
    title: "youBuidl",
    description: "Explore, Connect and Buidl",
    icons: {
        icon: '/youlogo.svg'
    }
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: inter.className },
            React.createElement(theme_provider_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true },
                React.createElement(rainbow_kit_provider_1.WalletProvider, null,
                    React.createElement(auth_provider_1.AuthProvider, null,
                        React.createElement(notification_provider_1.NotificationProvider, null,
                            React.createElement(points_provider_1.PointsProvider, null,
                                children,
                                React.createElement(toaster_1.Toaster, null),
                                React.createElement(mobile_nav_1.MobileNav, null)))))))));
}
exports["default"] = RootLayout;
