import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { useCarbonStore } from '../../store/carbonStore';

interface CarbonChartProps {
  data: Array<{
    date: string;
    footprint: number;
    goal?: number;
  }>;
  type?: 'line' | 'bar';
  title: string;
}

export default function CarbonChart({ data, type = 'line', title }: CarbonChartProps) {
  const activities = useCarbonStore((state) => state.activities);

  const Chart = type === 'line' ? LineChart : BarChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} kg CO₂`, 'Carbon Footprint']}
            />
            {type === 'line' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="footprint"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                />
                {data.some(d => d.goal) && (
                  <Line
                    type="monotone"
                    dataKey="goal"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </>
            ) : (
              <Bar dataKey="footprint" fill="#22c55e" radius={[4, 4, 0, 0]} />
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}