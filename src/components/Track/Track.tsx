import React from 'react';
import ActivityForm from './ActivityForm';
import VoiceInput from './VoiceInput';
import { ReceiptUpload } from './ReceiptUpload';

export default function Track() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Track Your Carbon Footprint</h1>
        <p className="text-gray-600 mt-2">
          Add activities manually, use voice input, or upload receipts for AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Input */}
        <VoiceInput />
        
        {/* Receipt Upload */}
        <ReceiptUpload />
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">🚗 Daily Commute</div>
              <div className="text-sm text-gray-500">Track your regular commute</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">🏠 Home Energy</div>
              <div className="text-sm text-gray-500">Log electricity/gas usage</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">🍽️ Meal Impact</div>
              <div className="text-sm text-gray-500">Calculate food footprint</div>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Form */}
      <ActivityForm />
    </div>
  );
}