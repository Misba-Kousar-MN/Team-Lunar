import React from 'react';
import InputBox from '../components/InputBox';
import { sampleProducts } from '../mockData';
import { ShieldCheck, ShieldAlert, Cpu, Sparkles, HelpCircle, BarChart3 } from 'lucide-react';

export default function Home({ onSubmitUrl, onSelectSampleProduct }) {
  
  const handleUseSample = () => {
    // Select the first product by default for generic sample demo
    if (sampleProducts.length > 0) {
      onSelectSampleProduct(sampleProducts[0]);
    }
  };

  return (
    <div className="flex-1 transition-colors duration-300 dark:bg-slate-950">
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 overflow-hidden">
        {/* Background blobs for premium glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="mx-auto max-w-4xl text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-100 bg-brand-50/50 dark:border-brand-950/30 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider animate-bounce">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Smart E-Commerce Buying
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.1]">
            Unmask Fake Reviews with{' '}
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
              ReviewTrust AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Paste any Amazon or Flipkart product URL to analyze thousands of buyer reviews instantly. Detect artificial sentiment shifts and make confident purchasing decisions.
          </p>

          {/* Search Input Bar component */}
          <div className="pt-6">
            <InputBox onSubmit={onSubmitUrl} onUseSample={handleUseSample} />
          </div>

        </div>
      </section>

      {/* Quick Select Sample Cards Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Quick Test Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
            No URL? Click a pre-loaded sample product to test the dashboard instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sampleProducts.map((product) => {
            const isAmazon = product.platform === 'Amazon';
            return (
              <div
                key={product.id}
                onClick={() => onSelectSampleProduct(product)}
                className="group cursor-pointer flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-800/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <div>
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                      isAmazon 
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' 
                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                    }`}>
                      {product.platform}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      Trust Score: <span className={product.trust_score >= 70 ? 'text-emerald-500' : product.trust_score >= 40 ? 'text-amber-500' : 'text-rose-500'}>{product.trust_score}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                  <span>Analyze Sample</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-slate-200/50 dark:border-slate-900/60 bg-slate-50/50 dark:bg-slate-900/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              State-of-the-Art Review Auditing
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              ReviewTrust AI uses deep learning to cross-reference multiple markers of rating manipulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Linguistic Check</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Highlights generic phrases, bot-like repetitive word structures, and promotional copywriting copy-pasted across multiple items.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Sentiment Shift Anomaly</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Identifies rating bursts—unusual concentrations of highly detailed positive reviews occurring within a suspicious timeframe.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Confidence Scoring</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Returns a detailed percentage probability for every review, allowing users to isolate and read exactly what is fishy.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <footer className="py-12 border-t border-slate-200/30 dark:border-slate-900/40 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-300">1.4M+</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-600 mt-0.5">Reviews Checked</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-300">98.2%</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-600 mt-0.5">Model Accuracy</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-300">220K+</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-600 mt-0.5">Fake Reviews Blocked</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
