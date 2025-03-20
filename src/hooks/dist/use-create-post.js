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
exports.useCreatePost = void 0;
var react_1 = require("react");
var use_toast_1 = require("@/hooks/use-toast");
var wagmi_1 = require("wagmi");
var posts_store_1 = require("@/store/posts-store");
var orbis_1 = require("@/lib/orbis");
function useCreatePost() {
    var _this = this;
    var _a = react_1.useState(false), isSubmitting = _a[0], setIsSubmitting = _a[1];
    var address = wagmi_1.useAccount().address;
    var addPost = posts_store_1.usePostsStore().addPost;
    var toast = use_toast_1.useToast().toast;
    var createPost = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var orbisResult, newPost, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!address) {
                        toast({
                            title: "Error",
                            description: "Please connect your wallet",
                            variant: "destructive"
                        });
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsSubmitting(true);
                    return [4 /*yield*/, orbis_1.createPost(content)];
                case 2:
                    orbisResult = _a.sent();
                    if (!orbisResult || orbisResult.status !== 200) {
                        throw new Error((orbisResult === null || orbisResult === void 0 ? void 0 : orbisResult.error) || 'Failed to create post on Orbis');
                    }
                    newPost = {
                        id: orbisResult.doc,
                        content: content,
                        author: {
                            id: address.toLowerCase(),
                            name: address.slice(0, 6) + '...' + address.slice(-4),
                            username: address.toLowerCase(),
                            avatar: '',
                            verified: true
                        },
                        timestamp: Date.now(),
                        stats: {
                            likes: 0,
                            comments: 0,
                            reposts: 0
                        },
                        stream_id: orbisResult.doc,
                        creator_details: {
                            did: address.toLowerCase(),
                            profile: {
                                username: address.toLowerCase()
                            }
                        }
                    };
                    // Add to local store
                    addPost(newPost);
                    toast({
                        title: "Success",
                        description: "Post created successfully"
                    });
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating post:', error_1);
                    toast({
                        title: "Error",
                        description: error_1 instanceof Error ? error_1.message : "Failed to create post",
                        variant: "destructive"
                    });
                    return [2 /*return*/, false];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        createPost: createPost,
        isSubmitting: isSubmitting
    };
}
exports.useCreatePost = useCreatePost;
