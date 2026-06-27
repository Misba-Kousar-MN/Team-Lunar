import React, { useState, useEffect } from 'react';
import { Search, Globe, AlertCircle, ShoppingBag } from 'lucide-react';

export default function InputBox({ onSubmit, onUseSample, initialUrl = '' }) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState(null);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  // Detect platform dynamically on typing
  useEffect(() => {
    if (!url) {
      setDetectedPlatform(null);
      return;
    }
    const val = url.toLowerCase();
    if (val.includes('amazon.') || val.includes('amzn.in')) {
      setDetectedPlatform('Amazon');
    } else if (val.includes('flipkart.')) {
      setDetectedPlatform('Flipkart');
    } else {
      setDetectedPlatform(null);
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }

    // Basic URL validation
    const val = url.toLowerCase();
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    if (!val.includes('amazon') && !val.includes('flipkart') && !val.includes('amzn.in')) {
      setError('Only Amazon and Flipkart product URLs are supported at this time.');
      return;
    }

    setError('');
    onSubmit(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Wrapper with gradient border on focus */}
        <div className="group relative rounded-2xl p-0.5 transition-all duration-300 bg-slate-200 dark:bg-slate-800 focus-within:bg-gradient-to-r focus-within:from-brand-500 focus-within:to-indigo-500 shadow-sm focus-within:shadow-md focus-within:shadow-brand-500/10">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[14px] overflow-hidden px-4 py-2 transition-colors duration-300">
            
            {/* Left Icon (Dynamic) */}
            <div className="flex items-center justify-center text-slate-400 mr-3">
              {detectedPlatform === 'Amazon' ? (
                <span className="text-amber-500 font-extrabold text-sm select-none border border-amber-500 rounded px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20">a</span>
              ) : detectedPlatform === 'Flipkart' ? (
                <span className="text-blue-500 font-extrabold text-sm select-none border border-blue-500 rounded px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/20">f</span>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>

            {/* Input field */}
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste Amazon/Flipkart product URL (e.g. amazon.com/dp/B09B8V1LZ3)..."
              className="w-full bg-transparent py-2.5 text-sm sm:text-base outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />

            {/* Platform Badge overlay */}
            {detectedPlatform && (
              <div className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border mr-2 uppercase tracking-wide transition-all ${
                detectedPlatform === 'Amazon'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-950/20'
              }`}>
                <Globe className="h-3 w-3" />
                {detectedPlatform}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-rose-500 text-sm px-2 animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 active:scale-[0.98] transition-all"
          >
            Analyze Reviews
          </button>
          
          <button
            type="button"
            onClick={onUseSample}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl font-medium border border-transparent dark:border-slate-700/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Use Sample Reviews
          </button>
        </div>
      </form>
    </div>
  );
}
