"use client";
"use strict";
exports.__esModule = true;
exports.Sidebar = void 0;
var wagmi_1 = require("wagmi");
var react_1 = require("react");
var link_1 = require("next/link");
var notification_provider_1 = require("@/components/notification-provider");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var navigation_1 = require("next/navigation");
function Sidebar() {
    var unreadCount = notification_provider_1.useNotifications().unreadCount;
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    var address = wagmi_1.useAccount().address;
    var pathname = navigation_1.usePathname();
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    // Default profile path when not connected or during initial render
    var profilePath = mounted && address ? "/profile/" + address : '/profile';
    var navigationItems = [
        { href: "/", icon: lucide_react_1.Home, label: "Home" },
        { href: "/search", icon: lucide_react_1.Search, label: "Explore" },
        { href: "/notifications", icon: lucide_react_1.Bell, label: "Notifications", count: unreadCount },
        { href: "/messages", icon: lucide_react_1.Mail, label: "Messages" },
        { href: profilePath, icon: lucide_react_1.User, label: "Profile" },
        { href: "/leaderboard", icon: lucide_react_1.Trophy, label: "Leaderboard" },
    ];
    var socialItems = [
        { href: "https://twitter.com/youbuidl", icon: lucide_react_1.Twitter, label: "Twitter" },
        { href: "https://github.com/youbuidl", icon: lucide_react_1.Github, label: "GitHub" },
        { href: "https://discord.gg/youbuidl", icon: lucide_react_1.MessageSquare, label: "Discord" },
    ];
    return (React.createElement("div", { className: "flex flex-col h-full py-4 px-2" },
        React.createElement("nav", { className: "space-y-1" }, navigationItems.map(function (item) { return (React.createElement(link_1["default"], { key: item.href, href: item.href, className: utils_1.cn("flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition-colors hover:bg-accent", pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted") },
            React.createElement(item.icon, { className: "h-5 w-5" }),
            React.createElement("span", null, item.label),
            item.count && mounted ? (React.createElement("span", { className: "ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full" }, item.count)) : null)); })),
        React.createElement("div", { className: "mt-8 border-t border-border pt-4" },
            React.createElement("h3", { className: "px-4 text-sm font-medium text-muted-foreground mb-2" }, "Connect With Us"),
            React.createElement("nav", { className: "space-y-1" }, socialItems.map(function (item) { return (React.createElement(link_1["default"], { key: item.href, href: item.href, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors" },
                React.createElement(item.icon, { className: "h-5 w-5" }),
                React.createElement("span", null, item.label))); })))));
}
exports.Sidebar = Sidebar;
