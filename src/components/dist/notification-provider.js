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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useNotifications = exports.NotificationProvider = void 0;
var react_1 = require("react");
var orbis_1 = require("@/lib/orbis");
var wallet_1 = require("@/utils/wallet");
var wagmi_1 = require("wagmi");
var NotificationContext = react_1.createContext({
    notifications: [],
    unreadCount: 0,
    addNotification: function () { },
    markAsRead: function () { },
    markAllAsRead: function () { },
    clearNotifications: function () { },
    fetchNotifications: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }
});
function NotificationProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = react_1.useState(false), mounted = _b[0], setMounted = _b[1];
    var _c = react_1.useState([]), notifications = _c[0], setNotifications = _c[1];
    var _d = react_1.useState(false), isInitialized = _d[0], setIsInitialized = _d[1];
    var isConnected = wagmi_1.useAccount().isConnected;
    var initializeOrbis = function () { return __awaiter(_this, void 0, void 0, function () {
        var provider, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!orbis_1.orbis) {
                        throw new Error("Orbis not initialized");
                    }
                    provider = wallet_1.getEthereumProvider();
                    if (!(provider && isConnected)) return [3 /*break*/, 2];
                    return [4 /*yield*/, orbis_1.orbis.connect_v2({
                            provider: provider,
                            chain: 'ethereum'
                        })];
                case 1:
                    res = _a.sent();
                    if (res === null || res === void 0 ? void 0 : res.status) {
                        setIsInitialized(true);
                        return [2 /*return*/, true];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, false];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to initialize Orbis:", error_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
        var initialized, result, notificationsData, formattedNotifications, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!isConnected) {
                        return [2 /*return*/, []];
                    }
                    if (!!isInitialized) return [3 /*break*/, 2];
                    return [4 /*yield*/, initializeOrbis()];
                case 1:
                    initialized = _a.sent();
                    if (!initialized)
                        return [2 /*return*/, []];
                    _a.label = 2;
                case 2: return [4 /*yield*/, orbis_1.orbis.getNotifications()];
                case 3:
                    result = _a.sent();
                    if (!result || !result.data) {
                        throw new Error("Failed to fetch notifications");
                    }
                    notificationsData = Array.isArray(result.data) ? result.data : [];
                    formattedNotifications = notificationsData.map(function (notification) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                        var type = notification.type || "system";
                        var content = "";
                        var postContent = notification.post_content;
                        switch (type) {
                            case "mention":
                                content = "mentioned you";
                                break;
                            case "like":
                                content = "liked your post";
                                break;
                            case "recast":
                                content = "recasted your post";
                                break;
                            case "follow":
                                content = "followed you";
                                break;
                            case "reply":
                                content = "replied to your post";
                                break;
                            case "channel":
                                content = "invited you to channel " + notification.channelName;
                                break;
                            case "donation":
                                content = "sent you " + ((_a = notification.amount) === null || _a === void 0 ? void 0 : _a.value) + " " + ((_b = notification.amount) === null || _b === void 0 ? void 0 : _b.currency);
                                break;
                            case "points":
                                content = "awarded you " + ((_c = notification.amount) === null || _c === void 0 ? void 0 : _c.value) + " points";
                                break;
                            case "withdrawal":
                                content = (notification.status === "completed" ? "Completed" : "Processing") + " withdrawal of " + ((_d = notification.amount) === null || _d === void 0 ? void 0 : _d.value) + " " + ((_e = notification.amount) === null || _e === void 0 ? void 0 : _e.currency);
                                break;
                        }
                        return {
                            id: notification.stream_id,
                            type: type,
                            user: {
                                name: ((_g = (_f = notification.user_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username) || ((_h = notification.did_details) === null || _h === void 0 ? void 0 : _h.did),
                                username: ((_k = (_j = notification.user_details) === null || _j === void 0 ? void 0 : _j.profile) === null || _k === void 0 ? void 0 : _k.username) || ((_l = notification.did_details) === null || _l === void 0 ? void 0 : _l.did),
                                avatar: ((_o = (_m = notification.user_details) === null || _m === void 0 ? void 0 : _m.profile) === null || _o === void 0 ? void 0 : _o.pfp) || "",
                                verified: ((_q = (_p = notification.user_details) === null || _p === void 0 ? void 0 : _p.profile) === null || _q === void 0 ? void 0 : _q.verified) || false
                            },
                            content: content,
                            postContent: postContent,
                            time: new Date(notification.timestamp).toLocaleString(),
                            isNew: !notification.read
                        };
                    });
                    setNotifications(formattedNotifications);
                    return [2 /*return*/, formattedNotifications];
                case 4:
                    error_2 = _a.sent();
                    console.error("Failed to fetch notifications:", error_2);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        if (!mounted) {
            setMounted(true);
        }
    }, []);
    react_1.useEffect(function () {
        if (mounted && isConnected) {
            initializeOrbis().then(function () {
                fetchNotifications();
            });
        }
        var pollInterval = setInterval(function () {
            if (isInitialized && isConnected) {
                fetchNotifications();
            }
        }, 30000);
        return function () { return clearInterval(pollInterval); };
    }, [mounted, isConnected, isInitialized]);
    var unreadCount = notifications.filter(function (n) { return n.isNew; }).length;
    var addNotification = function (notification) {
        setNotifications(function (prev) { return __spreadArrays([notification], prev); });
    };
    var markAsRead = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!!isInitialized) return [3 /*break*/, 2];
                    return [4 /*yield*/, initializeOrbis()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, orbis_1.orbis.markNotificationAsRead(id)];
                case 3:
                    result = _a.sent();
                    if (!(result === null || result === void 0 ? void 0 : result.status)) {
                        throw new Error("Failed to mark notification as read");
                    }
                    setNotifications(function (prev) {
                        return prev.map(function (notification) {
                            return notification.id === id
                                ? __assign(__assign({}, notification), { isNew: false }) : notification;
                        });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error("Failed to mark notification as read:", error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var markAllAsRead = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!!isInitialized) return [3 /*break*/, 2];
                    return [4 /*yield*/, initializeOrbis()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, orbis_1.orbis.markAllNotificationsAsRead()];
                case 3:
                    result = _a.sent();
                    if (!(result === null || result === void 0 ? void 0 : result.status)) {
                        throw new Error("Failed to mark all notifications as read");
                    }
                    setNotifications(function (prev) {
                        return prev.map(function (notification) { return (__assign(__assign({}, notification), { isNew: false })); });
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Failed to mark all notifications as read:", error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var clearNotifications = function () {
        setNotifications([]);
    };
    return (react_1["default"].createElement(NotificationContext.Provider, { value: {
            notifications: notifications,
            unreadCount: unreadCount,
            addNotification: addNotification,
            markAsRead: markAsRead,
            markAllAsRead: markAllAsRead,
            clearNotifications: clearNotifications,
            fetchNotifications: fetchNotifications
        } }, children));
}
exports.NotificationProvider = NotificationProvider;
function useNotifications() {
    var context = react_1.useContext(NotificationContext);
    return context;
}
exports.useNotifications = useNotifications;
