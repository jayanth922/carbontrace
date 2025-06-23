// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Track from './components/Track/Track';
import AIInsights from './components/Insights/AIInsights';
import Challenges from './components/Challenges';
import Login from './components/Auth/Login';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <main className="mt-4">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="track" element={<Track />} />
                      <Route path="insights" element={<AIInsights />} />
                      <Route path="challenges" element={<Challenges />} />
                    </Routes>
                  </main>
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
