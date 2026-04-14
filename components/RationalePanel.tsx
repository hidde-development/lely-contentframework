"use client";

import { useEffect, useRef, useState } from "react";
import type { QualityReport, QualityCategory, ActionItem } from "@/lib/types";

interface QualityPanelProps {
  quality: QualityReport | null;
  activeElementId: string | null;
  onActionHover: (elementId: string | null) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

type Tab = "all" | QualityCategory;

const TABS: { id: Tab; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "seo",      label: "SEO" },
  { id: "geo",      label: "GEO" },
  { id: "brand",    label: "Brand" },
  { id: "strategy", label: "Strategy" },
];

const CATEGORY_STYLE: Record<QualityCategory, { badge: string; dot: string }> = {
  seo:      { badge: "bg-blue-100 text-blue-700 border border-blue-200",     dot: "bg-blue-500" },
  geo:      { badge: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-500" },
  brand:    { badge: "bg-amber-100 text-amber-700 border border-amber-200",  dot: "bg-amber-500" },
  strategy: { badge: "bg-violet-100 text-violet-700 border border-violet-200", dot: "bg-violet-500" },
};

const SEVERITY_STYLE: Record<ActionItem["severity"], { dot: string; label: string }> = {
  high:   { dot: "bg-red-500",    label: "High" },
  medium: { dot: "bg-amber-400",  label: "Medium" },
  low:    { dot: "bg-gray-300",   label: "Low" },
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs work";
  return "Critical";
}

function ScoreCard({ category, score }: { category: QualityCategory; score: number }) {
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${scoreBg(score)}`}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
        <span className={`text-xs font-medium ${scoreColor(score)}`}>{scoreLabel(score)}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-bold tabular-nums leading-none ${scoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400 mb-0.5">/100</span>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Quality check</h2>
        </div>
        <p className="text-xs text-gray-400">Generate a page to see the quality audit</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">The quality audit will identify what needs your attention</p>
        </div>
      </div>
    </aside>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function QualityPanel({ quality, activeElementId, onActionHover, onRegenerate, isRegenerating }: QualityPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to action item when text element is hovered
  useEffect(() => {
    if (!activeElementId || !quality) return;
    const action = quality.actions.find((a) => a.elementId === activeElementId);
    if (action) {
      const el = itemRefs.current.get(action.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeElementId, quality]);

  if (!quality) return <EmptyState />;

  const visibleActions = activeTab === "all"
    ? quality.actions
    : quality.actions.filter((a) => a.category === activeTab);

  const tabCounts: Record<Tab, number> = {
    all:      quality.actions.length,
    seo:      quality.actions.filter((a) => a.category === "seo").length,
    geo:      quality.actions.filter((a) => a.category === "geo").length,
    brand:    quality.actions.filter((a) => a.category === "brand").length,
    strategy: quality.actions.filter((a) => a.category === "strategy").length,
  };

  const overallScore = Math.round(
    (quality.scores.seo + quality.scores.geo + quality.scores.brand + quality.scores.strategy) / 4
  );

  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${overallScore >= 80 ? "bg-green-500" : overallScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Quality check</h2>
          <span className="ml-auto text-xs text-gray-400">Overall: <span className={`font-bold ${scoreColor(overallScore)}`}>{overallScore}/100</span></span>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          {quality.actions.length === 0
            ? "No issues found. All criteria met."
            : `${quality.actions.filter(a => a.severity === "high").length} high · ${quality.actions.filter(a => a.severity === "medium").length} medium · ${quality.actions.filter(a => a.severity === "low").length} low`}
        </p>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(Object.entries(quality.scores) as [QualityCategory, number][]).map(([cat, score]) => (
            <ScoreCard key={cat} category={cat} score={score} />
          ))}
        </div>

        {/* Regenerate button */}
        {quality.actions.length > 0 && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRegenerating ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Regenerating…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate with critic feedback
              </>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-3 pt-2 flex gap-0.5 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tabCounts[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t whitespace-nowrap border-b-2 transition-colors ${
                isActive ? "border-gray-800 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {visibleActions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">All {activeTab === "all" ? "" : activeTab + " "}criteria met.</p>
          </div>
        ) : (
          visibleActions.map((action) => {
            const isHighlighted = action.elementId === activeElementId;
            const catStyle = CATEGORY_STYLE[action.category];
            const sevStyle = SEVERITY_STYLE[action.severity];

            return (
              <div
                key={action.id}
                ref={(el) => { if (el) itemRefs.current.set(action.id, el); else itemRefs.current.delete(action.id); }}
                onMouseEnter={() => onActionHover(action.elementId ?? null)}
                onMouseLeave={() => onActionHover(null)}
                className={`rounded-xl p-3.5 border cursor-default transition-all ${
                  isHighlighted ? "bg-yellow-50 border-yellow-300 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {/* Top row: severity + category + criterion */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${sevStyle.dot}`}></span>
                    {sevStyle.label}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catStyle.badge}`}>
                    {action.category.charAt(0).toUpperCase() + action.category.slice(1)}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-400 ml-auto">{action.criterion}</span>
                </div>

                {/* Issue */}
                <p className="text-xs font-semibold text-gray-700 mb-2 leading-relaxed">{action.issue}</p>

                {/* Fix */}
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <p className="text-xs text-gray-600 leading-relaxed">{action.fix}</p>
                </div>

                {/* Element ref badge */}
                {action.elementId && (
                  <p className="text-xs text-gray-400 mt-2">
                    ↑ Hover to highlight element in text
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
