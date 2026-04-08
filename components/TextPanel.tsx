"use client";

import type { TextElement } from "@/lib/types";

interface TextPanelProps {
  elements: TextElement[];
  activeRationaleId: string | null;
  onElementHover: (rationaleIds: string[] | null) => void;
}

function isHighlighted(rationaleIds: string[], activeRationaleId: string | null) {
  return activeRationaleId !== null && rationaleIds.includes(activeRationaleId);
}

function hoverClass(rationaleIds: string[], activeRationaleId: string | null) {
  return isHighlighted(rationaleIds, activeRationaleId)
    ? "bg-yellow-100 ring-1 ring-yellow-300"
    : "hover:bg-gray-50";
}

interface ElementProps {
  el: TextElement;
  activeRationaleId: string | null;
  onHover: (ids: string[] | null) => void;
}

function Breadcrumb({ el, activeRationaleId, onHover }: ElementProps) {
  return (
    <nav
      aria-label="Kruimelpad"
      onMouseEnter={() => onHover(el.rationaleIds)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-1.5 text-xs text-gray-400 mb-4 rounded px-1 -mx-1 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
    >
      {el.content.split(">").map((crumb, i, arr) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className={i === arr.length - 1 ? "text-gray-600 font-medium" : ""}>{crumb.trim()}</span>
          {i < arr.length - 1 && <span className="text-gray-300">/</span>}
        </span>
      ))}
    </nav>
  );
}

