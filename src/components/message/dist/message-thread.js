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
exports.MessageThread = void 0;
var react_1 = require("react");
var auth_provider_1 = require("@/providers/auth-provider");
var messages_store_1 = require("@/store/messages-store");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var scroll_area_1 = require("@/components/ui/scroll-area");
var lucide_react_1 = require("lucide-react");
function MessageThread(_a) {
    var _this = this;
    var threadId = _a.threadId;
    var _b = react_1.useState(""), newMessage = _b[0], setNewMessage = _b[1];
    var user = auth_provider_1.useAuth().user;
    var _c = messages_store_1.useMessagesStore(), messages = _c.messages, threads = _c.threads, isLoading = _c.isLoading, error = _c.error, sendMessage = _c.sendMessage, fetchMessages = _c.fetchMessages, markThreadAsRead = _c.markThreadAsRead;
    var thread = threads.find(function (t) { return t.id === threadId; });
    var threadMessages = messages[threadId] || [];
    var recipient = thread === null || thread === void 0 ? void 0 : thread.participants.find(function (p) { return p.did !== (user === null || user === void 0 ? void 0 : user.did); });
    react_1.useEffect(function () {
        if (threadId) {
            fetchMessages(threadId);
            markThreadAsRead(threadId);
        }
    }, [threadId]);
    var handleSend = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newMessage.trim() || !user || !recipient)
                        return [2 /*return*/];
                    return [4 /*yield*/, sendMessage(newMessage, recipient.did)];
                case 1:
                    _a.sent();
                    setNewMessage("");
                    return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (React.createElement("div", { className: "flex-1 flex items-center justify-center" },
            React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin" })));
    }
    if (error) {
        return (React.createElement("div", { className: "flex-1 flex items-center justify-center text-destructive" }, error));
    }
    if (!recipient) {
        return (React.createElement("div", { className: "flex-1 flex items-center justify-center" },
            React.createElement("div", { className: "text-center" },
                React.createElement("h2", { className: "text-xl font-semibold mb-2" }, "Start a conversation"),
                React.createElement("p", { className: "text-muted-foreground" }, "Select a user to start messaging"))));
    }
    return (React.createElement("div", { className: "flex-1 flex flex-col h-full" },
        React.createElement(scroll_area_1.ScrollArea, { className: "flex-1 p-4" },
            React.createElement("div", { className: "space-y-4" }, threadMessages.length === 0 ? (React.createElement("div", { className: "text-center text-muted-foreground py-8" },
                React.createElement("p", null,
                    "This is the beginning of your conversation with ",
                    recipient.name || recipient.did),
                React.createElement("p", { className: "text-sm" }, "Say hello! \uD83D\uDC4B"))) : (threadMessages.map(function (message) { return (React.createElement("div", { key: message.id, className: "flex " + (message.sender.did === (user === null || user === void 0 ? void 0 : user.did) ? 'justify-end' : 'justify-start') },
                React.createElement("div", { className: "max-w-[70%] rounded-lg p-3 " + (message.sender.did === (user === null || user === void 0 ? void 0 : user.did)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted') },
                    React.createElement("p", { className: "text-sm" }, message.content),
                    React.createElement("span", { className: "text-xs opacity-70" }, new Date(message.timestamp).toLocaleTimeString())))); })))),
        React.createElement("div", { className: "p-4 border-t" },
            React.createElement("div", { className: "flex gap-2" },
                React.createElement(input_1.Input, { value: newMessage, onChange: function (e) { return setNewMessage(e.target.value); }, placeholder: "Type a message...", onKeyDown: function (e) {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    } }),
                React.createElement(button_1.Button, { onClick: handleSend, disabled: !newMessage.trim() || isLoading }, isLoading ? (React.createElement(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" })) : ('Send'))))));
}
exports.MessageThread = MessageThread;
