# White Label Configuration Guide

## What this document is for

This guide explains how to adapt the GEO Content Generator for a new client. It lists every element that is Lely-specific, what needs to change, and what can stay the same. It is written for developers and AI assistants working on a new implementation.

The tool has two distinct layers:
- **The engine** — generic GEO/SEO rules, template logic, quality critic, regeneration system. Reusable for any client.
- **The configuration** — brand, products, tone of voice, strategy, audience, terminology. Replaced per client.

---

## What stays the same (the engine)

These components are content-agnostic and do not need to change:

| Component | Why it's universal |
|-----------|-------------------|
| GEO rules | AI search engine behaviour is the same regardless of industry |
| SEO rules | Keyword placement, heading hierarchy, meta tags |
| 13-block template structure | The awareness → problem → solution → proof → conversion funnel works for any B2B content |
| Quality critic system | The scoring rubric and 23 criteria cover universal content quality |
| Regeneration system | Surgical fix + re-audit logic is model-agnostic |
| Semantic Triple rule | Subject → Verb → Object is a universal writing pattern for AI retrieval |
| Self-contained sentence rule | Applies to all AI-optimised content |
| Paragraph length rule | Max 3 sentences / 60 words is a universal readability standard |

---

## What changes per client

### 1. Brand name and identity

**Currently:** "Lely" appears throughout the system prompt as the company name.

**Change:** Replace all instances of "Lely" with the client's brand name. Pay attention to:
- The opening sentence of `SYSTEM_PROMPT` ("You are a Senior Content Strategist writing production-ready page content for Lely")
- The "Benefits triad" description
- All examples in the tone of voice section that use "Lely" product names
- The product reference list

---

### 2. Tone of Voice pillars

**Currently:** Four Lely-specific pillars: Bright, Optimistic, Creative, Supportive — each with examples.

**What to provide per client:**
- 3–5 named tone of voice pillars
- A one-sentence definition of each pillar
- One "wrong" and one "correct" example sentence per pillar
- Any absolute prohibitions (e.g. "never use passive voice", "never open with a question")

**Where to update:** `SYSTEM_PROMPT` → section `### Tone of Voice — four non-negotiable pillars`

---

### 3. Grammar and style rules

**Currently:** British English, sentence case, no em dashes.

**What to provide per client:**
- Language variant (British English / American English / Dutch / German / etc.)
- Capitalisation conventions for headings
- Any punctuation rules specific to the brand
- Forbidden words or phrases

**Where to update:** `SYSTEM_PROMPT` → section `### Grammar and style — zero tolerance`

---

### 4. Brand strategy and Message House

**Currently:** Four Lely communication pillars (Futureproof innovation, Animal welfare, Farmer prosperity, Environment) and five Guiding Principles.

**What to provide per client:**
- 3–5 core communication pillars with a one-paragraph description each
- 3–5 content strategy principles (e.g. how to frame the customer, what role the brand plays, commercial links to make)
- The "benefits triad" for this client: what are the three outcomes the brand drives? (e.g. cost savings / time savings / quality of life for Lely; could be speed / reliability / ROI for another brand)

**Where to update:** `SYSTEM_PROMPT` → section `## MANDATORY BRAND STRATEGY`

---

### 5. Target audience

**Currently:** Dairy farmers — described at the kitchen table, with specific knowledge of herd management, margins, and labour pressure.

**What to provide per client:**
- Who is the target reader? (job title, sector, level of expertise)
- What are their primary concerns? (operational, financial, regulatory)
- How do they describe their problems? (use their own vocabulary)
- What do they distrust? (e.g. "farmers distrust claims not backed by peer data")

**Where to update:** `SYSTEM_PROMPT` → section `### Guiding Principles` and any farmer-specific examples throughout.

---

### 6. Product catalogue

**Currently:** ~20 Lely products across 7 categories, each with its full entity name.

**What to provide per client:**
- Full product names (never abbreviate or genericise)
- Product categories
- For each product: its primary function and 1–2 key metrics or capabilities
- USP data per product (used in Block 7 and Block 6)

**Where to update:** `SYSTEM_PROMPT` → section `## LELY PRODUCT REFERENCE`

Also update: `components/InputPanel.tsx` → the product selector lists products for the user to pick from.

---

### 7. Domain terminology

**Currently:** Dairy farming terms — somatic cell count (SCC), total mixed ration (TMR), rumen health, free cow traffic, milking interval, dry-off period, transition cow, etc.

