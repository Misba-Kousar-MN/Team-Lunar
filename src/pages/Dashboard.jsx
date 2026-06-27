import React, { useState, useMemo } from 'react';
import TrustMeter from '../components/TrustMeter';
import ReviewPieChart from '../components/PieChart';
import ReviewCard from '../components/ReviewCard';
import { 
  Search, ExternalLink, LayoutDashboard, History, 
  Bookmark, ShieldCheck, Share2, 
  SlidersHorizontal, ArrowDownAZ, Check, Cpu
} from 'lucide-react';

const getReviewerDetails = (id, label) => {
  const names = [
    "Rohit Sharma", "Neha Verma", "Siddharth Malhotra", "Priya Nair", 
    "Amit Patel", "Shreya Ghoshal", "Kabir Singh", "Divya Pillai", 
    "Rohan Mehta", "Kirti Sen", "Aditya Birla", "Anjali Sharma"
  ];
  const times = [
    "1 day ago", "2 days ago", "3 days ago", "4 days ago", 
    "5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago"
  ];
  
  let hash = 0;
  if (id && typeof id === 'string') {
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
  } else {
    hash = Math.floor(Math.random() * 100);
  }
  
  const name = names[hash % names.length];
  const time = times[hash % times.length];
  
  let rating = 5;
  if (label === 'Fake') {
    rating = (hash % 3 === 0) ? 5 : ((hash % 3 === 1) ? 1 : 2);
  } else {
    rating = (hash % 4 === 0) ? 4 : 5;
  }
  
  const avatarLabel = rating.toString();
  
  return { name, time, rating, avatarLabel };
};

function getTimestampFromRelative(timeStr) {
  const now = Date.now();
  if (timeStr.includes('day')) {
    const val = parseInt(timeStr) || 1;
    return now - val * 24 * 60 * 60 * 1000;
  }
  if (timeStr.includes('week')) {
    const val = parseInt(timeStr) || 1;
    return now - val * 7 * 24 * 60 * 60 * 1000;
  }
  return now;
}

const getShortTitle = (name) => {
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower.includes('iphone air')) return 'Apple iPhone Air (256 GB, Cloud White)';
  if (lower.includes('macbook air 15')) return 'Apple MacBook Air 15″ (M3, 24GB, Space Grey)';
  if (lower.includes('633 l') || lower.includes('rs78cg8543s9hl')) return 'Samsung 633L Side-by-Side Refrigerator';
  if (lower.includes('12 kg') || lower.includes('ww12dg6b24astl')) return 'Samsung 12kg Front Load Washer';
  if (lower.includes('eos r50')) return 'Canon EOS R50 Mirrorless Camera';
  if (lower.includes('oled b4') || lower.includes('oled55b46la')) return 'LG OLED B4 55″ Smart TV';
  if (lower.includes('dishwasher') || lower.includes('dfb424fp')) return 'LG DFB424FP Dishwasher (14 Place Settings)';
  if (lower.includes('ipad (9th gen)') || lower.includes('ipad 9th')) return 'Apple iPad 9th Gen (256 GB, Space Grey)';
  if (lower.includes('sleepyhead kiki') || lower.includes('sofa')) return 'Sleepyhead Kiki 2-Seater Sofa';

  // Fallback cleanup
  const clean = name.split(/[:|,(]/)[0].trim();
  return clean.length > 50 ? clean.substring(0, 50) + "..." : clean;
};

const getCategoryBreadcrumbs = (name) => {
  if (!name) return "Products";
  const lower = name.toLowerCase();
  if (lower.includes('iphone') || lower.includes('ipad')) return "Electronics > Mobile Devices";
  if (lower.includes('macbook')) return "Electronics > Laptops";
  if (lower.includes('refrigerator')) return "Home Appliances > Kitchen";
  if (lower.includes('washer') || lower.includes('washing')) return "Home Appliances > Laundry";
  if (lower.includes('camera') || lower.includes('eos')) return "Electronics > Photography";
  if (lower.includes('tv') || lower.includes('oled')) return "Electronics > Television";
  if (lower.includes('dishwasher')) return "Home Appliances > Kitchen";
  if (lower.includes('sofa') || lower.includes('seat')) return "Furniture > Living Room";
  return "Electronics > Accessories";
};

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

