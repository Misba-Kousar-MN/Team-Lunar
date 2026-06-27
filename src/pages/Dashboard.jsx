import React, { useState, useMemo } from 'react';
import TrustMeter from '../components/TrustMeter';
import ReviewPieChart from '../components/PieChart';
import ReviewCard from '../components/ReviewCard';
import { 
  ArrowLeft, Search, Filter, RefreshCw, 
  ExternalLink, BarChart3, AlertCircle, 
  CheckCircle, FileText, Check 
} from 'lucide-react';

export default function Dashboard({ data, onReanalyze, onGoHome }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'genuine' | 'fake'
  const [searchTerm, setSearchTerm] = useState('');
  const [newUrl, setNewUrl] = useState(data?.url || '');

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return { total: 0, genuine: 0, fake: 0 };
    
    // Sometimes backend returns percentage, sometimes absolute count. Let's compute.
    const total = data.reviews?.length || 0;
    const genuineCount = data.reviews?.filter(r => r.label === 'Genuine').length || 0;
    const fakeCount = total - genuineCount;

    return {
      total,
      genuine: genuineCount,
      fake: fakeCount
    };
  }, [data]);

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    if (!data?.reviews) return [];
    
    return data.reviews.filter(review => {
      // 1. Tab Filter
      if (filter === 'genuine' && review.label !== 'Genuine') return false;
      if (filter === 'fake' && review.label !== 'Fake') return false;

      // 2. Search Text
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          review.text.toLowerCase().includes(term) ||
          review.reason.toLowerCase().includes(term) ||
          review.keywords.some(kw => kw.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }, [data, filter, searchTerm]);

  const handleReanalyzeSubmit = (e) => {
    e.preventDefault();
    if (newUrl.trim()) {
      onReanalyze(newUrl);
    }
  };

  if (!data) return null;

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-brand-500 transition-colors" onClick={onGoHome}>Home</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
            {data.productName}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
              data.platform === 'Amazon' 
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' 
                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
            }`}>
              {data.platform}
            </span>

            {data.url && (
              <a 
                href={data.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-brand-500 dark:text-slate-500 dark:hover:text-brand-400 font-medium transition-colors"
              >
                <span>View Original Listing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Re-analyze inputs */}
        <form onSubmit={handleReanalyzeSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Analyze another URL..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 outline-none text-slate-700 dark:text-slate-200 focus:border-brand-500 dark:focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            className="shrink-0 p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md shadow-brand-500/10 active:scale-95 transition-all"
            title="Analyze URL"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* Main Charts & Meter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Card 1: circular score */}
        <TrustMeter score={data.trust_score} />

        {/* Metric Card 2: donut break down */}
        <ReviewPieChart genuine={data.genuine} fake={data.fake} />

        {/* Metric Card 3: numerical summary statistics */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm justify-between transition-all duration-300">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Auditing Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 flex-1 justify-center">
            
            {/* Stat Row 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30">
              <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                  Total Reviews
                </span>
                <span className="text-lg font-black text-slate-700 dark:text-slate-100">
                  {stats.total}
                </span>
              </div>
            </div>

            {/* Stat Row 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-emerald-600/60 dark:text-emerald-500/60 block uppercase tracking-wider">
                  Genuine Reviews
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                  {stats.genuine}
                </span>
              </div>
            </div>

            {/* Stat Row 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/10">
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-rose-600/60 dark:text-rose-500/60 block uppercase tracking-wider">
                  Flagged Suspicious
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-400">
                  {stats.fake}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>Classified Reviews List</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {filteredReviews.length}
            </span>
          </h2>

          {/* Controls: search and tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search within reviews */}
            <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 max-w-xs w-full transition-colors">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keywords..."
                className="w-full bg-transparent text-xs sm:text-sm outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200/20 dark:border-slate-800/40 select-none">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('genuine')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filter === 'genuine'
                    ? 'bg-emerald-550 text-white bg-emerald-500 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Genuine
              </button>
              <button
                onClick={() => setFilter('fake')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filter === 'fake'
                    ? 'bg-rose-550 text-white bg-rose-500 shadow-sm shadow-rose-500/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Fake Only
              </button>
            </div>

          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No reviews found</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              No reviews match the current combination of filters and keyword searches. Try clearing search input.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