**What to provide per client:**
- 15–30 domain-specific terms that must be used correctly
- Abbreviations and how to introduce them (spell out on first use)
- Any terms that are commonly misused and should be avoided

**Where to update:** `SYSTEM_PROMPT` → section `### Entity and product naming (LLM knowledge seeding)`

---

### 8. Trusted source list

**Currently:** Eight trusted institutions for the dairy farming sector (WUR, IDF, FAO, AHDB, Teagasc, RVO.nl, Lely, academic groups).

**What to provide per client:**
- Trusted academic or industry institutions for this sector
- Any proprietary research or whitepapers the client has published
- Institutions or publications to explicitly avoid citing

**Where to update:** `SYSTEM_PROMPT` → section `TRUSTED SOURCE LIST` (inside Block 11 instructions)

---

### 9. Page template — block contents

The 13-block structure can stay as-is for most B2B content clients. However, some blocks may need adjustment:

| Block | Lely-specific element | What to review |
|-------|----------------------|---------------|
| Block 2 — Key Takeaways | "No product names" rule | Keep this rule; adjust if client wants product mentions in takeaways |
| Block 3B — Keyword Definition | "No product names" rule | Keep |
| Block 4 — Problem Definition | Table is mandatory | Adjust if the client's content rarely has comparable structured data |
| Block 6 — Lely Approach | h3 per product + 4-sentence p structure | Keep; replace "Lely" with client brand |
| Block 7 — USP List | Exactly 4 USPs | Adjust count if client brand has more or fewer pillars |
| Block 9 — FAQ | 7 specific question types | Adjust types to match this client's customer journey |
| Block 11 — Sources | Trusted source list | Replace with client-appropriate sources |

---

### 10. E-E-A-T configuration (author + date)

**Currently:** A brief note in the system prompt to configure author and publication date in the CMS.

**For white label:** This should be expanded into a proper placeholder in Block 3 (Introduction) that reminds the editor to add:
- Author name and credentials
- Publication date
- Last updated date

---

## What a new client implementation requires — checklist

Before generating content for a new client, the following must be defined and written into `lib/prompts.ts`:

### Brand identity
- [ ] Company name and brief description (1 sentence)
- [ ] Tone of voice pillars (3–5) with definitions and examples
- [ ] Grammar/style rules (language, capitalisation, forbidden punctuation)
- [ ] Forbidden words and phrases

### Strategy
- [ ] Communication pillars / Message House (3–5)
- [ ] Content strategy principles (3–5)
- [ ] Benefits triad (the three outcomes this brand drives)

### Audience
- [ ] Target reader profile (role, sector, expertise level)
- [ ] Primary concerns and vocabulary
- [ ] What the audience distrusts

### Products
- [ ] Full product catalogue with entity names and categories
- [ ] Key metric or capability per product
- [ ] USP data per product

### Domain
- [ ] 15–30 domain terms with correct usage
- [ ] Abbreviations list
- [ ] Trusted source list (5–10 institutions)

---

## How to implement a new client in the codebase

1. **Copy `lib/prompts.ts`** — this file contains both `SYSTEM_PROMPT` and `CRITIC_SYSTEM_PROMPT`. Replace all Lely-specific content as described above. The GEO/SEO/writing rules in `SYSTEM_PROMPT` and all 23 critic criteria in `CRITIC_SYSTEM_PROMPT` stay unchanged.

2. **Update `components/InputPanel.tsx`** — the product selector is currently hardcoded with Lely products. Replace the product list with the client's catalogue.

3. **Update branding in the UI** — the app currently has no Lely logo or hard-coded colours, so UI changes are minimal. Update page title and any brand references in the interface if needed.

4. **Keep all API routes unchanged** — `app/api/generate/route.ts` and `app/api/regenerate/route.ts` are entirely content-agnostic.

5. **Keep all types unchanged** — `lib/types.ts` defines the data structures and is client-independent.

---

## What the white label version does NOT include (by design)

- **Image generation** — the tool generates text only. Image captions appear as placeholders.
- **CMS integration** — content is generated and displayed in the preview; export to any CMS is a separate integration step.
- **Automated publishing** — the tool produces a draft for human review, not a publish-ready output.
- **Multi-language generation** — the tool generates in one language per run. Multi-language support requires a separate configuration per language.
- **Real-time source verification** — all cited sources carry an editor verification warning. Automated fact-checking is out of scope.
