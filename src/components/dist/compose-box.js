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
exports.ComposeBox = void 0;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var textarea_1 = require("@/components/ui/textarea");
var wagmi_1 = require("wagmi");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
var points_provider_1 = require("@/providers/points-provider");
function ComposeBox(_a) {
    var _this = this;
    var onSubmit = _a.onSubmit, isSubmitting = _a.isSubmitting, _b = _a.placeholder, placeholder = _b === void 0 ? "What's happening?" : _b, _c = _a.maxLength, maxLength = _c === void 0 ? 280 : _c, _d = _a.autoFocus, autoFocus = _d === void 0 ? false : _d;
    var _e = react_1.useState(''), content = _e[0], setContent = _e[1];
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var actions = points_provider_1.usePoints().actions;
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!content.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, onSubmit(content)];
                case 2:
                    _a.sent();
                    setContent('');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Submit error:', error_1);
                    toast({
                        title: "Error",
                        description: error_1 instanceof Error ? error_1.message : "Failed to submit",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("form", { onSubmit: handleSubmit, className: "w-full bg-[#0C0A09] rounded-lg" },
        React.createElement("div", { className: "flex gap-1 p-6 rounded-2x1" },
            React.createElement(avatar_1.Avatar, { className: "h-8 w-8" },
                React.createElement(avatar_1.AvatarImage, { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + address }),
                React.createElement(avatar_1.AvatarFallback, null, "You")),
            React.createElement("div", { className: "flex-1 space-y-4" },
                React.createElement(textarea_1.Textarea, { value: content, onChange: function (e) { return setContent(e.target.value); }, placeholder: placeholder, className: "min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-zinc-500", maxLength: maxLength, autoFocus: autoFocus, disabled: isSubmitting }),
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", { className: "flex items-center gap-1" }),
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("span", { className: "text-xs text-zinc-500" },
                            content.length,
                            "/",
                            maxLength),
                        React.createElement(button_1.Button, { type: "submit", disabled: !content.trim() || isSubmitting, className: "bg-primary hover:bg-zinc-200 text-zinc-900 h-8 px-4 text-sm rounded-full disabled:bg-zinc-100/10 disabled:text-zinc-500" }, isSubmitting ? (React.createElement(lucide_react_1.Loader2, { className: "h-3 w-3 animate-spin" })) : ('Post'))))))));
}
exports.ComposeBox = ComposeBox;
