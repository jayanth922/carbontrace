// src/main.tsx

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

import * as Purchases from '@revenuecat/purchases-js'
import { supabase } from './utils/supabaseClient'

// 1) Grab your public RevenueCat key from env
const RC_PUBLIC_KEY = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY
if (!RC_PUBLIC_KEY) {
  throw new Error('Missing VITE_REVENUECAT_PUBLIC_API_KEY in environment')
}

// 2) Configure Purchases (no user ID yet)
Purchases.configure(RC_PUBLIC_KEY)

// 3) If a user is already signed in, identify them in RevenueCat
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user?.id) {
    Purchases.identify(session.user.id)
  }
})

// 4) Listen for future sign-in / sign-out events
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user?.id) {
    Purchases.identify(session.user.id)
  }
})


// 5) Boot the React app with createRoot
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container not found in HTML')
}
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
