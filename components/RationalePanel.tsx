"use client";

import { useEffect, useRef } from "react";
import type { RationaleItem, TemplateModule } from "@/lib/types";

interface RationalePanelProps {
  items: RationaleItem[];
  highlightedIds: string[];
  onItemHover: (id: string | null) => void;
}

const typeBadge: Record<string, { label: string; className: string }> = {
  seo:   { label: "SEO",   className: "bg-blue-100 text-blue-700 border border-blue-200" },
  geo:   { label: "GEO",   className: "bg-purple-100 text-purple-700 border border-purple-200" },
  both:  { label: "SEO + GEO", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  tov:   { label: "Tone of Voice", className: "bg-rose-100 text-rose-700 border border-rose-200" },
  brand: { label: "Brand", className: "bg-amber-100 text-amber-700 border border-amber-200" },
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

export default function RationalePanel({ items, highlightedIds, onItemHover }: RationalePanelProps) {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (highlightedIds.length > 0) {
      const el = itemRefs.current.get(highlightedIds[0]);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  // Counts per type
  const counts = items.reduce<Record<string, number>>((acc, i) => { acc[i.type] = (acc[i.type] ?? 0) + 1; return acc; }, {});
  const moduleCounts = items.reduce<Partial<Record<TemplateModule, number>>>((acc, i) => { if (i.module) acc[i.module] = (acc[i.module] ?? 0) + 1; return acc; }, {});

  return (
    <aside className="w-96 min-w-[320px] bg-gray-50 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Rationale</h2>
          <span className="ml-auto text-xs text-gray-400">{items.length} items</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">Hover over text to see the explanation</p>

        {/* Type badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {Object.entries(counts).map(([type, count]) => {
            const badge = typeBadge[type];
            if (!badge) return null;
            return (
              <span key={type} className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                {badge.label}: {count}
              </span>
            );
          })}
        </div>

        {/* Module breakdown */}
        <div className="flex flex-wrap gap-1">
          {(Object.entries(moduleCounts) as [TemplateModule, number][]).map(([mod, count]) => (
            <span key={mod} className={`text-xs px-2 py-0.5 rounded-full font-medium ${moduleColors[mod]}`}>
              {moduleLabels[mod]}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item, idx) => {
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
        })}
      </div>
    </aside>
  );
}
