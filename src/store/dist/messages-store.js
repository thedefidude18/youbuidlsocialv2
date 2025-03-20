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
exports.useMessagesStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
var orbis_1 = require("@/lib/orbis");
exports.useMessagesStore = zustand_1.create()(middleware_1.persist(function (set, get) { return ({
    threads: [],
    messages: {},
    unreadCount: 0,
    activeThread: null,
    isLoading: false,
    error: null,
    setActiveThread: function (threadId) { return set({ activeThread: threadId }); },
    sendMessage: function (content, recipientDid) { return __awaiter(void 0, void 0, void 0, function () {
        var res, message_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    set({ isLoading: true, error: null });
                    return [4 /*yield*/, orbis_1.orbis.createPost({
                            body: content,
                            context: 'youbuidl:dm',
                            encrypted_to: recipientDid
                        })];
                case 1:
                    res = _a.sent();
                    if (res.status !== 200) {
                        throw new Error(res.error || 'Failed to send message');
                    }
                    message_1 = {
                        id: res.doc,
                        content: content,
                        timestamp: new Date().toISOString(),
                        sender: {
                            did: res.did
                        },
                        recipient: {
                            did: recipientDid
                        },
                        streamId: res.doc,
                        read: true
                    };
                    set(function (state) {
                        var _a;
                        return ({
                            messages: __assign(__assign({}, state.messages), (_a = {}, _a[recipientDid] = __spreadArrays((state.messages[recipientDid] || []), [message_1]), _a))
                        });
                    });
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    set({ error: error_1.message });
                    return [3 /*break*/, 4];
                case 3:
                    set({ isLoading: false });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchThreads: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, threads, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    set({ isLoading: true, error: null });
                    return [4 /*yield*/, orbis_1.orbis.getDMs()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    threads = data.map(function (thread) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return ({
                            id: thread.stream_id,
                            participants: [
                                { did: thread.creator, username: (_b = (_a = thread.creator_details) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.username },
                                { did: thread.recipient, username: (_d = (_c = thread.recipient_details) === null || _c === void 0 ? void 0 : _c.profile) === null || _d === void 0 ? void 0 : _d.username }
                            ],
                            lastMessage: {
                                id: thread.stream_id,
                                content: ((_e = thread.content) === null || _e === void 0 ? void 0 : _e.body) || '',
                                timestamp: thread.timestamp,
                                sender: {
                                    did: thread.creator,
                                    username: (_g = (_f = thread.creator_details) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.username
                                },
                                recipient: {
                                    did: thread.recipient,
                                    username: (_j = (_h = thread.recipient_details) === null || _h === void 0 ? void 0 : _h.profile) === null || _j === void 0 ? void 0 : _j.username
                                },
                                read: thread.read || false
                            },
                            updatedAt: thread.timestamp
                        });
                    });
                    set({ threads: threads });
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _b.sent();
                    set({ error: error_2.message });
                    return [3 /*break*/, 4];
                case 3:
                    set({ isLoading: false });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchMessages: function (threadId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, messages_1, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    set({ isLoading: true, error: null });
                    return [4 /*yield*/, orbis_1.orbis.getMessages(threadId)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw new Error(error.message);
                    messages_1 = data.map(function (msg) {
                        var _a, _b, _c, _d, _e;
                        return ({
                            id: msg.stream_id,
                            content: ((_a = msg.content) === null || _a === void 0 ? void 0 : _a.body) || '',
                            timestamp: msg.timestamp,
                            sender: {
                                did: msg.creator,
                                username: (_c = (_b = msg.creator_details) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.username
                            },
                            recipient: {
                                did: msg.recipient,
                                username: (_e = (_d = msg.recipient_details) === null || _d === void 0 ? void 0 : _d.profile) === null || _e === void 0 ? void 0 : _e.username
                            },
                            streamId: msg.stream_id,
                            read: msg.read || false
                        });
                    });
                    set(function (state) {
                        var _a;
                        return ({
                            messages: __assign(__assign({}, state.messages), (_a = {}, _a[threadId] = messages_1, _a))
                        });
                    });
                    return [3 /*break*/, 4];
                case 2:
                    error_3 = _b.sent();
                    set({ error: error_3.message });
                    return [3 /*break*/, 4];
                case 3:
                    set({ isLoading: false });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    markThreadAsRead: function (threadId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, orbis_1.orbis.updateMessage(threadId, { read: true })];
                case 1:
                    _a.sent();
                    set(function (state) {
                        var messages = __assign({}, state.messages);
                        if (messages[threadId]) {
                            messages[threadId] = messages[threadId].map(function (msg) { return (__assign(__assign({}, msg), { read: true })); });
                        }
                        var unreadCount = Object.values(messages)
                            .flat()
                            .filter(function (msg) { return !msg.read; }).length;
                        return { messages: messages, unreadCount: unreadCount };
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    set({ error: error_4.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }
}); }, {
    name: 'messages-storage'
}));
