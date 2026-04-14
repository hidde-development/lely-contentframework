"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import TextPanel from "@/components/TextPanel";
import QualityPanel from "@/components/RationalePanel";
import ProgressBar from "@/components/ProgressBar";
import type { GenerateInput, GeneratedContent } from "@/lib/types";

export default function Home() {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<GenerateInput | null>(null);

  // Single shared state: which element ID is currently active (from either panel)
  const [activeElementId, setActiveElementId] = useState<string | null>(null);

  async function handleGenerate(input: GenerateInput) {
    setIsLoading(true);
    setError(null);
    setContent(null);
    setActiveElementId(null);
    setLastInput(input);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data: GeneratedContent = await res.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegenerate() {
    if (!content || !lastInput) return;
    setIsRegenerating(true);
    setError(null);
    setActiveElementId(null);

    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: lastInput, text: content.text, quality: content.quality }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Regeneration failed");
      }

      const data: GeneratedContent = await res.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top bar */}
      <header className="shrink-0 h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-brand-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">GEO & SEO Text Generator</span>
        </div>

        {error && (
          <div className="flex-1 mx-4 bg-red-900/40 border border-red-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-red-300">{error}</span>
          </div>
        )}
      </header>

      <ProgressBar isLoading={isLoading || isRegenerating} />

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        <InputPanel onGenerate={handleGenerate} isLoading={isLoading || isRegenerating} />
        <TextPanel
          elements={content?.text ?? []}
          activeElementId={activeElementId}
          onElementHover={setActiveElementId}
        />
        <QualityPanel
          quality={content?.quality ?? null}
          activeElementId={activeElementId}
          onActionHover={setActiveElementId}
          onRegenerate={handleRegenerate}
          isRegenerating={isRegenerating}
        />
      </div>
    </div>
  );
}
