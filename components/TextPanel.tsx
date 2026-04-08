"use client";

import type { TextElement } from "@/lib/types";

interface TextPanelProps {
  elements: TextElement[];
  activeRationaleId: string | null;
  onElementHover: (rationaleIds: string[] | null) => void;
}

function isHighlighted(rationaleIds: string[], activeId: string | null) {
  return activeId !== null && rationaleIds.includes(activeId);
}

function hoverCls(rationaleIds: string[], activeId: string | null) {
  return isHighlighted(rationaleIds, activeId)
    ? "bg-yellow-100 ring-1 ring-yellow-300"
    : "hover:bg-gray-50";
}

function bold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// ── Individual renderers ──────────────────────────────────────────────────────

function MetaBlock({ elements, activeId, onHover }: { elements: TextElement[]; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  const titleEl = elements.find((e) => e.type === "meta_title");
  const descEl = elements.find((e) => e.type === "meta_desc");

  if (!titleEl && !descEl) return null;

  function charColor(len: number, max: number) {
    if (len > max) return "text-red-600 font-semibold";
    if (len > max * 0.9) return "text-amber-600";
    return "text-green-600";
  }

  return (
    <div className="mb-8 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO metadata</span>
      </div>
      <div className="divide-y divide-gray-100">
        {titleEl && (
          <div onMouseEnter={() => onHover(titleEl.rationaleIds)} onMouseLeave={() => onHover(null)}
            className={`px-4 py-3 cursor-default transition-all ${hoverCls(titleEl.rationaleIds, activeId)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-400">Meta title</span>
              <span className={`text-xs tabular-nums ${charColor(titleEl.content.length, 65)}`}>
                {titleEl.content.length}/65
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800">{titleEl.content}</p>
          </div>
        )}
        {descEl && (
          <div onMouseEnter={() => onHover(descEl.rationaleIds)} onMouseLeave={() => onHover(null)}
            className={`px-4 py-3 cursor-default transition-all ${hoverCls(descEl.rationaleIds, activeId)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-400">Meta description</span>
              <span className={`text-xs tabular-nums ${charColor(descEl.content.length, 155)}`}>
                {descEl.content.length}/155
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{descEl.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CmsLabel({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.rationaleIds)} onMouseLeave={() => onHover(null)}
      className={`inline-flex items-center gap-1.5 mb-2 cursor-default transition-all rounded px-1 -mx-1 ${hoverCls(el.rationaleIds, activeId)}`}>
      <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{el.content}</span>
      <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-medium">CMS label</span>
    </div>
  );
}

function USPBlock({ items, activeId, onHover }: { items: TextElement[]; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3">
      {items.map((el) => (
        <div key={el.id} onMouseEnter={() => onHover(el.rationaleIds)} onMouseLeave={() => onHover(null)}
          className={`rounded-xl border border-gray-200 p-4 cursor-default transition-all ${hoverCls(el.rationaleIds, activeId)}`}>
          <h3 className="text-sm font-bold text-gray-900 mb-1">{el.content}</h3>
          {el.meta?.description && <p className="text-xs text-gray-500 leading-relaxed">{el.meta.description}</p>}
        </div>
      ))}
    </div>
  );
}

function CTAButton({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.rationaleIds)} onMouseLeave={() => onHover(null)}
      className={`my-3 flex items-center gap-3 cursor-default transition-all rounded-lg px-1 -mx-1 ${hoverCls(el.rationaleIds, activeId)}`}>
      <span className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg">
        {el.content}
      </span>
      {el.meta?.hint && <span className="text-xs text-gray-400 italic">{el.meta.hint}</span>}
    </div>
  );
}

function PlaceholderBlock({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.rationaleIds)} onMouseLeave={() => onHover(null)}
      className={`my-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-5 py-4 cursor-default transition-all ${isHighlighted(el.rationaleIds, activeId) ? "ring-1 ring-yellow-300" : ""}`}>
      <div className="flex items-start gap-2.5">
        <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">{el.content}</p>
      </div>
    </div>
  );
}

function RelatedBlogsSection({ items, activeId, onHover }: { items: TextElement[]; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Related blogs</p>
      <div className="space-y-2">
        {items.map((el) => (
          <div key={el.id} onMouseEnter={() => onHover(el.rationaleIds)} onMouseLeave={() => onHover(null)}
            className={`rounded-xl border border-gray-200 p-4 cursor-default transition-all ${hoverCls(el.rationaleIds, activeId)}`}>
            <p className="text-sm font-semibold text-gray-800 mb-1">{el.content}</p>
            {el.meta?.description && <p className="text-xs text-gray-500 leading-relaxed">{el.meta.description}</p>}
            <span className="mt-2 inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-medium">
              CMS placeholder — add actual link
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection({ pairs, activeId, onHover }: { pairs: Array<{ q: TextElement; a: TextElement }>; activeId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-1 border-b border-gray-200">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {pairs.map(({ q, a }, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden">
            <div onMouseEnter={() => onHover(q.rationaleIds)} onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-gray-50 cursor-default transition-all ${hoverCls(q.rationaleIds, activeId)}`}>
              <p className="text-sm font-semibold text-gray-800">{q.content}</p>
            </div>
            <div onMouseEnter={() => onHover(a.rationaleIds)} onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-white cursor-default transition-all ${hoverCls(a.rationaleIds, activeId)}`}>
              <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: bold(a.content) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TextPanel({ elements, activeRationaleId, onElementHover }: TextPanelProps) {
  if (elements.length === 0) {
    return (
      <main className="flex-1 bg-white border-r border-gray-200 h-full overflow-hidden flex items-center justify-center">
        <div className="text-center px-8 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">No text generated yet</h3>
          <p className="text-sm text-gray-400">Fill in the fields on the left and click &ldquo;Generate text&rdquo; to get started.</p>
        </div>
      </main>
    );
  }

  // Pre-collect grouped types
  const metaElements = elements.filter((e) => e.type === "meta_title" || e.type === "meta_desc");
  const uspItems = elements.filter((e) => e.type === "usp");
  const faq_qs = elements.filter((e) => e.type === "faq_q");
  const faq_as = elements.filter((e) => e.type === "faq_a");
  const blogItems = elements.filter((e) => e.type === "related_blog");
  const faqPairs = faq_qs.map((q, i) => ({ q, a: faq_as[i] })).filter((p) => p.a);

  // Group li into ul
  type Grouped =
    | TextElement
    | { type: "ul"; items: TextElement[] }
    | { type: "_usp_block"; items: TextElement[] }
    | { type: "_faq_block"; pairs: Array<{ q: TextElement; a: TextElement }> }
    | { type: "_blogs_block"; items: TextElement[] };

  const grouped: Grouped[] = [];
  let currentList: TextElement[] | null = null;
  let uspAdded = false, faqAdded = false, blogsAdded = false;

  for (const el of elements) {
    if (el.type === "faq_a") continue;
    // Meta elements rendered separately in MetaBlock
    if (el.type === "meta_title" || el.type === "meta_desc") continue;

    if (el.type === "usp") {
      currentList = null;
      if (!uspAdded) { grouped.push({ type: "_usp_block", items: uspItems }); uspAdded = true; }
      continue;
    }
    if (el.type === "faq_q") {
      currentList = null;
      if (!faqAdded) { grouped.push({ type: "_faq_block", pairs: faqPairs }); faqAdded = true; }
      continue;
    }
    if (el.type === "related_blog") {
      currentList = null;
      if (!blogsAdded) { grouped.push({ type: "_blogs_block", items: blogItems }); blogsAdded = true; }
      continue;
    }
    if (el.type === "li") {
      if (!currentList) { currentList = []; grouped.push({ type: "ul", items: currentList }); }
      currentList.push(el);
      continue;
    }
    currentList = null;
    grouped.push(el);
  }

  return (
    <main className="flex-1 bg-white border-r border-gray-200 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Generated text</h2>
        </div>
        <button onClick={() => { const text = elements.map((el) => el.content).join("\n\n"); navigator.clipboard.writeText(text); }}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <MetaBlock elements={metaElements} activeId={activeRationaleId} onHover={onElementHover} />
          {grouped.map((item, idx) => {
            // Grouped blocks
            if ("type" in item && item.type === "_usp_block")
              return <USPBlock key={idx} items={item.items} activeId={activeRationaleId} onHover={onElementHover} />;
            if ("type" in item && item.type === "_faq_block")
              return <FAQSection key={idx} pairs={item.pairs} activeId={activeRationaleId} onHover={onElementHover} />;
            if ("type" in item && item.type === "_blogs_block")
              return <RelatedBlogsSection key={idx} items={item.items} activeId={activeRationaleId} onHover={onElementHover} />;

            // Li list
            if ("type" in item && item.type === "ul") {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1 my-3 ml-2">
                  {item.items.map((li) => (
                    <li key={li.id} onMouseEnter={() => onElementHover(li.rationaleIds)} onMouseLeave={() => onElementHover(null)}
                      className={`text-sm text-gray-700 leading-relaxed rounded px-1 cursor-default transition-all ${hoverCls(li.rationaleIds, activeRationaleId)}`}
                      dangerouslySetInnerHTML={{ __html: bold(li.content) }} />
                  ))}
                </ul>
              );
            }

            // Individual elements
            const el = item as TextElement;

            if (el.type === "label")
              return <CmsLabel key={el.id} el={el} activeId={activeRationaleId} onHover={onElementHover} />;
            if (el.type === "cta")
              return <CTAButton key={el.id} el={el} activeId={activeRationaleId} onHover={onElementHover} />;
            if (el.type === "placeholder")
              return <PlaceholderBlock key={el.id} el={el} activeId={activeRationaleId} onHover={onElementHover} />;

            if (el.type === "h1" || el.type === "h2" || el.type === "h3") {
              const Tag = el.type as "h1" | "h2" | "h3";
              const cls = { h1: "text-2xl font-bold text-gray-900 mt-4 mb-2", h2: "text-xl font-semibold text-gray-800 mt-8 mb-2 pb-1 border-b border-gray-200", h3: "text-base font-semibold text-gray-700 mt-5 mb-1.5" }[el.type];
              return (
                <Tag key={el.id} onMouseEnter={() => onElementHover(el.rationaleIds)} onMouseLeave={() => onElementHover(null)}
                  className={`${cls} rounded px-1 -mx-1 cursor-default transition-all ${hoverCls(el.rationaleIds, activeRationaleId)}`}
                  dangerouslySetInnerHTML={{ __html: bold(el.content) }} />
              );
            }

            // p / default
            return (
              <p key={el.id} onMouseEnter={() => onElementHover(el.rationaleIds)} onMouseLeave={() => onElementHover(null)}
                className={`text-sm text-gray-700 leading-relaxed my-3 rounded px-1 -mx-1 cursor-default transition-all ${hoverCls(el.rationaleIds, activeRationaleId)}`}
                dangerouslySetInnerHTML={{ __html: bold(el.content) }} />
            );
          })}
        </div>
      </div>
    </main>
  );
}
