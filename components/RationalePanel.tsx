"use client";

import { useEffect, useRef } from "react";
import type { RationaleItem } from "@/lib/types";

interface RationalePanelProps {
  items: RationaleItem[];
  highlightedIds: string[];
  onItemHover: (id: string | null) => void;
}

const typeBadge: Record<string, { label: string; className: string }> = {
  seo: {
    label: "SEO",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  geo: {
    label: "GEO",
    className: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  both: {
    label: "SEO + GEO",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
};

export default function RationalePanel({ items, highlightedIds, onItemHover }: RationalePanelProps) {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to first highlighted item
  useEffect(() => {
    if (highlightedIds.length > 0) {
      const firstId = highlightedIds[0];
      const el = itemRefs.current.get(firstId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [highlightedIds]);

  if (items.length === 0) {
    return (
      <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rationale</h2>
          </div>
          <p className="text-xs text-gray-400">Hover over tekst om de toelichting te zien</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">Hier verschijnt de rationale per tekstelement</p>
          </div>
        </div>
      </aside>
    );
  }

  const seoCount = items.filter((i) => i.type === "seo" || i.type === "both").length;
  const geoCount = items.filter((i) => i.type === "geo" || i.type === "both").length;

  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rationale</h2>
          <span className="ml-auto text-xs text-gray-400">{items.length} punten</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">Hover over tekst om de toelichting te zien</p>
        {/* Stats */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-semibold text-blue-700">{seoCount}</span>
            <span className="text-xs text-blue-600">SEO</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-semibold text-purple-700">{geoCount}</span>
            <span className="text-xs text-purple-600">GEO</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item, idx) => {
          const isHighlighted = highlightedIds.includes(item.id);
          const badge = typeBadge[item.type] || typeBadge.seo;

          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              }}
              onMouseEnter={() => onItemHover(item.id)}
              onMouseLeave={() => onItemHover(null)}
              className={`rounded-xl p-3.5 border cursor-default transition-all ${
                isHighlighted
                  ? "bg-yellow-50 border-yellow-300 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-400 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <span className="text-xs text-gray-400 italic shrink-0">{item.element}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
