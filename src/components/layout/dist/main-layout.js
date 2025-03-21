"use client";
"use strict";
exports.__esModule = true;
exports.MainLayout = void 0;
var header_1 = require("./header");
var sidebar_1 = require("./sidebar");
var right_sidebar_1 = require("./right-sidebar");
var tooltip_1 = require("@/components/ui/tooltip");
function MainLayout(_a) {
    var children = _a.children, _b = _a.showHeader, showHeader = _b === void 0 ? true : _b;
    return (React.createElement(tooltip_1.TooltipProvider, null,
        React.createElement("div", { className: "min-h-screen bg-background" },
            showHeader && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "hidden md:block fixed top-0 left-0 right-0 h-16 z-50 bg-background border-b border-border" },
                    React.createElement(header_1.Header, null)),
                React.createElement("div", { className: "md:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-background border-b border-border" },
                    React.createElement(header_1.Header, null)))),
            React.createElement("div", { className: "flex " + (showHeader ? 'pt-14 md:pt-16' : 'pt-0') },
                React.createElement("div", { className: "hidden md:block w-64 xl:w-72 shrink-0" },
                    React.createElement("div", { className: "fixed " + (showHeader ? 'top-16' : 'top-0') + " bottom-0 w-64 xl:w-72 overflow-y-auto border-r border-border py-8 px-4" },
                        React.createElement(sidebar_1.Sidebar, null))),
                React.createElement("main", { className: "flex-1 min-h-screen w-full" }, children),
                React.createElement("div", { className: "hidden lg:block w-[320px] xl:w-[380px] shrink-0" },
                    React.createElement("div", { className: "fixed " + (showHeader ? 'top-16' : 'top-0') + " bottom-0 w-[320px] xl:w-[380px] overflow-y-auto hide-scrollbar border-l border-border bg-background" },
                        React.createElement("div", { className: "pb-16" },
                            React.createElement(right_sidebar_1.RightSidebar, null))))))));
}
exports.MainLayout = MainLayout;
