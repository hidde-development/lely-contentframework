"use client";

import { useEffect, useRef, useState } from "react";
import type { RationaleItem, RationaleType, TemplateModule } from "@/lib/types";

interface RationalePanelProps {
  items: RationaleItem[];
  highlightedIds: string[];
  onItemHover: (id: string | null) => void;
}

// ── Tab definitions ────────────────────────────────────────────────────────────

type Tab = "all" | "seo" | "geo" | "branding" | "strategy";

const TABS: { id: Tab; label: string; types: RationaleType[] }[] = [
  { id: "all",      label: "All",      types: ["seo", "geo", "both", "tov", "brand", "strategy"] },
  { id: "seo",      label: "SEO",      types: ["seo", "both"] },
  { id: "geo",      label: "GEO",      types: ["geo", "both"] },
  { id: "branding", label: "Branding", types: ["tov", "brand"] },
  { id: "strategy", label: "Strategy", types: ["strategy"] },
];

// ── Badge styles ───────────────────────────────────────────────────────────────

const typeBadge: Record<RationaleType, { label: string; className: string }> = {
  seo:      { label: "SEO",           className: "bg-blue-100 text-blue-700 border border-blue-200" },
  geo:      { label: "GEO",           className: "bg-purple-100 text-purple-700 border border-purple-200" },
  both:     { label: "SEO + GEO",     className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  tov:      { label: "Tone of voice", className: "bg-rose-100 text-rose-700 border border-rose-200" },
  brand:    { label: "Brand",         className: "bg-amber-100 text-amber-700 border border-amber-200" },
  strategy: { label: "Strategy",      className: "bg-violet-100 text-violet-700 border border-violet-200" },
};

const moduleLabels: Record<TemplateModule, string> = {
  META:        "SEO Metadata",
  HERO:        "Hero",
  INTRO:       "Introduction",
  USP:         "USP Block",
  BODY:        "Body Text",
  TESTIMONIAL: "Testimonials",
  CTA:         "Natural CTA",
  FAQ:         "FAQ",
  BLOGS:       "Related Blogs",
  PRODUCTS:    "Related Products",
};

const moduleColors: Record<TemplateModule, string> = {
  META:        "bg-violet-100 text-violet-700",
  HERO:        "bg-slate-100 text-slate-600",
  INTRO:       "bg-sky-100 text-sky-700",
  USP:         "bg-blue-100 text-blue-700",
  BODY:        "bg-indigo-100 text-indigo-700",
  TESTIMONIAL: "bg-pink-100 text-pink-700",
  CTA:         "bg-amber-100 text-amber-700",
  FAQ:         "bg-yellow-100 text-yellow-700",
  BLOGS:       "bg-teal-100 text-teal-700",
  PRODUCTS:    "bg-gray-100 text-gray-600",
};

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rationale</h2>
        </div>
        <p className="text-xs text-gray-400">Hover over text to see the explanation</p>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">The rationale for each text element will appear here</p>
        </div>
      </div>
    </aside>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function RationalePanel({ items, highlightedIds, onItemHover }: RationalePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-switch to the tab that contains the first highlighted item
  useEffect(() => {
    if (highlightedIds.length === 0) return;
    const firstId = highlightedIds[0];
    const item = items.find((i) => i.id === firstId);
    if (!item) return;

    const targetTab = TABS.find((t) => t.id !== "all" && t.types.includes(item.type));
    if (targetTab && activeTab !== "all") {
      // Only auto-switch if not on "all" and the item is not visible in current tab
      const currentTabTypes = TABS.find((t) => t.id === activeTab)?.types ?? [];
      if (!currentTabTypes.includes(item.type)) setActiveTab(targetTab.id);
    }
  }, [highlightedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (highlightedIds.length > 0) {
      const el = itemRefs.current.get(highlightedIds[0]);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [highlightedIds]);

  if (items.length === 0) return <EmptyState />;

  const activeTypes = TABS.find((t) => t.id === activeTab)?.types ?? [];
  const visibleItems = activeTab === "all" ? items : items.filter((i) => activeTypes.includes(i.type));

  // Count per tab for badges
  const tabCounts: Record<Tab, number> = {
    all:      items.length,
    seo:      items.filter((i) => i.type === "seo" || i.type === "both").length,
    geo:      items.filter((i) => i.type === "geo" || i.type === "both").length,
    branding: items.filter((i) => i.type === "tov" || i.type === "brand").length,
    strategy: items.filter((i) => i.type === "strategy").length,
  };

  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rationale</h2>
          <span className="ml-auto text-xs text-gray-400">{visibleItems.length} of {items.length}</span>
        </div>
        <p className="text-xs text-gray-400">Hover over text to see the explanation</p>
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
                isActive
                  ? "border-gray-800 text-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {visibleItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">No {activeTab} rationale items generated.</p>
          </div>
        ) : (
          visibleItems.map((item, idx) => {
            const isHighlighted = highlightedIds.includes(item.id);
            const badge = typeBadge[item.type] ?? typeBadge.seo;
            const modColor = item.module ? moduleColors[item.module] : "bg-gray-100 text-gray-600";
            const modLabel = item.module ? moduleLabels[item.module] : "";

            return (
              <div
                key={item.id}
                ref={(el) => { if (el) itemRefs.current.set(item.id, el); else itemRefs.current.delete(item.id); }}
                onMouseEnter={() => onItemHover(item.id)}
                onMouseLeave={() => onItemHover(null)}
                className={`rounded-xl p-3.5 border cursor-default transition-all ${
                  isHighlighted ? "bg-yellow-50 border-yellow-300 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-400 tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
                  {item.module && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${modColor}`}>{modLabel}</span>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-500 mb-1 italic">{item.element}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.explanation}</p>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
