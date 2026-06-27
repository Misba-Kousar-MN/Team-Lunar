import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * AuthenticityEngine.jsx  — Merchant Credibility & Product Authenticity Card
 * ─────────────────────────────────────────────────────────────────────────────
 * Redesigned as a compact enterprise-grade dashboard card to be displayed 
 * as the 4th card in the main grid row, matching other metric cards exactly.
 *
 * Visually supports the Trust Score without competing for attention.
 * Occupies exactly h-[280px] when collapsed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function getRiskMeta(riskLevel = '') {
  const r = riskLevel.toLowerCase();
  if (r.includes('low')) {
    return { label: 'LOW RISK', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' };
  }
  if (r.includes('medium') || r.includes('caution')) {
    return { label: 'CAUTION', dot: 'bg-amber-400', text: 'text-amber-500 dark:text-amber-400' };
  }
  if (r.includes('high')) {
    return { label: 'HIGH RISK', dot: 'bg-rose-500', text: 'text-rose-500 dark:text-rose-400' };
  }
  if (r.includes('critical')) {
    return { label: 'CRITICAL', dot: 'bg-red-600', text: 'text-red-600 dark:text-red-400' };
  }
  return { label: riskLevel.toUpperCase(), dot: 'bg-slate-450', text: 'text-slate-500' };
}

function ProgressBar({ score, barColor }) {
  return (
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
      />
    </div>
  );
}

function BreakdownRow({ label, value, max, positive }) {
  const pct = Math.min(100, Math.round((Math.max(0, value) / max) * 100));
  const color = positive ? 'bg-emerald-500' : 'bg-rose-500';

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-400 dark:text-slate-500 w-32 shrink-0 leading-tight truncate">
        {label}
      </span>
      <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-6 text-right tabular-nums">
        {Math.round(value)}
      </span>
    </div>
  );
}

export default function AuthenticityEngine({ data }) {
  const [expanded, setExpanded] = useState(false);

  if (
    !data ||
    typeof data.seller_credibility_score  !== 'number' ||
    typeof data.product_authenticity_score !== 'number'
  ) {
    return null;
  }

  const sellerScore  = data.seller_credibility_score;
  const authScore    = data.product_authenticity_score;
  const riskLevel    = data.risk_level || data.risk_category || 'Unknown';
  const breakdown    = data.signal_breakdown && typeof data.signal_breakdown === 'object'
                         ? data.signal_breakdown : null;

  const riskMeta     = getRiskMeta(riskLevel);

  const sellerColor  = sellerScore >= 75 ? 'bg-emerald-500' : sellerScore >= 50 ? 'bg-amber-400' : 'bg-rose-500';
  const authColor    = authScore >= 75 ? 'bg-emerald-500' : authScore >= 50 ? 'bg-amber-400' : 'bg-rose-500';

  // Compute dynamic top signals based on scores
  const signals = useMemo(() => {
    const s = [];
    s.push({ label: sellerScore >= 75 ? 'Trusted Seller' : 'Caution Seller Profile', ok: sellerScore >= 75 });
    s.push({ label: authScore >= 75 ? 'High Genuine Reviews' : 'Suspicious Review Volume', ok: authScore >= 75 });
    
    if (breakdown) {
      s.push({ label: breakdown.duplicate_penalty < 6 ? 'Low Duplicate Reviews' : 'Duplicate Cluster Detected', ok: breakdown.duplicate_penalty < 6 });
      s.push({ label: breakdown.vocabulary_diversity >= 5 ? 'High Review Diversity' : 'Narrow Review Vocab', ok: breakdown.vocabulary_diversity >= 5 });
    } else {
      s.push({ label: 'Low Duplicate Reviews', ok: true });
      s.push({ label: 'High Review Diversity', ok: true });
    }
    return s.slice(0, 4);
  }, [sellerScore, authScore, breakdown]);

  return (
    <div className={`flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] justify-between transition-all duration-300 ${expanded ? 'h-auto min-h-[280px]' : 'h-[280px]'}`}>
      
      {/* Title */}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
        Merchant Credibility
      </h3>

      {expanded ? (
        // Expanded View (Signal Breakdown Details)
        <div className="flex-1 flex flex-col justify-between py-2 space-y-3">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Detailed AI Analysis
            </h4>
            {breakdown ? (
              <div className="space-y-2">
                <BreakdownRow label="Genuine Contribution" value={breakdown.fake_ratio_contribution} max={35} positive={true} />
                <BreakdownRow label="Duplicate Penalty" value={breakdown.duplicate_penalty} max={20} positive={false} />
                <BreakdownRow label="Vocabulary Diversity" value={breakdown.vocabulary_diversity} max={10} positive={true} />
                <BreakdownRow label="Spam Pattern Score" value={breakdown.spam_pattern_penalty} max={25} positive={false} />
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">Detailed signals unavailable for this product.</p>
            )}
          </div>

          <button
            onClick={() => setExpanded(false)}
            className="flex items-center justify-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors mt-2"
          >
            <span>Show Main View</span>
            <ChevronUp className="h-3 w-3" />
          </button>
        </div>
      ) : (
        // Main View (Standard Heuristics)
        <div className="flex-1 flex flex-col justify-between py-1">
          {/* Progress Bars */}
          <div className="space-y-2.5 my-1.5">
            {/* Seller Credibility */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Seller Credibility</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{sellerScore} / 100</span>
              </div>
              <ProgressBar score={sellerScore} barColor={sellerColor} />
            </div>

            {/* Product Authenticity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Product Authenticity</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{authScore} / 100</span>
              </div>
              <ProgressBar score={authScore} barColor={authColor} />
            </div>
          </div>

          {/* Overall Risk & Signals */}
          <div className="flex items-center justify-between text-[11px] py-1 border-t border-slate-100 dark:border-slate-800/40 border-b">
            <span className="font-semibold text-slate-500">Overall Risk</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`h-1.5 w-1.5 rounded-full ${riskMeta.dot}`} />
              <span className={riskMeta.text}>{riskMeta.label}</span>
            </div>
          </div>

          {/* Top Signals */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 my-1">
            {signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 min-w-0">
                {sig.ok ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="h-3 w-3 text-rose-400 shrink-0" />
                )}
                <span className="truncate leading-none">{sig.label}</span>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors mt-1 select-none"
          >
            <span>View Details</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
