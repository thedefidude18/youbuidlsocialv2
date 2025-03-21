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
exports.PointsLeaderboard = exports.PostCard = void 0;
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var date_fns_1 = require("date-fns");
var use_toast_1 = require("@/hooks/use-toast");
var tooltip_1 = require("@/components/ui/tooltip");
var use_post_interactions_1 = require("@/hooks/use-post-interactions");
var points_provider_1 = require("@/providers/points-provider");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var card_1 = require("@/components/ui/card");
var utils_1 = require("@/lib/utils");
var navigation_1 = require("next/navigation");
var gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;
function PostCard(_a) {
    var _this = this;
    var post = _a.post;
    var router = navigation_1.useRouter();
    var toast = use_toast_1.useToast().toast;
    var _b = points_provider_1.usePoints(), points = _b.points, actions = _b.actions;
    var _c = react_1.useState(false), isLiked = _c[0], setIsLiked = _c[1];
    var _d = react_1.useState(false), isReposted = _d[0], setIsReposted = _d[1];
    var _e = react_1.useState(false), showDonateModal = _e[0], setShowDonateModal = _e[1];
    var _f = react_1.useState(post.stats.likes), likeCount = _f[0], setLikeCount = _f[1];
    var _g = react_1.useState(post.stats.reposts), repostCount = _g[0], setRepostCount = _g[1];
    var _h = react_1.useState(post.stats.comments), commentCount = _h[0], setCommentCount = _h[1];
    var _j = react_1.useState(false), isCommentsOpen = _j[0], setIsCommentsOpen = _j[1];
    var _k = react_1.useState([]), comments = _k[0], setComments = _k[1];
    var _l = react_1.useState(false), isLoadingComments = _l[0], setIsLoadingComments = _l[1];
    var _m = react_1.useState(false), isSubmittingComment = _m[0], setIsSubmittingComment = _m[1];
    var _o = react_1.useState(''), newComment = _o[0], setNewComment = _o[1];
    var _p = use_post_interactions_1.usePostInteractions(post.id), like = _p.like, repost = _p.repost, comment = _p.comment, isProcessing = _p.isProcessing;
    var handlePostClick = function (e) {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        router.push("/post/" + post.id);
    };
    var handleLike = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isProcessing)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, like()];
                case 2:
                    _a.sent();
                    setIsLiked(!isLiked);
                    setLikeCount(function (prev) { return isLiked ? prev - 1 : prev + 1; });
                    if (!!isLiked) return [3 /*break*/, 4];
                    return [4 /*yield*/, actions.addLike()];
                case 3:
                    _a.sent();
                    toast({
                        title: "Post liked",
                        description: "You earned 2 points for engagement"
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Could not process like action",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRepost = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isProcessing)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, repost()];
                case 2:
                    _a.sent();
                    setIsReposted(!isReposted);
                    setRepostCount(function (prev) { return isReposted ? prev - 1 : prev + 1; });
                    if (!isReposted) {
                        toast({
                            title: "Post reposted",
                            description: "Content shared to your feed"
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Could not process repost action",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDonate = function () {
        setShowDonateModal(true);
    };
    var handleShare = function (type) { return __awaiter(_this, void 0, void 0, function () {
        var postUrl, text, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    postUrl = window.location.origin + "/post/" + post.id;
                    text = ((_b = post.ceramicData) === null || _b === void 0 ? void 0 : _b.body) || post.content;
                    _a = type;
                    switch (_a) {
                        case 'copy': return [3 /*break*/, 1];
                        case 'twitter': return [3 /*break*/, 3];
                        case 'email': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, navigator.clipboard.writeText(postUrl)];
                case 2:
                    _c.sent();
                    toast({
                        title: "Link copied",
                        description: "Post link has been copied to your clipboard"
                    });
                    return [3 /*break*/, 5];
                case 3:
                    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(postUrl), '_blank');
                    return [3 /*break*/, 5];
                case 4:
                    window.location.href = "mailto:?subject=Check out this post&body=" + encodeURIComponent(text) + "%0A%0A" + encodeURIComponent(postUrl);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var formatPostDate = function (timestamp) {
        return date_fns_1.formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };
    // Add this function to safely render content with iframes
    var renderContent = function (content) {
        // Split content into text and iframes
        var parts = content.split(/(<iframe.*?<\/iframe>)/g);
        return parts.map(function (part, index) {
            if (part.startsWith('<iframe')) {
                // Create a wrapper for the iframe
                return (React.createElement("div", { key: index, className: "my-2 rounded-lg overflow-hidden" },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: part } })));
            }
            return React.createElement("p", { key: index }, part);
        });
    };
    var handleCommentClick = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var fetchedComments, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    setIsCommentsOpen(!isCommentsOpen);
                    if (!(!isCommentsOpen && comments.length === 0)) return [3 /*break*/, 5];
                    setIsLoadingComments(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchComments()];
                case 2:
                    fetchedComments = _a.sent();
                    setComments(fetchedComments);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Failed to load comments",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoadingComments(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleCommentSubmit = function (content) { return __awaiter(_this, void 0, void 0, function () {
        var updatedComments, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!content.trim())
                        return [2 /*return*/];
                    setIsSubmittingComment(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, comment(content)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchComments()];
                case 3:
                    updatedComments = _a.sent();
                    setComments(updatedComments);
                    setCommentCount(function (prev) { return prev + 1; });
                    setNewComment(''); // Clear input after successful post
                    toast({
                        title: "Comment posted",
                        description: "Your comment has been added successfully"
                    });
                    return [3 /*break*/, 6];
                case 4:
                    error_4 = _a.sent();
                    toast({
                        title: "Error",
                        description: "Failed to post comment",
                        variant: "destructive"
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setIsSubmittingComment(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var renderImage = function (ipfsHash) {
        if (!ipfsHash)
            return null;
        var imageUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        return (React.createElement("div", { className: "mt-2 relative group" },
            React.createElement("img", { src: imageUrl, alt: "Post attachment", className: "rounded-lg max-h-[500px] w-full object-cover", loading: "lazy", onError: function (e) {
                    // Fallback if Pinata gateway fails
                    var img = e.target;
                    if (!img.src.includes('ipfs.io')) {
                        img.src = "https://ipfs.io/ipfs/" + ipfsHash;
                    }
                } }),
            React.createElement("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" })));
    };
    return (React.createElement(card_1.Card, { className: "bg-white dark:bg-zinc-900 shadow-sm rounded-xl overflow-hidden mb-4" },
        React.createElement("div", { className: "p-4" },
            React.createElement("div", { className: "flex items-start justify-between" },
                React.createElement("div", { className: "flex items-center space-x-3" },
                    React.createElement(avatar_1.Avatar, { className: "h-10 w-10 ring-2 ring-offset-2 ring-blue-500" },
                        React.createElement(avatar_1.AvatarImage, { src: "https://api.dicebear.com/9.x/bottts/svg?seed=" + post.author.username, alt: post.author.name }),
                        React.createElement(avatar_1.AvatarFallback, null, post.author.name.charAt(0))),
                    React.createElement("div", null,
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("span", { className: "font-semibold text-zinc-900 dark:text-zinc-100" }, post.author.name),
                            post.author.verified && (React.createElement(tooltip_1.TooltipProvider, null,
                                React.createElement(tooltip_1.Tooltip, null,
                                    React.createElement(tooltip_1.TooltipTrigger, null,
                                        React.createElement(lucide_react_1.Check, { className: "w-4 h-4 text-blue-500 ml-1" })),
                                    React.createElement(tooltip_1.TooltipContent, null, "Verified"))))),
                        React.createElement("div", { className: "flex items-center text-sm text-zinc-500" },
                            React.createElement("span", null, formatPostDate(post.timestamp))))),
                React.createElement(dropdown_menu_1.DropdownMenu, null,
                    React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "ghost", size: "sm" },
                            React.createElement(lucide_react_1.MoreHorizontal, { className: "h-5 w-5" }))),
                    React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end" },
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleShare('copy'); } },
                            React.createElement(lucide_react_1.Link, { className: "w-4 h-4 mr-2" }),
                            "Copy link"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return handleShare('twitter'); } },
                            React.createElement(lucide_react_1.Twitter, { className: "w-4 h-4 mr-2" }),
                            "Share on Twitter"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: handleDonate },
                            React.createElement(lucide_react_1.Wallet, { className: "w-4 h-4 mr-2" }),
                            "Donate"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-red-500" },
                            React.createElement(lucide_react_1.Flag, { className: "w-4 h-4 mr-2" }),
                            "Report"))))),
        React.createElement("div", { className: "px-4", onClick: handlePostClick }, renderContent(post.content)),
        React.createElement("div", { className: "px-4 py-2 flex items-center space-x-4 text-sm text-zinc-500" },
            React.createElement("span", null, formatPostDate(post.timestamp)),
            React.createElement("span", null, "\u00B7"),
            React.createElement("span", null,
                likeCount,
                " likes"),
            React.createElement("span", null, "\u00B7"),
            React.createElement("span", null,
                commentCount,
                " comments")),
        React.createElement("div", { className: "px-2 py-1 border-t border-zinc-100 dark:border-zinc-800" },
            React.createElement("div", { className: "grid grid-cols-3 gap-1" },
                React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full", isLiked && "text-blue-500"), onClick: handleLike },
                    React.createElement(lucide_react_1.Heart, { className: utils_1.cn("w-5 h-5", isLiked && "fill-current") }),
                    React.createElement("span", null, "Like")),
                React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full", isCommentsOpen && "text-blue-500"), onClick: handleCommentClick },
                    React.createElement(lucide_react_1.MessageCircle, { className: "w-5 h-5" }),
                    React.createElement("span", null, "Comment")),
                React.createElement(button_1.Button, { variant: "ghost", className: utils_1.cn("flex items-center justify-center space-x-2 w-full", isReposted && "text-green-500"), onClick: handleRepost },
                    React.createElement(lucide_react_1.Repeat2, { className: "w-5 h-5" }),
                    React.createElement("span", null, "Share")))),
        isCommentsOpen && (React.createElement("div", { className: "border-t border-zinc-100 dark:border-zinc-800" },
            React.createElement("div", { className: "max-h-[400px] overflow-y-auto custom-scrollbar" }, isLoadingComments ? (React.createElement("div", { className: "flex items-center justify-center py-6" },
                React.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" }))) : comments.length > 0 ? (React.createElement("div", { className: "p-4 space-y-4" }, comments.map(function (comment) { return (React.createElement("div", { key: comment.id, className: "group" },
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement("div", { className: "flex-shrink-0" },
                        React.createElement(avatar_1.Avatar, { className: "h-7 w-7" },
                            React.createElement(avatar_1.AvatarImage, { src: comment.author.avatar }),
                            React.createElement(avatar_1.AvatarFallback, null, comment.author.name[0]))),
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", { className: "font-medium text-sm" }, comment.author.name),
                            React.createElement("span", { className: "text-xs text-muted-foreground" }, date_fns_1.formatDistanceToNow(comment.timestamp, { addSuffix: true }))),
                        React.createElement("p", { className: "text-sm mt-1 break-words" }, comment.content),
                        React.createElement("div", { className: "flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" },
                            React.createElement("button", { className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" },
                                React.createElement(lucide_react_1.Heart, { className: "h-3.5 w-3.5" }),
                                React.createElement("span", null, comment.likes || 0)),
                            React.createElement("button", { className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" },
                                React.createElement(lucide_react_1.MessageCircle, { className: "h-3.5 w-3.5" }),
                                React.createElement("span", null, "Reply"))))))); }))) : (React.createElement("div", { className: "py-8 text-center text-muted-foreground text-sm" },
                React.createElement(lucide_react_1.MessageCircle, { className: "h-5 w-5 mx-auto mb-2 opacity-50" }),
                React.createElement("p", null, "No comments yet"),
                React.createElement("p", { className: "text-xs" }, "Be the first to join the conversation")))),
            React.createElement("div", { className: "border-t border-zinc-100 dark:border-zinc-800 p-3" },
                React.createElement("div", { className: "flex items-start gap-3" },
                    React.createElement(avatar_1.Avatar, { className: "h-7 w-7 flex-shrink-0" },
                        React.createElement(avatar_1.AvatarImage, { src: post.author.avatar }),
                        React.createElement(avatar_1.AvatarFallback, null, "You")),
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement(input_1.Input, { placeholder: "Write a comment...", className: "bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-sm", value: newComment, onChange: function (e) { return setNewComment(e.target.value); }, onKeyDown: function (e) {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit(newComment);
                                }
                            }, disabled: isSubmittingComment }),
                        newComment.trim() && (React.createElement("div", { className: "flex justify-end mt-2" },
                            React.createElement(button_1.Button, { size: "sm", className: "h-7 px-3 text-xs rounded-full", onClick: function () { return handleCommentSubmit(newComment); }, disabled: isSubmittingComment }, isSubmittingComment ? (React.createElement(lucide_react_1.Loader2, { className: "h-3 w-3 animate-spin" })) : ('Post')))))))))));
}
exports.PostCard = PostCard;
function PointsLeaderboard() {
    var _a = react_1.useState([]), leaderboard = _a[0], setLeaderboard = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var contract = useContract({
        address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS,
        abi: pointsContractABI.abi
    });
    useEffect(function () {
        function fetchLeaderboard() {
            return __awaiter(this, void 0, void 0, function () {
                var topUsers, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, contract.getTopUsers(10)];
                        case 1:
                            topUsers = _a.sent();
                            setLeaderboard(topUsers);
                            return [3 /*break*/, 4];
                        case 2:
                            error_5 = _a.sent();
                            console.error('Error fetching leaderboard:', error_5);
                            return [3 /*break*/, 4];
                        case 3:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        fetchLeaderboard();
    }, []);
    if (loading)
        return React.createElement("div", null, "Loading leaderboard...");
    return (React.createElement("div", { className: "rounded-lg border p-4" },
        React.createElement("h2", { className: "text-xl font-bold mb-4" }, "Top Contributors"),
        React.createElement("div", { className: "space-y-2" }, leaderboard.map(function (user, index) { return (React.createElement("div", { key: user.address, className: "flex justify-between items-center" },
            React.createElement("span", null,
                "#",
                index + 1,
                " ",
                user.address.slice(0, 6),
                "...",
                user.address.slice(-4)),
            React.createElement("span", null,
                user.points,
                " points"))); }))));
}
exports.PointsLeaderboard = PointsLeaderboard;
