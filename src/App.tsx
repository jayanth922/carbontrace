// src/App.tsx

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Layout/Header'
import Dashboard from './components/Dashboard/Dashboard'
import Track from './components/Track/Track'
import AIInsights from './components/Insights/AIInsights'
import Challenges from './components/Challenges'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track" element={<Track />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
