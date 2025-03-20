"use strict";
exports.__esModule = true;
exports.SupabaseProvider = exports.useSupabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var react_1 = require("react");
var SupabaseContext = react_1.createContext({
    supabase: null
});
function useSupabase() {
    var context = react_1.useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
}
exports.useSupabase = useSupabase;
function SupabaseProvider(_a) {
    var children = _a.children;
    var _b = react_1.useState(null), supabase = _b[0], setSupabase = _b[1];
    react_1.useEffect(function () {
        // Initialize Supabase client
        var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase credentials are not properly configured');
            return;
        }
        var client = supabase_js_1.createClient(supabaseUrl, supabaseAnonKey);
        setSupabase(client);
    }, []);
    return (React.createElement(SupabaseContext.Provider, { value: { supabase: supabase } }, children));
}
exports.SupabaseProvider = SupabaseProvider;
