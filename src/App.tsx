import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import Track from './components/Track/Track';
import AIInsights from './components/Insights/AIInsights';
import { useCarbonStore } from './store/carbonStore';
import { Paywall } from './components/Paywall/Paywall';
import { Challenges } from './components/Challenges';

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
  );
}

export default App;