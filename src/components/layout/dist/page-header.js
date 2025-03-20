'use client';
"use strict";
exports.__esModule = true;
exports.PageHeader = void 0;
var navigation_1 = require("next/navigation");
function PageHeader(_a) {
    var title = _a.title, _b = _a.showBackButton, showBackButton = _b === void 0 ? true : _b, action = _a.action;
    var router = navigation_1.useRouter();
    return (React.createElement("div", { className: "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" },
        React.createElement("div", { className: "flex h-14 items-center px-4" },
            React.createElement("div", { className: "flex items-center gap-3 flex-1" },
                showBackButton && (React.createElement("button", { className: "rounded-full h-8 w-8 flex items-center justify-center hover:bg-secondary", onClick: function () { return router.back(); } },
                    React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                        React.createElement("path", { d: "M19 12H5M12 19l-7-7 7-7" })))),
                React.createElement("h1", { className: "text-xl font-bold" }, title)),
            action && React.createElement("div", null, action))));
}
exports.PageHeader = PageHeader;
