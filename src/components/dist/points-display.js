"use client";
"use strict";
exports.__esModule = true;
exports.PointsDisplay = void 0;
var points_provider_1 = require("@/providers/points-provider");
var badge_1 = require("@/components/ui/badge");
var tooltip_1 = require("@/components/ui/tooltip");
function PointsDisplay() {
    var _a = points_provider_1.usePoints(), points = _a.points, isLoading = _a.isLoading;
    if (isLoading) {
        return React.createElement(badge_1.Badge, { variant: "outline" }, "Points: ...");
    }
    return (React.createElement(tooltip_1.Tooltip, null,
        React.createElement(tooltip_1.TooltipTrigger, null,
            React.createElement(badge_1.Badge, { variant: "secondary", className: "ml-2" },
                points,
                " Points")),
        React.createElement(tooltip_1.TooltipContent, null,
            React.createElement("div", { className: "text-sm" },
                React.createElement("div", null, "Post: 10 points"),
                React.createElement("div", null, "Comment: 5 points"),
                React.createElement("div", null, "Like: 2 points"),
                React.createElement("div", null, "Repost: 3 points")))));
}
exports.PointsDisplay = PointsDisplay;
