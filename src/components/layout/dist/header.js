"use client";
"use strict";
exports.__esModule = true;
exports.Header = void 0;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var button_1 = require("@/components/ui/button");
var theme_toggle_1 = require("@/components/theme-toggle");
var points_provider_1 = require("@/providers/points-provider");
var auth_provider_1 = require("@/providers/auth-provider");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
var login_button_1 = require("@/components/login-button");
function Header() {
    var _a = points_provider_1.usePoints(), points = _a.points, level = _a.level;
    var user = auth_provider_1.useAuth().user;
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var showBackButton = pathname !== "/";
    return (React.createElement("header", { className: "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
        React.createElement("div", { className: "container flex h-14 max-w-screen-2xl items-center justify-between px-4 mx-auto" },
            React.createElement("div", { className: "flex items-center gap-2 md:gap-4 w-[200px]" }, showBackButton ? (React.createElement(button_1.Button, { variant: "ghost", size: "icon", className: "md:hidden", onClick: function () { return router.back(); } },
                React.createElement(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }))) : (React.createElement(link_1["default"], { href: "/", className: "flex items-center gap-2" },
                React.createElement("img", { src: "/youlogo.svg", alt: "Logo", className: "h-6 w-6" }),
                React.createElement("span", { className: "font-semibold" })))),
            React.createElement("div", { className: "md:hidden flex-1 flex justify-center" },
                React.createElement(button_1.Button, { variant: "ghost", className: "text-sm" },
                    points,
                    " pts \u2022 Lvl ",
                    level)),
            React.createElement("div", { className: "hidden md:flex justify-center max-w-[400px] w-full" },
                React.createElement("div", { className: "relative w-full" },
                    React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }),
                    React.createElement(input_1.Input, { type: "search", placeholder: "Search posts, users, and topics", className: "w-full pl-9 pr-4 bg-muted/50 border-none" }))),
            React.createElement("div", { className: "flex items-center space-x-4 w-[200px] justify-end" },
                React.createElement(button_1.Button, { variant: "ghost", className: "text-sm hidden md:inline-flex" },
                    points,
                    " pts \u2022 Level ",
                    level),
                React.createElement(link_1["default"], { href: "https://github.com/youbuidl", target: "_blank", rel: "noopener noreferrer", className: "hidden md:inline-flex" },
                    React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                        React.createElement(lucide_react_1.Github, { className: "h-5 w-5" }))),
                React.createElement(theme_toggle_1.ThemeToggle, null),
                React.createElement(login_button_1.LoginButton, null)))));
}
exports.Header = Header;
