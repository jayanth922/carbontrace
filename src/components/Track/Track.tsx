// src/components/Track/Track.tsx

import React, { useState, useRef, FormEvent } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import {
  MicrophoneIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline'
import { Car, UtensilsCrossed, Plane, Home, Zap, ShoppingBag } from 'lucide-react'
import {
  transportFactors,
  energyFactors,
  foodFactors,
} from '../../utils/emissionFactors'

type ActivityType =
  | 'transport'
  | 'energy'
  | 'food'
  | 'shopping'
  | 'travel'

export default function Track() {
  const addActivity = useCarbonStore((s) => s.addActivity)

  // --- Voice recording state & refs ---
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder>()
  const audioChunksRef = useRef<Blob[]>([])

  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      recorder.onstop = () =>
        processVoice(new Blob(audioChunksRef.current))
      recorder.start()
      setRecording(true)
    } else {
      mediaRecorderRef.current?.stop()
      setRecording(false)
    }
  }

  const processVoice = (audio: Blob) => {
    // TODO: send `audio` to AI endpoint, parse text → { type, desc, kg, meta }
    console.log('Voice blob ready for AI analysis:', audio)
  }

  // --- Receipt upload handler ---
  const handleReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // TODO: send `file` to OCR endpoint and extract carbon entries
    console.log('Receipt file:', file)
  }

  // --- Quick Actions presets ---
  const quickActions: {
    label: string
    icon: React.ReactNode
    preset: Parameters<typeof addActivity>[0]
  }[] = [
    {
      label: 'Daily Commute',
      icon: <Car className="h-6 w-6 text-green-500" />,
      preset: {
        type: 'transport',
        description: 'Daily commute',
        carbon_kg: 5,
        metadata: { vehicle: 'car' },
      },
    },
    {
      label: 'Home Energy',
      icon: <Home className="h-6 w-6 text-yellow-500" />,
      preset: {
        type: 'energy',
        description: 'Home electricity usage',
        carbon_kg: 10,
        metadata: { source: 'grid' },
      },
    },
    {
      label: 'Meal Impact',
      icon: <UtensilsCrossed className="h-6 w-6 text-red-500" />,
      preset: {
        type: 'food',
        description: 'Standard meal',
        carbon_kg: 2.5,
        metadata: { food: 'mixed' },
      },
    },
  ]

  // --- Manual form state ---
  const [type, setType] = useState<ActivityType>('transport')
  const [description, setDescription] = useState('')
  const [measurement, setMeasurement] = useState<number>(0)
  const [subType, setSubType] = useState<string>('')
  const [carbonInput, setCarbonInput] = useState<number>(0)

  // Choose the right factor table
  const factors = (() => {
    if (type === 'transport') return transportFactors
    if (type === 'energy') return energyFactors
    if (type === 'food') return foodFactors
    return {}
  })()

  // Compute carbon for factor-based types
  const computedCarbon = (() => {
    if (type === 'transport' || type === 'energy' || type === 'food') {
      const factor = factors[subType] || 0
      return +(measurement * factor).toFixed(2)
    }
    return carbonInput
  })()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const meta =
      type === 'transport' || type === 'energy' || type === 'food'
        ? { subType, measurement }
        : {}
    await addActivity({
      type,
      description,
      carbon_kg: computedCarbon,
      metadata: meta,
    })
    // reset
    setDescription('')
    setMeasurement(0)
    setSubType('')
    setCarbonInput(0)
    alert(`Activity saved: ${computedCarbon} kg CO₂`)
  }

  // Helper icons for the bottom form
  const typeIcons: Record<ActivityType, React.ReactNode> = {
    transport: <Car className="h-5 w-5" />,
    energy: <Zap className="h-5 w-5" />,
    food: <UtensilsCrossed className="h-5 w-5" />,
    shopping: <ShoppingBag className="h-5 w-5" />,
    travel: <Plane className="h-5 w-5" />,
  }

  // Dropdown options for factor types
  const subOptions = Object.keys(factors)

  return (
    <div className="space-y-8 px-6 py-4">
      <h2 className="text-3xl font-bold text-center">
        Track Your Carbon Footprint
      </h2>

      {/* Voice / Receipt / Quick Actions panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voice Input */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <MicrophoneIcon
            onClick={toggleRecording}
            className={`h-12 w-12 cursor-pointer ${
              recording ? 'text-red-500' : 'text-green-500'
            }`}
          />
          <p className="mt-4 font-medium">
            Tap to {recording ? 'stop' : 'start'} recording
          </p>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Try: “I drove 20 km in my electric car” or “I used 10 kWh of
            electricity”
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
              onChange={handleReceipt}
              className="hidden"
            />
          </label>
          <p className="mt-2 text-sm text-gray-500 text-center">
            AI will detect items & calculate carbon
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium">Quick Actions</h3>
          {quickActions.map(({ label, icon, preset }) => (
            <button
              key={label}
              onClick={() => addActivity(preset)}
              className="w-full flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
            >
              {icon}
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Track Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Category selector */}
          <div className="flex space-x-2">
            {(
              [
                'transport',
                'energy',
                'food',
                'shopping',
                'travel',
              ] as ActivityType[]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t)
                  setSubType('')
                  setMeasurement(0)
                  setCarbonInput(0)
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 border rounded-lg text-sm font-medium ${
                  type === t
                    ? 'bg-green-50 border-green-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {typeIcons[t]}
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>

          {/* Description */}
          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full border rounded p-2"
              placeholder="What did you do?"
            />
          </label>

          {/* If factor-based: measurement + subtype */}
          {(type === 'transport' ||
            type === 'energy' ||
            type === 'food') && (
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">
                  {type === 'transport'
                    ? 'Distance (km)'
                    : type === 'energy'
                    ? 'Energy (kWh)'
                    : 'Weight (kg)'}
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={measurement}
                  onChange={(e) =>
                    setMeasurement(parseFloat(e.target.value))
                  }
                  required
                  className="mt-1 block w-full border rounded p-2"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Type</span>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  required
                  className="mt-1 block w-full border rounded p-2"
                >
                  <option value="">Select…</option>
                  {subOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* If not factor-based: manual carbon input */}
          {(type === 'shopping' || type === 'travel') && (
            <label className="block">
              <span className="text-sm font-medium">
                Carbon (kg CO₂)
              </span>
              <input
                type="number"
                step="0.01"
                value={carbonInput}
                onChange={(e) =>
                  setCarbonInput(parseFloat(e.target.value))
                }
                required
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
          )}

          {/* Estimated / entered carbon */}
          <div>
            <span className="text-sm text-gray-600">
              Estimated Carbon
            </span>
            <p className="text-2xl font-bold">
              {computedCarbon.toFixed(2)} kg CO₂
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !description ||
              ((type === 'transport' ||
                type === 'energy' ||
                type === 'food') &&
                (!measurement || !subType))
            }
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Save Activity
          </button>
        </form>
      </div>
    </div>
  )
}
