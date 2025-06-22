// src/components/Dashboard/Dashboard.tsx

import { useEffect } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import StatsCard from './StatsCard'
import CarbonChart from './CarbonChart'
import CategoryBreakdown from './CategoryBreakdown'

export default function Dashboard() {
  const { activities, fetchActivities, loading } = useCarbonStore()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const total = activities.reduce((sum, a) => sum + a.carbon_kg, 0)

  if (loading) return <p>Loading…</p>

  // Transform activities for CarbonChart
  const chartData = activities.map((activity) => ({
    date: activity.created_at,
    footprint: activity.carbon_kg,
    goal: undefined, // Add goal logic if available
  }))

  // Transform activities for CategoryBreakdown
  const categoryData = activities.reduce(
    (acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + activity.carbon_kg
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total"
          value={`${total.toFixed(2)} kg`}
          icon={() => <span />} // Replace with actual icon component
          color="primary"
        />
        {/* <StatsCard title="This Month" value={…} /> */}
        {/* <StatsCard title="This Week" value={…} /> */}
        {/* <StatsCard title="Monthly Goal" value={…} /> */}
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Carbon Footprint</h2>
        <CarbonChart data={chartData} title="Daily Carbon Footprint" />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <CategoryBreakdown data={categoryData} />
      </div>
    </div>
  )
}
