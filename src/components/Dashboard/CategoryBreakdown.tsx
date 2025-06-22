import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useCarbonStore } from '../../store/carbonStore';

interface CategoryBreakdownProps {
  data: Record<string, number>;
}

const COLORS = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
  travel: '#ef4444',
};

const CATEGORY_LABELS = {
  transport: 'Transport',
  energy: 'Energy',
  food: 'Food',
  shopping: 'Shopping',
  travel: 'Travel',
};

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const activities = useCarbonStore((state) => state.activities);

  const chartData = Object.entries(data).map(([category, value]) => ({
    name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category,
    value: Math.round(value * 10) / 10,
    color: COLORS[category as keyof typeof COLORS] || '#6b7280',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Footprint by Category</h3>
      
      {total > 0 ? (
        <div className="flex flex-col lg:flex-row items-center">
          <div className="h-64 w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} kg CO₂`, 'Emissions']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-6">
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value} kg
                    </span>
                    <div className="text-xs text-gray-500">
                      {((item.value / total) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available yet. Start tracking your activities!</p>
        </div>
      )}
    </motion.div>
  );
}