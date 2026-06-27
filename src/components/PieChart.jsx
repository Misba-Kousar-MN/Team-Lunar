import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ReviewPieChart({ genuine, fake }) {
  const data = [
    { name: 'Genuine Reviews', value: genuine, color: '#10b981' }, // emerald-500
    { name: 'Fake / Suspicious', value: fake, color: '#ef4444' }, // rose-500
  ];

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-xl border border-slate-800">
          <span className="font-semibold" style={{ color: item.payload.color }}>
            {item.name}
          </span>
          : <span className="font-bold">{item.value}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm h-[320px] transition-all duration-300">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Review Classification Breakdown
      </h3>

      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="outline-none stroke-white dark:stroke-slate-900" 
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
              formatter={(value, entry) => (
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">
                  {value} ({entry.payload.value}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text displaying dominant review label */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {genuine >= fake ? `${genuine}%` : `${fake}%`}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {genuine >= fake ? 'Genuine' : 'Fake'}
          </span>
        </div>
      </div>
    </div>
  );
}
