// src/components/Dashboard/CategoryBreakdown.tsx

import type { Activity } from '../../store/carbonStore'

interface CategoryBreakdownProps {
  activities: Activity[]
}

export default function CategoryBreakdown({ activities }: CategoryBreakdownProps) {
  if (activities.length === 0) {
    return <p className="text-center text-gray-400 py-10">No data available yet. Start tracking your activities!</p>
  }

  // sum by type
  const sums: Record<string, number> = {}
  activities.forEach((a) => {
    sums[a.type] = (sums[a.type] || 0) + a.carbon_kg
  })

  return (
    <ul className="space-y-2">
      {Object.entries(sums).map(([type, kg]) => (
        <li key={type} className="flex justify-between">
          <span className="capitalize">{type}</span>
          <span>{kg.toFixed(2)} kg</span>
        </li>
      ))}
    </ul>
  )
}
