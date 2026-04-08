"use client";

import { useState, useRef } from "react";
import type { GenerateInput, KeywordEntry } from "@/lib/types";

interface InputPanelProps {
  onGenerate: (input: GenerateInput) => void;
  isLoading: boolean;
}

function formatVolume(v: number | null): string {
  if (v === null) return "—";
  return v.toLocaleString("en-GB");
}

function parseExcelPaste(text: string): KeywordEntry[] {
  return text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, i) => {
      const parts = line.split("\t");
      const keyword = parts[0]?.trim() ?? "";
      const rawVolume = parts[1]?.trim().replace(/[^0-9]/g, "") ?? "";
      const volume = rawVolume ? parseInt(rawVolume, 10) : null;
      return { keyword, volume: volume !== null && !isNaN(volume) ? volume : null, isPrimary: i === 0 };
    })
    .filter((e) => e.keyword.length > 0);
}

export default function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState<KeywordEntry[]>([]);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState("");
  const pasteRef = useRef<HTMLTextAreaElement>(null);

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text");
    const parsed = parseExcelPaste(text);
    if (parsed.length > 0) {
      setKeywords(parsed);
      setShowPasteArea(false);
      e.preventDefault();
    }
  }

  function handlePasteAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const parsed = parseExcelPaste(e.target.value);
    if (parsed.length > 0) {
      setKeywords(parsed);
      setShowPasteArea(false);
    }
  }

  function setPrimary(idx: number) {
    setKeywords((prev) => prev.map((k, i) => ({ ...k, isPrimary: i === idx })));
  }

  function removeKeyword(idx: number) {
    setKeywords((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // If removed was primary, make first one primary
      if (prev[idx].isPrimary && next.length > 0) {
        next[0].isPrimary = true;
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const primary = keywords.find((k) => k.isPrimary);
    if (!topic || !primary) return;

    const secondary = keywords.filter((k) => !k.isPrimary);

    onGenerate({
      topic,
      mainKeyword: primary.keyword,
      subKeywords: secondary.map((k) => k.keyword).join(", "),
      keywords,
      instructions,
      questions,
    });
  }

  const primaryKeyword = keywords.find((k) => k.isPrimary);
  const canGenerate = !isLoading && topic.trim() && primaryKeyword !== undefined;

  return (
    <aside className="w-80 min-w-[280px] max-w-sm bg-gray-900 border-r border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Input</h2>
        </div>
        <p className="text-xs text-gray-400">Enter your content details below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Topic */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Topic <span className="text-red-400">*</span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g. Milking robots for the modern dairy farmer"
            rows={3}
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>

        {/* Keywords */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-300">
              Keywords <span className="text-red-400">*</span>
            </label>
            {keywords.length > 0 && (
              <button
                type="button"
                onClick={() => { setKeywords([]); setShowPasteArea(true); setTimeout(() => pasteRef.current?.focus(), 50); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Paste area */}
          {(keywords.length === 0 || showPasteArea) && (
            <div>
              <textarea
                ref={pasteRef}
                placeholder={"Paste from Excel\n(keyword · volume per row)"}
                rows={4}
                onPaste={handlePaste}
                onChange={handlePasteAreaChange}
                className="w-full bg-gray-800 border border-dashed border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">
                Copy two columns from Excel (keyword + volume) and paste here
              </p>
            </div>
          )}

          {/* Parsed keyword list */}
          {keywords.length > 0 && !showPasteArea && (
            <div className="rounded-lg border border-gray-700 overflow-hidden">
              {/* Column headers */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 items-center px-3 py-1.5 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-500 w-4"></span>
                <span className="text-xs font-medium text-gray-400">Keyword</span>
                <span className="text-xs font-medium text-gray-400 text-right">Volume</span>
                <span className="w-4"></span>
              </div>

              <ul className="divide-y divide-gray-700/50 max-h-52 overflow-y-auto">
                {keywords.map((kw, idx) => (
                  <li
                    key={idx}
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-2 items-center px-3 py-2 transition-colors ${
                      kw.isPrimary ? "bg-brand-500/10" : "hover:bg-gray-800/50"
                    }`}
                  >
                    {/* Radio */}
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        borderColor: kw.isPrimary ? "#4f6ef7" : "#4b5563",
                        backgroundColor: kw.isPrimary ? "#4f6ef7" : "transparent",
                      }}
                      title="Set as primary keyword"
                    >
                      {kw.isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                    </button>

                    {/* Keyword */}
                    <span className={`text-xs truncate ${kw.isPrimary ? "text-white font-medium" : "text-gray-300"}`}>
                      {kw.keyword}
                    </span>

                    {/* Volume */}
                    <span className={`text-xs tabular-nums text-right ${kw.isPrimary ? "text-brand-500 font-semibold" : "text-gray-500"}`}>
                      {formatVolume(kw.volume)}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeKeyword(idx)}
                      className="w-4 h-4 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Summary */}
              <div className="px-3 py-2 bg-gray-800/50 border-t border-gray-700 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {keywords.length} keyword{keywords.length !== 1 ? "s" : ""}
                </span>
                {primaryKeyword && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-brand-500 font-medium truncate">
                      Primary: {primaryKeyword.keyword}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Questions to answer */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Questions to answer</label>
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="E.g. What does a milking robot cost? How many cows can a robot milk?"
            rows={4}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>

        {/* Additional instructions */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Additional instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. Write in a professional but accessible tone. Mention that Lely is market leader."
            rows={4}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>
      </form>

      {/* Generate button */}
      <div className="p-5 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={!canGenerate}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating text...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate text
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
