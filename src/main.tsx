// src/main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './components/Auth/AuthProvider';

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container not found')
}
createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
