"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useFollow = void 0;
var react_1 = require("react");
var auth_provider_1 = require("@/providers/auth-provider");
var points_provider_1 = require("@/providers/points-provider");
var FOLLOWING_STORAGE_KEY = 'warpcast_following';
function useFollow() {
    var user = auth_provider_1.useAuth().user;
    var addUserPoints = points_provider_1.usePoints().addUserPoints;
    var _a = react_1.useState([]), following = _a[0], setFollowing = _a[1];
    var _b = react_1.useState({}), followers = _b[0], setFollowers = _b[1];
    // Load following data on mount
    react_1.useEffect(function () {
        var loadFollowData = function () {
            var storedData = localStorage.getItem(FOLLOWING_STORAGE_KEY);
            if (storedData) {
                var parsed = JSON.parse(storedData);
                setFollowing(parsed.following || []);
                setFollowers(parsed.followers || {});
            }
        };
        loadFollowData();
        // Add event listener for storage changes
        window.addEventListener('storage', loadFollowData);
        return function () { return window.removeEventListener('storage', loadFollowData); };
    }, []);
    // Save data to localStorage and trigger event
    var saveData = react_1.useCallback(function (newFollowing, newFollowers) {
        var data = JSON.stringify({
            following: newFollowing,
            followers: newFollowers
        });
        localStorage.setItem(FOLLOWING_STORAGE_KEY, data);
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
    }, []);
    var toggleFollow = react_1.useCallback(function (userId) {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        setFollowing(function (prev) {
            var isCurrentlyFollowing = prev.includes(userId);
            var newFollowing = isCurrentlyFollowing
                ? prev.filter(function (id) { return id !== userId; })
                : __spreadArrays(prev, [userId]);
            setFollowers(function (prev) {
                var newFollowers = __assign({}, prev);
                if (isCurrentlyFollowing) {
                    newFollowers[userId] = (newFollowers[userId] || []).filter(function (id) { return id !== user.id; });
                }
                else {
                    newFollowers[userId] = __spreadArrays((newFollowers[userId] || []), [user.id]);
                    // Add points for following
                    addUserPoints(5, 'follow');
                }
                // Save and sync data
                saveData(newFollowing, newFollowers);
                return newFollowers;
            });
            return newFollowing;
        });
    }, [user === null || user === void 0 ? void 0 : user.id, addUserPoints, saveData]);
    var isFollowing = react_1.useCallback(function (userId) {
        return following.includes(userId);
    }, [following]);
    var getFollowingCount = react_1.useCallback(function (userId) {
        return following.filter(function (id) { return id === userId; }).length;
    }, [following]);
    var getFollowersCount = react_1.useCallback(function (userId) {
        var _a;
        return ((_a = followers[userId]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }, [followers]);
    return {
        following: following,
        followers: followers,
        toggleFollow: toggleFollow,
        isFollowing: isFollowing,
        getFollowingCount: getFollowingCount,
        getFollowersCount: getFollowersCount
    };
}
exports.useFollow = useFollow;
