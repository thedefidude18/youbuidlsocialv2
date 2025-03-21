"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var main_layout_1 = require("@/components/layout/main-layout");
var tabs_1 = require("@/components/ui/tabs");
var post_card_1 = require("@/components/post-card");
var auth_provider_1 = require("@/providers/auth-provider");
var points_provider_1 = require("@/providers/points-provider");
var navigation_1 = require("next/navigation");
var avatar_1 = require("@/components/ui/avatar");
var scroll_area_1 = require("@/components/ui/scroll-area");
var progress_1 = require("@/components/ui/progress");
var user_level_badge_1 = require("@/components/user-level-badge");
var page_header_1 = require("@/components/layout/page-header");
var use_follow_1 = require("@/hooks/use-follow");
var wagmi_1 = require("wagmi");
var skeleton_1 = require("@/components/ui/skeleton");
var profile_edit_form_1 = require("@/components/profile-edit-form");
var WithdrawModal_1 = require("@/components/WithdrawModal");
var use_posts_1 = require("@/hooks/use-posts");
var WithdrawDonations_1 = require("@/components/WithdrawDonations");
// ProfileLoadingState component
function ProfileLoadingState() {
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
            React.createElement("div", { className: "border-b border-border p-4" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(skeleton_1.Skeleton, { className: "h-8 w-8 rounded-full" }),
                    React.createElement("div", null,
                        React.createElement(skeleton_1.Skeleton, { className: "h-6 w-32 mb-1" }),
                        React.createElement(skeleton_1.Skeleton, { className: "h-4 w-24" })))),
            React.createElement("div", { className: "p-4 border-b border-border" },
                React.createElement("div", { className: "flex justify-between items-start mb-4" },
                    React.createElement("div", { className: "relative" },
                        React.createElement(skeleton_1.Skeleton, { className: "h-20 w-20 rounded-full" }),
                        React.createElement("div", { className: "absolute -bottom-1 -right-1" },
                            React.createElement(skeleton_1.Skeleton, { className: "h-6 w-6 rounded-full" }))),
                    React.createElement(skeleton_1.Skeleton, { className: "h-9 w-24" })),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(skeleton_1.Skeleton, { className: "h-6 w-32" }),
                    React.createElement(skeleton_1.Skeleton, { className: "h-4 w-24" }),
                    React.createElement(skeleton_1.Skeleton, { className: "h-4 w-48" }))))));
}
function ProfilePage() {
    var _a;
    var router = navigation_1.useRouter();
    var _b = auth_provider_1.useAuth(), user = _b.user, isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var _c = wagmi_1.useAccount(), address = _c.address, isConnected = _c.isConnected;
    var _d = points_provider_1.usePoints(), points = _d.points, level = _d.level, levelProgress = _d.levelProgress, nextLevelThreshold = _d.nextLevelThreshold, pointsBreakdown = _d.pointsBreakdown;
    var _e = use_follow_1.useFollow(), following = _e.following, followers = _e.followers, getFollowingCount = _e.getFollowingCount, getFollowersCount = _e.getFollowersCount;
    var _f = use_posts_1.usePosts(), userPosts = _f.posts, postsLoading = _f.loading, getUserPosts = _f.getUserPosts;
    var _g = react_1.useState(false), mounted = _g[0], setMounted = _g[1];
    var _h = react_1.useState('posts'), activeTab = _h[0], setActiveTab = _h[1];
    var _j = react_1.useState(false), isWithdrawModalOpen = _j[0], setIsWithdrawModalOpen = _j[1];
    // Memoized values
    var followingCount = useMemo(function () { return getFollowingCount((user === null || user === void 0 ? void 0 : user.id) || ''); }, [user === null || user === void 0 ? void 0 : user.id, getFollowingCount]);
    var followersCount = useMemo(function () { return getFollowersCount((user === null || user === void 0 ? void 0 : user.id) || ''); }, [user === null || user === void 0 ? void 0 : user.id, getFollowersCount]);
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    react_1.useEffect(function () {
        if (mounted && address) {
            getUserPosts(address); // This will now fetch only the current user's posts
        }
    }, [mounted, address, getUserPosts]);
    if (!mounted) {
        return React.createElement(ProfileLoadingState, null);
    }
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement(page_header_1.PageHeader, { title: (user === null || user === void 0 ? void 0 : user.name) || 'Profile' }),
        React.createElement("div", { className: "flex-1 min-h-0 flex flex-col pb-16 md:pb-0" },
            React.createElement("div", { className: "max-w-4xl mx-auto w-full px-4" },
                React.createElement("div", { className: "flex flex-col items-center" },
                    React.createElement("div", { className: "relative mb-4" },
                        React.createElement(avatar_1.Avatar, { className: "h-24 w-24" },
                            React.createElement(avatar_1.AvatarImage, { src: user === null || user === void 0 ? void 0 : user.avatar, alt: user === null || user === void 0 ? void 0 : user.name }),
                            React.createElement(avatar_1.AvatarFallback, null, (_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.charAt(0))),
                        React.createElement("div", { className: "absolute -bottom-1 -right-1" },
                            React.createElement(user_level_badge_1.UserLevelBadge, { level: level, size: "lg" }))),
                    React.createElement("h2", { className: "font-bold text-xl mb-2" }, user === null || user === void 0 ? void 0 : user.name),
                    address && (React.createElement("p", { className: "text-muted-foreground mb-2 font-mono" }, address)),
                    React.createElement("p", { className: "text-muted-foreground mb-4" }, (user === null || user === void 0 ? void 0 : user.bio) || 'No bio yet'),
                    React.createElement("div", { className: "flex gap-4 mb-6" },
                        React.createElement("div", { className: "text-center" },
                            React.createElement("span", { className: "font-bold block" }, followersCount),
                            React.createElement("span", { className: "text-muted-foreground" }, "Followers")),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("span", { className: "font-bold block" }, followingCount),
                            React.createElement("span", { className: "text-muted-foreground" }, "Following")),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("span", { className: "font-bold block" }, (userPosts === null || userPosts === void 0 ? void 0 : userPosts.length) || 0),
                            React.createElement("span", { className: "text-muted-foreground" }, "Posts"))),
                    React.createElement("div", { className: "flex gap-2 mb-6" },
                        address && React.createElement(WithdrawDonations_1.WithdrawDonations, null),
                        React.createElement(profile_edit_form_1.ProfileEditForm, { user: user }))),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("div", { className: "flex justify-between mb-2" },
                        React.createElement("span", null,
                            points,
                            " points"),
                        React.createElement("span", null,
                            "Level ",
                            level)),
                    React.createElement(progress_1.Progress, { value: levelProgress, max: nextLevelThreshold })),
                React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); } },
                    React.createElement(tabs_1.TabsList, { className: "w-full justify-start" },
                        React.createElement(tabs_1.TabsTrigger, { value: "posts", key: "posts-tab" }, "Posts"),
                        React.createElement(tabs_1.TabsTrigger, { value: "replies", key: "replies-tab" }, "Replies"),
                        React.createElement(tabs_1.TabsTrigger, { value: "media", key: "media-tab" }, "Media"),
                        React.createElement(tabs_1.TabsTrigger, { value: "likes", key: "likes-tab" }, "Likes"),
                        React.createElement(tabs_1.TabsTrigger, { value: "points", key: "points-tab" }, "Points")),
                    React.createElement(scroll_area_1.ScrollArea, { className: "flex-1 mt-4" },
                        React.createElement("div", { className: "space-y-4" }, postsLoading ? (React.createElement("div", { className: "space-y-4" }, [1, 2, 3].map(function (i) { return (React.createElement(skeleton_1.Skeleton, { key: i, className: "h-32 w-full" })); }))) : userPosts && userPosts.length > 0 ? (userPosts.map(function (post) { return (React.createElement(post_card_1.PostCard, { key: post.id, post: post })); })) : (React.createElement("div", { className: "text-center text-muted-foreground p-8" }, "No posts yet"))))))),
        React.createElement(WithdrawModal_1.WithdrawModal, { isOpen: isWithdrawModalOpen, onClose: function () { return setIsWithdrawModalOpen(false); }, points: points })));
}
exports["default"] = ProfilePage;
