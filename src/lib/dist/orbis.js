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
exports.commentOnPost = exports.likePost = exports.getPosts = exports.createPost = exports.connectOrbis = exports.orbis = void 0;
var orbis_sdk_1 = require("@orbisclub/orbis-sdk");
exports.orbis = new orbis_sdk_1.Orbis({
    useLit: false,
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    CERAMIC_NODE: "https://node2.orbis.club"
});
function connectOrbis() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.orbis.connect_v2({
                        provider: window.ethereum,
                        lit: false
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.status === 200];
            }
        });
    });
}
exports.connectOrbis = connectOrbis;
function createPost(content, hashtags) {
    if (hashtags === void 0) { hashtags = []; }
    return __awaiter(this, void 0, void 0, function () {
        var sanitizedContent, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sanitizedContent = content.replace(/<iframe[^>]*(src="https:\/\/[^"]*")[^>]*>[^<]*<\/iframe>/gi, function (match, src) {
                        // Only allow iframes with https sources
                        if (src.startsWith('src="https://')) {
                            return match;
                        }
                        return '';
                    });
                    return [4 /*yield*/, exports.orbis.createPost({
                            body: sanitizedContent,
                            context: 'youbuidl:post',
                            tags: hashtags
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.createPost = createPost;
function getPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.orbis.getPosts({
                            context: 'youbuidl:post'
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw error;
                    }
                    console.log('Raw Orbis posts:', data); // Debug log
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error in getPosts:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPosts = getPosts;
function likePost(postId) {
    return __awaiter(this, void 0, void 0, function () {
        var isConnected, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.orbis.isConnected()];
                case 1:
                    isConnected = (_a.sent()).status;
                    if (!(!isConnected && typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 3];
                    return [4 /*yield*/, exports.orbis.connect_v2({
                            provider: window.ethereum,
                            chain: 'ethereum'
                        })];
                case 2:
                    result = _a.sent();
                    if (!result.status) {
                        throw new Error('Failed to connect to Orbis');
                    }
                    _a.label = 3;
                case 3: return [4 /*yield*/, exports.orbis.react(postId, 'like')];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.likePost = likePost;
function commentOnPost(postId, content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.orbis.createPost({
                        context: 'youbuidl:comment',
                        body: content,
                        master: postId
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.commentOnPost = commentOnPost;
