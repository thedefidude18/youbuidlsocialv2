"use strict";
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
exports.usePostInteractions = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var use_toast_1 = require("@/hooks/use-toast");
var orbis_1 = require("@/lib/orbis");
var posts_store_1 = require("@/store/posts-store");
function usePostInteractions(postId) {
    var _this = this;
    var _a = wagmi_1.useAccount(), address = _a.address, isConnected = _a.isConnected;
    var toast = use_toast_1.useToast().toast;
    var _b = react_1.useState(false), isProcessing = _b[0], setIsProcessing = _b[1];
    var updatePost = posts_store_1.usePostsStore().updatePost;
    var ensureOrbisConnection = function () { return __awaiter(_this, void 0, void 0, function () {
        var isConnected, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orbis_1.orbis.isConnected()];
                case 1:
                    isConnected = (_a.sent()).status;
                    if (!(!isConnected && typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 3];
                    return [4 /*yield*/, orbis_1.orbis.connect_v2({
                            provider: window.ethereum,
                            chain: 'ethereum'
                        })];
                case 2:
                    result = _a.sent();
                    if (!result.status) {
                        throw new Error('Failed to connect to Orbis');
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, true];
            }
        });
    }); };
    var checkWalletConnection = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!address || !isConnected) {
                toast({
                    title: "Authentication Required",
                    description: "Please connect your wallet to continue",
                    variant: "destructive"
                });
                return [2 /*return*/, false];
            }
            return [2 /*return*/, true];
        });
    }); };
    var like = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkWalletConnection()];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, false];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 7]);
                    setIsProcessing(true);
                    // Ensure Orbis connection before liking
                    return [4 /*yield*/, ensureOrbisConnection()];
                case 3:
                    // Ensure Orbis connection before liking
                    _a.sent();
                    return [4 /*yield*/, orbis_1.likePost(postId)];
                case 4:
                    result = _a.sent();
                    if (!result || result.status !== 200) {
                        throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'Failed to like post');
                    }
                    // Update post in local store
                    updatePost(postId, function (post) { return (__assign(__assign({}, post), { stats: __assign(__assign({}, post.stats), { likes: post.stats.likes + 1 }) })); });
                    return [2 /*return*/, true];
                case 5:
                    error_1 = _a.sent();
                    console.error('Like error:', error_1);
                    toast({
                        title: "Error",
                        description: error_1 instanceof Error ? error_1.message : "Failed to like post",
                        variant: "destructive"
                    });
                    throw error_1;
                case 6:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var repost = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkWalletConnection()];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, false];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    setIsProcessing(true);
                    return [4 /*yield*/, orbis_1.orbis.createPost({
                            context: 'youbuidl:repost',
                            master: postId
                        })];
                case 3:
                    result = _a.sent();
                    if (!result || result.status !== 200) {
                        throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'Failed to repost');
                    }
                    // Update post in local store
                    updatePost(postId, function (post) { return (__assign(__assign({}, post), { stats: __assign(__assign({}, post.stats), { reposts: post.stats.reposts + 1 }) })); });
                    return [2 /*return*/, true];
                case 4:
                    error_2 = _a.sent();
                    console.error('Repost error:', error_2);
                    throw error_2;
                case 5:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var comment = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkWalletConnection()];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, false];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    setIsProcessing(true);
                    return [4 /*yield*/, orbis_1.orbis.createPost({
                            context: 'youbuidl:comment',
                            body: content,
                            master: postId,
                            reply_to: postId
                        })];
                case 3:
                    result = _a.sent();
                    if (!result || result.status !== 200) {
                        throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'Failed to create comment');
                    }
                    // Update post in local store
                    updatePost(postId, function (post) { return (__assign(__assign({}, post), { stats: __assign(__assign({}, post.stats), { comments: post.stats.comments + 1 }) })); });
                    return [2 /*return*/, true];
                case 4:
                    error_3 = _a.sent();
                    console.error('Comment error:', error_3);
                    throw error_3;
                case 5:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var fetchComments = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:comment',
                            master: postId
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error);
                    return [2 /*return*/, data.map(function (comment) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            return ({
                                id: comment.stream_id,
                                content: ((_a = comment.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                                timestamp: comment.timestamp * 1000,
                                author: {
                                    id: comment.creator,
                                    name: ((_c = (_b = comment.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username) ||
                                        ((_d = comment.creator) === null || _d === void 0 ? void 0 : _d.slice(0, 6)) + '...' + ((_e = comment.creator) === null || _e === void 0 ? void 0 : _e.slice(-4)),
                                    username: ((_g = (_f = comment.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username) || comment.creator,
                                    avatar: ((_j = (_h = comment.creator_details) === null || _h === void 0 ? void 0 : _h.profile) === null || _j === void 0 ? void 0 : _j.pfp) || ''
                                },
                                likes: comment.count_likes || 0,
                                isLiked: false
                            });
                        })];
                case 2:
                    error_4 = _b.sent();
                    console.error('Error fetching comments:', error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPost = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, comments, formattedPost, error_5;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 3, 4, 5]);
                    setIsProcessing(true);
                    return [4 /*yield*/, orbis_1.orbis.getPost(postId)];
                case 1:
                    _a = _m.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:comment',
                            master: postId
                        })];
                case 2:
                    comments = (_m.sent()).data;
                    formattedPost = {
                        id: data.stream_id,
                        content: ((_b = data.content) === null || _b === void 0 ? void 0 : _b.body) || '',
                        author: {
                            id: data.creator,
                            name: ((_d = (_c = data.creator_details) === null || _c === void 0 ? void 0 : _c.profile) === null || _d === void 0 ? void 0 : _d.username) ||
                                ((_e = data.creator) === null || _e === void 0 ? void 0 : _e.slice(0, 6)) + '...' + ((_f = data.creator) === null || _f === void 0 ? void 0 : _f.slice(-4)),
                            username: ((_h = (_g = data.creator_details) === null || _g === void 0 ? void 0 : _g.profile) === null || _h === void 0 ? void 0 : _h.username) || data.creator,
                            avatar: ((_k = (_j = data.creator_details) === null || _j === void 0 ? void 0 : _j.profile) === null || _k === void 0 ? void 0 : _k.pfp) || '',
                            verified: false
                        },
                        timestamp: data.timestamp * 1000,
                        stats: {
                            likes: data.count_likes || 0,
                            comments: data.count_replies || 0,
                            reposts: data.count_reposts || 0
                        },
                        ceramicData: ((_l = data.content) === null || _l === void 0 ? void 0 : _l.data) || null,
                        comments: (comments === null || comments === void 0 ? void 0 : comments.map(function (comment) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            return ({
                                id: comment.stream_id,
                                content: ((_a = comment.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                                author: {
                                    id: comment.creator,
                                    name: ((_c = (_b = comment.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username) ||
                                        ((_d = comment.creator) === null || _d === void 0 ? void 0 : _d.slice(0, 6)) + '...' + ((_e = comment.creator) === null || _e === void 0 ? void 0 : _e.slice(-4)),
                                    username: ((_g = (_f = comment.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username) || comment.creator,
                                    avatar: ((_j = (_h = comment.creator_details) === null || _h === void 0 ? void 0 : _h.profile) === null || _j === void 0 ? void 0 : _j.pfp) || '',
                                    verified: false
                                },
                                timestamp: comment.timestamp * 1000,
                                stats: {
                                    likes: comment.count_likes || 0,
                                    comments: comment.count_replies || 0,
                                    reposts: comment.count_reposts || 0
                                }
                            });
                        })) || []
                    };
                    return [2 /*return*/, formattedPost];
                case 3:
                    error_5 = _m.sent();
                    console.error('Fetch post error:', error_5);
                    throw error_5;
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        like: like,
        comment: comment,
        repost: repost,
        fetchComments: fetchComments,
        fetchPost: fetchPost,
        isProcessing: isProcessing
    };
}
exports.usePostInteractions = usePostInteractions;
