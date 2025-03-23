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
exports.HomeFeed = void 0;
var react_1 = require("react");
var posts_store_1 = require("@/store/posts-store");
var use_create_post_1 = require("@/hooks/use-create-post");
var post_card_1 = require("./post-card");
var compose_box_1 = require("./compose-box");
var orbis_1 = require("@/lib/orbis");
var react_auth_1 = require("@privy-io/react-auth");
var spinner_1 = require("./ui/spinner");
function HomeFeed() {
    var _this = this;
    var _a = posts_store_1.usePostsStore(), posts = _a.posts, setPosts = _a.setPosts, loading = _a.loading, setLoading = _a.setLoading, error = _a.error, setError = _a.setError;
    var _b = use_create_post_1.useCreatePost(), createPost = _b.createPost, isSubmitting = _b.isSubmitting;
    var authenticated = react_auth_1.usePrivy().authenticated;
    var _c = react_1.useState(false), mounted = _c[0], setMounted = _c[1];
    var fetchPosts = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, orbisPosts, orbisError, transformedPosts, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (loading)
                        return [2 /*return*/]; // Prevent multiple simultaneous fetches
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:post'
                        })];
                case 2:
                    _a = _b.sent(), orbisPosts = _a.data, orbisError = _a.error;
                    if (orbisError) {
                        throw new Error(orbisError);
                    }
                    if (!orbisPosts) {
                        setPosts([]);
                        return [2 /*return*/];
                    }
                    transformedPosts = orbisPosts.map(function (post) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        return ({
                            id: post.stream_id,
                            content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                            author: {
                                id: ((_b = post.creator_details) === null || _b === void 0 ? void 0 : _b.did) || '',
                                name: ((_d = (_c = post.creator_details) === null || _c === void 0 ? void 0 : _c.profile) === null || _d === void 0 ? void 0 : _d.username) || 'Anonymous',
                                username: ((_f = (_e = post.creator_details) === null || _e === void 0 ? void 0 : _e.profile) === null || _f === void 0 ? void 0 : _f.username) || 'anonymous',
                                avatar: ((_h = (_g = post.creator_details) === null || _g === void 0 ? void 0 : _g.profile) === null || _h === void 0 ? void 0 : _h.pfp) || "https://api.dicebear.com/7.x/avatars/svg?seed=" + ((_j = post.creator_details) === null || _j === void 0 ? void 0 : _j.did),
                                verified: ((_l = (_k = post.creator_details) === null || _k === void 0 ? void 0 : _k.profile) === null || _l === void 0 ? void 0 : _l.verified) || false
                            },
                            timestamp: post.timestamp || Date.now(),
                            stats: {
                                likes: post.count_likes || 0,
                                comments: post.count_replies || 0,
                                reposts: 0
                            }
                        });
                    });
                    setPosts(transformedPosts);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    console.error('Error fetching posts:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to fetch posts');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Initialize component
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    // Fetch posts when component mounts
    react_1.useEffect(function () {
        if (mounted) {
            fetchPosts();
        }
    }, [mounted]);
    var handleCreatePost = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!authenticated)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, createPost(content)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchPosts()];
                case 3:
                    _a.sent(); // Refresh posts after creating new one
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.error('Error creating post:', err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "max-w-2xl mx-auto" },
        authenticated && (React.createElement("div", { className: "hidden md:block sticky top-0 z-10 bg-background border-b border-border p-4" },
            React.createElement(compose_box_1.ComposeBox, { onSubmit: handleCreatePost, isSubmitting: isSubmitting }))),
        React.createElement("div", { className: "divide-y divide-border" }, loading ? (React.createElement("div", { className: "flex items-center justify-center p-8" },
            React.createElement(spinner_1.Spinner, null))) : error ? (React.createElement("div", { className: "p-4 text-destructive text-center" },
            React.createElement("p", { className: "font-medium" }, "Something went wrong"),
            React.createElement("p", { className: "text-sm" }, error))) : posts.length === 0 ? (React.createElement("div", { className: "p-8 text-center text-muted-foreground" }, "No posts yet. Be the first to post!")) : (posts.map(function (post) { return (React.createElement(post_card_1.PostCard, { key: post.id, post: post })); })))));
}
exports.HomeFeed = HomeFeed;
