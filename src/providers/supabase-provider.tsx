import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

interface SupabaseContextType {
  supabase: SupabaseClient | null;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
});

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials are not properly configured');
      return;
    }

    const client = createClient(supabaseUrl, supabaseAnonKey);
    setSupabase(client);
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}