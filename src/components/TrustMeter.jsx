import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function TrustMeter({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Count-up animation
    const duration = 1200; // ms
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easy out quad easing
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
        bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        glow: 'glow-green',
        label: 'Highly Trustworthy',
        desc: 'Reviews are mostly authentic and match natural customer behavior patterns.',
        icon: ShieldCheck,
      };
    } else if (val >= 40) {
      return {
        text: 'text-amber-500 dark:text-amber-400',
        border: 'stroke-amber-500',
        bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        glow: 'glow-yellow',
        label: 'Caution Advised',
        desc: 'Significant amount of suspicious reviews detected. Read with skepticism.',
        icon: AlertTriangle,
      };
    } else {
      return {
        text: 'text-rose-500 dark:text-rose-400',
        border: 'stroke-rose-500',
        bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        glow: 'glow-red',
        label: 'Highly Suspicious',
        desc: 'High concentration of bot/fake reviews detected. Extremely high risk.',
        icon: ShieldAlert,
      };
    }
  };

  const scheme = getColorScheme(score);
  const IconComponent = scheme.icon;

  // SVG parameters
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
        Trustworthiness Score
      </h3>

      {/* Meter Circular Wrapper */}
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Glow effect matching color scheme */}
        <div className={`absolute inset-4 rounded-full -z-10 blur-xl opacity-30 ${scheme.glow} transition-all duration-500`}></div>

        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className={`${scheme.border} transition-all duration-100 ease-out`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Text score overlay inside the circle */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black tracking-tighter text-slate-800 dark:text-slate-100">
            {animatedScore}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            out of 100
          </span>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="mt-6 flex flex-col items-center text-center max-w-xs">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${scheme.bg}`}>
          <IconComponent className="h-3.5 w-3.5" />
          {scheme.label}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
          {scheme.desc}
        </p>
      </div>
    </div>
  );
}
