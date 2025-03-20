'use client';
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
exports.useAuth = exports.AuthProvider = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var siwe_1 = require("siwe");
var orbis_sdk_1 = require("@orbisclub/orbis-sdk");
var AuthContext = react_1.createContext({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    signIn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    signOut: function () { }
});
function AuthProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = wagmi_1.useAccount(), address = _b.address, isConnected = _b.isConnected;
    var signMessageAsync = wagmi_1.useSignMessage().signMessageAsync;
    var chainId = wagmi_1.useChainId();
    var config = wagmi_1.useConfig();
    var orbis = new orbis_sdk_1.Orbis({
        useLit: false,
        node: "https://node2.orbis.club",
        PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
        CERAMIC_NODE: "https://node2.orbis.club"
    });
    var _c = react_1.useState(false), isAuthenticated = _c[0], setIsAuthenticated = _c[1];
    var _d = react_1.useState(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = react_1.useState(null), user = _e[0], setUser = _e[1];
    var _f = react_1.useState(false), isAuthenticating = _f[0], setIsAuthenticating = _f[1];
    // Check session when wallet connection changes
    react_1.useEffect(function () {
        if (isConnected && address) {
            checkSession();
        }
        else {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
        }
    }, [isConnected, address]);
    var checkSession = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, session, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 8]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch('/api/auth/session')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    session = _a.sent();
                    if (!(session.authenticated && session.address === address)) return [3 /*break*/, 4];
                    setIsAuthenticated(true);
                    return [4 /*yield*/, fetchUserProfile()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setIsAuthenticated(false);
                    setUser(null);
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Session check failed:', error_1);
                    setIsAuthenticated(false);
                    setUser(null);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var fetchUserProfile = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, userData, newProfile, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!address)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch("/api/users/" + address)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    userData = _a.sent();
                    setUser(__assign(__assign({}, userData), { address: address, joinedDate: userData.joinedDate || new Date().toISOString() }));
                    return [3 /*break*/, 6];
                case 4:
                    if (!(response.status === 404)) return [3 /*break*/, 6];
                    return [4 /*yield*/, createUserProfile(address)];
                case 5:
                    newProfile = _a.sent();
                    setUser(newProfile);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error('Failed to fetch user profile:', error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var createUserProfile = function (walletAddress) { return __awaiter(_this, void 0, Promise, function () {
        var randomAvatar, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomAvatar = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=" + walletAddress;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                address: walletAddress,
                                name: "User_" + walletAddress.substring(2, 8),
                                username: ("user_" + walletAddress.substring(2, 8)).toLowerCase(),
                                avatar: randomAvatar,
                                verified: false,
                                posts: 0,
                                joinedDate: new Date().toISOString()
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to create user profile');
                    }
                    return [4 /*yield*/, response.json()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_3 = _a.sent();
                    console.error('Failed to create user profile:', error_3);
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var signIn = function () { return __awaiter(_this, void 0, void 0, function () {
        var nonceRes, nonce, message, signature, verifyRes, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!address || isAuthenticating || !config)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, 10, 11]);
                    setIsAuthenticating(true);
                    return [4 /*yield*/, fetch('/api/auth/nonce')];
                case 2:
                    nonceRes = _a.sent();
                    return [4 /*yield*/, nonceRes.text()];
                case 3:
                    nonce = _a.sent();
                    message = new siwe_1.SiweMessage({
                        domain: window.location.host,
                        address: address,
                        statement: 'Sign in with Ethereum to the application.',
                        uri: window.location.origin,
                        version: '1',
                        chainId: chainId,
                        nonce: nonce
                    });
                    return [4 /*yield*/, signMessageAsync({
                            message: message.prepareMessage(),
                            account: address
                        })];
                case 4:
                    signature = _a.sent();
                    return [4 /*yield*/, fetch('/api/auth/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ message: message, signature: signature })
                        })];
                case 5:
                    verifyRes = _a.sent();
                    if (!verifyRes.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, verifyRes.json()];
                case 6:
                    result = _a.sent();
                    if (!result.success) return [3 /*break*/, 8];
                    setIsAuthenticated(true);
                    return [4 /*yield*/, fetchUserProfile()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
                case 8: throw new Error('Verification failed');
                case 9:
                    error_4 = _a.sent();
                    console.error('Sign in failed:', error_4);
                    setIsAuthenticated(false);
                    setUser(null);
                    return [3 /*break*/, 11];
                case 10:
                    setIsAuthenticating(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var signOut = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    return [4 /*yield*/, fetch('/api/auth/signout', { method: 'POST' })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    setIsAuthenticated(false);
                    setUser(null);
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(AuthContext.Provider, { value: { isAuthenticated: isAuthenticated, isLoading: isLoading, user: user, signIn: signIn, signOut: signOut } }, children));
}
exports.AuthProvider = AuthProvider;
function useAuth() {
    return react_1.useContext(AuthContext);
}
exports.useAuth = useAuth;
