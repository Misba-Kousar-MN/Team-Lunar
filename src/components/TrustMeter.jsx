import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function TrustMeter({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1200; // ms
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = progress * (2 - progress);
      const val = Math.round(easedProgress * score);
      
      setAnimatedScore(val);

      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color selection based on score
  const getColorScheme = (val) => {
    if (val >= 70) {
      return {
        text: 'text-emerald-500 dark:text-emerald-400',
        border: 'stroke-emerald-500',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
        glow: 'glow-green',
        label: 'Excellent',
        badge: 'Low Risk',
        desc: 'Highly trustworthy product based on our analysis.',
        icon: ShieldCheck,
      };
    } else if (val >= 40) {
      return {
        text: 'text-amber-500 dark:text-amber-400',
        border: 'stroke-amber-500',
        bg: 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
        glow: 'glow-yellow',
        label: 'Caution Advised',
        badge: 'Medium Risk',
        desc: 'Significant amount of suspicious reviews detected.',
        icon: AlertTriangle,
      };
    } else {
      return {
        text: 'text-rose-500 dark:text-rose-400',
        border: 'stroke-rose-500',
        bg: 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
        glow: 'glow-red',
        label: 'Highly Suspicious',
        badge: 'High Risk',
        desc: 'High concentration of bot/fake reviews detected.',
        icon: ShieldAlert,
      };
    }
  };

  const scheme = getColorScheme(score);
  const IconComponent = scheme.icon;

  const radius = 58;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 h-[280px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] justify-between transition-all duration-300">
      <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span>Trust Score</span>
        <span className="text-[10px] cursor-help" title="Overall Product Trust Score calculated from ML classifier confidence, review specificity, duplicate clusters, and marketplace signals.">ⓘ</span>
      </div>

      <div className="flex-1 flex items-center justify-between gap-4 mt-2">
        {/* Left side: circular progress */}
        <div className="relative flex items-center justify-center w-28 h-28 shrink-0 select-none">
          <div className={`absolute inset-2 rounded-full -z-10 blur-xl opacity-20 ${scheme.glow}`}></div>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className={`${scheme.border} transition-all duration-100 ease-out`}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
              {animatedScore}
            </span>
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              / 100
            </span>
          </div>
        </div>

        {/* Right side: Trust Score explanations */}
        <div className="flex-1 flex flex-col justify-center items-start text-left space-y-2 pl-2">
          <span className={`text-lg font-bold ${scheme.text}`}>{scheme.label}</span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[160px]">
            {scheme.desc}
          </p>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${scheme.bg}`}>
            <IconComponent className="h-3 w-3" />
            <span>{scheme.badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
