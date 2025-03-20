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
exports.usePostsStore = void 0;
var zustand_1 = require("zustand");
exports.usePostsStore = zustand_1.create(function (set) { return ({
    posts: [],
    loading: false,
    error: null,
    setPosts: function (posts) { return set({ posts: posts }); },
    addPost: function (post) { return set(function (state) { return ({
        posts: __spreadArrays([post], state.posts) // Add new post at the beginning of the array
    }); }); },
    updatePost: function (id, updates) { return set(function (state) { return ({
        posts: state.posts.map(function (post) {
            return post.id === id ? __assign(__assign({}, post), updates) : post;
        })
    }); }); },
    setLoading: function (loading) { return set({ loading: loading }); },
    setError: function (error) { return set({ error: error }); }
}); });
