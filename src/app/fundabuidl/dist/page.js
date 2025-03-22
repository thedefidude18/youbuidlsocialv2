'use client';
"use strict";
exports.__esModule = true;
var debug_donate_modal_1 = require("@/components/debug-donate-modal");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var react_1 = require("react");
var mockAuthor = {
    name: "Test Builder",
    username: "testbuilder",
    avatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Example address
};
var mockStreamId = "test-stream-123";
var mockPostExcerpt = "This is a test post to verify the donation system...";
function Fundabuidl() {
    var _a = react_1.useState(false), isModalOpen = _a[0], setIsModalOpen = _a[1];
    return (React.createElement("div", { className: "container mx-auto py-8" },
        React.createElement("h1", { className: "text-4xl font-bold text-center mb-8" }, "Fundabuidl"),
        React.createElement("div", { className: "max-w-2xl mx-auto" },
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardHeader, null,
                    React.createElement(card_1.CardTitle, null, "Test Donation System"),
                    React.createElement(card_1.CardDescription, null, "This is a test page to verify the donation system functionality")),
                React.createElement(card_1.CardContent, null,
                    React.createElement("div", { className: "space-y-4" },
                        React.createElement("div", { className: "p-4 bg-muted rounded-lg" },
                            React.createElement("h3", { className: "font-semibold mb-2" }, "Test Configuration:"),
                            React.createElement("pre", { className: "text-sm overflow-x-auto" }, JSON.stringify({
                                contractAddress: process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS,
                                author: mockAuthor,
                                streamId: mockStreamId
                            }, null, 2))),
                        React.createElement(button_1.Button, { onClick: function () { return setIsModalOpen(true); }, className: "w-full" }, "Open Donation Modal")))),
            React.createElement(debug_donate_modal_1.DebugDonateModal, { isOpen: isModalOpen, onClose: function () { return setIsModalOpen(false); }, author: mockAuthor, streamId: mockStreamId, postExcerpt: mockPostExcerpt }))));
}
exports["default"] = Fundabuidl;
