// src/components/Dashboard/CarbonChart.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { subDays, format } from 'date-fns'
import type { Activity } from '../../store/carbonStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CarbonChartProps {
  activities: Activity[]
}

export default function CarbonChart({ activities }: CarbonChartProps) {
  const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i))
  const labels = days.map((d) => format(d, 'MMM d'))

  // build a map date→sum
  const sums: Record<string, number> = {}
  activities.forEach((a) => {
    const day = format(new Date(a.created_at), 'MMM d')
    sums[day] = (sums[day] || 0) + a.carbon_kg
  })

  const dataPoints = days.map((d) => sums[format(d, 'MMM d')] ?? 0)

  // Dashed goal line: 500kg/month → approx 16.7kg/day
  const dailyGoal = 500 / 30
  const goalLine = days.map(() => dailyGoal)

  const data = {
    labels,
    datasets: [
      {
        label: 'Goal',
        data: goalLine,
        borderColor: '#F59E0B',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Actual',
        data: dataPoints,
        borderColor: '#10B981',
        fill: false,
      },
    ],
  }

  const options = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'kg CO₂' } },
    },
  }

  if (activities.length === 0) {
    return <p className="text-center text-gray-400 py-10">No data available yet. Start tracking your activities!</p>
  }

  return <Line data={data} options={options} />
}
