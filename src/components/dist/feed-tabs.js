"use client";
"use strict";
exports.__esModule = true;
exports.FeedTabs = void 0;
var tabs_1 = require("@/components/ui/tabs");
var utils_1 = require("@/lib/utils");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
function FeedTabs(_a) {
    var currentTab = _a.currentTab, onChange = _a.onChange, _b = _a.forYouCount, forYouCount = _b === void 0 ? 0 : _b, _c = _a.followingCount, followingCount = _c === void 0 ? 0 : _c;
    var router = navigation_1.useRouter();
    var handleTabChange = function (value) {
        if (value === "search") {
            router.push("/search");
            return;
        }
        onChange(value);
    };
    return (React.createElement("div", { className: "sticky top-14 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
        React.createElement(tabs_1.Tabs, { defaultValue: currentTab, onValueChange: handleTabChange, className: "w-full" },
            React.createElement("div", { className: "max-w-2xl mx-auto" },
                " ",
                React.createElement(tabs_1.TabsList, { className: "w-full h-12 bg-transparent p-0 flex justify-center gap-2" },
                    React.createElement(tabs_1.TabsTrigger, { value: "home", className: utils_1.cn("relative flex items-center gap-2 px-6", "data-[state=active]:border-b-2 data-[state=active]:border-primary", "data-[state=active]:text-foreground data-[state=active]:shadow-none", "data-[state=active]:rounded-none rounded-none h-full", "text-sm font-semibold transition-all") },
                        "For you",
                        forYouCount > 0 && (React.createElement("span", { className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground" }, forYouCount > 99 ? '99+' : forYouCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "following", className: utils_1.cn("relative flex items-center gap-2 px-6", "data-[state=active]:border-b-2 data-[state=active]:border-primary", "data-[state=active]:text-foreground data-[state=active]:shadow-none", "data-[state=active]:rounded-none rounded-none h-full", "text-sm font-semibold transition-all") },
                        "Following",
                        followingCount > 0 && (React.createElement("span", { className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground" }, followingCount > 99 ? '99+' : followingCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "latest", className: utils_1.cn("relative flex items-center gap-2 px-6", "data-[state=active]:border-b-2 data-[state=active]:border-primary", "data-[state=active]:text-foreground data-[state=active]:shadow-none", "data-[state=active]:rounded-none rounded-none h-full", "text-sm font-semibold transition-all") }, "Latest"),
                    React.createElement(tabs_1.TabsTrigger, { value: "home", className: utils_1.cn("relative flex items-center gap-2 px-6", "data-[state=active]:border-b-2 data-[state=active]:border-primary", "data-[state=active]:text-foreground data-[state=active]:shadow-none", "data-[state=active]:rounded-none rounded-none h-full", "text-sm font-semibold transition-all") },
                        "For you",
                        forYouCount > 0 && (React.createElement("span", { className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground" }, forYouCount > 99 ? '99+' : forYouCount))),
                    React.createElement(tabs_1.TabsTrigger, { value: "search", className: utils_1.cn("relative flex items-center gap-2 px-6", "data-[state=active]:border-b-2 data-[state=active]:border-primary", "data-[state=active]:text-foreground data-[state=active]:shadow-none", "data-[state=active]:rounded-none rounded-none h-full", "text-sm font-semibold transition-all") },
                        React.createElement(lucide_react_1.Search, { className: "h-4 w-4" })))))));
}
exports.FeedTabs = FeedTabs;
