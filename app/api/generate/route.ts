import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { GenerateInput, GeneratedContent, QualityReport } from "@/lib/types";
import { SYSTEM_PROMPT, CRITIC_SYSTEM_PROMPT, parseJSON } from "@/lib/prompts";

// Supports multiple common Vercel env var names for the Anthropic API key
const apiKey =
  process.env.Claude ||
  process.env.ANTHROPIC_API_KEY ||
  process.env.CLAUDE_API_KEY;

const client = new Anthropic({ apiKey });

export async function POST(request: NextRequest) {
  const input: GenerateInput = await request.json();

  // Build keyword context with volumes
  const keywordContext = input.keywords && input.keywords.length > 0
    ? input.keywords.map((k) => {
        const vol = k.volume !== null ? ` (${k.volume.toLocaleString("en-GB")} searches/mo)` : "";
        const tag = k.isPrimary ? " ← PRIMARY" : "";
        return `- ${k.keyword}${vol}${tag}`;
      }).join("\n")
    : `- ${input.mainKeyword} ← PRIMARY${input.subKeywords ? "\n" + input.subKeywords.split(",").map((k) => `- ${k.trim()}`).join("\n") : ""}`;

  const productContext = input.products && input.products.length > 0
    ? input.products.map((p) => {
        const uspLines = p.usps && p.usps.length > 0
          ? "\n" + p.usps.map((u) => `    - **${u.title}**: ${u.description}`).join("\n")
          : "";
        return `- **${p.name}**${p.description ? `: ${p.description}` : ""}${uspLines}`;
      }).join("\n")
    : "No specific products selected — use your knowledge of relevant Lely products from the product reference list.";

  const sharedContext = `Topic: ${input.topic}
Keywords:
${keywordContext}
Products to feature:
${productContext}
Additional instructions: ${input.instructions || "None"}
Questions to answer: ${input.questions || "None"}`;

  try {
    // ── Call 1: blocks 0–7 (META → BODY 3) ───────────────────────────────────
    const prompt1 = `Generate blocks 0–7 of the Lely CMS page template as a JSON object with a "text" array.

${sharedContext}

Generate ONLY these blocks in order:
- Block 0: SEO METADATA (meta_title + meta_desc)
- Block 1: HERO (label + h1 — frame the farmer's problem as the title, not a product or Lely title)
- Block 2: KEY TAKEAWAYS (label "KEY TAKEAWAYS" + h2 + exactly 3 li items — each a single punchy sentence with a specific number or metric, nothing longer)
- Block 3: INTRODUCTION (label + h2 as a question the farmer is asking right now + p max 4 sentences, acknowledge situation → explain page → promise value)
- Block 3B: KEYWORD DEFINITION (h2 "What defines modern [primary keyword]?" using the exact primary keyword + 1–2 p: first sentence = precise standalone definition, second sentence = why it matters to dairy farmers today. No Lely products.)
- Block 4: BODY TEXT SECTION 1 — PROBLEM DEFINITION (label + h2 as question about definition/cause + 1–2 p encyclopedic answer + table REQUIRED comparing causes/risk factors/stages + cta)
- Block 5: BODY TEXT SECTION 2 — FARMER IMPACT (label + h2 as question about cost or operational impact + 1–2 p opening with a specific financial figure + optional table of cost scenarios + cta)
- Block 6: BODY TEXT SECTION 3 — PREVENTION AND LELY APPROACH (label + h2 as question about prevention/management + for EACH featured product: h3 with product name + benefit phrase linking to this topic, then p of exactly 4 sentences: 1. what the product is and its role in this topic, 2. how it addresses the specific problem, 3. specific data point or measurable outcome, 4. concrete farmer benefit in cost/time/welfare + cta)
- Block 7: USP LIST BLOCK (label + h2 as question introducing why farmers choose this Lely solution + exactly 4 usp elements: content = 1–2 word benefit heading, meta.description = specific fact or figure proving the benefit)

Apply ALL mandatory rules from the system prompt. The table in Block 4 is mandatory. Blocks 4–6 must form a logical funnel: problem → cost → prevention.`;

    // ── Call 2: blocks 8–13 (TESTIMONIAL → PRODUCTS) ─────────────────────────
    const prompt2 = `Generate blocks 8–13 of the Lely CMS page template as a JSON object with a "text" array. Use element IDs starting from t50.

${sharedContext}

Generate ONLY these blocks in order:
- Block 8: RELATED TESTIMONIALS (placeholder element)
- Block 9: FAQ (exactly 7 faq_q + faq_a pairs — cover in order: 1. practical/day-to-day, 2. labour saving with hours saved, 3. financial ROI/payback, 4. herd suitability/barn type, 5. integration with existing systems, 6. regulatory compliance, 7. data ownership and privacy. Each faq_a: first sentence = direct answer, then 1–2 sentences with a specific figure or Lely product reference.)
- Block 11: SOURCES (label "SOURCES" + h2 "Sources and further reading" + 3–5 source elements — only from the trusted source list in the system prompt; if uncertain about a specific study, cite the institution without a title rather than inventing one)
- Block 11B: SOURCE VERIFICATION WARNING (a placeholder element reminding the editor to verify all sources before publication — always include this)
- Block 12: RELATED BLOGS (exactly 3 related_blog elements)
- Block 13: RELATED PRODUCTS (placeholder element)

Apply ALL mandatory rules from the system prompt.`;

    const [msg1, msg2] = await Promise.all([
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        messages: [{ role: "user", content: prompt1 }],
        system: SYSTEM_PROMPT,
      }),
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 16000,
        messages: [{ role: "user", content: prompt2 }],
        system: SYSTEM_PROMPT,
      }),
    ]);

    if (msg1.content[0].type !== "text" || msg2.content[0].type !== "text") {
      return NextResponse.json({ error: "Unexpected response from Claude" }, { status: 500 });
    }

    const part1 = parseJSON<{ text: GeneratedContent["text"] }>(msg1.content[0].text, "Text call 1 (blocks 0-7)");
    const part2 = parseJSON<{ text: GeneratedContent["text"] }>(msg2.content[0].text, "Text call 2 (blocks 8-13)");
    const allText = [...part1.text, ...part2.text];

    // ── Call 3: quality audit ─────────────────────────────────────────────────
    const criticPrompt = `Audit the following Lely page content against all quality criteria.

ORIGINAL BRIEF:
${sharedContext}

GENERATED CONTENT:
${JSON.stringify(allText, null, 2)}`;

    const msg3 = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: criticPrompt }],
      system: CRITIC_SYSTEM_PROMPT,
    });

    if (msg3.content[0].type !== "text") {
      return NextResponse.json({ error: "Unexpected response from quality audit" }, { status: 500 });
    }

    const qualityData = parseJSON<QualityReport>(msg3.content[0].text, "Quality audit");

    return NextResponse.json({ text: allText, quality: qualityData });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Claude API error:", message);
    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}
