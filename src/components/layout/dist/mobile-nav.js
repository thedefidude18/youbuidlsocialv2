"use client";
"use strict";
exports.__esModule = true;
exports.MobileNav = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var utils_1 = require("@/lib/utils");
var icons_1 = require("@/components/icons");
var notification_provider_1 = require("@/components/notification-provider");
function MobileNav() {
    var pathname = navigation_1.usePathname();
    var unreadCount = notification_provider_1.useNotifications().unreadCount;
    var _a = react_1.useState(false), showBadge = _a[0], setShowBadge = _a[1];
    react_1.useEffect(function () {
        setShowBadge(unreadCount > 0);
    }, [unreadCount]);
    var navItems = [
        {
            name: "Explore",
            href: "/",
            icon: React.createElement(icons_1.HomeIcon, { className: "h-6 w-6" })
        },
        {
            name: "Explore",
            href: "/explore",
            icon: React.createElement(icons_1.ExploreIcon, { className: "h-6 w-6" })
        },
        {
            name: "Rank",
            href: "leaderboard",
            icon: React.createElement(icons_1.WarpcastIcon, { className: "h-6 w-6" }),
            primary: true
        },
        {
            name: "Notifications",
            href: "/notifications",
            icon: React.createElement(icons_1.NotificationsIcon, { className: "h-6 w-6" }),
            badge: showBadge ? unreadCount : undefined
        },
        {
            name: "Profile",
            href: "/profile",
            icon: React.createElement(icons_1.ProfileIcon, { className: "h-6 w-6" })
        },
    ];
    return (React.createElement("div", { className: "fixed bottom-0 left-0 z-40 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
        React.createElement("div", { className: "flex h-16 items-center justify-around" }, navItems.map(function (item) { return (React.createElement(link_1["default"], { key: item.name, href: item.href, className: utils_1.cn("flex flex-col items-center justify-center flex-1 h-full relative", item.primary ? "text-primary" : "text-muted-foreground", pathname === item.href && !item.primary && "text-foreground") },
            item.primary ? (React.createElement("div", { className: "flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground" }, item.icon)) : (React.createElement("div", { className: "flex items-center justify-center h-6 relative" },
                item.icon,
                item.badge && (React.createElement("span", { className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground" }, item.badge > 9 ? '9+' : item.badge)))),
            React.createElement("span", { className: "text-xs mt-1" }, item.name))); }))));
}
exports.MobileNav = MobileNav;
