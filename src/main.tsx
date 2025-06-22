import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // make sure your global CSS is still imported

// RevenueCat & Supabase setup (if you’re still doing this here)
import Purchases from '@revenuecat/purchases-js';
import { supabase } from './utils/supabaseClient';

const RC_PUBLIC_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY!;
if (!RC_PUBLIC_KEY) throw new Error('Missing VITE_REVENUECAT_PUBLIC_API_KEY');

Purchases.configure(RC_PUBLIC_KEY);
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user?.id) Purchases.identify(session.user.id);
});

// ----------------------
// The only change below:
// ----------------------
const container = document.getElementById('root');
if (!container) throw new Error('Root container missing in HTML');
const root = createRoot(container);
root.render(<App />);
