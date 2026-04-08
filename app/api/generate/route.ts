import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { GenerateInput, GeneratedContent } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const SYSTEM_PROMPT = `Je bent een expert in SEO en GEO (Generative Engine Optimization) content. Je schrijft teksten die zowel vindbaar zijn in traditionele zoekmachines (Google, Bing) als in AI-zoekmachines (ChatGPT, Perplexity, Google AI Overviews, Copilot).

Je taak is om een gestructureerde tekst te schrijven op basis van de gegeven input, en daarbij voor elk element van de tekst precies uit te leggen waarom het bijdraagt aan de zichtbaarheid.

SEO-factoren om op te letten:
- Hoofdzoekwoord in H1, eerste alinea, en verspreid door de tekst (keyword density ~1-2%)
- Subzoekwoorden verwerkt in H2/H3-koppen en alinea's
- Duidelijke semantische structuur (H1 > H2 > H3)
- Beantwoording van zoekintentie (informationeel, commercieel, etc.)
- Interne coherentie van het onderwerp (topical authority)
- Gebruik van synoniemen en semantisch verwante termen (LSI keywords)
- Lengte en diepgang passend bij het onderwerp

GEO-factoren om op te letten:
- Directe, feitelijke antwoorden op vragen (ideaal voor AI-citaties)
- Gestructureerde informatie die AI makkelijk kan ophalen
- Gebruik van autoriteitsmarkeringen ("volgens...", "onderzoek toont aan...")
- Concrete feiten, cijfers en definities
- Klare en ondubbelzinnige taal
- Beantwoording van W-vragen (wie, wat, waar, wanneer, waarom, hoe)
- Gebruik van lijsten en opsommingen voor scanbaarheid

Geef je antwoord UITSLUITEND als geldig JSON zonder markdown code blocks, in exact dit formaat:
{
  "text": [
    {
      "id": "t1",
      "type": "h1",
      "content": "De tekst van het element",
      "rationaleIds": ["r1", "r2"]
    }
  ],
  "rationale": [
    {
      "id": "r1",
      "type": "seo",
      "element": "H1-kop",
      "explanation": "Uitleg waarom dit element bijdraagt aan zichtbaarheid"
    }
  ]
}

Typen voor tekstelementen: h1, h2, h3, p, li, intro
Typen voor rationale: seo, geo, both

Zorg voor minimaal 15 en maximaal 35 rationale-items per tekst. Elk tekstelement moet minimaal één rationaleId hebben.`;

export async function POST(request: NextRequest) {
  const input: GenerateInput = await request.json();

  const userPrompt = `Schrijf een SEO- en GEO-geoptimaliseerde tekst met de volgende gegevens:

**Onderwerp:** ${input.topic}
**Hoofdzoekwoord:** ${input.mainKeyword}
**Subzoekwoorden:** ${input.subKeywords || "Geen opgegeven"}
**Extra instructies:** ${input.instructions || "Geen"}
**Te beantwoorden vragen:** ${input.questions || "Geen specifieke vragen"}

Schrijf de volledige tekst en geef bij elk element de rationale waarom het bijdraagt aan SEO en/of GEO-zichtbaarheid.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: userPrompt }],
      system: SYSTEM_PROMPT,
    });

    const rawContent = message.content[0];
    if (rawContent.type !== "text") {
      return NextResponse.json({ error: "Onverwacht antwoord van Claude" }, { status: 500 });
    }

    let parsed: GeneratedContent;
    try {
      parsed = JSON.parse(rawContent.text);
    } catch {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = rawContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ error: "Kon de gegenereerde tekst niet verwerken" }, { status: 500 });
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json({ error: "Er is een fout opgetreden bij het genereren van de tekst" }, { status: 500 });
  }
}
