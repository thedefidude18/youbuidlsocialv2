'use client';
"use strict";
exports.__esModule = true;
exports.ProtectedRoute = void 0;
var use_auth_1 = require("@/hooks/use-auth");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function ProtectedRoute(_a) {
    var children = _a.children;
    var _b = use_auth_1.useAuth(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, router]);
    if (isLoading) {
        return null; // or your loading component
    }
    if (!isAuthenticated) {
        return null;
    }
    return React.createElement(React.Fragment, null, children);
}
exports.ProtectedRoute = ProtectedRoute;
