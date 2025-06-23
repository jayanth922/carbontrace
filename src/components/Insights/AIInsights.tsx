// src/components/Insights/AIInsights.tsx

import { useState } from 'react'
import { LightBulbIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'

export default function AIInsights() {
  const tips = [
    'Recycling one aluminum can saves enough energy to power a TV for 3 hours',
    'A 5-minute shorter shower can save 12kg of CO₂ per month',
    'Keeping devices longer reduces e-waste and manufacturing emissions',
  ]

  const [playingIdx, setPlayingIdx] = useState<number | null>(null)

  const playTip = async (tip: string, idx: number) => {
    setPlayingIdx(idx)
    try {
      const res = await fetch('/.netlify/functions/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tip }),
      })
      if (!res.ok) {
        console.error('TTS failed', await res.text())
        return
      }
      const buf = await res.arrayBuffer()
      const blob = new Blob([buf], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      await audio.play()
    } catch (e) {
      console.error('Error playing tip:', e)
    } finally {
      setPlayingIdx(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Daily Tips */}
      <div className="bg-green-600 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-green-700/50 p-4 rounded-md flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <LightBulbIcon className="h-5 w-5 text-green-200" />
              <span className="text-green-50">{tip}</span>
            </div>
            <button
              onClick={() => playTip(tip, idx)}
              disabled={playingIdx === idx}
              className="p-1 hover:bg-green-800 rounded-full"
            >
              {playingIdx === idx ? (
                <span className="block h-5 w-5 border-2 border-green-200 border-t-transparent rounded-full animate-spin" />
              ) : (
                <SpeakerWaveIcon className="h-5 w-5 text-green-200" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
        <div className="text-center py-10 text-gray-400">
          <LightBulbIcon className="mx-auto h-10 w-10" />
          <p>No recommendations yet</p>
          <p className="mt-2 text-sm">
            Track some activities to get personalized AI recommendations for reducing your carbon footprint.
          </p>
        </div>
      </div>

      {/* Impact Forecast */}
      <div className="bg-white rounded-lg shadow p-6 flex justify-around">
        <div className="text-center">
          <span className="text-2xl font-bold text-green-600">0.0 kg</span>
          <p>Potential Monthly Savings</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-800">0 kg</span>
          <p>Annual Impact</p>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-blue-600">0</span>
          <p>Trees Equivalent</p>
        </div>
      </div>
    </div>
  )
}
