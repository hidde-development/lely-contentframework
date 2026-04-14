export type TextElementType =
  | "h1" | "h2" | "h3"
  | "p" | "li"
  | "meta_title"    // SEO meta title, max 65 characters
  | "meta_desc"     // SEO meta description, max 155 characters
  | "label"         // CMS section label — suggested by Claude, confirmed by user in CMS
  | "usp"           // USP item: content = H3 heading (1–2 words), meta.description = 1 supporting sentence
  | "cta"           // CTA button suggestion: content = button label, meta.hint = destination hint
  | "placeholder"   // Content Claude cannot generate (testimonials, specific links) — user fills in
  | "related_blog"  // Blog suggestion: content = proposed title, meta.description = one-line summary
  | "faq_q" | "faq_a"
  | "table"         // Data/comparison table. content = pipe-separated rows: first line = headers, rest = data rows
  | "source";       // Cited source for E-E-A-T / GEO authority. content = full citation string

/** Lely page template blocks */
export type TemplateModule =
  | "META"
  | "HERO"
  | "INTRO"
  | "TAKEAWAYS"
  | "USP"
  | "BODY"
  | "TESTIMONIAL"
  | "CTA"
  | "FAQ"
  | "SOURCES"
  | "BLOGS"
  | "PRODUCTS";

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TextElement {
  id: string;
  type: TextElementType;
  content: string;
  /** For "usp": meta.description = supporting sentence.
   *  For "cta": meta.hint = destination hint.
   *  For "related_blog": meta.description = one-line summary. */
  meta?: Record<string, string>;
}

// ── Quality report (replaces rationale) ───────────────────────────────────────

export type QualityCategory = "seo" | "geo" | "brand" | "strategy";

export interface ActionItem {
  id: string;
  category: QualityCategory;
  /** high = blocks quality, medium = reduces effectiveness, low = minor improvement */
  severity: "high" | "medium" | "low";
  /** Criterion code, e.g. "G1", "B2" */
  criterion: string;
  /** ID of the most relevant text element, if applicable */
  elementId?: string;
  /** What is wrong or missing */
  issue: string;
  /** Specific instruction for the human editor to fix it */
  fix: string;
  /** True when this issue remains after the automated regeneration pass — requires manual editing */
  humanOnly?: boolean;
}

export interface QualityReport {
  scores: Record<QualityCategory, number>; // 0–100
  actions: ActionItem[];
  /** True after a regeneration pass has been run */
  regenerated?: boolean;
  /** Number of issues resolved by the regeneration pass */
  resolvedCount?: number;
}

export interface GeneratedContent {
  text: TextElement[];
  quality: QualityReport;
}

export interface KeywordEntry {
  keyword: string;
  volume: number | null;
  isPrimary: boolean;
}

export interface ProductUsp {
  title: string;
  description: string;
}

export interface ProductEntry {
  name: string;
  description: string;
  usps?: ProductUsp[];
}

export interface GenerateInput {
  topic: string;
  mainKeyword: string;
  subKeywords: string;
  keywords: KeywordEntry[];
  products: ProductEntry[];
  instructions: string;
  questions: string;
}

export interface RegenerateInput {
  input: GenerateInput;
  text: TextElement[];
  quality: QualityReport;
}
