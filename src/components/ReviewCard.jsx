import React from 'react';
import { ShieldCheck, ShieldAlert, Brain, Percent } from 'lucide-react';

export default function ReviewCard({ review }) {
  const isFake = review.label === 'Fake';
  const confidencePercent = Math.round(review.confidence * 100);

  // Helper function to highlight keywords dynamically
  const getHighlightedText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;

    // Escape special regex characters in keywords
    const escapedKws = keywords
      .map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .filter(Boolean);

    if (escapedKws.length === 0) return text;

    const regex = new RegExp(`(${escapedKws.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark 
          key={index} 
          className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-medium dark:bg-amber-950/60 dark:text-amber-200 border-b border-amber-300/40 dark:border-amber-700/40 select-all"
        >
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`group relative flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
      isFake 
        ? 'border-rose-100/70 hover:border-rose-200 dark:border-rose-950/30 dark:hover:border-rose-900/50' 
        : 'border-emerald-100/70 hover:border-emerald-200 dark:border-emerald-950/30 dark:hover:border-emerald-900/50'
    }`}>
      
      {/* Top row: Badges and Confidence */}
      <div className="flex items-center justify-between gap-2 mb-3">
        
        {/* Label Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
          isFake 
            ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
        }`}>
          {isFake ? (
            <ShieldAlert className="h-3.5 w-3.5" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          <span>{review.label}</span>
        </div>

        {/* Confidence score indicator pill */}
        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider select-none ${
          isFake 
            ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30'
        }`}>
          <span className="text-[8px]">{isFake ? '🔴' : '🟢'}</span>
          <span>{confidencePercent}%</span>
        </div>

      </div>

      {/* Review Text Area */}
      <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1">
        "{getHighlightedText(review.text, review.keywords)}"
      </div>

      {/* Bottom Row: AI Insights Explanation */}
      <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed transition-colors ${
        isFake
          ? 'bg-rose-50/50 text-rose-800 border-rose-100/50 dark:bg-rose-950/10 dark:text-rose-300 dark:border-rose-900/10'
          : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-800/30'
      }`}>
        <Brain className={`h-4 w-4 shrink-0 mt-0.5 ${isFake ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`} />
        <div>
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block mb-0.5">
            AI Explanation
          </span>
          {review.reason}
        </div>
      </div>

    </div>
  );
}
