import React, { useState } from 'react';
import { ShieldCheck, Sun, Moon, Cpu, Menu, X } from 'lucide-react';

export default function Navbar({ page, setPage, isDark, toggleTheme, isMockMode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 backdrop-blur-md dark:border-slate-850/40 dark:bg-slate-950/70 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer active:scale-98 transition-transform" onClick={() => setPage('home')}>
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

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('live-demo')} 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
          >
            Live Demo
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
          >
            About
          </button>
        </nav>

        {/* Right: CTA, Status, theme toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Status Badge */}
          <div 
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-300 ${
              isMockMode 
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
            }`}
            title={isMockMode ? "API offline. Running simulated AI engine." : "AI engine connected & live."}
          >
            <span className={`h-2 w-2 rounded-full ${isMockMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{isMockMode ? 'Simulated AI' : 'AI Engine Live'}</span>
          </div>

          {/* GitHub Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors flex items-center justify-center"
            aria-label="GitHub Repository"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-650" />
            )}
          </button>

          {/* Analyze CTA */}
          <button
            onClick={() => scrollToSection('search-section')}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-655 px-4.5 py-2 text-xs font-semibold text-white shadow-sm hover:from-brand-500 hover:to-indigo-550 active:scale-95 transition-all duration-200"
          >
            Analyze Now
          </button>
        </div>

        {/* Mobile controls: Theme toggle & Hamburger menu */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-650" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300">
          <nav className="flex flex-col space-y-4 p-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-left text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-left text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('live-demo')} 
              className="text-left text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250"
            >
              Live Demo
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-left text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250"
            >
              About
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-850 my-2" />

            <div className="flex flex-wrap items-center gap-4">
              <div 
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                  isMockMode 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' 
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isMockMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                <span>{isMockMode ? 'Simulated AI' : 'AI Engine Live'}</span>
              </div>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>GitHub Repo</span>
              </a>
            </div>

            <button
              onClick={() => scrollToSection('search-section')}
              className="w-full text-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-650 py-3 text-sm font-bold text-white shadow-sm hover:from-brand-500 hover:to-indigo-550 active:scale-[0.98] transition-all"
            >
              Analyze Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
