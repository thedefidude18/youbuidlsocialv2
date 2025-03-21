"use client";
"use strict";
exports.__esModule = true;
exports.TrendingSidebar = void 0;
var link_1 = require("next/link");
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var points_system_1 = require("@/lib/points-system");
function PointsEarnerItem(_a) {
    var user = _a.user;
    return (React.createElement("div", { className: "px-4 py-3 hover:bg-secondary/80 transition-colors" },
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                React.createElement(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }),
                React.createElement(avatar_1.AvatarFallback, null, user.name.charAt(0))),
            React.createElement("div", { className: "flex-1" },
                React.createElement("div", { className: "text-sm font-medium flex items-center gap-2" },
                    user.name,
                    React.createElement("span", { className: "text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full" },
                        "Lvl ",
                        user.level)),
                React.createElement("div", { className: "text-xs text-muted-foreground" },
                    "@",
                    user.username)),
            React.createElement("div", { className: "text-sm font-medium text-primary" },
                user.points.toLocaleString(),
                " pts"))));
}
function TrendingSidebar() {
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    var _b = react_1.useState([]), topEarners = _b[0], setTopEarners = _b[1];
    react_1.useEffect(function () {
        setMounted(true);
        // Get top 5 earners from the leaderboard
        var leaderboard = points_system_1.getLeaderboard(5);
        setTopEarners(leaderboard.map(function (user) { return ({
            id: user.userId,
            name: user.userId,
            username: user.userId.slice(0, 8),
            avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=" + user.userId,
            points: user.points,
            level: user.level
        }); }));
    }, []);
    if (!mounted)
        return null;
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "bg-card rounded-xl overflow-hidden border border-border" },
            React.createElement("div", { className: "p-4 font-bold text-xl border-b border-border" }, "\uD83C\uDFC6 Top Points Earners"),
            topEarners.map(function (user) { return (React.createElement(PointsEarnerItem, { key: user.id, user: user })); }),
            React.createElement(link_1["default"], { href: "/leaderboard", className: "px-4 py-3 text-primary hover:bg-secondary/80 transition-colors cursor-pointer block text-sm" }, "View Full Leaderboard \u2192"))));
}
exports.TrendingSidebar = TrendingSidebar;
