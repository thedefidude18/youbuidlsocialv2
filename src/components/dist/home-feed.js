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
function HomeFeed() {
    var _this = this;
    var _a = posts_store_1.usePostsStore(), posts = _a.posts, setPosts = _a.setPosts, loading = _a.loading, setLoading = _a.setLoading, error = _a.error, setError = _a.setError;
    var _b = use_create_post_1.useCreatePost(), createPost = _b.createPost, isSubmitting = _b.isSubmitting;
    var fetchPosts = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, orbisPosts, orbisError, transformedPosts, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:post'
                        })];
                case 1:
                    _a = _b.sent(), orbisPosts = _a.data, orbisError = _a.error;
                    if (orbisError) {
                        throw new Error(orbisError);
                    }
                    transformedPosts = orbisPosts
                        .map(function (post) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                        return ({
                            id: post.stream_id,
                            content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                            author: {
                                id: ((_b = post.creator_details) === null || _b === void 0 ? void 0 : _b.did) || '',
                                name: ((_d = (_c = post.creator_details) === null || _c === void 0 ? void 0 : _c.profile) === null || _d === void 0 ? void 0 : _d.username) || ((_f = (_e = post.creator_details) === null || _e === void 0 ? void 0 : _e.did) === null || _f === void 0 ? void 0 : _f.slice(0, 6)) + '...',
                                username: ((_h = (_g = post.creator_details) === null || _g === void 0 ? void 0 : _g.profile) === null || _h === void 0 ? void 0 : _h.username) || ((_j = post.creator_details) === null || _j === void 0 ? void 0 : _j.did),
                                avatar: ((_l = (_k = post.creator_details) === null || _k === void 0 ? void 0 : _k.profile) === null || _l === void 0 ? void 0 : _l.pfp) || '',
                                verified: ((_o = (_m = post.creator_details) === null || _m === void 0 ? void 0 : _m.profile) === null || _o === void 0 ? void 0 : _o.verified) || false
                            },
                            timestamp: Number(post.timestamp) * 1000,
                            stats: {
                                likes: post.count_likes || 0,
                                comments: post.count_replies || 0,
                                reposts: post.count_haha || 0
                            }
                        });
                    })
                        .sort(function (a, b) { return b.timestamp - a.timestamp; });
                    setPosts(transformedPosts);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    console.error('Error fetching posts:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to fetch posts');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchPosts();
    }, []); // Run once on mount
    var handleCreatePost = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createPost(content)];
                case 1:
                    success = _a.sent();
                    if (!success) return [3 /*break*/, 3];
                    // Refresh posts after successful creation
                    return [4 /*yield*/, fetchPosts()];
                case 2:
                    // Refresh posts after successful creation
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "max-w-2xl mx-auto" },
        React.createElement("div", { className: "hidden md:block sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4" },
            React.createElement(compose_box_1.ComposeBox, { onSubmit: handleCreatePost, isSubmitting: isSubmitting })),
        React.createElement("div", { className: "divide-y divide-gray-200 dark:divide-gray-800" }, loading ? (React.createElement("div", { className: "flex items-center justify-center p-8" },
            React.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" }))) : error ? (React.createElement("div", { className: "p-4 text-red-500 text-center" },
            React.createElement("p", { className: "font-medium" }, "Something went wrong"),
            React.createElement("p", { className: "text-sm" }, error))) : posts.length === 0 ? (React.createElement("div", { className: "p-8 text-center text-gray-500" }, "No posts yet. Be the first to post!")) : (posts.map(function (post) { return (React.createElement(post_card_1.PostCard, { key: post.id, post: post })); })))));
}
exports.HomeFeed = HomeFeed;
