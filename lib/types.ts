export type TextElementType = "h1" | "h2" | "h3" | "p" | "li" | "intro";

export type RationaleType = "seo" | "geo" | "both";

export interface TextElement {
  id: string;
  type: TextElementType;
  content: string;
  rationaleIds: string[];
}

export interface RationaleItem {
  id: string;
  type: RationaleType;
  element: string;
  explanation: string;
}

export interface GeneratedContent {
  text: TextElement[];
  rationale: RationaleItem[];
}

export interface GenerateInput {
  topic: string;
  mainKeyword: string;
  subKeywords: string;
  instructions: string;
  questions: string;
}
