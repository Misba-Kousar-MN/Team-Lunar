import React, { useState, useEffect } from 'react';
import { sampleProducts } from '../mockData';
import { 
  ShieldCheck, ShieldAlert, Cpu, Sparkles, HelpCircle, 
  Search, ShoppingBag, AlertCircle, Globe, ArrowRight,
  TrendingUp, Award, Layers, Zap, Clock, CheckCircle
} from 'lucide-react';

const getProductThumbnail = (name) => {
  if (!name) return "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=300&q=80";
  const lower = name.toLowerCase();
  if (lower.includes('iphone')) {
    return "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('macbook')) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('refrigerator')) {
    return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('washing') || lower.includes('washer')) {
    return "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('camera') || lower.includes('eos')) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('tv') || lower.includes('oled')) {
    return "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('dishwasher')) {
    return "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('ipad')) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80";
  }
  if (lower.includes('sofa') || lower.includes('fabric')) {
    return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80";
  }
  return "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=300&q=80";
};

const getShortTitle = (name) => {
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower.includes('iphone air')) return 'Apple iPhone Air (256 GB, White)';
  if (lower.includes('macbook air 15')) return 'Apple MacBook Air 15″ (M3, 24GB)';
  if (lower.includes('633 l') || lower.includes('rs78cg8543s9hl')) return 'Samsung 633L Side-by-Side Refrigerator';
  if (lower.includes('12 kg') || lower.includes('ww12dg6b24astl')) return 'Samsung 12kg Front Load Washer';
  if (lower.includes('eos r50')) return 'Canon EOS R50 Mirrorless Camera';
  if (lower.includes('oled b4') || lower.includes('oled55b46la')) return 'LG OLED B4 55″ Smart TV';
  if (lower.includes('dishwasher') || lower.includes('dfb424fp')) return 'LG DFB424FP Dishwasher';
  
  const clean = name.split(/[:|,(]/)[0].trim();
  return clean.length > 50 ? clean.substring(0, 50) + "..." : clean;
};