function EEATBlock({ el, activeRationaleId, onHover }: ElementProps) {
  const author = el.meta?.author ?? "Onbekende auteur";
  const published = el.meta?.published ?? "";
  const updated = el.meta?.updated ?? "";

  return (
    <div
      onMouseEnter={() => onHover(el.rationaleIds)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-3 my-4 py-3 px-4 rounded-xl border border-gray-100 bg-gray-50 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
    >
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700">{author}</p>
        <p className="text-xs text-gray-400">
          {published && <>Gepubliceerd: <time dateTime={published}>{published}</time></>}
          {updated && published && " · "}
          {updated && <>Bijgewerkt: <time dateTime={updated}>{updated}</time></>}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        E-E-A-T
      </div>
    </div>
  );
}

function KeyTakeawaysBlock({ items, activeRationaleId, onHover }: { items: TextElement[]; activeRationaleId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Kernpunten</span>
      </div>
      <ul className="space-y-2">
        {items.map((el) => (
          <li
            key={el.id}
            onMouseEnter={() => onHover(el.rationaleIds)}
            onMouseLeave={() => onHover(null)}
            className={`flex items-start gap-2.5 text-sm text-blue-900 rounded-lg px-2 py-1 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
          >
            <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: el.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DataTable({ el, activeRationaleId, onHover }: ElementProps) {
  if (!el.tableData) return null;
  const { headers, rows } = el.tableData;

  return (
    <div
      onMouseEnter={() => onHover(el.rationaleIds)}
      onMouseLeave={() => onHover(null)}
      className={`my-6 rounded-xl overflow-hidden border border-gray-200 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
    >
      {el.content && (
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{el.content}</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-gray-50">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQSection({ pairs, activeRationaleId, onHover }: { pairs: Array<{ q: TextElement; a: TextElement }>; activeRationaleId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-1 border-b border-gray-200">
        Veelgestelde vragen
      </h2>
      <div className="space-y-4">
        {pairs.map(({ q, a }, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden">
            <div
              onMouseEnter={() => onHover(q.rationaleIds)}
              onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-gray-50 cursor-default transition-all ${hoverClass(q.rationaleIds, activeRationaleId)}`}
            >
              <p className="text-sm font-semibold text-gray-800">{q.content}</p>
            </div>
            <div
              onMouseEnter={() => onHover(a.rationaleIds)}
              onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-white cursor-default transition-all ${hoverClass(a.rationaleIds, activeRationaleId)}`}
            >
              <p className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: a.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesSection({ items, activeRationaleId, onHover }: { items: TextElement[]; activeRationaleId: string | null; onHover: (ids: string[] | null) => void }) {
  return (
    <div className="my-6 pt-4 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bronnen</p>
      <ol className="space-y-2 list-decimal list-inside">
        {items.map((el, idx) => (
          <li
            key={el.id}
            onMouseEnter={() => onHover(el.rationaleIds)}
            onMouseLeave={() => onHover(null)}
            className={`text-xs text-gray-500 rounded px-1 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
          >
            {el.meta?.url ? (
              <a href={el.meta.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {el.content}
              </a>
            ) : (
              el.content
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

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
          <h3 className="text-base font-semibold text-gray-700 mb-2">Geen tekst gegenereerd</h3>
          <p className="text-sm text-gray-400">
            Vul de inputvelden in en klik op &ldquo;Genereer tekst&rdquo; om te beginnen.
          </p>
        </div>
      </main>
    );
  }

  // Groepeer gerelateerde elementen
  const keytakeaways = elements.filter((e) => e.type === "keytakeaway");
  const faq_qs = elements.filter((e) => e.type === "faq_q");
  const faq_as = elements.filter((e) => e.type === "faq_a");
  const sources = elements.filter((e) => e.type === "source");

  // Bouw FAQ-paren
  const faqPairs = faq_qs.map((q, i) => ({ q, a: faq_as[i] })).filter((p) => p.a);

  // Bouw gegroepeerde li-elementen
  type GroupedItem =
    | TextElement
    | { type: "ul"; items: TextElement[] }
    | { type: "keytakeaways_block"; items: TextElement[] }
    | { type: "faq_block"; pairs: Array<{ q: TextElement; a: TextElement }> }
    | { type: "sources_block"; items: TextElement[] };

  const grouped: GroupedItem[] = [];
  let currentList: TextElement[] | null = null;
  let keytakeawaysAdded = false;
  let faqAdded = false;
  let sourcesAdded = false;

  for (const el of elements) {
    // Sla individuele faq/source/keytakeaway over — worden als blok toegevoegd
    if (el.type === "faq_a") continue;

    if (el.type === "keytakeaway") {
      currentList = null;
      if (!keytakeawaysAdded) {
        grouped.push({ type: "keytakeaways_block", items: keytakeaways });
        keytakeawaysAdded = true;
      }
      continue;
    }

    if (el.type === "faq_q") {
      currentList = null;
      if (!faqAdded) {
        grouped.push({ type: "faq_block", pairs: faqPairs });
        faqAdded = true;
      }
      continue;
    }

    if (el.type === "source") {
      currentList = null;
      if (!sourcesAdded) {
        grouped.push({ type: "sources_block", items: sources });
        sourcesAdded = true;
      }
      continue;
    }

    if (el.type === "li") {
      if (!currentList) {
        currentList = [];
        grouped.push({ type: "ul", items: currentList });
      }
      currentList.push(el);
      continue;
    }

    currentList = null;
    grouped.push(el);
  }

  const headingClass: Record<string, string> = {
    h1: "text-2xl font-bold text-gray-900 mt-6 mb-3",
    h2: "text-xl font-semibold text-gray-800 mt-8 mb-2 pb-1 border-b border-gray-200",
    h3: "text-base font-semibold text-gray-700 mt-5 mb-1.5",
  };

  return (
    <main className="flex-1 bg-white border-r border-gray-200 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Gegenereerde tekst</h2>
        </div>
        <button
          onClick={() => {
            const text = elements.map((el) => el.content).join("\n\n");
            navigator.clipboard.writeText(text);
          }}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Kopieer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {grouped.map((item, idx) => {
            // Speciale blokken
            if ("type" in item && item.type === "keytakeaways_block") {
              return <KeyTakeawaysBlock key={idx} items={item.items} activeRationaleId={activeRationaleId} onHover={onElementHover} />;
            }
            if ("type" in item && item.type === "faq_block") {
              return <FAQSection key={idx} pairs={item.pairs} activeRationaleId={activeRationaleId} onHover={onElementHover} />;
            }
            if ("type" in item && item.type === "sources_block") {
              return <SourcesSection key={idx} items={item.items} activeRationaleId={activeRationaleId} onHover={onElementHover} />;
            }

            // Li-lijst
            if ("type" in item && item.type === "ul") {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1 my-3 ml-2">
                  {item.items.map((li) => (
                    <li
                      key={li.id}
                      onMouseEnter={() => onElementHover(li.rationaleIds)}
                      onMouseLeave={() => onElementHover(null)}
                      className={`text-sm text-gray-700 leading-relaxed rounded px-1 cursor-default transition-all ${hoverClass(li.rationaleIds, activeRationaleId)}`}
                      dangerouslySetInnerHTML={{ __html: li.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                    />
                  ))}
                </ul>
              );
            }

            // Individuele elementen
            const el = item as TextElement;

            if (el.type === "breadcrumb") return <Breadcrumb key={el.id} el={el} activeRationaleId={activeRationaleId} onHover={onElementHover} />;
            if (el.type === "eeat") return <EEATBlock key={el.id} el={el} activeRationaleId={activeRationaleId} onHover={onElementHover} />;
            if (el.type === "table") return <DataTable key={el.id} el={el} activeRationaleId={activeRationaleId} onHover={onElementHover} />;

            if (el.type === "h1" || el.type === "h2" || el.type === "h3") {
              const Tag = el.type as "h1" | "h2" | "h3";
              return (
                <Tag
                  key={el.id}
                  onMouseEnter={() => onElementHover(el.rationaleIds)}
                  onMouseLeave={() => onElementHover(null)}
                  className={`${headingClass[el.type]} rounded px-1 -mx-1 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
                  dangerouslySetInnerHTML={{ __html: el.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
              );
            }

            // p / intro
            return (
              <p
                key={el.id}
                onMouseEnter={() => onElementHover(el.rationaleIds)}
                onMouseLeave={() => onElementHover(null)}
                className={`${el.type === "intro" ? "text-base font-medium" : "text-sm"} text-gray-700 leading-relaxed my-3 rounded px-1 -mx-1 cursor-default transition-all ${hoverClass(el.rationaleIds, activeRationaleId)}`}
                dangerouslySetInnerHTML={{ __html: el.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
