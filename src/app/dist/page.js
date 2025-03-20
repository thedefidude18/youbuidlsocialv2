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
var tabs_1 = require("@/components/ui/tabs");
var post_card_1 = require("@/components/post-card");
var auth_provider_1 = require("@/providers/auth-provider");
var points_provider_1 = require("@/providers/points-provider");
var navigation_1 = require("next/navigation");
var avatar_1 = require("@/components/ui/avatar");
var scroll_area_1 = require("@/components/ui/scroll-area");
var use_follow_1 = require("@/hooks/use-follow");
var wagmi_1 = require("wagmi");
var skeleton_1 = require("@/components/ui/skeleton");
var compose_box_1 = require("@/components/compose-box");
var use_create_post_1 = require("@/hooks/use-create-post");
var use_posts_1 = require("@/hooks/use-posts");
var orbis_1 = require("@/lib/orbis");
var lucide_react_1 = require("lucide-react");
var input_1 = require("@/components/ui/input");
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
                    React.createElement(skeleton_1.Skeleton, { className: "h-4 w-48" }))),
            React.createElement("div", { className: "p-4 border-b border-border" },
                React.createElement("div", { className: "flex justify-between mb-2" },
                    React.createElement(skeleton_1.Skeleton, { className: "h-4 w-24" }),
                    React.createElement(skeleton_1.Skeleton, { className: "h-4 w-24" })),
                React.createElement(skeleton_1.Skeleton, { className: "h-2 w-full" })),
            React.createElement("div", { className: "border-b border-border" },
                React.createElement("div", { className: "px-4" },
                    React.createElement("div", { className: "flex gap-4" }, Array.from({ length: 4 }).map(function (_, index) { return (React.createElement(skeleton_1.Skeleton, { key: "tab-skeleton-" + index, className: "h-9 w-16" })); })))))));
}
function HomeLoadingState() {
    return (React.createElement("div", { className: "space-y-4 p-4" }, Array.from({ length: 3 }).map(function (_, index) { return (React.createElement("div", { key: "post-skeleton-" + index, className: "bg-card rounded-lg p-4 animate-pulse" },
        React.createElement("div", { className: "flex items-center space-x-4 mb-4" },
            React.createElement("div", { className: "h-10 w-10 rounded-full bg-muted" }),
            React.createElement("div", { className: "space-y-2" },
                React.createElement("div", { className: "h-4 w-24 bg-muted rounded" }),
                React.createElement("div", { className: "h-3 w-16 bg-muted rounded" }))),
        React.createElement("div", { className: "h-20 bg-muted rounded" }))); })));
}
function HomePage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = auth_provider_1.useAuth(), user = _a.user, isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var isConnected = wagmi_1.useAccount().isConnected;
    var _b = points_provider_1.usePoints(), points = _b.points, level = _b.level, levelProgress = _b.levelProgress, nextLevelThreshold = _b.nextLevelThreshold, pointsBreakdown = _b.pointsBreakdown;
    var _c = use_follow_1.useFollow(), following = _c.following, followers = _c.followers, getFollowingCount = _c.getFollowingCount, getFollowersCount = _c.getFollowersCount;
    var _d = use_posts_1.usePosts(), posts = _d.posts, postsLoading = _d.loading, refreshPosts = _d.refreshPosts;
    var _e = use_create_post_1.useCreatePost(), createPost = _e.createPost, isSubmitting = _e.isSubmitting;
    var _f = react_1.useState(false), mounted = _f[0], setMounted = _f[1];
    var _g = react_1.useState('following'), activeTab = _g[0], setActiveTab = _g[1];
    var _h = react_1.useState(false), isWithdrawModalOpen = _h[0], setIsWithdrawModalOpen = _h[1];
    var _j = react_1.useState([]), orbisPosts = _j[0], setOrbisPosts = _j[1];
    var _k = react_1.useState(""), searchQuery = _k[0], setSearchQuery = _k[1];
    var _l = react_1.useState([]), searchResults = _l[0], setSearchResults = _l[1];
    // Filter out invalid posts
    var validPosts = (posts === null || posts === void 0 ? void 0 : posts.filter(function (post) {
        return post &&
            post.id &&
            post.likes !== undefined &&
            typeof post.id === 'string';
    })) || [];
    // Handle mounting state
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    // Transform Orbis posts to match PostCard interface
    var transformOrbisPost = function (post) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            id: post.stream_id,
            content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.body) || '',
            author: {
                id: post.creator,
                name: ((_c = (_b = post.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username) ||
                    ((_d = post.creator) === null || _d === void 0 ? void 0 : _d.slice(0, 6)) + '...' + ((_e = post.creator) === null || _e === void 0 ? void 0 : _e.slice(-4)),
                username: ((_g = (_f = post.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username) || post.creator,
                avatar: ((_j = (_h = post.creator_details) === null || _h === void 0 ? void 0 : _h.profile) === null || _j === void 0 ? void 0 : _j.pfp) || '',
                verified: false
            },
            timestamp: post.timestamp * 1000,
            stats: {
                likes: post.count_likes || 0,
                comments: post.count_replies || 0,
                reposts: post.count_hops || 0
            },
            ceramicData: ((_k = post.content) === null || _k === void 0 ? void 0 : _k.data) || null
        };
    };
    // Fetch Orbis posts
    react_1.useEffect(function () {
        var fetchOrbisPosts = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, transformedPosts, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, orbis_1.orbis.getPosts({
                                context: 'youbuidl:post'
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        transformedPosts = (data || [])
                            .map(transformOrbisPost)
                            .sort(function (a, b) { return b.timestamp - a.timestamp; });
                        setOrbisPosts(transformedPosts);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error fetching Orbis posts:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (mounted) {
            fetchOrbisPosts();
            refreshPosts();
        }
    }, [mounted, refreshPosts]);
    // Loading state
    if (!mounted || isLoading) {
        return React.createElement(ProfileLoadingState, null);
    }
    var handleSearch = function (query) {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        var normalizedQuery = query.toLowerCase().trim();
        // Search in Orbis posts
        var matchingPosts = orbisPosts.filter(function (post) {
            var _a;
            return ((_a = post.content) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(normalizedQuery)) ||
                post.author.name.toLowerCase().includes(normalizedQuery) ||
                post.author.username.toLowerCase().includes(normalizedQuery);
        }).slice(0, 5);
        setSearchResults(matchingPosts);
    };
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "flex-1 flex flex-col" },
            React.createElement("div", { className: "border-b border-border" },
                React.createElement("div", { className: "max-w-2xl mx-auto" },
                    React.createElement(tabs_1.TabsList, { className: "w-full justify-center px-4 h-12" },
                        React.createElement(tabs_1.TabsTrigger, { value: "latest" }, "Latest"),
                        React.createElement(tabs_1.TabsTrigger, { value: "following" }, "Following"),
                        React.createElement(tabs_1.TabsTrigger, { value: "foryou" }, "For You"),
                        React.createElement(tabs_1.TabsTrigger, { value: "search" },
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.Search, { className: "h-4 w-4" }),
                                "Search"))))),
            React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" },
                React.createElement("div", { className: "hidden md:block p-4" },
                    React.createElement(compose_box_1.ComposeBox, { onSubmit: createPost, isSubmitting: isSubmitting, placeholder: "What's happening?", maxLength: 280 })),
                React.createElement(tabs_1.TabsContent, { value: "latest", className: "m-0 p-4" },
                    React.createElement("div", { className: "space-y-4" }, postsLoading ? (React.createElement(HomeLoadingState, null)) : orbisPosts.length > 0 ? (orbisPosts.map(function (post, index) { return (React.createElement(post_card_1.PostCard, { key: "latest-" + post.id + "-" + index, post: post })); })) : (React.createElement("div", { className: "text-center text-muted-foreground p-8" }, "No posts yet. Be the first to post!")))),
                React.createElement(tabs_1.TabsContent, { value: "following", className: "m-0 p-4" },
                    React.createElement("div", { className: "space-y-4" }, postsLoading ? (React.createElement(HomeLoadingState, null)) : validPosts.length > 0 ? (validPosts.map(function (post, index) { return (React.createElement(post_card_1.PostCard, { key: "following-" + post.id + "-" + index, post: post })); })) : (React.createElement("div", { className: "text-center text-muted-foreground p-8" }, "No posts from people you follow. Start following some builders!")))),
                React.createElement(tabs_1.TabsContent, { value: "foryou", className: "m-0 p-4" },
                    React.createElement("div", { className: "space-y-4" }, postsLoading ? (React.createElement(HomeLoadingState, null)) : orbisPosts.length > 0 ? (orbisPosts.map(function (post, index) { return (React.createElement(post_card_1.PostCard, { key: "foryou-" + post.id + "-" + index, post: post })); })) : (React.createElement("div", { className: "text-center text-muted-foreground p-8" }, "No recommended posts yet. Start interacting with the community!")))),
                React.createElement(tabs_1.TabsContent, { value: "latest", className: "m-0 p-4" },
                    React.createElement("div", { className: "space-y-4" }, postsLoading ? (React.createElement(HomeLoadingState, null)) : orbisPosts.length > 0 ? (orbisPosts.map(function (post, index) { return (React.createElement(post_card_1.PostCard, { key: "latest-" + post.id + "-" + index, post: post })); })) : (React.createElement("div", { className: "text-center text-muted-foreground p-8" }, "No posts yet. Be the first to post!")))),
                React.createElement(tabs_1.TabsContent, { value: "search", className: "m-0 p-4" },
                    React.createElement("div", { className: "space-y-6" },
                        React.createElement("div", { className: "relative" },
                            React.createElement(input_1.Input, { type: "text", placeholder: "Search posts, users, and topics", className: "pr-10", value: searchQuery, onChange: function (e) {
                                    setSearchQuery(e.target.value);
                                    handleSearch(e.target.value);
                                } }),
                            React.createElement(lucide_react_1.Search, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" })),
                        searchQuery ? (
                        // Show search results
                        React.createElement("div", { className: "space-y-4" }, searchResults.length > 0 ? (searchResults.map(function (result, index) { return (React.createElement(post_card_1.PostCard, { key: "search-" + result.id + "-" + index, post: result })); })) : (React.createElement("div", { className: "text-center text-muted-foreground py-8" },
                            "No results found for \"",
                            searchQuery,
                            "\"")))) : (
                        // Show trending content when no search query
                        React.createElement(React.Fragment, null,
                            React.createElement("div", null,
                                React.createElement("h3", { className: "text-base font-medium mb-2" }, "Recent Posts"),
                                React.createElement("div", { className: "space-y-4" }, orbisPosts.slice(0, 3).map(function (post, index) { return (React.createElement(post_card_1.PostCard, { key: "trending-" + post.id + "-" + index, post: post })); }))),
                            React.createElement("div", null,
                                React.createElement("h3", { className: "text-base font-medium mb-2" }, "Active Users"),
                                React.createElement("div", { className: "space-y-2" }, orbisPosts
                                    .reduce(function (acc, post) {
                                    if (!acc.some(function (p) { return p.author.id === post.author.id; })) {
                                        acc.push(post);
                                    }
                                    return acc;
                                }, [])
                                    .slice(0, 5)
                                    .map(function (post, index) { return (React.createElement("div", { key: index, className: "flex items-center p-2 rounded-md hover:bg-secondary cursor-pointer", onClick: function () { return router.push("/profile/" + post.author.id); } },
                                    React.createElement(avatar_1.Avatar, { className: "h-8 w-8 mr-3" },
                                        React.createElement(avatar_1.AvatarImage, { src: post.author.avatar }),
                                        React.createElement(avatar_1.AvatarFallback, null, post.author.name[0])),
                                    React.createElement("div", { className: "flex-1" },
                                        React.createElement("div", { className: "font-medium" }, post.author.name),
                                        React.createElement("div", { className: "text-sm text-muted-foreground" },
                                            "@",
                                            post.author.username)))); })))))))))));
}
exports["default"] = HomePage;
