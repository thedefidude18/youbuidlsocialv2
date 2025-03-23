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
exports.usePosts = void 0;
var react_1 = require("react");
var orbis_1 = require("@/lib/orbis");
function usePosts() {
    var _this = this;
    var _a = react_1.useState([]), posts = _a[0], setPosts = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var refreshPosts = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result, transformedPosts, sortedPosts, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    if (!orbis_1.orbis) {
                        throw new Error('Orbis client not initialized');
                    }
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:post'
                        })];
                case 1:
                    result = _a.sent();
                    if (!result || !result.data) {
                        throw new Error('Invalid response from Orbis');
                    }
                    transformedPosts = result.data.map(function (post) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return ({
                            id: post.stream_id,
                            content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                            author: {
                                id: post.creator,
                                name: ((_c = (_b = post.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username) ||
                                    ((_d = post.creator) === null || _d === void 0 ? void 0 : _d.slice(0, 6)) + '...' + ((_e = post.creator) === null || _e === void 0 ? void 0 : _e.slice(-4)),
                                username: ((_g = (_f = post.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username) || post.creator,
                                avatar: ((_j = (_h = post.creator_details) === null || _h === void 0 ? void 0 : _h.profile) === null || _j === void 0 ? void 0 : _j.pfp) ||
                                    "https://api.dicebear.com/9.x/bottts/svg?seed=" + post.creator,
                                verified: false
                            },
                            timestamp: new Date(post.timestamp * 1000).toISOString(),
                            stats: {
                                likes: post.count_likes || 0,
                                comments: post.count_replies || 0,
                                reposts: post.count_haha || 0
                            }
                        });
                    });
                    sortedPosts = transformedPosts.sort(function (a, b) {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    });
                    setPosts(sortedPosts);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error fetching posts:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to fetch posts');
                    setPosts([]); // Reset posts on error
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var getUserPosts = react_1.useCallback(function (userAddress) { return __awaiter(_this, void 0, void 0, function () {
        var result, transformedPosts, sortedPosts, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    if (!orbis_1.orbis) {
                        throw new Error('Orbis client not initialized');
                    }
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            context: 'youbuidl:post',
                            did: userAddress // Filter posts by user's DID/address
                        })];
                case 1:
                    result = _a.sent();
                    if (!result || !result.data) {
                        throw new Error('Invalid response from Orbis');
                    }
                    transformedPosts = result.data.map(transformPost);
                    sortedPosts = transformedPosts.sort(function (a, b) {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    });
                    setPosts(sortedPosts);
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    console.error('Error fetching user posts:', err_2);
                    setError(err_2 instanceof Error ? err_2.message : 'Failed to fetch user posts');
                    setPosts([]); // Reset posts on error
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        posts: posts,
        loading: loading,
        error: error,
        refreshPosts: refreshPosts,
        getUserPosts: getUserPosts
    };
}
exports.usePosts = usePosts;
