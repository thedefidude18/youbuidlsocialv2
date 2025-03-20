"use strict";
exports.__esModule = true;
exports.OptimismLink = void 0;
var react_1 = require("react");
var button_1 = require("./ui/button");
function OptimismLink(_a) {
    var transactionHash = _a.transactionHash, _b = _a.className, className = _b === void 0 ? '' : _b;
    if (!transactionHash)
        return null;
    var optimismUrl = "https://sepolia-optimism.etherscan.io/tx/" + transactionHash;
    return (react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2 " + className, onClick: function () { return window.open(optimismUrl, '_blank'); } },
        react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            react_1["default"].createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
            react_1["default"].createElement("polyline", { points: "15 3 21 3 21 9" }),
            react_1["default"].createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" })),
        "View on Optimism"));
}
exports.OptimismLink = OptimismLink;
