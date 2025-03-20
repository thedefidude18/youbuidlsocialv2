"use client";
"use strict";
exports.__esModule = true;
exports.RightSidebar = void 0;
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var icons_1 = require("@/components/icons");
function UserToFollow(_a) {
    var id = _a.id, name = _a.name, username = _a.username, avatar = _a.avatar;
    return (React.createElement("div", { className: "flex items-center gap-3 mb-4 hover:bg-secondary/50 rounded-lg p-2 transition-colors" },
        React.createElement(avatar_1.Avatar, { className: "h-10 w-10" },
            React.createElement(avatar_1.AvatarImage, { src: avatar, alt: name }),
            React.createElement(avatar_1.AvatarFallback, null, name.charAt(0))),
        React.createElement("div", { className: "flex-1 min-w-0" },
            React.createElement("div", { className: "text-sm font-medium truncate" }, name),
            React.createElement("div", { className: "text-xs text-muted-foreground truncate" },
                "@",
                username)),
        React.createElement(button_1.Button, { size: "sm", variant: "outline", className: "rounded-full px-4" }, "Follow")));
}
function RightSidebar() {
    return (React.createElement("div", { className: "w-0 lg:w-80 border-l border-border h-full py-6 px-4 hidden lg:block overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent" },
        React.createElement("div", { className: "mb-6" },
            React.createElement("div", { className: "flex items-center justify-between mb-4" },
                React.createElement("h3", { className: "text-lg font-semibold" }, "Suggested Follows"),
                React.createElement(icons_1.SettingsIcon, { className: "h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" })),
            React.createElement("div", { className: "space-y-2" },
                React.createElement(UserToFollow, { id: "1", name: "John Doe", username: "johndoe", avatar: "https://placekitten.com/100/100" }),
                React.createElement(UserToFollow, { id: "2", name: "Jane Smith", username: "janesmith", avatar: "https://placekitten.com/101/101" }),
                React.createElement(UserToFollow, { id: "3", name: "Bob Johnson", username: "bobjohnson", avatar: "https://placekitten.com/102/102" })),
            React.createElement("button", { className: "w-full text-sm text-primary hover:underline mt-3 text-center" }, "Show more")),
        React.createElement("div", { className: "mb-6" },
            React.createElement("div", { className: "flex items-center justify-between mb-4" },
                React.createElement("h3", { className: "text-lg font-semibold" }, "Trending Frames"),
                React.createElement(icons_1.SettingsIcon, { className: "h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" })),
            React.createElement(card_1.Card, { className: "overflow-hidden hover:shadow-md transition-shadow" },
                React.createElement(card_1.CardHeader, { className: "p-0" },
                    React.createElement("div", { className: "bg-gradient-to-r from-orange-500 to-amber-500 h-24 flex items-center justify-center" },
                        React.createElement(icons_1.FramesIcon, { className: "h-8 w-8 text-white" }))),
                React.createElement(card_1.CardContent, { className: "p-4" },
                    React.createElement(card_1.CardTitle, { className: "text-sm mb-2" }, "Ball Frame"),
                    React.createElement("div", { className: "text-xs text-muted-foreground" }, "12.3k views \u00B7 2.1k likes")))),
        React.createElement("div", { className: "text-xs text-muted-foreground flex flex-wrap gap-2" },
            React.createElement("a", { href: "#", className: "hover:underline" }, "Support"),
            React.createElement("span", null, "\u00B7"),
            React.createElement("a", { href: "#", className: "hover:underline" }, "Privacy"),
            React.createElement("span", null, "\u00B7"),
            React.createElement("a", { href: "#", className: "hover:underline" }, "Terms"),
            React.createElement("span", null, "\u00B7"),
            React.createElement("a", { href: "#", className: "hover:underline" }, "Developers"))));
}
exports.RightSidebar = RightSidebar;
