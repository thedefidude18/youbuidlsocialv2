"use client";
"use strict";
exports.__esModule = true;
exports.TrendingSidebar = void 0;
var link_1 = require("next/link");
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var avatar_1 = require("@/components/ui/avatar");
var use_follow_1 = require("@/hooks/use-follow");
// Mock suggested accounts to follow
var suggestedUsers = [
    {
        id: "u1",
        name: "Base Official",
        username: "base",
        avatar: "https://placekitten.com/200/200",
        bio: "Official account of Base, the Ethereum L2 built by Coinbase.",
        verified: true
    },
    {
        id: "u2",
        name: "Vitalik Buterin",
        username: "vitalik",
        avatar: "https://placekitten.com/201/201",
        bio: "Ethereum co-founder. Cryptocurrency & blockchain enthusiast.",
        verified: true
    },
    {
        id: "u3",
        name: "DeFi Pulse",
        username: "defipulse",
        avatar: "https://placekitten.com/202/202",
        bio: "Tracking DeFi metrics & news. The go-to source for DeFi analytics.",
        verified: true
    },
];
// Mock data for trending topics
var trendingTopics = [];
// Create a separate component for the user item
function SuggestedUserItem(_a) {
    var user = _a.user;
    var _b = use_follow_1.useFollow(), isFollowing = _b.isFollowing, toggleFollow = _b.toggleFollow;
    var following = isFollowing(user.id);
    return (React.createElement("div", { key: user.id, className: "px-4 py-3 hover:bg-secondary/80 transition-colors" },
        React.createElement("div", { className: "flex items-start justify-between" },
            React.createElement("div", { className: "flex items-start gap-3" },
                React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                    React.createElement(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }),
                    React.createElement(avatar_1.AvatarFallback, null, user.name.charAt(0))),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex items-center gap-1" },
                        React.createElement("span", { className: "text-sm font-medium" }, user.name),
                        user.verified && (React.createElement("span", { className: "text-blue-500" }, "\u2713"))),
                    React.createElement("div", { className: "text-xs text-muted-foreground" },
                        "@",
                        user.username))),
            React.createElement(button_1.Button, { variant: following ? "default" : "outline", className: "rounded-full h-8", size: "sm", onClick: function () { return toggleFollow(user.id); } }, following ? 'Following' : 'Follow')),
        React.createElement("div", { className: "mt-2 text-sm text-muted-foreground" }, user.bio)));
}
function TrendingSidebar() {
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    if (!mounted)
        return null;
    // Mock data for top points earners
    var topPointsEarners = [
    // Add mock data here
    ];
    // Mock data for top posts
    var topPosts = [
    // Add mock data here
    ];
    // Create component for points earner item
    function PointsEarnerItem(_a) {
        var user = _a.user;
        return (React.createElement("div", { className: "px-4 py-3 hover:bg-secondary/80 transition-colors" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                    React.createElement(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }),
                    React.createElement(avatar_1.AvatarFallback, null, user.name.charAt(0))),
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "text-sm font-medium" }, user.name),
                    React.createElement("div", { className: "text-xs text-muted-foreground" },
                        "@",
                        user.username)),
                React.createElement("div", { className: "text-sm font-medium" },
                    user.points,
                    " pts"))));
    }
    // Create component for top post item
    function TopPostItem(_a) {
        var post = _a.post;
        return (React.createElement("div", { className: "px-4 py-3 hover:bg-secondary/80 transition-colors" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
                    React.createElement(avatar_1.AvatarImage, { src: post.author.avatar, alt: post.author.name }),
                    React.createElement(avatar_1.AvatarFallback, null, post.author.name.charAt(0))),
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "text-sm font-medium" }, post.title),
                    React.createElement("div", { className: "text-xs text-muted-foreground" },
                        post.likes,
                        " likes \u2022 ",
                        post.comments,
                        " comments")))));
    }
    // In the TrendingSidebar component, add new sections
    return (React.createElement("div", { className: "w-80 border-l border-border overflow-y-auto h-full" },
        React.createElement("div", { className: "p-4 space-y-4" },
            React.createElement("div", { className: "relative" },
                React.createElement("div", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none" },
                    React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-muted-foreground" },
                        React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
                        React.createElement("path", { d: "m21 21-4.3-4.3" }))),
                React.createElement("input", { type: "search", placeholder: "Search", className: "w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" })),
            React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden" },
                React.createElement("div", { className: "p-4 font-bold text-xl" }, "What's happening"),
                trendingTopics.map(function (topic) { return (React.createElement("div", { key: topic.id, className: "px-4 py-3 hover:bg-secondary/80 transition-colors cursor-pointer" },
                    React.createElement("div", { className: "flex flex-col" },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("span", { className: "text-xs text-muted-foreground" }, topic.category),
                            topic.time && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "text-xs text-muted-foreground mx-1" }, "\u00B7"),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, topic.time)))),
                        React.createElement("div", { className: "font-medium mt-0.5" }, topic.title),
                        React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                            topic.posts.toLocaleString(),
                            " posts")))); }),
                React.createElement("div", { className: "px-4 py-3 text-primary hover:bg-secondary/80 transition-colors cursor-pointer" },
                    React.createElement("span", { className: "text-sm" }, "Show more"))),
            React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden" },
                React.createElement("div", { className: "p-4 font-bold text-xl" }, "Who to follow"),
                suggestedUsers.map(function (user) { return (React.createElement(SuggestedUserItem, { key: user.id, user: user })); })),
            React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden" },
                React.createElement("div", { className: "p-4 font-bold text-xl" }, "Top Points Earners"),
                topPointsEarners.map(function (user) { return (React.createElement(PointsEarnerItem, { key: user.id, user: user })); })),
            React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden" },
                React.createElement("div", { className: "p-4 font-bold text-xl" }, "Top Posts"),
                topPosts.map(function (post) { return (React.createElement(TopPostItem, { key: post.id, post: post })); })),
            React.createElement("div", { className: "bg-secondary rounded-xl overflow-hidden" },
                React.createElement("div", { className: "p-4 font-bold text-xl" }, "Who to follow"),
                suggestedUsers.map(function (user) { return (React.createElement(SuggestedUserItem, { key: user.id, user: user })); })),
            React.createElement("div", { className: "text-xs text-muted-foreground" },
                React.createElement("div", { className: "flex flex-wrap gap-x-2" },
                    React.createElement(link_1["default"], { href: "#", className: "hover:underline" }, "Terms of Service"),
                    React.createElement(link_1["default"], { href: "#", className: "hover:underline" }, "Privacy Policy"),
                    React.createElement(link_1["default"], { href: "#", className: "hover:underline" }, "Privacy Policy")),
                React.createElement("div", { className: "mt-2" }, "\u00A9 2025 GiveStation")))));
}
exports.TrendingSidebar = TrendingSidebar;
