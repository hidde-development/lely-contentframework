"use client";

import type { TextElement } from "@/lib/types";

interface TextPanelProps {
  elements: TextElement[];
  activeRationaleId: string | null;
  onElementHover: (rationaleIds: string[] | null) => void;
}

const typeStyles: Record<string, string> = {
  h1: "text-2xl font-bold text-gray-900 mt-6 mb-3",
  h2: "text-xl font-semibold text-gray-800 mt-8 mb-2 pb-1 border-b border-gray-200",
  h3: "text-base font-semibold text-gray-700 mt-5 mb-1.5",
  intro: "text-base text-gray-700 leading-relaxed font-medium",
  p: "text-sm text-gray-700 leading-relaxed",
  li: "text-sm text-gray-700 leading-relaxed",
};

const typeTag: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  intro: "p",
  p: "p",
  li: "li",
};

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

  // Group li elements into lists
  const grouped: Array<TextElement | { type: "ul"; items: TextElement[] }> = [];
  let currentList: TextElement[] | null = null;

  for (const el of elements) {
    if (el.type === "li") {
      if (!currentList) {
        currentList = [];
        grouped.push({ type: "ul", items: currentList });
      }
      currentList.push(el);
    } else {
      currentList = null;
      grouped.push(el);
    }
  }

  function isHighlighted(rationaleIds: string[]) {
    return activeRationaleId !== null && rationaleIds.includes(activeRationaleId);
  }

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
            if ("items" in item) {
              // Unordered list
              return (
                <ul key={idx} className="list-disc list-inside space-y-1 my-3 ml-2">
                  {item.items.map((li) => {
                    const highlighted = isHighlighted(li.rationaleIds);
                    return (
                      <li
                        key={li.id}
                        onMouseEnter={() => onElementHover(li.rationaleIds)}
                        onMouseLeave={() => onElementHover(null)}
                        className={`text-sm text-gray-700 leading-relaxed rounded px-1 cursor-default transition-colors ${
                          highlighted ? "bg-yellow-100 text-gray-900" : "hover:bg-gray-50"
                        }`}
                      >
                        {li.content}
                      </li>
                    );
                  })}
                </ul>
              );
            }

            const el = item as TextElement;
            const Tag = typeTag[el.type] || "p";
            const highlighted = isHighlighted(el.rationaleIds);
            const baseClass = typeStyles[el.type] || typeStyles.p;

            return (
              <Tag
                key={el.id}
                onMouseEnter={() => onElementHover(el.rationaleIds)}
                onMouseLeave={() => onElementHover(null)}
                className={`${baseClass} rounded px-1 -mx-1 cursor-default transition-colors ${
                  highlighted ? "bg-yellow-100" : "hover:bg-gray-50"
                }`}
              >
                {el.content}
              </Tag>
            );
          })}
        </div>
      </div>
    </main>
  );
}
