import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabaseClient';

const AuthContext = createContext<Session | null | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null); // Default to null

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null); // Ensure session is accessed safely
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session || null); // Directly use session as it is passed by the callback
    });

    return () => {
      authListener?.subscription?.unsubscribe(); // Safely unsubscribe
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be inside AuthProvider');
  }
  return ctx;
}
