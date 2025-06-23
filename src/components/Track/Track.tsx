// src/components/Track/Track.tsx
import React, { useState, useRef } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import {
  MicrophoneIcon,
  DocumentArrowUpIcon,
  TruckIcon,
  HomeIcon,
  CakeIcon,
} from '@heroicons/react/24/outline'

type ActivityType = 'transport' | 'energy' | 'food' | 'shopping' | 'travel'

export default function Track() {
  const addActivity = useCarbonStore((s) => s.addActivity)

  // -- form state --
  const [type, setType] = useState<ActivityType>('transport')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [extra, setExtra] = useState('')

  // -- voice recording refs/state --
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder>()
  const audioChunksRef = useRef<Blob[]>([])

  // Start / stop recording
  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      audioChunksRef.current = []
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      mr.onstop = () => processVoice(new Blob(audioChunksRef.current))
      mr.start()
      setRecording(true)
    } else {
      mediaRecorderRef.current?.stop()
      setRecording(false)
    }
  }

  // Stub: parse voice and call addActivity()
  const processVoice = (audio: Blob) => {
    // TODO: send `audio` to your AI endpoint and get { type, desc, kg, extra }
    console.log('Received audio blob:', audio)
    // Example stub:
    // addActivity({ type: 'transport', description: 'Drove 15km', carbon_kg: 3.2, metadata: { vehicle: 'car' } })
  }

  // Receipt upload handler
  const handleReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // TODO: send `file` to your receipt-OCR endpoint
    console.log('Uploaded receipt:', file)
  }

  // Quick-action shortcuts
  const quickActions: { label: string; icon: React.ReactNode; preset: Partial<Parameters<typeof addActivity>[0]> }[] = [
    {
      label: 'Daily Commute',
      icon: <TruckIcon className="h-6 w-6 text-green-500" />,
      preset: { type: 'transport', description: 'Daily commute', carbon_kg: 5, metadata: { vehicle: 'car' } },
    },
    {
      label: 'Home Energy',
      icon: <HomeIcon className="h-6 w-6 text-yellow-500" />,
      preset: { type: 'energy', description: 'Home electricity usage', carbon_kg: 10, metadata: { source: 'grid' } },
    },
    {
      label: 'Meal Impact',
      icon: <CakeIcon className="h-6 w-6 text-red-500" />,
      preset: { type: 'food', description: 'Standard meal', carbon_kg: 2.5, metadata: { food: 'mixed' } },
    },
  ]

  // Manual form submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addActivity({ type, description, carbon_kg: amount, metadata: { extra } })
    setDescription('')
    setAmount(0)
    setExtra('')
    alert('Activity saved!')
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">Track Your Carbon Footprint</h2>
      {/* 3-panel UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voice Input */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <MicrophoneIcon
            className={`h-12 w-12 cursor-pointer ${recording ? 'text-red-500' : 'text-green-500'}`}
            onClick={toggleRecording}
          />
          <p className="mt-4 text-center">Tap to {recording ? 'stop' : 'start'} recording</p>
          <p className="mt-2 text-xs text-gray-400 text-center">
            Try: “I drove 20km in my electric car” or “I used 10kWh of electricity”
          </p>
        </div>

        {/* Receipt Upload */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <DocumentArrowUpIcon className="h-12 w-12 text-blue-500" />
          <label className="mt-4 cursor-pointer px-4 py-2 bg-blue-100 rounded">
            Choose Receipt
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReceipt}
            />
          </label>
          <p className="mt-2 text-xs text-gray-400 text-center">
            AI will detect items & calculate carbon
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          {quickActions.map(({ label, icon, preset }) => (
            <button
              key={label}
              type="button"
              className="w-full flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
              onClick={() => addActivity(preset as Parameters<typeof addActivity>[0])}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Track Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto space-y-4"
      >
        {/* Type selector */}
        <div className="flex space-x-2">
          {(['transport','energy','food','shopping','travel'] as ActivityType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 flex flex-col items-center p-3 border rounded ${
                type === t
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* reuse icons */}
              {quickActions.find((q) => q.preset.type === t)?.icon}
              <span className="mt-1 text-sm capitalize">{t}</span>
            </button>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="What did you do?"
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

        <label className="block">
          <span className="text-sm font-medium">Extra info</span>
          <input
            type="text"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Vehicle type, energy source, etc."
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Activity
        </button>
      </form>
    </div>
  )
}
