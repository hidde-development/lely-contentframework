import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { GeneratedContent, QualityReport, RegenerateInput } from "@/lib/types";
import { SYSTEM_PROMPT, CRITIC_SYSTEM_PROMPT, parseJSON } from "@/lib/prompts";

const apiKey =
  process.env.Claude ||
  process.env.ANTHROPIC_API_KEY ||
  process.env.CLAUDE_API_KEY;

const client = new Anthropic({ apiKey });

export async function POST(request: NextRequest) {
  const { input, text, quality }: RegenerateInput = await request.json();

  // Build shared context (same as generate route)
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

  // ── Surgical fix: only touch elements flagged by the critic ────────────────
  // Actions with an elementId can be fixed automatically.
  // Actions without an elementId are structural/page-level — left for human review.
  const elementActions = quality.actions.filter((a) => a.elementId);

  let newText = text;

  if (elementActions.length > 0) {
    const idsToFix = [...new Set(elementActions.map((a) => a.elementId!))];
    const elementsToFix = text.filter((el) => idsToFix.includes(el.id));

    const fixInstructions = elementActions
      .map((a) =>
        `\n[Element ID: ${a.elementId}] Criterion ${a.criterion} (${a.severity})\nIssue: ${a.issue}\nFix: ${a.fix}`
      )
      .join("\n");

    const fixPrompt = `You are making surgical fixes to specific elements of a published Lely CMS page.

STRICT RULES:
- Fix ONLY the elements provided below. Every other element must remain exactly as-is.
- Return a JSON object with a "text" array containing ONLY the corrected elements, with the exact same IDs and types.
- Do not rewrite, restructure, add, or remove any element not listed here.
- Apply all brand and quality rules from the system prompt.
- Do not introduce new problems while fixing existing ones.

${sharedContext}

ELEMENTS TO FIX (current content):
${JSON.stringify(elementsToFix, null, 2)}

FIX INSTRUCTIONS (one per element):
${fixInstructions}`;

    try {
      const fixMsg = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 6000,
        messages: [{ role: "user", content: fixPrompt }],
        system: SYSTEM_PROMPT,
      });

      if (fixMsg.content[0].type !== "text") {
        throw new Error("Unexpected response from fix call");
      }

      const fixResult = parseJSON<{ text: GeneratedContent["text"] }>(
        fixMsg.content[0].text,
        "Surgical fix"
      );

      // Merge: replace fixed elements, keep everything else unchanged
      const fixedById: Record<string, GeneratedContent["text"][number]> = {};
      fixResult.text.forEach((el) => { fixedById[el.id] = el; });
      newText = text.map((el) => fixedById[el.id] ?? el);

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Surgical fix error:", message);
      // Fall through with original text — still run the critic
    }
  }

  // ── Full critic run on the improved content ────────────────────────────────
  try {
    const criticPrompt = `Audit the following Lely page content against all quality criteria.

ORIGINAL BRIEF:
${sharedContext}

GENERATED CONTENT:
${JSON.stringify(newText, null, 2)}`;

    const criticMsg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{ role: "user", content: criticPrompt }],
      system: CRITIC_SYSTEM_PROMPT,
    });

    if (criticMsg.content[0].type !== "text") {
      throw new Error("Unexpected response from critic");
    }

    const newQuality = parseJSON<QualityReport>(criticMsg.content[0].text, "Quality audit (regenerate)");

    // How many issues were resolved: compare action count before vs. after
    const resolvedCount = Math.max(0, quality.actions.length - newQuality.actions.length);

    // All remaining actions are for human review only — no second automated pass
    const humanOnlyActions = newQuality.actions.map((a) => ({ ...a, humanOnly: true }));

    return NextResponse.json({
      text: newText,
      quality: {
        scores: newQuality.scores,
        actions: humanOnlyActions,
        regenerated: true,
        resolvedCount,
      },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Regenerate critic error:", message);
    return NextResponse.json({ error: `Regeneration failed: ${message}` }, { status: 500 });
  }
}
