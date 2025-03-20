"use client";
"use strict";
exports.__esModule = true;
exports.PointsProvider = exports.usePoints = void 0;
var react_1 = require("react");
var usePointsContract_1 = require("@/hooks/usePointsContract");
var wagmi_1 = require("wagmi");
// Default context
var PointsContext = react_1.createContext({
    points: 0,
    isLoading: true,
    actions: {
        createPost: function () { },
        addLike: function () { },
        addComment: function () { }
    }
});
function usePoints() {
    return react_1.useContext(PointsContext);
}
exports.usePoints = usePoints;
function PointsProvider(_a) {
    var children = _a.children;
    var address = wagmi_1.useAccount().address;
    var _b = usePointsContract_1.usePointsContract(), points = _b.points, pointsLoading = _b.pointsLoading, createPost = _b.createPost, addLike = _b.addLike, addComment = _b.addComment;
    var value = {
        points: points || 0,
        isLoading: pointsLoading,
        actions: {
            createPost: createPost,
            addLike: addLike,
            addComment: addComment
        }
    };
    return (react_1["default"].createElement(PointsContext.Provider, { value: value }, children));
}
exports.PointsProvider = PointsProvider;
