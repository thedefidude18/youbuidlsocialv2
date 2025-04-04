"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var points_system_1 = require("@/lib/points-system");
var auth_provider_1 = require("@/providers/auth-provider");
var use_follow_1 = require("@/hooks/use-follow");
var wagmi_1 = require("wagmi");
var DonationContract_1 = require("@/contracts/DonationContract");
var viem_1 = require("viem");
function LeaderboardPage() {
    var _a = react_1.useState("points"), leaderboardType = _a[0], setLeaderboardType = _a[1];
    var _b = react_1.useState([]), pointsLeaderboard = _b[0], setPointsLeaderboard = _b[1];
    var _c = react_1.useState([]), donationsLeaderboard = _c[0], setDonationsLeaderboard = _c[1];
    var _d = react_1.useState(false), mounted = _d[0], setMounted = _d[1];
    var user = auth_provider_1.useAuth().user;
    var _e = use_follow_1.useFollow(), isFollowing = _e.isFollowing, toggleFollow = _e.toggleFollow;
    // Get donations leaderboard from contract
    var topDonators = wagmi_1.useContractRead({
        address: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS
    }(templateObject_1 || (templateObject_1 = __makeTemplateObject(["0x", ""], ["0x", ""])), string), abi, DonationContract_1.donationContractABI, functionName, 'getTopDonators', args, [10], // Get top 10
    enabled, mounted).data;
}
exports["default"] = LeaderboardPage;
;
// Initialize leaderboards on mount
react_1.useEffect(function () {
    setMounted(true);
    // For the points leaderboard, we'll use our real points data
    var pointsData = points_system_1.getLeaderboard(10);
    var formattedPointsLeaderboard = formatLeaderboardData(pointsData, 'points');
    setPointsLeaderboard(formattedPointsLeaderboard);
    // For donations leaderboard, format the contract data
    if (topDonators) {
        var formattedDonationsLeaderboard = formatLeaderboardData(topDonators, 'donations');
        setDonationsLeaderboard(formattedDonationsLeaderboard);
    }
}, [isFollowing, topDonators]);
var formatLeaderboardData = function (data, type) {
    return data.map(function (entry) {
        var username = "user_" + entry.userId.substring(2, 8).toLowerCase();
        var shortAddress = entry.userId.substring(0, 6) + "..." + entry.userId.substring(entry.userId.length - 4);
        return {
            userId: entry.userId,
            points: type === 'points' ? entry.points : 0,
            level: entry.level || 1,
            name: shortAddress,
            username: username,
            avatar: "https://avatars.dicebear.com/api/identicon/" + entry.userId + ".svg",
            posts: Math.floor(Math.random() * 300),
            donations: type === 'donations' ? viem_1.formatEther(entry.amount || 0n) : "0",
            isFollowing: isFollowing(entry.userId)
        };
    });
};
// Handle follow/unfollow
var handleToggleFollow = function (userId) {
    toggleFollow(userId);
    updateLeaderboardFollowStatus(userId);
};
var updateLeaderboardFollowStatus = function (userId) {
    var updateBoard = function (prev) {
        return prev.map(function (user) {
            return user.userId === userId
                ? __assign(__assign({}, user), { isFollowing: !user.isFollowing }) : user;
        });
    };
    setPointsLeaderboard(updateBoard);
    setDonationsLeaderboard(updateBoard);
};
// Get current leaderboard based on type
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
function LeaderboardPage() {
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
                mounted && getCurrentLeaderboard().length === 0 && (React.createElement("div", { className: "p-8 text-center text-muted-foreground" }, "No data available yet"))))))));
}

exports.default = LeaderboardPage;
var templateObject_1;
