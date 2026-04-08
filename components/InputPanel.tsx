"use client";

import { useState } from "react";
import type { GenerateInput } from "@/lib/types";

interface InputPanelProps {
  onGenerate: (input: GenerateInput) => void;
  isLoading: boolean;
}

export default function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [form, setForm] = useState<GenerateInput>({
    topic: "",
    mainKeyword: "",
    subKeywords: "",
    instructions: "",
    questions: "",
  });

  function handleChange(field: keyof GenerateInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.topic || !form.mainKeyword) return;
    onGenerate(form);
  }

  return (
    <aside className="w-80 min-w-[280px] max-w-sm bg-gray-900 border-r border-gray-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Input</h2>
        </div>
        <p className="text-xs text-gray-400">Vul de gegevens in voor je tekst</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Onderwerp */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Onderwerp <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
            placeholder="Bijv. Melkrobots voor de moderne veehouder"
            rows={3}
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>

        {/* Hoofdzoekwoord */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Hoofdzoekwoord <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.mainKeyword}
            onChange={(e) => handleChange("mainKeyword", e.target.value)}
            placeholder="Bijv. melkrobot kopen"
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Subzoekwoorden */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Subzoekwoorden</label>
          <textarea
            value={form.subKeywords}
            onChange={(e) => handleChange("subKeywords", e.target.value)}
            placeholder="Bijv. automatisch melken, melkmachine prijs, voordelen melkrobot"
            rows={3}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
          <p className="mt-1 text-xs text-gray-500">Scheid zoekwoorden met komma's</p>
        </div>

        {/* Te beantwoorden vragen */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Te beantwoorden vragen</label>
          <textarea
            value={form.questions}
            onChange={(e) => handleChange("questions", e.target.value)}
            placeholder="Bijv. Wat kost een melkrobot? Hoeveel koeien kan een robot melken?"
            rows={4}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>

        {/* Extra instructies */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Extra instructies</label>
          <textarea
            value={form.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            placeholder="Bijv. Schrijf in een zakelijke maar toegankelijke toon. Vermeld dat Lely marktleider is."
            rows={4}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-colors"
          />
        </div>
      </form>

      {/* Generate button */}
      <div className="p-5 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !form.topic || !form.mainKeyword}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Tekst genereren...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Genereer tekst
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
