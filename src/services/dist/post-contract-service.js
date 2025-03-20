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
exports.PostContractService = void 0;
var orbis_sdk_1 = require("@orbisclub/orbis-sdk");
var ethers_1 = require("ethers");
var PostRegistry_1 = require("../contracts/PostRegistry");
var EAS_1 = require("../contracts/EAS");
var PostContractService = /** @class */ (function () {
    function PostContractService() {
        this.signer = null;
        this.orbis = new orbis_sdk_1.Orbis({
            useLit: false,
            node: "https://node2.orbis.club",
            PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
            CERAMIC_NODE: "https://node2.orbis.club"
        });
        if (typeof window !== 'undefined' && window.ethereum) {
            // Initialize Orbis connection only in browser environment
            this.orbis.connect_v2({ provider: window.ethereum })["catch"](function (error) {
                console.error('Failed to connect to Orbis:', error);
            });
            // Browser environment - use window.ethereum
            this.provider = new ethers_1.ethers.BrowserProvider(window.ethereum);
            this.initializeSigner();
        }
        else {
            // Fallback for non-browser environment
            this.provider = new ethers_1.ethers.JsonRpcProvider("https://sepolia.optimism.io/v1/rpc");
            this.contract = new PostRegistry_1.PostRegistry(this.provider);
            this.eas = new EAS_1.EAS(this.provider);
        }
    }
    PostContractService.prototype.initializeSigner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.provider.getSigner()];
                    case 1:
                        _a.signer = _b.sent();
                        this.contract = new PostRegistry_1.PostRegistry(this.signer);
                        this.eas = new EAS_1.EAS(this.signer);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Failed to initialize signer:', error_1);
                        // Fallback to provider-only mode
                        this.contract = new PostRegistry_1.PostRegistry(this.provider);
                        this.eas = new EAS_1.EAS(this.provider);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostContractService.prototype.createPost = function (content, hashtags) {
        if (hashtags === void 0) { hashtags = []; }
        return __awaiter(this, void 0, void 0, function () {
            var connectionStatus, connectResult, orbisResult, attestationData, _a, _b, _c, _d, tx, receipt, attestationUID, error_2, connectionStatus_1, connectResult, originalPost, repostContent, orbisResult, attestationData, _e, _f, _g, _h, tx, receipt, connectionStatus_2, connectResult, orbisResult, attestationData, _j, _k, _l, _m, tx, receipt;
            var _this = this;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4 /*yield*/, this.orbis.isConnected()];
                    case 1:
                        connectionStatus = (_o.sent()).status;
                        if (!!connectionStatus) return [3 /*break*/, 33];
                        if (!(typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 12];
                        if (!(typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.orbis.connect_v2({ provider: window.ethereum })];
                    case 2:
                        connectResult = _o.sent();
                        if (!connectResult.status) {
                            throw new Error('Failed to connect to Orbis. Please check your wallet connection.');
                        }
                        _o.label = 3;
                    case 3: return [4 /*yield*/, this.orbis.createPost({
                            body: content,
                            context: 'youbuidl:post',
                            tags: hashtags
                        })["catch"](function (error) {
                            console.error('Orbis createPost error:', error);
                            throw new Error("Failed to create post on Orbis: " + (error.message || 'Unknown error'));
                        })];
                    case 4:
                        orbisResult = _o.sent();
                        if (!orbisResult || orbisResult.status !== 200) {
                            throw new Error("Failed to create post on Orbis: " + ((orbisResult === null || orbisResult === void 0 ? void 0 : orbisResult.error) || 'Unknown error'));
                        }
                        _o.label = 5;
                    case 5:
                        _o.trys.push([5, 11, , 12]);
                        if (!!this.signer) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.initializeSigner()];
                    case 6:
                        _o.sent();
                        if (!this.signer) {
                            throw new Error('Failed to initialize signer. Please check your wallet connection.');
                        }
                        _o.label = 7;
                    case 7:
                        _b = (_a = ethers_1.ethers.AbiCoder.defaultAbiCoder()).encode;
                        _c = [["string", "address", "uint256"]];
                        _d = [orbisResult.doc];
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 8:
                        attestationData = _b.apply(_a, _c.concat([_d.concat([_o.sent(), Date.now()])]));
                        return [4 /*yield*/, this.contract.createPost(orbisResult.doc)];
                    case 9:
                        tx = _o.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 10:
                        receipt = _o.sent();
                        attestationUID = receipt.logs[0].topics[1];
                        return [2 /*return*/, {
                                streamId: orbisResult.doc,
                                transactionHash: receipt.transactionHash,
                                attestationUID: attestationUID,
                                timestamp: Date.now()
                            }];
                    case 11:
                        error_2 = _o.sent();
                        console.error('Failed to store post on Optimism:', error_2);
                        throw error_2;
                    case 12:
                        async;
                        likePost = function (postId) { return __awaiter(_this, void 0, void 0, function () {
                            var connectionStatus, connectResult, likeResult, tx, receipt, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.orbis.isConnected()];
                                    case 1:
                                        connectionStatus = (_a.sent()).status;
                                        if (!!connectionStatus) return [3 /*break*/, 3];
                                        if (!(typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.orbis.connect_v2({ provider: window.ethereum })];
                                    case 2:
                                        connectResult = _a.sent();
                                        if (!connectResult.status) {
                                            throw new Error('Failed to connect to Orbis. Please check your wallet connection.');
                                        }
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 9, , 10]);
                                        return [4 /*yield*/, this.orbis.react(postId, 'like')];
                                    case 4:
                                        likeResult = _a.sent();
                                        if (!likeResult || likeResult.status !== 200) {
                                            throw new Error("Failed to like post on Orbis: " + ((likeResult === null || likeResult === void 0 ? void 0 : likeResult.error) || 'Unknown error'));
                                        }
                                        if (!!this.signer) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.initializeSigner()];
                                    case 5:
                                        _a.sent();
                                        if (!this.signer) {
                                            throw new Error('Failed to initialize signer. Please check your wallet connection.');
                                        }
                                        _a.label = 6;
                                    case 6: return [4 /*yield*/, this.contract.likePost(postId)];
                                    case 7:
                                        tx = _a.sent();
                                        return [4 /*yield*/, tx.wait()];
                                    case 8:
                                        receipt = _a.sent();
                                        return [2 /*return*/, {
                                                success: true,
                                                transactionHash: receipt.transactionHash,
                                                timestamp: Date.now()
                                            }];
                                    case 9:
                                        error_3 = _a.sent();
                                        console.error('Failed to like post:', error_3);
                                        throw error_3;
                                    case 10: return [2 /*return*/];
                                }
                            });
                        }); };
                        async;
                        repost(postId, string);
                        return [4 /*yield*/, this.orbis.isConnected()];
                    case 13:
                        connectionStatus_1 = (_o.sent()).status;
                        if (!!connectionStatus_1) return [3 /*break*/, 23];
                        if (!(typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.orbis.connect_v2({ provider: window.ethereum })];
                    case 14:
                        connectResult = _o.sent();
                        if (!connectResult.status) {
                            throw new Error('Failed to connect to Orbis. Please check your wallet connection.');
                        }
                        _o.label = 15;
                    case 15: return [4 /*yield*/, this.orbis.getPost(postId)];
                    case 16:
                        originalPost = _o.sent();
                        if (!originalPost || originalPost.status !== 200) {
                            throw new Error('Failed to fetch original post');
                        }
                        repostContent = {
                            body: originalPost.data.content.body,
                            context: 'youbuidl:repost',
                            master: postId,
                            repost: true
                        };
                        return [4 /*yield*/, this.orbis.createPost(repostContent)["catch"](function (error) {
                                console.error('Orbis repost error:', error);
                                throw new Error("Failed to repost on Orbis: " + (error.message || 'Unknown error'));
                            })];
                    case 17:
                        orbisResult = _o.sent();
                        if (!orbisResult || orbisResult.status !== 200) {
                            throw new Error("Failed to repost on Orbis: " + ((orbisResult === null || orbisResult === void 0 ? void 0 : orbisResult.error) || 'Unknown error'));
                        }
                        if (!!this.signer) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.initializeSigner()];
                    case 18:
                        _o.sent();
                        if (!this.signer) {
                            throw new Error('Failed to initialize signer. Please check your wallet connection.');
                        }
                        _o.label = 19;
                    case 19:
                        _f = (_e = ethers_1.ethers.AbiCoder.defaultAbiCoder()).encode;
                        _g = [["string", "address", "uint256", "string"]];
                        _h = [orbisResult.doc];
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 20:
                        attestationData = _f.apply(_e, _g.concat([_h.concat([_o.sent(), Date.now(), postId])]));
                        return [4 /*yield*/, this.contract.repost(postId, orbisResult.doc)];
                    case 21:
                        tx = _o.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 22:
                        receipt = _o.sent();
                        return [2 /*return*/, {
                                postId: orbisResult.doc,
                                attestationUID: receipt.logs[0].topics[1]
                            }];
                    case 23:
                        async;
                        commentOnPost(postId, string, content, string);
                        return [4 /*yield*/, this.orbis.isConnected()];
                    case 24:
                        connectionStatus_2 = (_o.sent()).status;
                        if (!!connectionStatus_2) return [3 /*break*/, 33];
                        if (!(typeof window !== 'undefined' && window.ethereum)) return [3 /*break*/, 26];
                        return [4 /*yield*/, this.orbis.connect_v2({ provider: window.ethereum })];
                    case 25:
                        connectResult = _o.sent();
                        if (!connectResult.status) {
                            throw new Error('Failed to connect to Orbis. Please check your wallet connection.');
                        }
                        _o.label = 26;
                    case 26: return [4 /*yield*/, this.orbis.createPost({
                            body: content,
                            context: 'youbuidl:comment',
                            master: postId,
                            reply_to: postId
                        })["catch"](function (error) {
                            console.error('Orbis comment error:', error);
                            throw new Error("Failed to create comment on Orbis: " + (error.message || 'Unknown error'));
                        })];
                    case 27:
                        orbisResult = _o.sent();
                        if (!orbisResult || orbisResult.status !== 200) {
                            throw new Error("Failed to create comment on Orbis: " + ((orbisResult === null || orbisResult === void 0 ? void 0 : orbisResult.error) || 'Unknown error'));
                        }
                        if (!!this.signer) return [3 /*break*/, 29];
                        return [4 /*yield*/, this.initializeSigner()];
                    case 28:
                        _o.sent();
                        if (!this.signer) {
                            throw new Error('Failed to initialize signer. Please check your wallet connection.');
                        }
                        _o.label = 29;
                    case 29:
                        _k = (_j = ethers_1.ethers.AbiCoder.defaultAbiCoder()).encode;
                        _l = [["string", "address", "uint256", "string"]];
                        _m = [orbisResult.doc];
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 30:
                        attestationData = _k.apply(_j, _l.concat([_m.concat([_o.sent(), Date.now(), postId])]));
                        return [4 /*yield*/, this.contract.comment(postId, orbisResult.doc)];
                    case 31:
                        tx = _o.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 32:
                        receipt = _o.sent();
                        return [2 /*return*/, {
                                commentId: orbisResult.doc,
                                attestationUID: receipt.logs[0].topics[1]
                            }];
                    case 33: return [2 /*return*/];
                }
            });
        });
    };
    return PostContractService;
}());
exports.PostContractService = PostContractService;
