// src/components/Track/Track.tsx
import React, { useState } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import { Car, BoltIcon, ShoppingBagIcon, TicketIcon, CakeIcon } from 'lucide-react'

const ICONS: Record<ActivityType, React.ReactNode> = {
  transport: <Car className="h-6 w-6 text-green-500" />,
  energy:    <BoltIcon className="h-6 w-6 text-yellow-500" />,
  food:      <CakeIcon className="h-6 w-6 text-red-500" />,
  shopping:  <ShoppingBagIcon className="h-6 w-6 text-blue-500" />,
  travel:    <TicketIcon className="h-6 w-6 text-purple-500" />,
}

type ActivityType = 'transport' | 'energy' | 'food' | 'shopping' | 'travel'

export default function Track() {
  const addActivity = useCarbonStore((s) => s.addActivity)

  const [type, setType] = useState<ActivityType>('transport')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [extra, setExtra] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let metadata: Record<string, string> = {}

    switch (type) {
      case 'transport':
        metadata = { vehicle: extra }
        break
      case 'energy':
        metadata = { source: extra }
        break
      case 'food':
        metadata = { cuisine: extra }
        break
      case 'shopping':
        metadata = { item: extra }
        break
      case 'travel':
        metadata = { mode: extra }
        break
    }

    await addActivity({ type, description, carbon_kg: amount, metadata })
    // reset
    setDescription('')
    setAmount(0)
    setExtra('')
    alert('Activity saved!')
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-white rounded-lg shadow p-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold">Track New Activity</h2>

      {/* Type selector */}
      <div className="flex space-x-2">
        {(['transport','energy','food','shopping','travel'] as ActivityType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 flex flex-col items-center p-4 border rounded-lg 
              ${type === t ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}
          >
            {ICONS[t]}
            <span className="mt-2 text-sm capitalize">{t}</span>
          </button>
        ))}
      </div>

      {/* Common fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you do?"
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Carbon (kg CO₂)</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </label>
      </div>

      {/* Type-specific extra field */}
      <label className="block">
        <span className="text-sm font-medium">
          {type === 'transport' && 'Vehicle Type'}
          {type === 'energy'    && 'Energy Source'}
          {type === 'food'      && 'Cuisine / Food Category'}
          {type === 'shopping'  && 'Item Purchased'}
          {type === 'travel'    && 'Mode of Travel'}
        </span>
        <input
          type="text"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={
            type === 'transport' ? 'e.g. Electric Car' :
            type === 'energy'    ? 'e.g. Grid Electricity' :
            type === 'food'      ? 'e.g. Italian' :
            type === 'shopping'  ? 'e.g. Jeans' :
            'e.g. Plane'
          }
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Save Activity
      </button>
    </form>
  )
}
