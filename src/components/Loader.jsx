import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  "Connecting to platform gateway...",
  "Fetching product listings and metadata...",
  "Crawling customer reviews database...",
  "Tokenizing review text elements...",
  "Running semantic and linguistic checks...",
  "Evaluating user profile velocities...",
  "Detecting repetitive pattern clusters...",
  "Calculating final Trust Score..."
];

export default function Loader() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Progressively cycle through AI processing stages
    const stepDuration = 800; // ms per step
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      
      {/* Outer spinning ring and AI chip icon */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Animated outer gradients */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-950/30"></div>
        <div className="absolute w-24 h-24 rounded-full border-4 border-t-brand-600 border-r-indigo-500 border-l-transparent border-b-transparent animate-spin"></div>
        
        {/* Inner glow and chip */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Cpu className="h-8 w-8 text-white animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        AI Review Analysis in Progress
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
        Our natural language models are auditing reviews for bot behavior and linguistic templates.
      </p>

      {/* Simulated steps timeline */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 text-left space-y-3.5 shadow-sm">
        {ANALYSIS_STEPS.map((step, index) => {
          const isPending = index > currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isDone = index < currentStepIndex;

          return (
            <div 
              key={index} 
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isCurrent 
                  ? 'text-brand-600 dark:text-brand-400 font-semibold translate-x-1' 
                  : isDone 
                    ? 'text-slate-500 dark:text-slate-400 font-medium' 
                    : 'text-slate-300 dark:text-slate-700'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 flex items-center justify-center">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                    </span>
                  </div>
                ) : (
                  <div className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-700 ml-0.5"></div>
                )}
              </div>
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
