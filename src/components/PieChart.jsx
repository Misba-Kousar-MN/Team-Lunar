import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ReviewPieChart({ genuinePct, fakePct, genuineCount, fakeCount }) {
  const chartData = [
    { name: 'Genuine', value: genuinePct || 0, color: '#10B981' }, // success
    { name: 'Suspicious', value: fakePct || 0, color: '#EF4444' }, // danger
  ];

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 h-[280px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] justify-between transition-all duration-300">
      <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span>Review Breakdown</span>
        <span className="text-[10px] cursor-help" title="Distribution of reviews classified as Genuine vs. Suspicious.">ⓘ</span>
      </div>

      <div className="flex-1 flex items-center justify-between gap-4 mt-2">
        {/* Left side: Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={48}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-slate-850 dark:text-slate-100">{genuinePct}%</span>
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Genuine</span>
          </div>
        </div>

        {/* Right side: Indicators List */}
        <div className="flex-1 flex flex-col justify-center space-y-3.5 pl-2 select-none">
          <div className="flex items-start gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
            <div>
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wide block">Genuine Reviews</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-0.5">
                {(genuineCount || 0).toLocaleString()} ({genuinePct}%)
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0 mt-1" />
            <div>
              <span className="text-[10px] font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wide block">Suspicious Reviews</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-0.5">
                {(fakeCount || 0).toLocaleString()} ({fakePct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors cursor-pointer select-none pt-1">
        View all reviews →
      </div>
    </div>
  );
}
