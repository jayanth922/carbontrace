import React, { useMemo } from 'react';
import { TrendingDown, Target, Zap, Calendar } from 'lucide-react';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCarbonFootprint } from '../../utils/carbonCalculations';
import StatsCard from './StatsCard';
import CarbonChart from './CarbonChart';
import CategoryBreakdown from './CategoryBreakdown';
import { format, subDays, startOfDay } from 'date-fns';

export default function Dashboard() {
  const { 
    activities, 
    user, 
    getTotalFootprint, 
    getMonthlyFootprint, 
    getWeeklyFootprint, 
    getFootprintByCategory 
  } = useCarbonStore();

  const totalFootprint = getTotalFootprint();
  const monthlyFootprint = getMonthlyFootprint();
  const weeklyFootprint = getWeeklyFootprint();
  const categoryData = getFootprintByCategory();

  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayActivities = activities.filter(
        activity => startOfDay(activity.date).getTime() === date.getTime()
      );
      const dayFootprint = dayActivities.reduce(
        (sum, activity) => sum + activity.carbonFootprint, 
        0
      );
      
      data.push({
        date: format(date, 'MMM dd'),
        footprint: Math.round(dayFootprint * 10) / 10,
        goal: user?.monthlyGoal ? user.monthlyGoal / 30 : undefined,
      });
    }
    return data;
  }, [activities, user?.monthlyGoal]);

  const monthlyProgress = user?.monthlyGoal ? (monthlyFootprint / user.monthlyGoal) * 100 : 0;
  const isOnTrack = monthlyProgress <= 100;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Footprint"
          value={formatCarbonFootprint(totalFootprint)}
          icon={TrendingDown}
          color="primary"
        />
        <StatsCard
          title="This Month"
          value={formatCarbonFootprint(monthlyFootprint)}
          change={`${monthlyProgress.toFixed(1)}% of goal`}
          changeType={isOnTrack ? 'positive' : 'negative'}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="This Week"
          value={formatCarbonFootprint(weeklyFootprint)}
          icon={Zap}
          color="green"
        />
        <StatsCard
          title="Monthly Goal"
          value={user?.monthlyGoal ? formatCarbonFootprint(user.monthlyGoal) : 'Not set'}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarbonChart
          data={chartData}
          title="Daily Carbon Footprint (Last 7 Days)"
          type="line"
        />
        <CategoryBreakdown data={categoryData} />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(activity.date, 'MMM dd, yyyy')} • {activity.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCarbonFootprint(activity.carbonFootprint)}
                  </p>
                  {activity.verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities tracked yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start tracking your carbon footprint to see insights here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}