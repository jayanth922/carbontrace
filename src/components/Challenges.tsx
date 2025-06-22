import React, { useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface Myth {
  statement: string
  isTrue: boolean
}

const myths: Myth[] = [
  {
    statement:
      'Eating a tomato produces more CO₂ than driving a car for 1 km.',
    isTrue: false,
  },
  {
    statement:
      'Recycling one plastic bottle saves enough energy to power a laptop for 3 hours.',
    isTrue: true,
  },
  {
    statement:
      'A single flight from New York to London emits more CO₂ than the average person in Africa does in a year.',
    isTrue: true,
  },
  {
    statement:
      'Electric cars emit more carbon than diesel cars over their lifecycle.',
    isTrue: false,
  },
  {
    statement:
      'Growing your own vegetables always has zero carbon footprint.',
    isTrue: false,
  },
]

export default function Challenges() {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const answer = (guess: boolean) => {
    if (myths[current].isTrue === guess) {
      setScore((s) => s + 1)
    }
    if (current + 1 < myths.length) {
      setCurrent((c) => c + 1)
    } else {
      setFinished(true)
    }
  }

  const shareToReddit = () => {
    const title = encodeURIComponent(
      `I scored ${score}/${myths.length} on the CarbonTrace Myth Buster!`
    )
    const text = encodeURIComponent(
      `I just completed the CarbonTrace Myth Buster quiz and got ${score}/${myths.length}! Prove your sustainability smarts at https://carbontrace.app 🌱`
    )
    window.open(
      `https://www.reddit.com/submit?title=${title}&text=${text}`,
      '_blank'
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold">CarbonTrace Myth Buster</h2>

      {!finished ? (
        <>
          <p className="text-lg">{myths[current].statement}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => answer(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              True
            </button>
            <button
              onClick={() => answer(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              False
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Question {current + 1} of {myths.length}
          </p>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-xl">
            You scored <span className="font-bold">{score}</span> out of{' '}
            {myths.length}!
          </p>
          <button
            onClick={shareToReddit}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 space-x-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>Share on Reddit</span>
          </button>
        </div>
      )}
    </div>
  )
}
