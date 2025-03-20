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
exports.UserSearch = void 0;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var command_1 = require("@/components/ui/command");
var dialog_1 = require("@/components/ui/dialog");
var orbis_1 = require("@/lib/orbis");
var lucide_react_1 = require("lucide-react");
function UserSearch(_a) {
    var _this = this;
    var isOpen = _a.isOpen, onClose = _a.onClose, onSelectUser = _a.onSelectUser;
    var _b = react_1.useState(""), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = react_1.useState([]), users = _c[0], setUsers = _c[1];
    var _d = react_1.useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    react_1.useEffect(function () {
        if (isOpen && searchQuery.length >= 2) {
            searchUsers();
        }
    }, [searchQuery, isOpen]);
    var searchUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error_1, filteredUsers, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    setError(null);
                    return [4 /*yield*/, orbis_1.orbis.getPosts({
                            algorithm: "all-posts",
                            tag: "profile",
                            only_master: true
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error_1 = _a.error;
                    if (error_1)
                        throw new Error(error_1.message);
                    filteredUsers = data
                        .filter(function (user) {
                        var _a, _b, _c;
                        return ((_b = (_a = user.content) === null || _a === void 0 ? void 0 : _a.username) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchQuery.toLowerCase())) || ((_c = user.did) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchQuery.toLowerCase()));
                    })
                        .slice(0, 10);
                    setUsers(filteredUsers);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    setError(err_1.message);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: onClose },
        React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[425px]" },
            React.createElement(dialog_1.DialogHeader, null,
                React.createElement(dialog_1.DialogTitle, null, "New Message")),
            React.createElement(command_1.Command, null,
                React.createElement(command_1.CommandInput, { placeholder: "Search users...", value: searchQuery, onValueChange: setSearchQuery }),
                React.createElement(command_1.CommandList, null, isLoading ? (React.createElement("div", { className: "p-4 text-center" },
                    React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin mx-auto" }))) : error ? (React.createElement("div", { className: "p-4 text-center text-destructive" }, error)) : users.length === 0 ? (React.createElement("div", { className: "p-4 text-center text-muted-foreground" }, searchQuery.length < 2 ? 'Type to search users' : 'No users found')) : (users.map(function (user) {
                    var _a, _b, _c, _d;
                    return (React.createElement(command_1.CommandItem, { key: user.did, onSelect: function () {
                            onSelectUser(user);
                            onClose();
                        }, className: "cursor-pointer" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement(avatar_1.Avatar, null,
                                React.createElement(avatar_1.AvatarImage, { src: (_a = user.content) === null || _a === void 0 ? void 0 : _a.pfp, alt: ((_b = user.content) === null || _b === void 0 ? void 0 : _b.username) || user.did }),
                                React.createElement(avatar_1.AvatarFallback, null, (((_c = user.content) === null || _c === void 0 ? void 0 : _c.username) || user.did).charAt(0))),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium" }, ((_d = user.content) === null || _d === void 0 ? void 0 : _d.username) || user.did.slice(0, 10)),
                                React.createElement("p", { className: "text-sm text-muted-foreground" },
                                    user.did.slice(0, 20),
                                    "...")))));
                })))))));
}
exports.UserSearch = UserSearch;
