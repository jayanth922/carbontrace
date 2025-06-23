import React, { useState } from 'react';
import ActivityForm from './ActivityForm';
import VoiceInput from './VoiceInput';
import { ReceiptUpload } from './ReceiptUpload';
import { useCarbonStore } from '../../store/carbonStore';

export default function Track() {
  const addActivity = useCarbonStore((s) => s.addActivity);

  const [type, setType] = useState<'transport' | 'energy' | 'food' | 'shopping' | 'travel'>('transport');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0); // e.g. km, kWh, kg CO2
  const [metadata, setMetadata] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addActivity({
        type,
        description,
        carbon_kg: amount,
        metadata: metadata ? JSON.parse(metadata) : {},
      });
      // clear form
      setDescription('');
      setAmount(0);
      setMetadata('');
      alert('Activity stored!');
    } catch (err) {
      console.error(err);
      alert('Failed to store activity.');
    }
  };

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

      {/* New Activity Form */}
      <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Track New Activity</h2>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'transport' | 'energy' | 'food' | 'shopping' | 'travel')}
            className="mt-1 block w-full border rounded p-2"
          >
            <option value="transport">Transport</option>
            <option value="energy">Energy</option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="travel">Travel</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Drove 10 km"
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Amount (kg CO₂)</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Metadata (JSON)</span>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder='e.g. {"vehicle":"electric"}'
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Activity
        </button>
      </form>
    </div>
  );
}