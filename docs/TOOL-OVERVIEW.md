# Lely GEO Content Generator — Tool Overview

## What this tool is

A web application that generates, audits, and improves production-ready CMS page content for Lely — a global dairy farming company. The tool is built specifically to produce content that performs well in both traditional search (Google) and AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews, Microsoft Copilot).

This discipline — writing for AI retrieval and citation — is called **Generative Engine Optimisation (GEO)**. The tool encodes GEO and SEO best practices directly into the generation process so every output meets a defined quality standard before a human editor touches it.

---

## What the tool does

1. **Generates** a full CMS page (13 structured blocks) from a brief: topic, keywords, products, additional instructions
2. **Audits** the output with a separate critic model that scores the content across four categories and lists specific, actionable issues
3. **Regenerates** automatically — surgically fixing only the flagged elements, then re-auditing to measure improvement
4. **Displays** the result in a live preview with hover-linked quality issues, so editors know exactly which element to fix

---

## Architecture: three API calls per generation

```
User input
    │
    ├─► Call 1: Generate blocks 0–7  (SYSTEM_PROMPT)  ─┐
    ├─► Call 2: Generate blocks 8–13 (SYSTEM_PROMPT)  ─┼─► Merge → full article
    │                                                   ┘
    └─► Call 3: Quality audit        (CRITIC_SYSTEM_PROMPT) → QualityReport
```

On regeneration:
```
QualityReport (actions with elementIds)
    │
    ├─► Surgical fix call  → only flagged elements are rewritten / new elements inserted
    └─► New critic call    → re-audits improved content, filtered to original criteria only
```

---

## Layer 1: SEO Rules

These rules ensure the page ranks in traditional search engines.

| Rule | Detail |
|------|--------|
| Primary keyword in H1 | Verbatim, not paraphrased |
| Primary keyword in meta_title | Near the start, max 65 characters |
| Primary keyword in first body paragraph | Verbatim |
| Secondary keywords in H2/H3 headings | At least 2, placed naturally |
| Heading hierarchy | H1 → H2 → H3, no levels skipped |
| Meta description | Max 155 characters, clear value proposition |

Critic criteria: S1, S2, S3, S4

---

## Layer 2: GEO Rules

These rules ensure the page is cited and quoted by AI search engines.

### Direct answer structure (Bottom Line Up Front)
- At least 4 H2 headings must be phrased as direct user questions (e.g. "What causes mastitis in dairy cows?")
- The first sentence under any question H2 must answer the question directly — no preamble, no context-setting
- Every factual sentence must be self-contained: an AI must be able to quote it without surrounding context

### Self-contained sentences
- Never use pronouns ("this", "it", "the system", "the device") without naming the subject in the same sentence
- Wrong: "This device ensures a higher yield."
- Correct: "The Lely Astronaut A5 Next ensures a higher yield per cow."

### Semantic Triple structure
- Factual sentences follow Subject → Verb → Object
- This is how AI models store and retrieve facts internally
- Example: "The Lely Grazeway (subject) manages (verb) individual cow access to pasture (object)."

### Entity density over keyword density
- Do not repeat the exact keyword mechanically
- Instead, use the full ecosystem of related concepts, product names, and domain terminology
- This demonstrates expertise to AI models

### Information gain
- Every body section must contain at least one piece of information not available in a generic search result
- Use specific Lely product capabilities, cited research findings, or precise technical specifications

### Machine-readable formatting
- Use bullet lists for features, symptoms, criteria, risk factors
- Use tables for comparisons, cost breakdowns, specifications — mandatory in Block 4
- Every table must include a final "Source:" row

### Inline source attribution
- Every statistic or percentage must be attributed at the point of use, not just in the sources block
- The sources block is the bibliography; inline attributions are the in-text references

### Descriptive link anchor text
- Every CTA and internal link must describe exactly what the destination page contains
- Forbidden: "click here", "read more", "find out more"
- Required: "Read how the Lely Astronaut A5 Next detects early mastitis at every milking"

