// src/components/Dashboard/StatsCard.tsx

import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string
  subtext?: string
}

export default function StatsCard({ icon, title, value, subtext }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <div className="p-2 bg-green-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
    </div>
  )
}
