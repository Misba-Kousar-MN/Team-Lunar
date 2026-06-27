import React from 'react';
import { MoreVertical, Check } from 'lucide-react';

const getReviewerDetails = (id, label) => {
  const names = [
    "Rohit Sharma", "Neha Verma", "Siddharth Malhotra", "Priya Nair", 
    "Amit Patel", "Shreya Ghoshal", "Kabir Singh", "Divya Pillai", 
    "Rohan Mehta", "Kirti Sen", "Aditya Birla", "Anjali Sharma"
  ];
  const times = [
    "1 day ago", "2 days ago", "3 days ago", "4 days ago", 
    "5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago"
  ];
  
  let hash = 0;
  if (id && typeof id === 'string') {
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
  } else {
    hash = Math.floor(Math.random() * 100);
  }
  
  const name = names[hash % names.length];
  const time = times[hash % times.length];
  
  // Stars logic: Genuine reviews generally get 4-5 stars. Fake reviews are mixed (e.g. 1-2 or 5 stars).
  let rating = 5;
  if (label === 'Fake') {
    rating = (hash % 3 === 0) ? 5 : ((hash % 3 === 1) ? 1 : 2);
  } else {
    rating = (hash % 4 === 0) ? 4 : 5;
  }
  
  // Deterministic Avatar profile indicator (numeric rating score inside circle or initial)
  const avatarLabel = rating.toString();
  
  return { name, time, rating, avatarLabel };
};

const getReviewTags = (text) => {
  if (!text) return ["General"];
  const lower = text.toLowerCase();
  const tags = [];
  if (lower.includes('camera') || lower.includes('lens') || lower.includes('photo') || lower.includes('picture')) tags.push('Camera Quality');
  if (lower.includes('battery') || lower.includes('power') || lower.includes('charge') || lower.includes('lasts')) tags.push('Battery Life');
  if (lower.includes('screen') || lower.includes('display') || lower.includes('vibrant') || lower.includes('oled') || lower.includes('retina')) tags.push('Display');
  if (lower.includes('performance') || lower.includes('fast') || lower.includes('speed') || lower.includes('lag') || lower.includes('chip') || lower.includes('processor')) tags.push('Performance');
  if (lower.includes('price') || lower.includes('value') || lower.includes('cost') || lower.includes('cheap') || lower.includes('buy') || lower.includes('money')) tags.push('Value');
  if (lower.includes('build') || lower.includes('design') || lower.includes('quality') || lower.includes('feel') || lower.includes('material')) tags.push('Build Quality');
  
  if (tags.length === 0) tags.push('General Usability');
  return tags.slice(0, 3);
};

export default function ReviewCard({ review }) {
  const isFake = review.label === 'Fake';
  const confidencePercent = Math.round(review.confidence * 100);
  const reviewer = getReviewerDetails(review.id, review.label);
  const tags = getReviewTags(review.text);

  // Helper function to highlight keywords dynamically
  const getHighlightedText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;
    const escapedKws = keywords
      .map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
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

  // SVG parameters for right side circular confidence meter
  const radius = 18;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidencePercent / 100) * circumference;

  return (
    <div className={`flex flex-col md:flex-row items-stretch p-5 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] hover:translate-y-[-1px] ${
      isFake 
        ? 'border-rose-100 hover:border-rose-200 dark:border-rose-950/30 dark:hover:border-rose-900/40' 
        : 'border-slate-100 hover:border-slate-200 dark:border-slate-800/60 dark:hover:border-slate-700/60'
    }`}>
      
      {/* Column 1: Reviewer Details (Left) */}
      <div className="w-full md:w-44 shrink-0 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-3.5 md:pb-0 md:pr-4 select-none">
        <div className="space-y-2">
          {/* Verified purchase status */}
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/30 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
            <Check className="h-2.5 w-2.5" />
            <span>Verified Purchase</span>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2">
            {/* Numeric avatar circle */}
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${
              isFake ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
              {reviewer.avatarLabel}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {reviewer.name}
            </span>
          </div>
        </div>

        {/* Rating Stars & Time */}
        <div className="text-right md:text-left flex flex-col md:mt-2.5 space-y-0.5">
          <div className="flex items-center gap-0.5 text-amber-400 text-xs tracking-tighter">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="leading-none">
                {i < reviewer.rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {reviewer.time}
          </span>
        </div>
      </div>

      {/* Column 2: Review Body (Middle) */}
      <div className="flex-1 flex flex-col justify-between pt-4 md:pt-0 md:px-5">
        <div className="space-y-1.5 flex-1">
          {/* Review title placeholder matching the dynamic tone */}
          <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
            {isFake ? 'Suspicious Review Details' : 'Verified Buyer Insight'}
          </span>
          <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed">
            "{getHighlightedText(review.text, review.keywords)}"
          </p>
        </div>

        {/* Dynamic feature chips tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 select-none">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="text-[9px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-450 border border-slate-100 dark:border-slate-800/20 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Column 3: AI Verdict classification (Right) */}
      <div className="w-full md:w-32 shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0 md:pl-4 mt-3.5 md:mt-0">
        
        {/* Genuine vs Suspicious Badge */}
        <div className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border ${
          isFake 
            ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
        }`}>
          {review.label}
        </div>

        {/* AI Confidence progress wheel */}
        <div className="flex items-center gap-2 select-none md:mt-4">
          <div className="text-right">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 block uppercase leading-none tracking-wide">AI Confidence</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 mt-0.5 block">{confidencePercent}%</span>
          </div>
          
          <div className="relative flex items-center justify-center h-10 w-10 shrink-0">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth={strokeWidth} fill="transparent" />
              <circle 
                cx="20" 
                cy="20" 
                r={radius} 
                className={`${isFake ? 'stroke-rose-500' : 'stroke-emerald-500'} transition-all duration-300`} 
                strokeWidth={strokeWidth} 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute text-[8px] font-black text-slate-800 dark:text-slate-200">
              {confidencePercent}%
            </div>
          </div>
        </div>

        {/* Action button */}
        <button 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden md:block" 
          title="Audit Action"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