Critic criteria: G1, G2, G3, G4, G5, G6, G7, G8, G9, G10

---

## Layer 3: Brand Rules

These rules enforce Lely's tone of voice and editorial standards.

### Tone of Voice — four pillars (all mandatory)
Every paragraph must embody at least one:

1. **Bright** — plain language, one idea, no filler. Cut every word that adds no meaning.
2. **Optimistic** — lead with the opportunity, not the threat. Show what becomes possible.
3. **Creative** — open with a counterintuitive fact, striking number, or reframe that earns attention.
4. **Supportive** — the farmer is the expert. Lely is the partner. Write for the farmer's reality, not Lely's catalogue.

### Grammar and style (zero tolerance)
- Sentence case only — no title case in headings
- No em dashes (— or –)
- No double hyphens (--)
- British English throughout (optimise, colour, behaviour, recognise)
- Max 3 sentences and 60 words per paragraph
- No filler openers ("In this article", "As a farmer", "It is important to note")

### Copywriting
- Headings max 8 words, phrased to earn the reader's attention
- No hollow marketing language without evidence: "revolutionary", "groundbreaking", "cutting-edge", "game-changing" are forbidden without a supporting fact
- Every factual claim needs a number, named source, or named Lely product capability

Critic criteria: B1, B2, B3, B4, B5

---

## Layer 4: Brand Strategy Rules

These rules ensure the content serves Lely's commercial and positioning goals.

### Message House — four communication pillars
Every page must anchor to one or more:
1. **Futureproof innovation with real impact** — 75+ years of innovation, 9% R&D investment, Yellow Revolutions
2. **Animal welfare** — healthy cows perform better, free cow traffic, early detection through monitoring
3. **Farmer prosperity** — save time, reduce labour, improve margins, data-driven via Lely Horizon
4. **Our environment** — energy efficiency, circular nutrient management (Lely Sphere), emission reduction

### Guiding Principles — five content strategy rules
1. **From keywords to journeys** — lead the farmer from a broad challenge to a specific Lely solution
2. **Farmer-First Empathy** — frame every problem as the farmer experiences it at the kitchen table
3. **Management over treatment** — position Lely as a prevention and monitoring partner, not a cure
4. **Always a commercial link** — every topic connects to the farmer's wallet
5. **Futureproof and AI ready** — answer the farmer's questions definitively with clear structure

### Page-level requirements
- Benefits triad: at least one explicit connection to cost savings, time savings, or quality of life
- Scannable for campaign visitors: a first-time reader must understand the page's value within 10 seconds

Critic criteria: T1, T2, T3, T4, T5, T6

---

## The 13-Block Page Template

The template follows a deliberate content funnel:
**Awareness → problem education → financial impact → Lely prevention approach → USP proof → social proof → conversion**

