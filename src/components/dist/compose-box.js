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
var switch_1 = require("@/components/ui/switch");
var wagmi_1 = require("wagmi");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var use_toast_1 = require("@/hooks/use-toast");
function ComposeBox(_a) {
    var _this = this;
    var onSubmit = _a.onSubmit, isSubmitting = _a.isSubmitting, _b = _a.placeholder, placeholder = _b === void 0 ? "What's happening?" : _b, _c = _a.maxLength, maxLength = _c === void 0 ? 280 : _c, _d = _a.autoFocus, autoFocus = _d === void 0 ? false : _d;
    var _e = react_1.useState(''), content = _e[0], setContent = _e[1];
    var _f = react_1.useState(null), selectedImage = _f[0], setSelectedImage = _f[1];
    var _g = react_1.useState(''), embedUrl = _g[0], setEmbedUrl = _g[1];
    var _h = react_1.useState(false), showEmbedInput = _h[0], setShowEmbedInput = _h[1];
    var _j = react_1.useState(false), isDirectIframe = _j[0], setIsDirectIframe = _j[1]; // New state for iframe switch
    var address = wagmi_1.useAccount().address;
    var toast = use_toast_1.useToast().toast;
    var fileInputRef = react_1.useRef(null);
    var _k = react_1.useState(false), isUploading = _k[0], setIsUploading = _k[1];
    // Function to convert URL to iframe embed code
    var generateEmbedCode = function (url) {
        try {
            var urlObj = new URL(url);
            // YouTube
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                var videoId = urlObj.hostname.includes('youtu.be')
                    ? urlObj.pathname.slice(1)
                    : urlObj.searchParams.get('v');
                if (videoId) {
                    return "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + videoId + "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>";
                }
            }
            // Twitter/X
            if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
                return "<iframe src=\"https://twitframe.com/show?url=" + encodeURIComponent(url) + "\" width=\"550\" height=\"300\" frameborder=\"0\" scrolling=\"no\" allowtransparency=\"true\"></iframe>";
            }
            // Default iframe for other URLs
            return "<iframe src=\"" + url + "\" width=\"100%\" height=\"400\" frameborder=\"0\"></iframe>";
        }
        catch (error) {
            return null;
        }
    };
    var testGameUrls = function (url) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'HEAD',
                            mode: 'no-cors'
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('Game URL not accessible:', error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleEmbedSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var embedCode, urlMatch, isAccessible;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!embedUrl.trim())
                        return [2 /*return*/];
                    embedCode = null;
                    if (!isDirectIframe) return [3 /*break*/, 3];
                    // Direct iframe code input
                    if (!embedUrl.includes('<iframe') || !embedUrl.includes('</iframe>')) {
                        toast({
                            title: "Invalid iframe",
                            description: "Please enter a valid iframe HTML code",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    urlMatch = embedUrl.match(/src="([^"]+)"/);
                    if (!(urlMatch && urlMatch[1])) return [3 /*break*/, 2];
                    return [4 /*yield*/, testGameUrls(urlMatch[1])];
                case 1:
                    isAccessible = _a.sent();
                    if (!isAccessible) {
                        toast({
                            title: "Game not accessible",
                            description: "The game URL might be unavailable or blocked",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    embedCode = embedUrl;
                    return [3 /*break*/, 4];
                case 3:
                    // URL to iframe conversion
                    embedCode = generateEmbedCode(embedUrl);
                    _a.label = 4;
                case 4:
                    if (!embedCode) {
                        toast({
                            title: "Invalid input",
                            description: isDirectIframe ? "Please enter valid iframe code" : "Please enter a valid URL to embed",
                            variant: "destructive"
                        });
                        return [2 /*return*/];
                    }
                    setContent(function (prev) {
                        var newContent = prev + '\n' + embedCode;
                        return newContent;
                    });
                    setEmbedUrl('');
                    setShowEmbedInput(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleImageClick = function () {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    var handleImageChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Image size should be less than 5MB",
                    variant: "destructive"
                });
                return;
            }
            // Check file type
            var validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast({
                    title: "Error",
                    description: "Only JPEG, PNG, GIF, and WebP files are allowed",
                    variant: "destructive"
                });
                return;
            }
            // Preview validation
            try {
                var objectUrl_1 = URL.createObjectURL(file);
                var img = new lucide_react_1.Image();
                img.onload = function () {
                    URL.revokeObjectURL(objectUrl_1);
                    setSelectedImage(file);
                };
                img.onerror = function () {
                    URL.revokeObjectURL(objectUrl_1);
                    toast({
                        title: "Error",
                        description: "Invalid image file",
                        variant: "destructive"
                    });
                };
                img.src = objectUrl_1;
            }
            catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to process image",
                    variant: "destructive"
                });
            }
        }
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!content.trim() && !selectedImage)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsUploading(true);
                    return [4 /*yield*/, onSubmit(content, selectedImage)];
                case 2:
                    _a.sent();
                    setContent('');
                    setSelectedImage(null);
                    setEmbedUrl('');
                    setShowEmbedInput(false);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Failed to create post",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var removeImage = function () {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (React.createElement("form", { onSubmit: handleSubmit, className: "w-full bg-background rounded-lg border border-border" },
        React.createElement("div", { className: "flex gap-1 p-6 rounded-2x1" },
            React.createElement(avatar_1.Avatar, { className: "h-8 w-8" },
                React.createElement(avatar_1.AvatarImage, { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + address }),
                React.createElement(avatar_1.AvatarFallback, null, "You")),
            React.createElement("div", { className: "flex-1 space-y-4" },
                React.createElement(textarea_1.Textarea, { value: content, onChange: function (e) { return setContent(e.target.value); }, placeholder: placeholder, className: "min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground", maxLength: maxLength, autoFocus: autoFocus, disabled: isSubmitting }),
                selectedImage && (React.createElement("div", { className: "relative w-full" },
                    React.createElement("img", { src: URL.createObjectURL(selectedImage), alt: "Selected", className: "max-h-[300px] rounded-lg object-cover" }),
                    React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", className: "absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full", onClick: removeImage, disabled: isUploading },
                        React.createElement(lucide_react_1.X, { className: "h-4 w-4" })),
                    isUploading && (React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg" },
                        React.createElement(lucide_react_1.Loader2, { className: "h-6 w-6 animate-spin text-white" }))))),
                showEmbedInput && (React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        React.createElement(switch_1.Switch, { checked: isDirectIframe, onCheckedChange: setIsDirectIframe, id: "iframe-mode" }),
                        React.createElement("label", { htmlFor: "iframe-mode", className: "text-sm text-muted-foreground" }, "Direct iframe code")),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("textarea", { value: embedUrl, onChange: function (e) { return setEmbedUrl(e.target.value); }, placeholder: isDirectIframe
                                ? "Paste iframe HTML code here"
                                : "Enter URL to embed (YouTube, Twitter, etc.)", className: "flex-1 bg-transparent border rounded-md px-3 py-2 text-sm min-h-[60px]" }),
                        React.createElement("div", { className: "flex flex-col gap-2" },
                            React.createElement(button_1.Button, { type: "button", variant: "ghost", onClick: handleEmbedSubmit, className: "text-primary" }, "Embed"),
                            React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", onClick: function () {
                                    setShowEmbedInput(false);
                                    setEmbedUrl('');
                                } },
                                React.createElement(lucide_react_1.X, { className: "h-4 w-4" })))))),
                React.createElement("input", { type: "file", ref: fileInputRef, onChange: handleImageChange, accept: "image/*", className: "hidden" }),
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", { className: "flex items-center gap-1" },
                        React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground hover:bg-accent", onClick: handleImageClick, disabled: isUploading },
                            React.createElement(lucide_react_1.Image, { className: "h-5 w-5" })),
                        React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", className: utils_1.cn("text-muted-foreground hover:text-foreground hover:bg-accent transition-colors", showEmbedInput && "bg-accent text-primary border-primary"), onClick: function () { return setShowEmbedInput(!showEmbedInput); }, "aria-pressed": showEmbedInput },
                            React.createElement(lucide_react_1.Link, { className: utils_1.cn("h-5 w-5", showEmbedInput && "text-primary") })),
                        React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground hover:bg-accent" },
                            React.createElement(lucide_react_1.Code, { className: "h-5 w-5" })),
                        React.createElement(button_1.Button, { type: "button", variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground hover:bg-accent" },
                            React.createElement(lucide_react_1.Play, { className: "h-5 w-5" }))),
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("span", { className: "text-xs text-muted-foreground" },
                            content.length,
                            "/",
                            maxLength),
                        React.createElement(button_1.Button, { type: "submit", disabled: (!content.trim() && !selectedImage) || isSubmitting || isUploading, className: "bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-sm rounded-full disabled:bg-muted disabled:text-muted-foreground" },
                            (isSubmitting || isUploading) && React.createElement(lucide_react_1.Loader2, { className: "h-3 w-3 animate-spin" }),
                            "Post")))))));
}
exports.ComposeBox = ComposeBox;
