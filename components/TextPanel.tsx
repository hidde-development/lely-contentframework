"use client";

import { useState } from "react";
import type { TextElement } from "@/lib/types";

// Escape HTML entities in raw text
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Convert **bold** markers to <strong> after escaping
function inlineHtml(text: string): string {
  return esc(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// Strip **bold** markers for plain-text fallback
function stripBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

function elementsToHtml(elements: TextElement[]): string {
  const parts: string[] = [];

  // SEO metadata table at the top
  const metaTitle = elements.find((e) => e.type === "meta_title");
  const metaDesc = elements.find((e) => e.type === "meta_desc");
  if (metaTitle || metaDesc) {
    parts.push(
      `<table style="border:1px solid #d1d5db;border-collapse:collapse;width:100%;margin-bottom:16px;font-family:Arial,sans-serif">`,
      `<tr><td colspan="2" style="background:#f9fafb;padding:8px 12px;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;border-bottom:1px solid #d1d5db">SEO Metadata</td></tr>`,
    );
    if (metaTitle) {
      parts.push(
        `<tr><td style="padding:8px 12px;font-weight:600;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;white-space:nowrap">Meta title (${metaTitle.content.length}/65)</td>`,
        `<td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #e5e7eb">${esc(metaTitle.content)}</td></tr>`,
      );
    }
    if (metaDesc) {
      parts.push(
        `<tr><td style="padding:8px 12px;font-weight:600;font-size:12px;color:#6b7280;white-space:nowrap">Meta description (${metaDesc.content.length}/155)</td>`,
        `<td style="padding:8px 12px;font-size:14px">${esc(metaDesc.content)}</td></tr>`,
      );
    }
    parts.push(`</table>`);
  }

  const body = elements.filter((e) => e.type !== "meta_title" && e.type !== "meta_desc");
  let i = 0;

  while (i < body.length) {
    const el = body[i];

    switch (el.type) {
      case "label":
        // CMS labels are not part of the article copy
        break;
      case "h1":
        parts.push(`<h1 style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</h1>`);
        break;
      case "h2":
        parts.push(`<h2 style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</h2>`);
        break;
      case "h3":
        parts.push(`<h3 style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</h3>`);
        break;
      case "p":
        parts.push(`<p style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</p>`);
        break;
      case "li": {
        // Collect all consecutive li elements into one <ul>
        const lis: string[] = [];
        while (i < body.length && body[i].type === "li") {
          lis.push(`<li style="font-family:Arial,sans-serif">${inlineHtml(body[i].content)}</li>`);
          i++;
        }
        parts.push(`<ul>${lis.join("")}</ul>`);
        continue; // i already advanced past the list
      }
      case "usp":
        parts.push(`<h3 style="font-family:Arial,sans-serif">${esc(el.content)}</h3>`);
        if (el.meta?.description) parts.push(`<p style="font-family:Arial,sans-serif">${esc(el.meta.description)}</p>`);
        break;
      case "cta": {
        const hint = el.meta?.hint ? ` <em style="color:#6b7280">(${esc(el.meta.hint)})</em>` : "";
        parts.push(`<p style="font-family:Arial,sans-serif"><strong>→ ${esc(el.content)}</strong>${hint}</p>`);
        break;
      }
      case "placeholder":
        parts.push(
          `<p style="font-family:Arial,sans-serif;border:1px solid #f59e0b;background:#fffbeb;padding:8px 12px"><strong>⚠ ${esc(el.content)}</strong></p>`,
        );
        break;
      case "table": {
        const { headers, rows } = parseTable(el.content);
        const thCells = headers.map((h) => `<th style="padding:6px 12px;border:1px solid #d1d5db;background:#f9fafb;font-weight:600;text-align:left;font-family:Arial,sans-serif;font-size:13px">${esc(h)}</th>`).join("");
        const trRows = rows.map((row) => {
          const tds = row.map((cell) => `<td style="padding:6px 12px;border:1px solid #d1d5db;font-family:Arial,sans-serif;font-size:13px">${inlineHtml(cell)}</td>`).join("");
          return `<tr>${tds}</tr>`;
        }).join("");
        parts.push(`<table style="border-collapse:collapse;width:100%;margin:12px 0"><thead><tr>${thCells}</tr></thead><tbody>${trRows}</tbody></table>`);
        break;
      }
      case "source":
        parts.push(`<p style="font-family:Arial,sans-serif;font-size:12px;color:#4b5563">${inlineHtml(el.content)}</p>`);
        break;
      case "related_blog":
        parts.push(
          `<p style="font-family:Arial,sans-serif"><strong>${esc(el.content)}</strong>${el.meta?.description ? `: ${esc(el.meta.description)}` : ""}</p>`,
        );
        break;
      case "faq_q":
        parts.push(`<h3 style="font-family:Arial,sans-serif">${esc(el.content)}</h3>`);
        break;
      case "faq_a":
        parts.push(`<p style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</p>`);
        break;
      default:
        if (el.content) parts.push(`<p style="font-family:Arial,sans-serif">${inlineHtml(el.content)}</p>`);
    }
    i++;
  }

  return `<html><body>${parts.join("\n")}</body></html>`;
}

function elementsToPlainText(elements: TextElement[]): string {
  const lines: string[] = [];

  const metaTitle = elements.find((e) => e.type === "meta_title");
  const metaDesc = elements.find((e) => e.type === "meta_desc");
  if (metaTitle || metaDesc) {
    lines.push("SEO METADATA");
    if (metaTitle) lines.push(`Meta title (${metaTitle.content.length}/65): ${metaTitle.content}`);
    if (metaDesc) lines.push(`Meta description (${metaDesc.content.length}/155): ${metaDesc.content}`);
    lines.push("", "---", "");
  }

  for (const el of elements) {
    if (el.type === "meta_title" || el.type === "meta_desc" || el.type === "label") continue;
    const text = stripBold(el.content);

    switch (el.type) {
      case "h1": case "h2": case "h3":
        lines.push(text, "");
        break;
      case "p": case "faq_a":
        lines.push(text, "");
        break;
      case "li":
        lines.push(`• ${text}`);
        break;
      case "usp":
        lines.push(text);
        if (el.meta?.description) lines.push(el.meta.description);
        lines.push("");
        break;
      case "cta":
        lines.push(`→ ${text}${el.meta?.hint ? ` (${el.meta.hint})` : ""}`, "");
        break;
      case "placeholder":
        lines.push(`[${text}]`, "");
        break;
      case "table": {
        const { headers, rows } = parseTable(el.content);
        lines.push(headers.join(" | "));
        lines.push(headers.map(() => "---").join(" | "));
        rows.forEach((row) => lines.push(row.join(" | ")));
        lines.push("");
        break;
      }
      case "source":
        lines.push(`• ${text}`, "");
        break;
      case "related_blog":
        lines.push(`${text}${el.meta?.description ? `: ${el.meta.description}` : ""}`, "");
        break;
      case "faq_q":
        lines.push(text);
        break;
      default:
        if (text) lines.push(text, "");
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

interface TextPanelProps {
  elements: TextElement[];
  activeElementId: string | null;
  onElementHover: (elementId: string | null) => void;
}

function isHighlighted(elementId: string, activeId: string | null) {
  return activeId !== null && elementId === activeId;
}

function hoverCls(elementId: string, activeId: string | null) {
  return isHighlighted(elementId, activeId)
    ? "bg-yellow-100 ring-1 ring-yellow-300"
    : "hover:bg-gray-50";
}

function bold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// ── Individual renderers ──────────────────────────────────────────────────────

function MetaBlock({ elements, activeId, onHover }: { elements: TextElement[]; activeId: string | null; onHover: (id: string | null) => void }) {
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
          <div onMouseEnter={() => onHover(titleEl.id)} onMouseLeave={() => onHover(null)}
            className={`px-4 py-3 cursor-default transition-all ${hoverCls(titleEl.id, activeId)}`}>
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
          <div onMouseEnter={() => onHover(descEl.id)} onMouseLeave={() => onHover(null)}
            className={`px-4 py-3 cursor-default transition-all ${hoverCls(descEl.id, activeId)}`}>
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

function CmsLabel({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
      className={`inline-flex items-center gap-1.5 mb-2 cursor-default transition-all rounded px-1 -mx-1 ${hoverCls(el.id, activeId)}`}>
      <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{el.content}</span>
      <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-medium">CMS label</span>
    </div>
  );
}

function USPBlock({ items, activeId, onHover }: { items: TextElement[]; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3">
      {items.map((el) => (
        <div key={el.id} onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
          className={`rounded-xl border border-gray-200 p-4 cursor-default transition-all ${hoverCls(el.id, activeId)}`}>
          <h3 className="text-sm font-bold text-gray-900 mb-1">{el.content}</h3>
          {el.meta?.description && <p className="text-xs text-gray-500 leading-relaxed">{el.meta.description}</p>}
        </div>
      ))}
    </div>
  );
}

function CTAButton({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
      className={`my-3 flex items-center gap-3 cursor-default transition-all rounded-lg px-1 -mx-1 ${hoverCls(el.id, activeId)}`}>
      <span className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg">
        {el.content}
      </span>
      {el.meta?.hint && <span className="text-xs text-gray-400 italic">{el.meta.hint}</span>}
    </div>
  );
}

function PlaceholderBlock({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
      className={`my-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-5 py-4 cursor-default transition-all ${isHighlighted(el.id, activeId) ? "ring-1 ring-yellow-300" : ""}`}>
      <div className="flex items-start gap-2.5">
        <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">{el.content}</p>
      </div>
    </div>
  );
}

function parseTable(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const [headerLine, ...rowLines] = lines;
  const headers = (headerLine ?? "").split("|").map((h) => h.trim());
  const rows = rowLines.map((line) => line.split("|").map((cell) => cell.trim()));
  return { headers, rows };
}

function DataTable({ el, activeId, onHover }: { el: TextElement; activeId: string | null; onHover: (id: string | null) => void }) {
  const { headers, rows } = parseTable(el.content);
  return (
    <div onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
      className={`my-5 overflow-x-auto rounded-xl border border-gray-200 cursor-default transition-all ${isHighlighted(el.id, activeId) ? "ring-1 ring-yellow-300 bg-yellow-50" : ""}`}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineHtml(cell) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourcesSection({ items, activeId, onHover }: { items: TextElement[]; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div className="my-8 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sources and further reading</span>
      </div>
      <ol className="divide-y divide-gray-100">
        {items.map((el, idx) => (
          <li key={el.id} onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
            className={`flex gap-3 px-4 py-3 cursor-default transition-all ${hoverCls(el.id, activeId)}`}>
            <span className="text-xs font-bold text-gray-400 tabular-nums mt-0.5 shrink-0">{idx + 1}.</span>
            <p className="text-xs text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineHtml(el.content) }} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function RelatedBlogsSection({ items, activeId, onHover }: { items: TextElement[]; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div className="my-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Related blogs</p>
      <div className="space-y-2">
        {items.map((el) => (
          <div key={el.id} onMouseEnter={() => onHover(el.id)} onMouseLeave={() => onHover(null)}
            className={`rounded-xl border border-gray-200 p-4 cursor-default transition-all ${hoverCls(el.id, activeId)}`}>
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

function FAQSection({ pairs, activeId, onHover }: { pairs: Array<{ q: TextElement; a: TextElement }>; activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-1 border-b border-gray-200">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {pairs.map(({ q, a }, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden">
            <div onMouseEnter={() => onHover(q.id)} onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-gray-50 cursor-default transition-all ${hoverCls(q.id, activeId)}`}>
              <p className="text-sm font-semibold text-gray-800">{q.content}</p>
            </div>
            <div onMouseEnter={() => onHover(a.id)} onMouseLeave={() => onHover(null)}
              className={`px-4 py-3 bg-white cursor-default transition-all ${hoverCls(a.id, activeId)}`}>
              <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: bold(a.content) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TextPanel({ elements, activeElementId, onElementHover }: TextPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const html = elementsToHtml(elements);
    const plain = elementsToPlainText(elements);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
    } catch {
      // Fallback for browsers that don't support ClipboardItem
      await navigator.clipboard.writeText(plain);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
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
  const sourceItems = elements.filter((e) => e.type === "source");
  const faqPairs = faq_qs.map((q, i) => ({ q, a: faq_as[i] })).filter((p) => p.a);

  // Group li into ul
  type Grouped =
    | TextElement
    | { type: "ul"; items: TextElement[] }
    | { type: "_usp_block"; items: TextElement[] }
    | { type: "_faq_block"; pairs: Array<{ q: TextElement; a: TextElement }> }
    | { type: "_blogs_block"; items: TextElement[] }
    | { type: "_sources_block"; items: TextElement[] };

  const grouped: Grouped[] = [];
  let currentList: TextElement[] | null = null;
  let uspAdded = false, faqAdded = false, blogsAdded = false, sourcesAdded = false;

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
    if (el.type === "source") {
      currentList = null;
      if (!sourcesAdded) { grouped.push({ type: "_sources_block", items: sourceItems }); sourcesAdded = true; }
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
        <button onClick={handleCopy}
          className={`text-xs flex items-center gap-1.5 transition-colors ${copied ? "text-green-600" : "text-gray-400 hover:text-gray-600"}`}>
          {copied ? (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy article</>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <MetaBlock elements={metaElements} activeId={activeElementId} onHover={onElementHover} />
          {grouped.map((item, idx) => {
            // Grouped blocks
            if ("type" in item && item.type === "_usp_block")
              return <USPBlock key={idx} items={item.items} activeId={activeElementId} onHover={onElementHover} />;
            if ("type" in item && item.type === "_faq_block")
              return <FAQSection key={idx} pairs={item.pairs} activeId={activeElementId} onHover={onElementHover} />;
            if ("type" in item && item.type === "_blogs_block")
              return <RelatedBlogsSection key={idx} items={item.items} activeId={activeElementId} onHover={onElementHover} />;
            if ("type" in item && item.type === "_sources_block")
              return <SourcesSection key={idx} items={item.items} activeId={activeElementId} onHover={onElementHover} />;

            // Li list
            if ("type" in item && item.type === "ul") {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1 my-3 ml-2">
                  {item.items.map((li) => (
                    <li key={li.id} onMouseEnter={() => onElementHover(li.id)} onMouseLeave={() => onElementHover(null)}
                      className={`text-sm text-gray-700 leading-relaxed rounded px-1 cursor-default transition-all ${hoverCls(li.id, activeElementId)}`}
                      dangerouslySetInnerHTML={{ __html: bold(li.content) }} />
                  ))}
                </ul>
              );
            }

            // Individual elements
            const el = item as TextElement;

            if (el.type === "label")
              return <CmsLabel key={el.id} el={el} activeId={activeElementId} onHover={onElementHover} />;
            if (el.type === "cta")
              return <CTAButton key={el.id} el={el} activeId={activeElementId} onHover={onElementHover} />;
            if (el.type === "placeholder")
              return <PlaceholderBlock key={el.id} el={el} activeId={activeElementId} onHover={onElementHover} />;
            if (el.type === "table")
              return <DataTable key={el.id} el={el} activeId={activeElementId} onHover={onElementHover} />;

            if (el.type === "h1" || el.type === "h2" || el.type === "h3") {
              const Tag = el.type as "h1" | "h2" | "h3";
              const cls = { h1: "text-2xl font-bold text-gray-900 mt-4 mb-2", h2: "text-xl font-semibold text-gray-800 mt-8 mb-2 pb-1 border-b border-gray-200", h3: "text-base font-semibold text-gray-700 mt-5 mb-1.5" }[el.type];
              return (
                <Tag key={el.id} onMouseEnter={() => onElementHover(el.id)} onMouseLeave={() => onElementHover(null)}
                  className={`${cls} rounded px-1 -mx-1 cursor-default transition-all ${hoverCls(el.id, activeElementId)}`}
                  dangerouslySetInnerHTML={{ __html: bold(el.content) }} />
              );
            }

            // p / default
            return (
              <p key={el.id} onMouseEnter={() => onElementHover(el.id)} onMouseLeave={() => onElementHover(null)}
                className={`text-sm text-gray-700 leading-relaxed my-3 rounded px-1 -mx-1 cursor-default transition-all ${hoverCls(el.id, activeElementId)}`}
                dangerouslySetInnerHTML={{ __html: bold(el.content) }} />
            );
          })}
        </div>
      </div>
    </main>
  );
}