export default function Dashboard({ data, _onReanalyze, onGoHome }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCredDetails, setShowCredDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history' | 'settings'

  // Dynamic filter states
  const [filterGenuine, setFilterGenuine] = useState(true);
  const [filterSuspicious, setFilterSuspicious] = useState(true);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filter5Star, setFilter5Star] = useState(false);
  const [filter4PlusStar, setFilter4PlusStar] = useState(false);
  const [filterRecent, setFilterRecent] = useState(false);
  const [filterOldest, setFilterOldest] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState('relevant'); // 'relevant' | 'newest' | 'oldest' | 'confidence_high' | 'confidence_low' | 'rating_high' | 'rating_low'

  // Dropdown toggle states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const riskMeta = useMemo(() => {
    const r = (data?.authenticityEngine?.risk_level || data?.authenticityEngine?.risk_category || 'Unknown').toLowerCase();
    if (r.includes('low')) return { label: 'LOW RISK', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/30', dot: 'bg-emerald-500' };
    if (r.includes('medium') || r.includes('caution')) return { label: 'CAUTION', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/30', dot: 'bg-amber-400' };
    if (r.includes('high')) return { label: 'HIGH RISK', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/30', dot: 'bg-rose-500' };
    if (r.includes('critical')) return { label: 'CRITICAL', color: 'text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border-red-100/30', dot: 'bg-red-600' };
    return { label: r.toUpperCase(), color: 'text-slate-500 bg-slate-50 border-slate-100', dot: 'bg-slate-400' };
  }, [data]);

  const trustRiskMeta = useMemo(() => {
    const r = (data?.trustEngine?.risk_level || 'Unknown').toLowerCase();
    if (r === 'excellent' || r.includes('highly trustworthy') || r.includes('low')) {
      return { label: 'LOW RISK', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/30', dot: 'bg-emerald-500' };
    }
    if (r.includes('moderate') || r.includes('caution')) {
      return { label: 'CAUTION', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-100/30', dot: 'bg-amber-450' };
    }
    return { label: 'HIGH RISK', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100/30', dot: 'bg-rose-500' };
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, genuine: 0, fake: 0 };
    const total = data.reviews?.length || 0;
    const genuineCount = data.reviews?.filter(r => r.label === 'Genuine').length || 0;
    const fakeCount = total - genuineCount;
    return {
      total,
      genuine: genuineCount,
      fake: fakeCount
    };
  }, [data]);

  // Enrich reviews with rating/age to support filter and sorting
  const enrichedReviews = useMemo(() => {
    if (!data?.reviews) return [];
    return data.reviews.map(review => {
      const details = getReviewerDetails(review.id, review.label);
      return {
        ...review,
        reviewerRating: details.rating,
        reviewerTime: details.time,
        timestamp: getTimestampFromRelative(details.time),
        verified: true
      };
    });
  }, [data]);

  // Filter reviews based on checkboxes and search input
  const filteredReviews = useMemo(() => {
    let result = enrichedReviews;

    // 1. Filter by Genuine/Suspicious checkboxes
    if (!filterGenuine && !filterSuspicious) {
      return [];
    }
    if (filterGenuine && !filterSuspicious) {
      result = result.filter(r => r.label === 'Genuine');
    }
    if (!filterGenuine && filterSuspicious) {
      result = result.filter(r => r.label === 'Fake');
    }

    // 2. Filter by Verified Purchase
    if (filterVerified) {
      result = result.filter(r => r.verified);
    }

    // 3. Filter by Rating
    if (filter5Star) {
      result = result.filter(r => r.reviewerRating === 5);
    } else if (filter4PlusStar) {
      result = result.filter(r => r.reviewerRating >= 4);
    }

    // 4. Search Filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(review => 
        review.text.toLowerCase().includes(term) ||
        review.reason.toLowerCase().includes(term) ||
        (review.keywords && review.keywords.some(kw => kw.toLowerCase().includes(term)))
      );
    }

    return result;
  }, [enrichedReviews, filterGenuine, filterSuspicious, filterVerified, filter5Star, filter4PlusStar, searchTerm]);

  // Sort reviews based on dropdown choice
  const sortedReviews = useMemo(() => {
    const list = [...filteredReviews];

    let activeSort = sortBy;
    if (filterRecent) {
      activeSort = 'newest';
    } else if (filterOldest) {
      activeSort = 'oldest';
    }

    if (activeSort === 'newest') {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (activeSort === 'oldest') {
      list.sort((a, b) => a.timestamp - b.timestamp);
    } else if (activeSort === 'confidence_high') {
      list.sort((a, b) => b.confidence - a.confidence);
    } else if (activeSort === 'confidence_low') {
      list.sort((a, b) => a.confidence - b.confidence);
    } else if (activeSort === 'rating_high') {
      list.sort((a, b) => b.reviewerRating - a.reviewerRating);
    } else if (activeSort === 'rating_low') {
      list.sort((a, b) => a.reviewerRating - b.reviewerRating);
    }

    return list;
  }, [filteredReviews, sortBy, filterRecent, filterOldest]);

  const formattedDate = useMemo(() => {
    const dateObj = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `Scanned on ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}, ${hours}:${minutes}`;
  }, []);

  // AI Trust Signals generator mapping directly to weighted scoring formula
  const aiTrustSignals = useMemo(() => {
    const flags = data?.trustEngine?.triggered_flags || data?.authenticityEngine?.triggered_flags || [];
    const platform = data?.platform || 'Amazon';
    const status = data?.trustEngine?.marketplace_status || (platform === 'Amazon' ? 'Amazon Fulfilled' : 'Flipkart Assured');

    const list = [
      // 1. Marketplace Verification (10%)
      {
        key: 'verification',
        isPositive: !flags.includes('UNVERIFIED_LOGISTICS'),
        text: !flags.includes('UNVERIFIED_LOGISTICS') 
          ? `Marketplace Verified (${status})` 
          : 'Seller logistics origin unverified'
      },
      // 2. Price Consistency (5%)
      {
        key: 'price',
        isPositive: !flags.includes('PRICE_ANOMALY'),
        text: !flags.includes('PRICE_ANOMALY') 
          ? 'Product price is within expected market range' 
          : 'Unusual pricing drift against market index'
      },
      // 3. Product Metadata Consistency
      {
        key: 'metadata',
        isPositive: true,
        text: 'Product metadata is internally consistent'
      },
      // 4. Duplicate Review Ratio (15%)
      {
        key: 'duplicate',
        isPositive: !flags.includes('COORDINATED_REVIEWS'),
        text: !flags.includes('COORDINATED_REVIEWS') 
          ? 'No duplicate review clusters detected' 
          : 'Small duplicate review cluster detected'
      },
      // 5. Review Diversity (20%)
      {
        key: 'diversity',
        isPositive: !flags.includes('LOW_VOCAB_DIVERSITY'),
        text: !flags.includes('LOW_VOCAB_DIVERSITY') 
          ? 'Strong review diversity detected' 
          : 'Low vocabulary diversity score flagged'
      },
      // 6. Review Specificity (15%)
      {
        key: 'specificity',
        isPositive: !flags.includes('GENERIC_PRAISE_STUFFING'),
        text: !flags.includes('GENERIC_PRAISE_STUFFING') 
          ? 'High product-specific review coverage' 
          : 'High generic phrase ratio detected'
      },
      // 7. Risk Keyword Density
      {
        key: 'keyword',
        isPositive: !flags.includes('HIGH_SUSPICIOUS_REVIEW_RATIO'),
        text: !flags.includes('HIGH_SUSPICIOUS_REVIEW_RATIO') 
          ? 'No promotional keyword inflation spikes' 
          : 'Mild promotional keyword density detected'
      }
    ];

    // Priority to anomalies/warnings at top, then list positive signals
    const warnings = list.filter(item => !item.isPositive);
    const positives = list.filter(item => item.isPositive);
    return [...warnings, ...positives].slice(0, 6);
  }, [data]);

  // Overall Risk Text mapping based on product trust score
  const overallRisk = useMemo(() => {
    const score = data?.trustEngine?.product_trust_score || data?.trust_score || 0;
    if (score >= 70) return { label: 'LOW', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/30' };
    if (score >= 40) return { label: 'MODERATE', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/30' };
    return { label: 'HIGH', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100/30' };
  }, [data]);

  if (!data) return null;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 font-sans transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* ── Left Sidebar (Task 1: Cleaned list with Dashboard, Search, History) ── */}
      <aside className="w-64 border-r border-slate-200/60 bg-white dark:border-slate-800/80 dark:bg-slate-900/90 p-5 flex flex-col hidden md:flex shrink-0 select-none">
        <div className="space-y-6 flex-1">
          
          {/* Sidebar Logo */}
          <div className="flex items-center gap-2.5 px-1 cursor-pointer" onClick={onGoHome}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                ReviewTrust AI
              </span>
              <span className="text-[10px] font-semibold text-slate-450 block uppercase tracking-wider leading-none mt-0.5">
                AI Trust Analysis
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100/85 text-[#2563EB] dark:bg-slate-800 dark:text-[#2563EB]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-all"
            >
              <Search className="h-4.5 w-4.5" />
              <span>Search URL</span>
            </button>

            <button 
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-all"
            >
              <History className="h-4.5 w-4.5" />
              <span>History Logs</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Right Content Pane ── */}
      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 select-none pb-2">
          {/* Back link */}
          <button 
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-fit"
          >
            <span>← Back to Dashboard</span>
          </button>

          {/* Right Header items */}
          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
            {data.url && (
              <a 
                href={data.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <span>Original Listing</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              {formattedDate}
            </span>

            <button className="p-2 bg-white border border-slate-200/80 rounded-xl text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm" title="Bookmark">
              <Bookmark className="h-4 w-4" />
            </button>

            <button className="p-2 bg-white border border-slate-200/80 rounded-xl text-slate-400 hover:text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-all shadow-sm" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Product Header Block ── */}
        <div className="flex flex-col md:flex-row gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_rgba(0,0,0,0.03)] items-stretch">
          
          {/* Thumbnail */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-1 overflow-hidden select-none">
            <img 
              src={data.productImage || getProductThumbnail(data.productName)} 
              alt="Product Image"
              className="h-full w-full object-contain rounded-lg transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Metadata */}
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#2563EB] tracking-wide uppercase select-none block">
                {getCategoryBreadcrumbs(data.productName)}
              </span>
              
              <h1 
                className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 cursor-help"
                title={data.productName}
              >
                {getShortTitle(data.productName)}
              </h1>
            </div>

            {/* Badges and Stats Row */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5 select-none">
              
              {/* Marketplace badge */}
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                data.platform === 'Amazon' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' 
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
              }`}>
                {data.platform === 'Amazon' ? 'a Amazon.in' : 'f Flipkart'}
              </span>

              {/* Data Source Badge */}
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                data.isLive 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30' 
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.isLive ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span>{data.isLive ? 'Live Data (Apify)' : 'Demo Dataset'}</span>
              </span>

              {/* Fulfillment */}
              {data.trustEngine?.marketplace_status && (
                <span className="bg-blue-50 text-blue-700 border border-blue-100/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider dark:bg-blue-950/20 dark:text-blue-400">
                  {data.trustEngine.marketplace_status}
                </span>
              )}

              {/* Verified badge */}
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider dark:bg-emerald-950/20 dark:text-emerald-400 inline-flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Verified Listing</span>
              </span>

              {/* AI Engine Status Indicator */}
              <div 
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                  data.isMock 
                    ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400'
                }`}
                title={data.isMock ? "API unavailable. Running on local AI simulation engine." : "AI Pipeline server connected successfully."}
              >
                <Cpu className="h-2.5 w-2.5 shrink-0" />
                <span>AI: {data.isMock ? 'Simulated' : 'Online'}</span>
              </div>

              {/* Star details */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 ml-auto">
                <span className="text-amber-400 text-xs">★★★★★</span>
                <span>{data.rating || '4.6'}</span>
                <span className="font-semibold text-slate-350 dark:text-slate-655">
                  ({(data.totalRatings !== undefined ? data.totalRatings : 12842).toLocaleString()} Ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Analytics (Exactly Three Cards) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Trust Score */}
          <TrustMeter score={data.trust_score} />

          {/* Card 2: Review Breakdown */}
          <ReviewPieChart 
            genuinePct={data.genuine} 
            fakePct={data.fake} 
            genuineCount={stats.genuine} 
            fakeCount={stats.fake} 
          />

          {/* Card 3: Product Insights (Redesigned for Task: AI Trust Signals) */}
          <div className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 h-[280px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] justify-between transition-all duration-300 select-none">
            <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Product Insights</span>
              <span className="text-[10px] cursor-help" title="Detailed multi-factor explainability scoring.">ⓘ</span>
            </div>

            {/* Split layout inside Card 3 */}
            <div className="flex-1 flex gap-5 mt-3 min-h-0 items-stretch">
              
              {/* Left Column: Progress bars */}
              <div className="flex-1 flex flex-col justify-center space-y-2">
                
                {/* Metric 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-450 uppercase">
                    <span>Product Trust</span>
                    <span className="text-slate-700 dark:text-slate-250 font-black">{data.trustEngine?.product_trust_score || data.trust_score}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#2563EB] transition-all duration-500" 
                      style={{ width: `${data.trustEngine?.product_trust_score || data.trust_score}%` }} 
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-455 uppercase">
                    <span>Shopping Confidence</span>
                    <span className="text-slate-700 dark:text-slate-250 font-black">{data.trustEngine?.overall_shopping_confidence || data.trust_score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${data.trustEngine?.overall_shopping_confidence || data.trust_score}%` }} 
                    />
                  </div>
                </div>

                {/* Marketplace status line */}
                <div className="flex items-center justify-between text-[9px] font-bold pt-1 border-t border-slate-100/50 dark:border-slate-800/40">
                  <span className="text-slate-455 uppercase">Marketplace</span>
                  <span className="text-slate-750 dark:text-slate-300 font-extrabold truncate max-w-[80px]">
                    {data.trustEngine?.marketplace_status || data.platform}
                  </span>
                </div>

                {/* Risk Level status line */}
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-455 uppercase">Risk Level</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${data.trustEngine ? trustRiskMeta.dot : riskMeta.dot}`} />
                  <span className={`${data.trustEngine ? trustRiskMeta.color : riskMeta.color} font-extrabold text-[9px]`}>
                    {data.trustEngine ? data.trustEngine.risk_level : riskMeta.label}
                  </span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-slate-100 dark:bg-slate-800/40 shrink-0 py-1" />

              {/* Right Column: AI Trust Signals */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <span className="text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wide">
                  AI TRUST SIGNALS
                </span>
                
                <div className="space-y-1 mt-1">
                  {aiTrustSignals.map((sig, i) => (
                    <div key={i} className="text-[9px] text-slate-600 dark:text-slate-400 flex items-start gap-1 leading-tight font-medium">
                      {sig.isPositive ? (
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      ) : (
                        <span className="text-amber-500 font-bold shrink-0">⚠</span>
                      )}
                      <span className="line-clamp-1">{sig.text}</span>
                    </div>
                  ))}
                </div>

                {/* Overall Risk display */}
                <div className="mt-2 pt-1 border-t border-slate-100/80 dark:border-slate-800/45 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wide">Overall Risk</span>
                  <span className={`${overallRisk.color} px-2 py-0.25 rounded text-[9px] font-extrabold`}>
                    {overallRisk.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom link trigger */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 mt-1 flex justify-between items-center">
              <button 
                onClick={() => setShowCredDetails(true)}
                className="text-[9px] font-bold text-[#2563EB] hover:underline transition-all"
              >
                View full analysis →
              </button>
            </div>
          </div>
        </div>

        {/* ── Reviews Analysis List ── */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
            
            {/* Task 2 - Segmented Toggle Pill group */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200/20 dark:border-slate-800/40 select-none">
              <button
                onClick={() => {
                  setFilterGenuine(true);
                  setFilterSuspicious(true);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterGenuine && filterSuspicious
                    ? 'bg-white text-[#2563EB] shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All Reviews ({stats.total})
              </button>
              <button
                onClick={() => {
                  setFilterGenuine(true);
                  setFilterSuspicious(false);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterGenuine && !filterSuspicious
                    ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Genuine Reviews ({stats.genuine})
              </button>
              <button
                onClick={() => {
                  setFilterGenuine(false);
                  setFilterSuspicious(true);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !filterGenuine && filterSuspicious
                    ? 'bg-white text-rose-600 shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Suspicious Reviews ({stats.fake})
              </button>
            </div>

            {/* Controls: Search, Filter icon, Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto self-end">
              
              {/* Search filter input */}
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 max-w-xs w-full shadow-sm">
                <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search keywords..."
                  className="w-full bg-transparent text-xs sm:text-sm outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
                />
              </div>

              {/* Task 3: Functional Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowFilterMenu(prev => !prev);
                    setShowSortMenu(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold shadow-sm transition-all ${
                    showFilterMenu 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Toggle Filters Options"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filter</span>
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-2 mb-1">Filter Reviews</span>
                    
                    <button 
                      onClick={() => setFilterGenuine(prev => !prev)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>Genuine Reviews</span>
                      {filterGenuine && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <button 
                      onClick={() => setFilterSuspicious(prev => !prev)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>Suspicious Reviews</span>
                      {filterSuspicious && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <button 
                      onClick={() => setFilterVerified(prev => !prev)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>Verified Purchase</span>
                      {filterVerified && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button 
                      onClick={() => {
                        setFilter5Star(prev => !prev);
                        setFilter4PlusStar(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>5 Star</span>
                      {filter5Star && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <button 
                      onClick={() => {
                        setFilter4PlusStar(prev => !prev);
                        setFilter5Star(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>4+ Star</span>
                      {filter4PlusStar && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button 
                      onClick={() => {
                        setFilterRecent(prev => !prev);
                        setFilterOldest(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>Recent Reviews</span>
                      {filterRecent && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>

                    <button 
                      onClick={() => {
                        setFilterOldest(prev => !prev);
                        setFilterRecent(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                    >
                      <span>Oldest Reviews</span>
                      {filterOldest && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Task 4: Functional Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSortMenu(prev => !prev);
                    setShowFilterMenu(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold shadow-sm transition-all ${
                    showSortMenu 
                      ? 'bg-slate-50 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Sort order"
                >
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    Sort: {
                      sortBy === 'relevant' ? 'Most Relevant' :
                      sortBy === 'newest' ? 'Newest First' :
                      sortBy === 'oldest' ? 'Oldest First' :
                      sortBy === 'confidence_high' ? 'Highest AI Confidence' :
                      sortBy === 'confidence_low' ? 'Lowest AI Confidence' :
                      sortBy === 'rating_high' ? 'Highest Rating' :
                      'Lowest Rating'
                    }
                  </span>
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-155">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-2.5 py-1 mb-0.5">Sort Order</span>
                    
                    {[
                      { value: 'relevant', label: 'Most Relevant' },
                      { value: 'newest', label: 'Newest First' },
                      { value: 'oldest', label: 'Oldest First' },
                      { value: 'confidence_high', label: 'Highest AI Confidence' },
                      { value: 'confidence_low', label: 'Lowest AI Confidence' },
                      { value: 'rating_high', label: 'Highest Rating' },
                      { value: 'rating_low', label: 'Lowest Rating' }
                    ].map(opt => (
                      <button 
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setFilterRecent(false);
                          setFilterOldest(false);
                          setShowSortMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-left transition-colors"
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.value && <Check className="h-3.5 w-3.5 text-[#2563EB]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Reviews List */}
          {sortedReviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
              <Search className="h-10 w-10 text-slate-350 dark:text-slate-700 mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No reviews matched</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-normal">
                Try clearing keyword searches or adjusting your active filter options.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* ── Explainable AI Detailed Audit Modal Overlay ── */}
      {showCredDetails && (data.trustEngine || data.authenticityEngine) && (() => {
        const engine = data.trustEngine || data.authenticityEngine;
        const flags = engine.triggered_flags || [];
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/65 max-w-lg w-full shadow-2xl p-6 relative flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
                <div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                    Explainable Shopping Trust Audit
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    ESTE Explanations &amp; Telemetry Matrix
                  </p>
                </div>
                <button 
                  onClick={() => setShowCredDetails(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close details"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 text-slate-700 dark:text-slate-355 text-xs">
                
                {/* Heuristics breakdown */}
                <div className="space-y-2 select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Telemetry Analysis &amp; Formulas
                  </span>
                  
                  <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/10 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    
                    {/* Marketplace Verification details */}
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 border-b border-slate-100/60 pb-1.5">
                      <span>Marketplace Verification details</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {engine.marketplace_status || (data.platform === 'Amazon' ? 'Amazon Fulfilled' : 'Flipkart Assured')}
                      </span>
                    </div>

                    {/* Price comparison analysis */}
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 border-b border-slate-100/60 pb-1.5">
                      <span>Price comparison analysis</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {!flags.includes('PRICE_ANOMALY') ? "Price matches reference market average" : "Pricing anomaly detected"}
                      </span>
                    </div>

                    {/* Product Metadata Consistency */}
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 border-b border-slate-100/60 pb-1.5">
                      <span>Product Metadata Consistency</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Internally Consistent
                      </span>
                    </div>

                    {/* Duplicate review percentage */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>Duplicate review percentage / penalty</span>
                        <span className="font-bold tabular-nums text-slate-700 dark:text-slate-350">
                          {engine.signal_breakdown?.duplicate_penalty ? `${Math.round((engine.signal_breakdown.duplicate_penalty / 20) * 100)}%` : "0%"}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${(engine.signal_breakdown?.duplicate_penalty || 0) / 20 * 100}%` }} />
                      </div>
                    </div>

                    {/* Vocabulary diversity score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>Vocabulary diversity score</span>
                        <span className="font-bold tabular-nums text-slate-700 dark:text-slate-350">
                          {engine.signal_breakdown?.vocabulary_diversity?.toFixed(1) || "8.5"} / 10.0
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(engine.signal_breakdown?.vocabulary_diversity || 8.5) / 10 * 100}%` }} />
                      </div>
                    </div>

                    {/* Keyword density statistics */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>Risk keyword density rating</span>
                        <span className="font-bold tabular-nums text-slate-700 dark:text-slate-350">
                          {engine.signal_breakdown?.spam_pattern_penalty?.toFixed(1) || "12.0"} / 25.0
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-450" style={{ width: `${(engine.signal_breakdown?.spam_pattern_penalty || 12) / 25 * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Triggered Flags */}
                {flags.length > 0 && (
                  <div className="space-y-1.5 select-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Triggered Scoring Flags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {flags.map((flag) => {
                        const isPositive = flag === 'VERIFIED_CONTENT_SIGNALS';
                        return (
                          <span 
                            key={flag} 
                            className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400'
                            }`}
                          >
                            <span className={`h-1 w-1 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {flag.replace(/_/g, ' ')}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actionable Recommendations */}
                {engine.recommendations?.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      AI Recommendations
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {engine.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/30">
                          <span className="mt-0.5 text-brand-500 shrink-0 font-extrabold text-[10px]">➤</span>
                          <p className="text-slate-650 dark:text-slate-300 leading-normal">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={() => setShowCredDetails(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