| Block | Name | Key elements |
|-------|------|-------------|
| 0 | SEO Metadata | meta_title (max 65 chars), meta_desc (max 155 chars) |
| 1 | Hero | label, h1 (farmer's problem, max 8 words) |
| 2 | Key Takeaways | label, h2, exactly 3 li — each with a metric, no product names |
| 3 | Introduction | label, h2 as farmer's question, p (max 4 sentences) |
| 3B | Keyword Definition | h2 "What defines modern [keyword]?", p — authoritative definition, no stats, no products |
| 4 | Problem Definition | label, h2 as question, 1–2 p, table (mandatory), cta |
| 5 | Farmer Impact | label, h2 as cost question, 1–2 p with financial figure, optional table, cta |
| 6 | Prevention & Lely Approach | label, h2, per product: h3 + p (4 sentences: what/how/data/benefit), cta |
| 7 | USP List | label, h2, exactly 4 usp (1–2 word heading + 1 sentence with figure) |
| 8 | Testimonials | placeholder |
| 9 | FAQ | exactly 7 faq_q + faq_a pairs (practical / labour / ROI / herd / integration / regulatory / data) |
| 11 | Sources | label, h2, 3–5 source elements from trusted list only |
| 11B | Source Verification Warning | placeholder — editor must verify all sources |
| 12 | Related Blogs | placeholder (3 cards) |
| 13 | Related Products | placeholder |

---

## The Quality Critic

A separate Claude call audits the generated content against 23 named criteria and returns a structured `QualityReport`.

### Scoring
Each failing criterion is weighted: high = 3 pts, medium = 2 pts, low = 1 pt. Score mapped per category:

| Weighted points | Score |
|----------------|-------|
| 0 | 100 |
| 1 | 95 |
| 2 | 88 |
| 3 | 80 |
| 4 | 72 |
| 5 | 64 |
| 6 | 55 |
| 7 | 46 |
| 8 | 38 |
| 9 | 30 |
| 10 | 22 |
| 11 | 15 |
| 12+ | 8 |

### Action items
Each action includes:
- `category`: seo / geo / brand / strategy
- `severity`: high / medium / low
- `criterion`: e.g. "G2"
- `elementId`: the specific JSON element to fix
- `issue`: plain-language description of the problem
- `fix`: specific, actionable instruction for the editor

---

## The Regeneration System

1. Collect all actions with an `elementId` (or infer element IDs from criterion code via fallback mapping)
2. Send only the flagged elements to a surgical fix call — all other elements are untouched
3. The fix LLM can modify existing elements AND insert new elements via `insertAfter`
4. Run a new critic on the improved content
5. Filter new critic actions to only criteria that existed in the original report (prevents new issues appearing)
6. Apply `Math.max` per category — scores can only stay equal or improve

---

## Trusted Source List

Only these sources may be cited:
- Wageningen University & Research (WUR)
- International Dairy Federation (IDF)
- Food and Agriculture Organization (FAO)
- DairyCo / AHDB Dairy (UK)
- Teagasc (Ireland)
- Dutch Government / RVO.nl
- Lely (own whitepapers, product datasheets, trial reports)
- University of Wisconsin–Madison, Cornell University, or Wageningen-affiliated groups

---

## Lely Product Reference

| Category | Products |
|----------|---------|
| Automatic milking | Lely Astronaut A5 Next, Lely Astronaut Max, Lely Dairy XL, Lely Meteor, Lely Meteor Hoof Bath, Lely Grazeway, Lely Cooling Tank |
| Feeding | Lely Vector, Lely Juno, Lely Juno Max, Lely Calm, Lely Cosmix |
| Manure | Lely Discovery Collector, Lely Discovery Scraper, Lely Sphere |
| Latest innovations | Lely Exos, Lely Orbiter, Lely Zeta |
| Software | Lely Horizon |
| Sensors & monitoring | Lely Tags |
| Cow welfare | Lely Luna |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| AI model | claude-sonnet-4-6 (Anthropic) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Key files | `lib/prompts.ts` — all prompts and helpers |
| | `app/api/generate/route.ts` — generation endpoint |
| | `app/api/regenerate/route.ts` — regeneration endpoint |
| | `components/TextPanel.tsx` — article preview |
| | `components/RationalePanel.tsx` — quality audit panel |
| | `components/InputPanel.tsx` — input form (localStorage persisted) |
| | `lib/types.ts` — shared TypeScript types |

---

## Cost per article

Based on claude-sonnet-4-6 pricing ($3/MTok input, $15/MTok output):

| Phase | Input tokens | Output tokens | Cost |
|-------|-------------|--------------|------|
| Generation (3 calls) | ~20,300 | ~7,500 | ~$0.17 |
| Regeneration (2 calls, optional) | ~16,000 | ~3,500 | ~$0.07 |
| **Full cycle** | | | **~$0.24** |
