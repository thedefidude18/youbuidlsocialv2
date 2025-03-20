"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var main_layout_1 = require("@/components/layout/main-layout");
var scroll_area_1 = require("@/components/ui/scroll-area");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var message_list_1 = require("@/components/message/message-list");
var message_thread_1 = require("@/components/message/message-thread");
var lucide_react_1 = require("lucide-react");
var page_header_1 = require("@/components/layout/page-header");
function MessagesPage() {
    var _a = react_1.useState(null), selectedThread = _a[0], setSelectedThread = _a[1];
    return (React.createElement(main_layout_1.MainLayout, null,
        React.createElement(page_header_1.PageHeader, { title: "Messages" }),
        React.createElement("div", { className: "flex-1 min-h-0 flex" },
            React.createElement("div", { className: "w-full md:w-80 border-r border-border flex flex-col" },
                React.createElement("div", { className: "p-4 border-b border-border" },
                    React.createElement("div", { className: "relative" },
                        React.createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }),
                        React.createElement(input_1.Input, { placeholder: "Search Direct Messages", className: "pl-9" }))),
                React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" },
                    React.createElement(message_list_1.MessageList, { onThreadSelect: setSelectedThread, selectedThread: selectedThread })),
                React.createElement("div", { className: "p-4 border-t border-border" },
                    React.createElement(button_1.Button, { className: "w-full" }, "New Message"))),
            React.createElement("div", { className: "hidden md:flex flex-1 flex-col" }, selectedThread ? (React.createElement(message_thread_1.MessageThread, { threadId: selectedThread })) : (React.createElement("div", { className: "flex-1 flex items-center justify-center" },
                React.createElement("div", { className: "text-center" },
                    React.createElement("h2", { className: "text-xl font-semibold mb-2" }, "Select a message"),
                    React.createElement("p", { className: "text-muted-foreground" }, "Choose a conversation to start messaging"))))))));
}
exports["default"] = MessagesPage;
