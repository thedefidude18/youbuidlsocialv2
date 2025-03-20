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
exports.ProfileEditForm = void 0;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var use_toast_1 = require("@/hooks/use-toast");
var auth_provider_1 = require("@/providers/auth-provider");
var dialog_1 = require("@/components/ui/dialog");
var form_1 = require("@/components/ui/form");
var avatar_1 = require("@/components/ui/avatar");
var profileFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    avatar: z.string().url('Please enter a valid URL').optional(),
    bio: z.string().max(160, 'Bio must be less than 160 characters').optional()
});
function ProfileEditForm() {
    var _this = this;
    var _a;
    var _b = auth_provider_1.useAuth(), user = _b.user, updateUser = _b.updateUser;
    var toast = use_toast_1.useToast().toast;
    var _c = react_1.useState(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = react_1.useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(profileFormSchema),
        defaultValues: {
            name: (user === null || user === void 0 ? void 0 : user.name) || '',
            username: (user === null || user === void 0 ? void 0 : user.username) || '',
            avatar: (user === null || user === void 0 ? void 0 : user.avatar) || '',
            bio: (user === null || user === void 0 ? void 0 : user.bio) || ''
        }
    });
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsSubmitting(true);
                    // Here you would typically make an API call to update the user profile
                    return [4 /*yield*/, updateUser(data)];
                case 1:
                    // Here you would typically make an API call to update the user profile
                    _a.sent();
                    toast({
                        title: 'Profile updated',
                        description: 'Your profile has been successfully updated.'
                    });
                    setIsOpen(false);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    toast({
                        title: 'Error',
                        description: 'Failed to update profile. Please try again.',
                        variant: 'destructive'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen },
        React.createElement(dialog_1.DialogTrigger, { asChild: true },
            React.createElement(button_1.Button, { variant: "outline", size: "sm", className: "rounded-full" }, "Edit profile")),
        React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[425px]" },
            React.createElement(dialog_1.DialogHeader, null,
                React.createElement(dialog_1.DialogTitle, null, "Edit profile")),
            React.createElement(form_1.Form, __assign({}, form),
                React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement(avatar_1.Avatar, { className: "h-16 w-16" },
                            React.createElement(avatar_1.AvatarImage, { src: form.watch('avatar') }),
                            React.createElement(avatar_1.AvatarFallback, null, (_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.charAt(0))),
                        React.createElement(form_1.FormField, { control: form.control, name: "avatar", render: function (_a) {
                                var field = _a.field;
                                return (React.createElement(form_1.FormItem, { className: "flex-1" },
                                    React.createElement(form_1.FormLabel, null, "Avatar URL"),
                                    React.createElement(form_1.FormControl, null,
                                        React.createElement(input_1.Input, __assign({ placeholder: "https://example.com/avatar.jpg" }, field))),
                                    React.createElement(form_1.FormMessage, null)));
                            } })),
                    React.createElement(form_1.FormField, { control: form.control, name: "name", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, null,
                                React.createElement(form_1.FormLabel, null, "Name"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Your name" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } }),
                    React.createElement(form_1.FormField, { control: form.control, name: "username", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, null,
                                React.createElement(form_1.FormLabel, null, "Username"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "username" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } }),
                    React.createElement(form_1.FormField, { control: form.control, name: "bio", render: function (_a) {
                            var field = _a.field;
                            return (React.createElement(form_1.FormItem, null,
                                React.createElement(form_1.FormLabel, null, "Bio"),
                                React.createElement(form_1.FormControl, null,
                                    React.createElement(input_1.Input, __assign({ placeholder: "Tell us about yourself" }, field))),
                                React.createElement(form_1.FormMessage, null)));
                        } }),
                    React.createElement("div", { className: "flex justify-end space-x-2" },
                        React.createElement(button_1.Button, { type: "button", variant: "outline", onClick: function () { return setIsOpen(false); } }, "Cancel"),
                        React.createElement(button_1.Button, { type: "submit", disabled: isSubmitting }, isSubmitting ? 'Saving...' : 'Save changes')))))));
}
exports.ProfileEditForm = ProfileEditForm;
