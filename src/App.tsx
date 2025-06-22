import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import Track from './components/Track/Track';
import AIInsights from './components/Insights/AIInsights';
import { useCarbonStore } from './store/carbonStore';
import { Paywall } from './components/Paywall/Paywall';
import { Challenges } from './components/Challenges';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-6 bg-red-100 text-red-800">
      <h2 className="text-lg font-bold">Something went wrong:</h2>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fetchActivities = useCarbonStore((s) => s.fetchActivities)

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'track':
        return <Track />;
      case 'insights':
        return <AIInsights />;
      case 'goals':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Goals & Targets</h2>
            <p className="text-gray-600">Set and track your carbon reduction goals</p>
            <div className="mt-8 text-sm text-gray-500">Coming soon...</div>
          </div>
        );
      case 'challenges':
        return <Challenges />;
      case 'offset':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Carbon Offsetting</h2>
            <p className="text-gray-600">Purchase verified carbon credits to offset your footprint</p>
            <div className="mt-8 text-sm text-gray-500">Coming soon...</div>
          </div>
        );
      case 'premium':
        return <Paywall />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track" element={<Track />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/premium" element={<Paywall />} />
          {/* ...other routes */}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;