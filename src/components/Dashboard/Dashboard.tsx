// src/components/Dashboard/Dashboard.tsx

import React, { useEffect } from 'react'
import { useCarbonStore } from '../../store/carbonStore'
import StatsCard from './StatsCard'
import CarbonChart from './CarbonChart'
import CategoryBreakdown from './CategoryBreakdown'
import RecentActivities from './RecentActivities'
import { ChartBarIcon, CalendarDaysIcon, BoltIcon, TargetIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { activities, loading, fetchActivities } = useCarbonStore()

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  if (loading) {
    return <p className="p-6 text-center">Loading dashboard…</p>
  }

  const total = activities.reduce((sum, a) => sum + a.carbon_kg, 0)
  const monthlyGoal = 500
  const monthPct = ((total / monthlyGoal) * 100).toFixed(1)
  // You can compute weekly/monthly sums similarly—using filters on `a.created_at`

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<ChartBarIcon className="h-6 w-6 text-green-500" />}
          title="Total Footprint"
          value={`${total.toFixed(2)} kg`}
        />
        <StatsCard
          icon={<CalendarDaysIcon className="h-6 w-6 text-blue-500" />}
          title="This Month"
          value={`${total.toFixed(2)} kg`}
          subtext={`${monthPct}% of goal`}
        />
        <StatsCard
          icon={<BoltIcon className="h-6 w-6 text-green-500" />}
          title="This Week"
          value={`${total.toFixed(2)} kg`}
        />
        <StatsCard
          icon={<TargetIcon className="h-6 w-6 text-orange-500" />}
          title="Monthly Goal"
          value={`${monthlyGoal} kg`}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Carbon Footprint (Last 7 Days)</h2>
          <CarbonChart activities={activities} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Carbon Footprint by Category</h2>
          <CategoryBreakdown activities={activities} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <RecentActivities activities={activities} />
      </div>
    </div>
  )
}
