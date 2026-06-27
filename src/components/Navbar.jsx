import React from 'react';
import { ShieldAlert, ShieldCheck, Sun, Moon, ArrowLeft, Cpu } from 'lucide-react';

export default function Navbar({ page, setPage, isDark, toggleTheme, isMockMode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section: Brand Logo & Navigation */}
        <div className="flex items-center gap-4">
          {page === 'dashboard' && (
            <button
              onClick={() => setPage('home')}
              className="group flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors"
              title="Back to home"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}

          <div
            onClick={() => setPage('home')}
            className="flex cursor-pointer items-center gap-2.5 active:scale-95 transition-transform"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <ShieldCheck className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
                ReviewTrust
              </span>
              <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Status, Dark Mode Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Status Badge */}
          <div 
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              isMockMode 
                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
            }`}
            title={isMockMode ? "API unavailable. Running on local AI simulation engine." : "Axios backend service connected successfully."}
          >
            <Cpu className={`h-3.5 w-3.5 ${isMockMode ? 'text-amber-500' : 'text-emerald-500 animate-spin-slow'}`} />
            <span className="hidden sm:inline">AI Engine:</span>
            <span>{isMockMode ? 'Simulated' : 'API Online'}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>
          
        </div>
      </div>
    </header>
  );
}
