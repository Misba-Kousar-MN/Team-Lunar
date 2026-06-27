import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Loader from './components/Loader';
import { analyzeProduct } from './api';
import { ShieldAlert, X, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'dashboard'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  
  // Theme Management
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toast System
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleAnalyze = async (urlOrReviews) => {
    setIsLoading(true);
    setError('');
    setPage('dashboard');
    
    try {
      const result = await analyzeProduct(urlOrReviews);
      setAnalysisData(result);
      
      if (result.isMock) {
        showToast("Backend offline. Fallback sample data displayed.", "warning");
      } else {
        showToast("AI Review analysis completed successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during review analysis. Please check your network and try again.");
      showToast("Analysis failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (product) => {
    handleAnalyze(product.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation header bar */}
      <Navbar 
        page={page} 
        setPage={setPage} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        isMockMode={analysisData ? analysisData.isMock : true} 
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        
        {/* Loading Spinner / Multi-Step Overlay */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Loader />
          </div>
        ) : error ? (
          /* Error display container */
          <div className="flex-1 flex items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/30 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Analysis Failed</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {error}
              </p>
              <button
                onClick={() => setPage('home')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl active:scale-95 transition-all"
              >
                Return Home
              </button>
            </div>
          </div>
        ) : page === 'home' ? (
          /* Landing page view */
          <Home 
            onSubmitUrl={handleAnalyze} 
            onSelectSampleProduct={handleSelectSample} 
          />
        ) : (
          /* Dashboard analytics view */
          <Dashboard 
            data={analysisData} 
            onReanalyze={handleAnalyze} 
            onGoHome={() => setPage('home')}
          />
        )}
      </main>

      {/* Toast Alert System overlay */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] animate-slide-in max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xl flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
            ) : toast.type === 'error' ? (
              <ShieldAlert className="h-5 w-5 text-rose-500 animate-bounce" />
            ) : (
              <Bell className="h-5 w-5 text-indigo-500" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Notification
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
