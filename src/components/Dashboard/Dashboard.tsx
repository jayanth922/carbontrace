// src/components/Dashboard/Dashboard.tsx

import React, { useEffect } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import StatsCard from './StatsCard'
import CarbonChart from './CarbonChart'
import CategoryBreakdown from './CategoryBreakdown'

export default function Dashboard() {
  const { activities, loading, fetchActivities } = useCarbonStore()

  // Fetch on mount
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Safely derive your stats
  const totalCarbon = activities.reduce((sum, a) => sum + a.carbon_kg, 0)
  // You can similarly compute `monthCarbon`, `weekCarbon`, `goal`…

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total" value={`${totalCarbon.toFixed(2)} kg`} />
        {/* <StatsCard title="This Month" value={…} /> */}
        {/* <StatsCard title="This Week" value={…} /> */}
        {/* <StatsCard title="Monthly Goal" value={…} /> */}
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Carbon Footprint</h2>
        <CarbonChart activities={activities} />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <CategoryBreakdown activities={activities} />
      </div>
    </div>
  )
}
