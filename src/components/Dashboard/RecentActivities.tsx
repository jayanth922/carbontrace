// src/components/Dashboard/RecentActivities.tsx

import React from 'react'
import type { Activity } from '../../store/carbonStore'
import { format } from 'date-fns'

interface RecentActivitiesProps {
  activities: Activity[]
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return <p className="text-center text-gray-400 py-10">No activities tracked yet. Start tracking your carbon footprint to see insights here.</p>
  }

  return (
    <ul className="divide-y">
      {activities.slice(0, 5).map((a) => (
        <li key={a.id} className="py-2 flex justify-between">
          <div>
            <p className="font-medium">{a.description}</p>
            <p className="text-xs text-gray-500">{format(new Date(a.created_at), 'PPpp')}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{a.carbon_kg.toFixed(2)} kg</p>
            <p className="text-xs text-gray-500 capitalize">{a.type}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
