// src/components/Dashboard/Dashboard.tsx

import { useEffect } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import StatsCard from './StatsCard'
import CarbonChart from './CarbonChart'
import CategoryBreakdown from './CategoryBreakdown'
import RecentActivities from './RecentActivities'
import { ChartBarIcon, CalendarDaysIcon, BoltIcon, FlagIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const {
    loading,
    fetchAll,
    total,
    monthTotal,
    weekTotal,
    dailyData,
    categoryData,
    recent,
  } = useCarbonStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (loading) {
    return <p className="p-6 text-center">Loading dashboard…</p>
  }

  // percentage toward a 500kg goal
  const monthlyGoal = 500
  const monthPct = ((monthTotal / monthlyGoal) * 100).toFixed(1)

  // Transform `categoryData` into an array of `Activity` objects
  const categoryActivities = Object.entries(categoryData).map(([type, carbon_kg], index) => ({
    id: `category-${index}`,
    user_id: 'default_user',
    type,
    description: `Category: ${type}`,
    carbon_kg,
    metadata: {},
    created_at: new Date().toISOString(),
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<ChartBarIcon className="h-6 w-6 text-green-500" />}
          title="Total Footprint"
          value={`${total.toFixed(2)} kg`}
        />
        <StatsCard
          icon={<CalendarDaysIcon className="h-6 w-6 text-blue-500" />}
          title="This Month"
          value={`${monthTotal.toFixed(2)} kg`}
          subtext={`${monthPct}% of goal`}
        />
        <StatsCard
          icon={<BoltIcon className="h-6 w-6 text-green-500" />}
          title="This Week"
          value={`${weekTotal.toFixed(2)} kg`}
        />
        <StatsCard
          icon={<FlagIcon className="h-6 w-6 text-orange-500" />}
          title="Monthly Goal"
          value={`${monthlyGoal} kg`}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Carbon Footprint (Last 7 Days)</h2>
          <CarbonChart
            activities={dailyData.map((data, index) => ({
              id: index.toString(),
              user_id: 'default_user',
              type: 'daily',
              description: `Activity for ${data.label}`,
              date: new Date().toISOString(),
              value: data.value,
              carbon_kg: data.value, // Assuming `value` represents carbon in kg
              metadata: {}, // Add appropriate metadata if available
              created_at: new Date().toISOString(), // Use current timestamp
            }))}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Carbon Footprint by Category</h2>
          <CategoryBreakdown activities={categoryActivities} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <RecentActivities activities={recent} />
      </div>
    </div>
  )
}
