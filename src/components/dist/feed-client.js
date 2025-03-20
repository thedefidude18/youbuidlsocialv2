"use client";
"use strict";
exports.__esModule = true;
exports.FeedClient = void 0;
var react_1 = require("react");
var feed_tabs_1 = require("@/components/feed-tabs");
function FeedClient(_a) {
    var children = _a.children;
    var _b = react_1.useState("home"), currentTab = _b[0], setCurrentTab = _b[1]; // Make sure default is "home"
    var handleTabChange = function (value) {
        setCurrentTab(value);
    };
    return (React.createElement("div", { className: "flex-1 min-h-0 flex flex-col" },
        React.createElement(feed_tabs_1.FeedTabs, { currentTab: currentTab, onChange: handleTabChange, forYouCount: 0, followingCount: 0 }),
        children));
}
exports.FeedClient = FeedClient;
