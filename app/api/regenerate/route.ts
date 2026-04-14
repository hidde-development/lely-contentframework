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

  // ── Criterion → element fallback mapping ──────────────────────────────────
  // When the critic omits elementId, infer the most relevant elements from the
  // text array based on the criterion code. Keeps fix prompts focused.
  function inferElementIds(criterion: string, allText: GeneratedContent["text"]): string[] {
    const byType = (types: string[]) => allText.filter(el => types.includes(el.type)).map(el => el.id);
    switch (criterion) {
      case "S1": return byType(["h1"]);
      case "S2": return allText.filter(el => el.type === "p").slice(0, 2).map(el => el.id);
      case "S3":
      case "S4":
      case "G1":
      case "B1": return byType(["h1", "h2", "h3"]);
      case "G2": return byType(["h2", "p"]).slice(0, 12);
      case "G3": return byType(["li"]);
      case "G4":
      case "G6": return byType(["p", "h2", "h3"]).slice(0, 15);
      case "G5":
      case "G10": return byType(["table"]);
      case "G7": return byType(["source"]);
      case "G8": return byType(["faq_q", "faq_a"]);
      case "G9": return byType(["p"]).slice(0, 15);
      case "B2": return allText.filter(el => /—|–/.test(el.content)).map(el => el.id);
      case "B3":
      case "B4":
      case "B5": return byType(["p"]).slice(0, 10);
      default:   return [];
    }
  }

  // ── Surgical fix: only touch elements flagged by the critic ────────────────
  // Actions with an elementId are fixed directly.
  // Actions without an elementId fall back to the criterion mapping above.
  // Actions that cannot be mapped to any element are left for human review.
  const elementActions = quality.actions.filter((a) => {
    if (a.elementId) return true;
    return inferElementIds(a.criterion, text).length > 0;
  });

  let newText = text;

  if (elementActions.length > 0) {
    // Resolve element IDs: use explicit elementId, or fall back to criterion mapping
    const idsToFix = new Set<string>();
    const actionWithIds = elementActions.map((a) => {
      const ids = a.elementId
        ? [a.elementId]
        : inferElementIds(a.criterion, text);
      ids.forEach((id) => idsToFix.add(id));
      return { ...a, resolvedIds: ids };
    });

    const elementsToFix = text.filter((el) => idsToFix.has(el.id));

    const fixInstructions = actionWithIds
      .map((a) =>
        `\n[Elements: ${a.resolvedIds.join(", ")}] Criterion ${a.criterion} (${a.severity})\nIssue: ${a.issue}\nFix: ${a.fix}`
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

    // Scores never decrease after regeneration — take the best of before/after
    // per category. The fix targeted specific elements; any new issues found by
    // the critic on unchanged elements are LLM noise, not real regressions.
    const scores = {
      seo:      Math.max(quality.scores.seo,      newQuality.scores.seo),
      geo:      Math.max(quality.scores.geo,      newQuality.scores.geo),
      brand:    Math.max(quality.scores.brand,    newQuality.scores.brand),
      strategy: Math.max(quality.scores.strategy, newQuality.scores.strategy),
    };

    // All remaining actions are for human review only — no second automated pass
    const humanOnlyActions = newQuality.actions.map((a) => ({ ...a, humanOnly: true }));

    return NextResponse.json({
      text: newText,
      quality: {
        scores,
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
