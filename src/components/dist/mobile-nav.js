'use client';
"use strict";
exports.__esModule = true;
exports.MobileNav = void 0;
var wagmi_1 = require("wagmi");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var Home_1 = require("@/components/icons/Home");
var PlusSquare_1 = require("@/components/icons/PlusSquare");
var Bell_1 = require("@/components/icons/Bell");
var User_1 = require("@/components/icons/User");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function MobileNav() {
    var address = wagmi_1.useAccount().address;
    var pathname = navigation_1.usePathname();
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    var profilePath = mounted && address ? "/profile/" + address : '#';
    return (React.createElement(React.Fragment, null,
        React.createElement(link_1["default"], { href: "/compose", className: "fixed right-4 bottom-20 z-50 md:hidden" },
            React.createElement(button_1.Button, { className: "h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg", size: "icon" },
                React.createElement(PlusSquare_1["default"], { className: "h-6 w-6" }))),
        React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden" },
            React.createElement("div", { className: "flex items-center justify-around" },
                React.createElement(link_1["default"], { href: "/", className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full p-4 text-sm", pathname === '/' ? 'text-primary' : 'text-muted-foreground') },
                    React.createElement(Home_1["default"], { className: "w-5 h-5" }),
                    React.createElement("span", null)),
                React.createElement(link_1["default"], { href: "/leaderboard", className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full p-4 text-sm", pathname === '/leaderboard' ? 'text-primary' : 'text-muted-foreground') },
                    React.createElement(Trophy, { className: "w-5 h-5" }),
                    React.createElement("span", null)),
                React.createElement(link_1["default"], { href: "/notifications", className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full p-4 text-sm", pathname === '/notifications' ? 'text-primary' : 'text-muted-foreground') },
                    React.createElement(Bell_1["default"], { className: "w-5 h-5" }),
                    React.createElement("span", null)),
                React.createElement(link_1["default"], { href: "/messages", className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full p-4 text-sm", pathname === '/messages' ? 'text-primary' : 'text-muted-foreground') },
                    React.createElement(lucide_react_1.MessageSquare, { className: "w-5 h-5" }),
                    React.createElement("span", null)),
                React.createElement(link_1["default"], { href: profilePath, className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full p-4 text-sm", (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/profile')) ? 'text-primary' : 'text-muted-foreground'), onClick: function (e) {
                        if (!mounted || !address) {
                            e.preventDefault();
                            // Optionally show a toast or modal prompting to connect wallet
                        }
                    } },
                    React.createElement(User_1["default"], { className: "w-5 h-5" }),
                    React.createElement("span", null))))));
}
exports.MobileNav = MobileNav;
