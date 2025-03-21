"use client";
"use strict";
exports.__esModule = true;
exports.FeedTabs = void 0;
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
function FeedTabs(_a) {
    var currentTab = _a.currentTab, onChange = _a.onChange, _b = _a.forYouCount, forYouCount = _b === void 0 ? 0 : _b, _c = _a.followingCount, followingCount = _c === void 0 ? 0 : _c, _d = _a.latestCount, latestCount = _d === void 0 ? 0 : _d;
    var router = navigation_1.useRouter();
    var handleTabChange = function (value) {
        if (value === "search") {
            router.push("/search");
            return;
        }
        onChange(value);
    };
    var renderBadge = function (count) {
        if (count <= 0)
            return null;
        return (React.createElement("div", { className: "absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-primary flex items-center justify-center" },
            React.createElement("span", { className: "text-[11px] font-medium text-primary-foreground" }, count > 99 ? '99+' : count)));
    };
    return (React.createElement("div", { className: "sticky top-14 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
        React.createElement(tabs_1.Tabs, { value: currentTab, onValueChange: handleTabChange, className: "w-full" },
            React.createElement("div", { className: "max-w-2xl mx-auto" },
                React.createElement(tabs_1.TabsList, { className: "w-full h-12 bg-transparent p-0 flex justify-center gap-2" },
                    React.createElement(tabs_1.TabsTrigger, { value: "home", className: "relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary" },
                        React.createElement("span", { className: "relative" },
                            "For you",
                            renderBadge(forYouCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "following", className: "relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary" },
                        React.createElement("span", { className: "relative" },
                            "Following",
                            renderBadge(followingCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "latest", className: "relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary" },
                        React.createElement("span", { className: "relative" },
                            "Latest",
                            renderBadge(latestCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "search", className: "relative flex-1 flex items-center justify-center gap-2 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary" },
                        React.createElement(lucide_react_1.Search, { className: "h-4 w-4" })))))));
}
exports.FeedTabs = FeedTabs;
