import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as Purchases from '@revenuecat/purchases-js';
import { supabase } from './utils/supabaseClient';

// 1) Get your public API key from env

const RC_PUBLIC_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY!;
Purchases.configure(RC_PUBLIC_KEY)

// also re-identify when auth state changes:
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user?.id) {
    Purchases.identify(session.user.id)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
