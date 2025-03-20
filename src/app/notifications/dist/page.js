"use client";
"use strict";
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
exports.__esModule = true;
var react_1 = require("react");
var main_layout_1 = require("@/components/layout/main-layout");
var scroll_area_1 = require("@/components/ui/scroll-area");
var tabs_1 = require("@/components/ui/tabs");
var avatar_1 = require("@/components/ui/avatar");
var badge_1 = require("@/components/ui/badge");
var link_1 = require("next/link");
var notification_provider_1 = require("@/components/notification-provider");
var lucide_react_1 = require("lucide-react");
function NotificationsPage() {
    var _this = this;
    var _a = react_1.useState("all"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = notification_provider_1.useNotifications(), notifications = _b.notifications, unreadCount = _b.unreadCount, markAsRead = _b.markAsRead, markAllAsRead = _b.markAllAsRead, fetchNotifications = _b.fetchNotifications;
    var _c = react_1.useState(false), mounted = _c[0], setMounted = _c[1];
    var _d = react_1.useState(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    react_1.useEffect(function () {
        var loadNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        setError(null);
                        return [4 /*yield*/, fetchNotifications()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError(err_1.message || 'Failed to load notifications');
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        setMounted(true);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (!mounted) {
            loadNotifications();
        }
    }, [mounted, fetchNotifications]);
    var filteredNotifications = notifications.filter(function (notification) {
        if (activeTab === "all")
            return true;
        if (activeTab === "mentions")
            return notification.type === "mention";
        if (activeTab === "likes")
            return notification.type === "like";
        if (activeTab === "recasts")
            return notification.type === "recast";
        if (activeTab === "follows")
            return notification.type === "follow";
        if (activeTab === "donations")
            return notification.type === "donation";
        if (activeTab === "points")
            return notification.type === "points";
        if (activeTab === "withdrawals")
            return notification.type === "withdrawal";
        return false;
    });
    if (!mounted || isLoading) {
        return (React.createElement(main_layout_1.MainLayout, null,
            React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
                React.createElement("div", { className: "border-b border-border p-4" },
                    React.createElement("h1", { className: "text-xl font-bold" }, "Notifications")),
                React.createElement("div", { className: "flex-1 flex items-center justify-center" },
                    React.createElement(lucide_react_1.Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" })))));
    }
    if (error) {
        return (React.createElement(main_layout_1.MainLayout, null,
            React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
                React.createElement("div", { className: "border-b border-border p-4" },
                    React.createElement("h1", { className: "text-xl font-bold" }, "Notifications")),
                React.createElement("div", { className: "flex-1 flex items-center justify-center" },
                    React.createElement("div", { className: "text-destructive text-center" },
                        React.createElement("p", null, "Failed to load notifications"),
                        React.createElement("button", { onClick: function () { return fetchNotifications(); }, className: "mt-2 text-sm text-primary hover:underline" }, "Try again"))))));
    }
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
            React.createElement("div", { className: "border-b border-border p-4 flex items-center justify-between" },
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-xl font-bold" }, "Notifications"),
                    unreadCount > 0 && (React.createElement("p", { className: "text-sm text-muted-foreground" },
                        "You have ",
                        unreadCount,
                        " new notifications"))),
                unreadCount > 0 && (React.createElement("button", { onClick: markAllAsRead, className: "text-sm text-primary hover:underline" }, "Mark all as read"))),
            React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); }, className: "w-full" },
                React.createElement(scroll_area_1.ScrollArea, { orientation: "horizontal", className: "w-full border-b border-border" },
                    React.createElement(tabs_1.TabsList, { className: "inline-flex w-full md:w-auto p-0 h-12" },
                        React.createElement(tabs_1.TabsTrigger, { value: "all", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "All"),
                        React.createElement(tabs_1.TabsTrigger, { value: "mentions", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Mentions"),
                        React.createElement(tabs_1.TabsTrigger, { value: "likes", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Likes"),
                        React.createElement(tabs_1.TabsTrigger, { value: "recasts", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Reposts"),
                        React.createElement(tabs_1.TabsTrigger, { value: "follows", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Follows"),
                        React.createElement(tabs_1.TabsTrigger, { value: "donations", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Donations"),
                        React.createElement(tabs_1.TabsTrigger, { value: "points", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Points"),
                        React.createElement(tabs_1.TabsTrigger, { value: "withdrawals", className: "flex-1 md:flex-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none rounded-none px-4 h-full" }, "Withdrawals"))),
                React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" }, filteredNotifications.length > 0 ? (React.createElement("div", { className: "divide-y divide-border" }, filteredNotifications.map(function (notification) {
                    var _a, _b, _c, _d, _e;
                    return (React.createElement("div", { key: notification.id, className: "p-4 " + (notification.isNew ? 'bg-primary/5 dark:bg-primary/10' : ''), onClick: function () { return markAsRead(notification.id); } },
                        React.createElement("div", { className: "flex gap-3" },
                            React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                                React.createElement(avatar_1.AvatarImage, { src: notification.user.avatar, alt: notification.user.name }),
                                React.createElement(avatar_1.AvatarFallback, null, notification.user.name.charAt(0))),
                            React.createElement("div", { className: "flex-1" },
                                React.createElement("div", { className: "flex items-center gap-1 flex-wrap" },
                                    React.createElement(link_1["default"], { href: "/profile/" + notification.user.username, className: "font-semibold hover:underline" }, notification.user.name),
                                    notification.user.verified && (React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-primary" },
                                        React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                                        React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" }))),
                                    React.createElement("span", { className: "text-muted-foreground" }, notification.content),
                                    React.createElement("span", { className: "text-muted-foreground text-sm" }, notification.time),
                                    notification.isNew && (React.createElement(badge_1.Badge, { variant: "outline", className: "ml-2 bg-primary/10 text-primary border-primary/20 text-xs" }, "New"))),
                                notification.postContent && (React.createElement("div", { className: "mt-2 text-sm text-muted-foreground border-l-2 border-muted pl-3 py-1" }, notification.postContent)),
                                notification.channelName && (React.createElement("div", { className: "mt-2" },
                                    React.createElement(link_1["default"], { href: "/" + notification.channelName, className: "text-primary" },
                                        "#",
                                        notification.channelName))),
                                notification.type === "follow" && (React.createElement("button", { className: "mt-2 text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90" }, "Follow back")),
                                notification.type === "donation" && (React.createElement("div", { className: "mt-2 flex items-center gap-2" },
                                    React.createElement("span", { className: "text-sm font-medium text-green-600 dark:text-green-400" },
                                        "+", (_a = notification.amount) === null || _a === void 0 ? void 0 :
                                        _a.value,
                                        " ", (_b = notification.amount) === null || _b === void 0 ? void 0 :
                                        _b.currency),
                                    React.createElement(badge_1.Badge, { variant: "outline", className: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" }, "Donation"))),
                                notification.type === "points" && (React.createElement("div", { className: "mt-2 flex items-center gap-2" },
                                    React.createElement("span", { className: "text-sm font-medium text-purple-600 dark:text-purple-400" },
                                        "+", (_c = notification.amount) === null || _c === void 0 ? void 0 :
                                        _c.value,
                                        " Points"),
                                    React.createElement(badge_1.Badge, { variant: "outline", className: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" }, "Points"))),
                                notification.type === "withdrawal" && (React.createElement("div", { className: "mt-2 flex items-center gap-2" },
                                    React.createElement("span", { className: "text-sm font-medium text-blue-600 dark:text-blue-400" }, (_d = notification.amount) === null || _d === void 0 ? void 0 :
                                        _d.value,
                                        " ", (_e = notification.amount) === null || _e === void 0 ? void 0 :
                                        _e.currency),
                                    React.createElement(badge_1.Badge, { variant: "outline", className: cn("border-blue-200 dark:border-blue-800", notification.status === "completed"
                                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                            : notification.status === "pending"
                                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                                                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400") }, notification.status === "completed" ? "Completed" :
                                        notification.status === "pending" ? "Processing" : "Failed")))))));
                }))) : (React.createElement("div", { className: "flex flex-col items-center justify-center h-full py-12 px-4" },
                    React.createElement("div", { className: "bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4" },
                        React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-8 w-8 text-muted-foreground" },
                            React.createElement("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
                            React.createElement("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }))),
                    React.createElement("h3", { className: "text-lg font-medium mb-1" }, "No notifications yet"),
                    React.createElement("p", { className: "text-muted-foreground text-center max-w-md" }, "When you get notifications, they'll show up here. Interact with posts and other users to start receiving notifications."))))))));
}
exports["default"] = NotificationsPage;