export default function Home({ onSubmitUrl, onSelectSampleProduct }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState(null);

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
      setError('Please enter a product URL to analyze');
      return;
    }

    // Basic URL validation
    const val = url.toLowerCase();
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    if (!val.includes('amazon') && !val.includes('flipkart') && !val.includes('amzn.in')) {
      setError('Only Amazon and Flipkart product URLs are supported.');
      return;
    }

    setError('');
    onSubmitUrl(url);
  };

  const handleUseSample = () => {
    if (sampleProducts.length > 0) {
      onSelectSampleProduct(sampleProducts[0]);
    }
  };

  return (
    <div className="flex-1 bg-[#FAFCFF] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative">
      
      {/* Background blobs for premium glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 dark:from-brand-500/5 dark:to-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-purple-500/10 to-brand-500/10 dark:from-purple-500/5 dark:to-brand-500/5 blur-[150px] pointer-events-none" />

      {/* Hero & Search Section */}
      <section id="search-section" className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Sparkles Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-100/50 bg-brand-50/50 dark:border-brand-900/20 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Explainable Trust Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl text-slate-900 dark:text-white">
          Unmask Fake Reviews with{' '}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
            ReviewTrust AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          AI-powered explainable review intelligence that helps shoppers identify trustworthy products before they buy.
        </p>

        {/* Search input container */}
        <div className="mt-10 w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group relative rounded-2xl p-0.5 transition-all duration-300 bg-slate-200/80 dark:bg-slate-800/80 focus-within:bg-gradient-to-r focus-within:from-brand-500 focus-within:to-indigo-500 shadow-md focus-within:shadow-xl focus-within:shadow-brand-500/10">
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[14px] overflow-hidden px-4 py-2.5 transition-colors duration-300">
                
                {/* Left Icon */}
                <div className="flex items-center justify-center text-slate-400 mr-3">
                  {detectedPlatform === 'Amazon' ? (
                    <span className="text-amber-500 font-extrabold text-sm select-none border border-amber-500/20 rounded px-1.5 py-0.5 bg-amber-500/5">A</span>
                  ) : detectedPlatform === 'Flipkart' ? (
                    <span className="text-blue-500 font-extrabold text-sm select-none border border-blue-500/20 rounded px-1.5 py-0.5 bg-blue-500/5">F</span>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Paste Amazon or Flipkart Product URL..."
                  className="w-full bg-transparent py-2.5 text-sm sm:text-base outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />

                {/* Detected Platform Badge */}
                {detectedPlatform && (
                  <div className={`hidden sm:flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border mr-2 uppercase tracking-wide transition-all ${
                    detectedPlatform === 'Amazon'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                      : 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400'
                  }`}>
                    <Globe className="h-3.5 w-3.5" />
                    <span>{detectedPlatform} Detected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-sm px-2 animate-pulse justify-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-500 hover:to-indigo-550 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Analyze Reviews</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={handleUseSample}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350 rounded-xl font-semibold border border-slate-200/50 dark:border-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Use Sample Product</span>
              </button>
            </div>
          </form>
        </div>

        {/* Marketplace support text/icons */}
        <div className="flex items-center justify-center gap-6 text-slate-400 dark:text-slate-650 text-xs font-semibold mt-8">
          <span>Supported Marketplaces:</span>
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <span className="font-extrabold text-amber-500 bg-amber-500/10 rounded px-2.5 py-0.5 border border-amber-500/20 text-[11px] uppercase tracking-wide">Amazon</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <span className="font-extrabold text-blue-500 bg-blue-500/10 rounded px-2.5 py-0.5 border border-blue-500/20 text-[11px] uppercase tracking-wide">Flipkart</span>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-slate-200/40 dark:border-slate-900/60 bg-slate-50/30 dark:bg-slate-950/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              State-of-the-Art Review Auditing
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              ReviewTrust AI applies localized natural language auditing and anomalous burst detection to cross-reference authenticity markers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="group p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">AI Review Detection</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Highlights generic phrases, repetitive bot structures, and copy-paste templates using advanced linguistic pattern matching.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Explainable AI</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Provides transparent Trust Signals explaining exactly how reviewer details, language anomalies, and metadata factor into score calculations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Shopping Trust Score</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A weighted credibility model calculating shopping risk categories (Low, Caution, High) across listing parameters.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">Authenticity & Seller Credibility</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Checks verified merchant status badges (Amazon Fulfilled, Flipkart Assured) and tracks seller credibility footprints.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-slate-200/40 dark:border-slate-900/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Audit Pipeline in Action
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              ReviewTrust AI performs real-time analytics parsing to convert raw reviews into clear confidence grades.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-500/20 via-indigo-500/20 to-purple-500/20 -translate-y-1/2 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Search className="h-6 w-6 text-brand-500" />
                </div>
                <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Step 1</div>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-1.5">Paste Product URL</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  Enter any Amazon or Flipkart product listing URL in the analysis bar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Layers className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Step 2</div>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-1.5">Extract Reviews</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  The data layer pulls listing metadata and checks live reviewer comment pools.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Cpu className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Step 3</div>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-1.5">AI Engine Analysis</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  Linguistic classifiers audit phrases, anomalies, and duplicate groupings.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Step 4</div>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm mb-1.5">Trust & Confidence Report</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                  Generates an overall trust score, marketplace flags, and verified purchase diagnostics.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Why ReviewTrust AI section */}
      <section id="about" className="border-t border-slate-200/40 dark:border-slate-900/60 bg-slate-50/20 dark:bg-slate-950/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why ReviewTrust AI?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              We focus strictly on objective, explainable markers rather than bulk rating summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Why 1 */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-150 text-sm mb-2">Explainable AI</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                See exactly which review signals triggered score reductions, bypassing typical "black-box" models.
              </p>
            </div>

            {/* Why 2 */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-150 text-sm mb-2">Product Trust Score</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Weighed dynamically by verification status, reviewer consistency, and seller performance history.
              </p>
            </div>

            {/* Why 3 */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-150 text-sm mb-2">Seller Credibility</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Calculates merchant credibility indexes checking customer ratings and fulfillment methods.
              </p>
            </div>

            {/* Why 4 */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800/50 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-slate-150 text-sm mb-2">Marketplace Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Checks and compares seller parameters dynamically on Amazon and Flipkart.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="live-demo" className="border-t border-slate-200/40 dark:border-slate-900/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Try Live Demo
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Select one of our parsed sample products to check the interactive dashboard instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sampleProducts.slice(0, 6).map((product) => {
              const isAmazon = product.platform === 'Amazon';
              const thumbnail = getProductThumbnail(product.name);
              const shortTitle = getShortTitle(product.name);
              
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectSampleProduct(product)}
                  className="group cursor-pointer flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-500/30 hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Thumbnail Image Header */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img 
                      src={thumbnail} 
                      alt={shortTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Platform Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                        isAmazon 
                          ? 'bg-amber-500/90 text-white border-amber-400 backdrop-blur-sm' 
                          : 'bg-blue-600/90 text-white border-blue-500 backdrop-blur-sm'
                      }`}>
                        {product.platform}
                      </span>
                    </div>

                    {/* Trust Score overlay */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-2 py-1 text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Trust Score</span>
                      <span className={`text-base font-extrabold leading-none ${
                        product.trust_score >= 70 ? 'text-emerald-450' : product.trust_score >= 40 ? 'text-amber-400' : 'text-rose-400'
                      }`}>{product.trust_score}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {shortTitle}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {product.reviews[0]?.text || "No review content available."}
                      </p>
                    </div>

                    {/* Action button container */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-450">
                      <span>Analyze Demo Data</span>
                      <span className="transform group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                        <span>Launch</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Platform Stats Row */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-800/85">
          {/* Ambient inner glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text">1.4M+</span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-400 tracking-wider mt-2">Reviews Checked</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text">25K+</span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-400 tracking-wider mt-2">Products Tested</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text">98.2%</span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-400 tracking-wider mt-2">Model Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text">220K+</span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-slate-400 tracking-wider mt-2">Fakes Identified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges section */}
      <section className="border-t border-slate-200/30 dark:border-slate-900/30 py-10 px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-5xl mx-auto opacity-75">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle className="h-4.5 w-4.5 text-brand-500" />
            <span>No Login Required</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle className="h-4.5 w-4.5 text-brand-500" />
            <span>Privacy First</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle className="h-4.5 w-4.5 text-brand-500" />
            <span>AI Powered Audits</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle className="h-4.5 w-4.5 text-brand-500" />
            <span>Lightning Fast Scrapes</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle className="h-4.5 w-4.5 text-brand-500" />
            <span>100% Explainable Scores</span>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-slate-200/40 dark:border-slate-900/60 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300 tracking-tight">ReviewTrust AI</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Fake review detection</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 dark:hover:text-slate-300">GitHub</a>
            <span>Team Lunar Project</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-800">|</span>
            <span>Made for Hackathon ❤️</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
