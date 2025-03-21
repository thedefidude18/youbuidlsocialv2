"use client";
"use strict";
exports.__esModule = true;
exports.RightSidebar = void 0;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var points_system_1 = require("@/lib/points-system");
var link_1 = require("next/link");
var utils_1 = require("@/lib/utils");
var card_1 = require("@/components/ui/card");
var use_posts_1 = require("@/hooks/use-posts");
var lucide_react_1 = require("lucide-react");
function TopPost(_a) {
    var post = _a.post;
    return (React.createElement(link_1["default"], { href: "/post/" + post.id, className: "px-4 py-3 hover:bg-secondary/80 transition-colors block" },
        React.createElement("div", { className: "flex items-start gap-3" },
            React.createElement(avatar_1.Avatar, { className: "h-8 w-8" },
                React.createElement(avatar_1.AvatarImage, { src: post.author.avatar, alt: post.author.name }),
                React.createElement(avatar_1.AvatarFallback, null, utils_1.formatAddress(post.author.id))),
            React.createElement("div", { className: "flex-1 min-w-0" },
                React.createElement("div", { className: "text-sm font-medium mb-1 truncate" }, utils_1.formatAddress(post.author.id)),
                React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2" }, post.content),
                React.createElement("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground" },
                    React.createElement("span", null,
                        "\u2764\uFE0F ",
                        post.stats.likes),
                    React.createElement("span", null,
                        "\uD83D\uDCAC ",
                        post.stats.comments))))));
}
function RightSidebar() {
    var _a = react_1.useState(false), mounted = _a[0], setMounted = _a[1];
    var _b = react_1.useState([]), topEarners = _b[0], setTopEarners = _b[1];
    var _c = use_posts_1.usePosts(), posts = _c.posts, loading = _c.loading, refreshPosts = _c.refreshPosts;
    react_1.useEffect(function () {
        setMounted(true);
        var leaderboard = points_system_1.getLeaderboard(5);
        setTopEarners(leaderboard.map(function (user) { return ({
            id: user.userId,
            name: utils_1.formatAddress(user.userId),
            username: utils_1.formatAddress(user.userId),
            avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=" + user.userId,
            points: user.points,
            level: user.level
        }); }));
    }, []);
    react_1.useEffect(function () {
        if (mounted) {
            console.log('Fetching posts...');
            refreshPosts();
        }
    }, [mounted, refreshPosts]);
    // Debug logs
    react_1.useEffect(function () {
        console.log('Posts state:', { posts: posts, loading: loading, mounted: mounted });
    }, [posts, loading, mounted]);
    var recentPosts = (posts === null || posts === void 0 ? void 0 : posts.slice(0, 3)) || [];
    if (!mounted)
        return null;
    return (React.createElement("div", { className: "w-0 lg:w-[320px] xl:w-[380px] h-full hidden lg:block bg-background" },
        React.createElement("div", { className: "h-full flex flex-col" },
            React.createElement("div", { className: "flex-1 overflow-y-auto hide-scrollbar" },
                React.createElement("div", { className: "mb-4" },
                    React.createElement(card_1.Card, { className: "overflow-hidden rounded-none border-x-0 bg-background" },
                        React.createElement("div", { className: "p-4 font-semibold text-sm border-b border-border flex items-center gap-2" }, "\uD83D\uDCDD Recent Posts"),
                        React.createElement("div", null, loading ? (React.createElement("div", { className: "flex items-center justify-center p-4" },
                            React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }))) : recentPosts.length > 0 ? (recentPosts.map(function (post) { return (React.createElement(TopPost, { key: post.id, post: post })); })) : (React.createElement("div", { className: "px-4 py-3 text-sm text-muted-foreground" }, "No recent posts")))))),
            React.createElement("div", { className: "mt-auto pb-16 hide-scrollbar" }))));
}
exports.RightSidebar = RightSidebar;
