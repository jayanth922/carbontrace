import React from 'react';
import { BarChart3, Plus, Target, Trophy, Lightbulb, Leaf } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Paywall } from '../Paywall/Paywall';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'track', label: 'Track', icon: Plus },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
    { id: 'offset', label: 'Offset', icon: Leaf },
    { id: 'premium', label: 'Premium', icon: Trophy },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <NavLink
                key={tab.id}
                to={`/${tab.id}`}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}