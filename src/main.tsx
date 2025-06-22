import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Purchases } from '@revenuecat/purchases-js';
import { supabase } from './utils/supabaseClient';

// 1) Get your public API key from env
const RC_PUBLIC_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY!;
if (!RC_PUBLIC_KEY) throw new Error('Missing VITE_REVENUECAT_PUBLIC_API_KEY');

// 2) Configure once, after you know the user ID
supabase.auth.getSession().then(({ data: { session } }) => {
  Purchases.configure(RC_PUBLIC_KEY, session?.user?.id); // pass undefined if not signed in
});
supabase.auth.onAuthStateChange((_event, session) => {
  Purchases.configure(RC_PUBLIC_KEY, session?.user?.id);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
