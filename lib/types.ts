export type TextElementType =
  | "h1" | "h2" | "h3"
  | "p" | "li" | "intro"
  | "breadcrumb"
  | "eeat"
  | "keytakeaway"
  | "table"
  | "faq_q" | "faq_a"
  | "source";

export type RationaleType = "seo" | "geo" | "both";

/** Template modules A t/m I zoals gedefinieerd in de development guidelines */
export type TemplateModule = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TextElement {
  id: string;
  type: TextElementType;
  content: string;
  rationaleIds: string[];
  /** Alleen voor type === "table" */
  tableData?: TableData;
  /** Generiek metadata-veld. Voor "eeat": { author, published, updated }. Voor "source": { url } */
  meta?: Record<string, string>;
}

export interface RationaleItem {
  id: string;
  type: RationaleType;
  /** Template-module waartoe dit rationale-punt behoort */
  module: TemplateModule;
  element: string;
  explanation: string;
}

export interface GeneratedContent {
  text: TextElement[];
  rationale: RationaleItem[];
}

export interface KeywordEntry {
  keyword: string;
  volume: number | null;
  isPrimary: boolean;
}

export interface GenerateInput {
  topic: string;
  mainKeyword: string;
  subKeywords: string;
  keywords: KeywordEntry[];
  instructions: string;
  questions: string;
}
