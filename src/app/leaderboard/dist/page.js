'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var main_layout_1 = require("@/components/layout/main-layout");
var page_header_1 = require("@/components/page-header");
var tabs_1 = require("@/components/ui/tabs");
var scroll_area_1 = require("@/components/ui/scroll-area");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var link_1 = require("next/link");
var user_level_badge_1 = require("@/components/user-level-badge");
var auth_provider_1 = require("@/providers/auth-provider");
var use_toast_1 = require("@/hooks/use-toast");
var styled_components_1 = require("styled-components");
var templateObject_1;
function LeaderboardPage() {
    var _a = (0, react_1.useState)("points"), leaderboardType = _a[0], setLeaderboardType = _a[1];
    var _b = (0, react_1.useState)(false), mounted = _b[0], setMounted = _b[1];
    var _c = (0, react_1.useState)([]), pointsLeaderboard = _c[0], setPointsLeaderboard = _c[1];
    var _d = (0, react_1.useState)([]), donationsLeaderboard = _d[0], setDonationsLeaderboard = _d[1];
    var user = (0, auth_provider_1.useAuth)().user;
    var toast = (0, use_toast_1.useToast)().toast;
    // Set mounted state when component mounts
    (0, react_1.useEffect)(function () {
        setMounted(true);
        // Fetch leaderboard data
        fetchLeaderboardData();
    }, []);
    var fetchLeaderboardData = function () {
        // Simulate API call for points leaderboard
        var mockPointsLeaderboard = [
            {
                userId: "1",
                name: "Alice Johnson",
                username: "alice",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alice",
                points: 1250,
                level: 5,
                isFollowing: true
            },
            {
                userId: "2",
                name: "Bob Smith",
                username: "bobsmith",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bob",
                points: 980,
                level: 4,
                isFollowing: false
            },
            {
                userId: "3",
                name: "Charlie Brown",
                username: "charlie",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=charlie",
                points: 750,
                level: 3,
                isFollowing: true
            },
            {
                userId: "4",
                name: "Diana Prince",
                username: "diana",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=diana",
                points: 620,
                level: 3,
                isFollowing: false
            },
            {
                userId: "5",
                name: "Ethan Hunt",
                username: "ethan",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ethan",
                points: 510,
                level: 2,
                isFollowing: false
            }
        ];
        // Simulate API call for donations leaderboard
        var mockDonationsLeaderboard = [
            {
                userId: "3",
                name: "Charlie Brown",
                username: "charlie",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=charlie",
                donations: 250,
                level: 3,
                isFollowing: true
            },
            {
                userId: "1",
                name: "Alice Johnson",
                username: "alice",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alice",
                donations: 180,
                level: 5,
                isFollowing: true
            },
            {
                userId: "5",
                name: "Ethan Hunt",
                username: "ethan",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ethan",
                donations: 120,
                level: 2,
                isFollowing: false
            },
            {
                userId: "2",
                name: "Bob Smith",
                username: "bobsmith",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bob",
                donations: 90,
                level: 4,
                isFollowing: false
            },
            {
                userId: "4",
                name: "Diana Prince",
                username: "diana",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=diana",
                donations: 75,
                level: 3,
                isFollowing: false
            }
        ];
        setPointsLeaderboard(mockPointsLeaderboard);
        setDonationsLeaderboard(mockDonationsLeaderboard);
    };
    var handleToggleFollow = function (userId) {
        // Toggle follow status in both leaderboards
        setPointsLeaderboard(function (prev) {
            return prev.map(function (user) {
                if (user.userId === userId) {
                    return Object.assign(Object.assign({}, user), { isFollowing: !user.isFollowing });
                }
                return user;
            });
        });
        setDonationsLeaderboard(function (prev) {
            return prev.map(function (user) {
                if (user.userId === userId) {
                    return Object.assign(Object.assign({}, user), { isFollowing: !user.isFollowing });
                }
                return user;
            });
        });
        // Show toast notification
        toast({
            title: "Success",
            description: "Follow status updated"
        });
    };
    var getCurrentLeaderboard = function () {
        switch (leaderboardType) {
            case "points":
                return pointsLeaderboard;
            case "donations":
                return donationsLeaderboard;
            default:
                return pointsLeaderboard;
        }
    };

    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
            React.createElement(page_header_1.PageHeader, { title: "Leaderboard" }),
            React.createElement(tabs_1.Tabs, { value: leaderboardType, onValueChange: function (value) { return setLeaderboardType(value); }, className: "w-full border-b border-border" },
                React.createElement(tabs_1.TabsList, { className: "grid w-full grid-cols-2 h-12 bg-transparent" },
                    React.createElement(tabs_1.TabsTrigger, { value: "points", className: "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full" }, "Points"),
                    React.createElement(tabs_1.TabsTrigger, { value: "donations", className: "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full" }, "Donations"))),
            React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" },
                React.createElement("div", { className: "divide-y divide-border" },
                    !mounted ? (
                    // Loading state
                    Array(5).fill(0).map(function (_, i) { return (React.createElement("div", { key: i, className: "p-4 animate-pulse flex items-center gap-4" },
                        React.createElement("div", { className: "w-8 text-center font-bold text-muted-foreground" }, i + 1),
                        React.createElement("div", { className: "h-12 w-12 rounded-full bg-muted" }),
                        React.createElement("div", { className: "flex-1 space-y-2" },
                            React.createElement("div", { className: "h-4 bg-muted rounded w-1/4" }),
                            React.createElement("div", { className: "h-3 bg-muted rounded w-1/6" })),
                        React.createElement("div", { className: "h-8 w-20 bg-muted rounded" }))); })) : (getCurrentLeaderboard().map(function (user, index) { return (React.createElement("div", { key: user.userId, className: "p-4 flex items-center" },
                        React.createElement("div", { className: "w-8 text-center font-bold text-muted-foreground" }, index + 1),
                        React.createElement("div", { className: "flex-1 flex items-center gap-3" },
                            React.createElement(link_1["default"], { href: "/profile/" + user.username, className: "relative block" },
                                React.createElement(avatar_1.Avatar, { className: "h-12 w-12" },
                                    React.createElement(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }),
                                    React.createElement(avatar_1.AvatarFallback, null, user.name.charAt(0))),
                                React.createElement("div", { className: "absolute -bottom-1 -right-1" },
                                    React.createElement(user_level_badge_1.UserLevelBadge, { level: user.level, size: "sm" }))),
                            React.createElement("div", { className: "overflow-hidden" },
                                React.createElement(link_1["default"], { href: "/profile/" + user.username, className: "font-semibold hover:underline block truncate" }, user.name),
                                React.createElement("span", { className: "text-sm text-muted-foreground" },
                                    "@",
                                    user.username))),
                        React.createElement("div", { className: "flex items-center gap-6" },
                            React.createElement("div", { className: "text-right mr-2" },
                                React.createElement("div", { className: "font-semibold" },
                                    leaderboardType === "points" && user.points.toLocaleString() + " pts",
                                    leaderboardType === "donations" && "$" + user.donations),
                                React.createElement("div", { className: "text-xs text-muted-foreground" },
                                    "Level ",
                                    user.level)),
                            user.userId !== (user === null || user === void 0 ? void 0 : user.id) && (React.createElement(button_1.Button, { variant: user.isFollowing ? "default" : "outline", size: "sm", className: "rounded-full", onClick: function () { return handleToggleFollow(user.userId); } }, user.isFollowing ? "Following" : "Follow"))))); })),
                    mounted && getCurrentLeaderboard().length === 0 && (React.createElement("div", { className: "p-8 text-center text-muted-foreground" }, "No data available yet")))))));
}

exports.default = LeaderboardPage;
