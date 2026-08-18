import type { ArcadeData, ArcadeEngine } from "./arcade-catalog";

const SHAPES: Record<ArcadeEngine, string> = {
  choice:
    '{"rounds":[{"q":"question text","options":["a","b","c","d"],"correct":0}]} with exactly 5 rounds',
  tokens:
    '{"tokens":[{"label":"item name","emoji":"🥭","target":60}]} with exactly 4 rounds; target is a number only',
  fraction:
    '{"fractions":[{"label":"dish name","emoji":"🍕","numerator":3,"denominator":4}]} with exactly 4 rounds; denominator between 2 and 8',
  sort: '{"bins":["bin1","bin2","bin3"],"items":[{"label":"token","bin":"bin1"}]} with 3 bins and exactly 6 items',
  order: '{"sequence":[{"label":"event name","order":1}]} with exactly 6 events ordered 1..6',
  meters: '{"crop":{"name":"crop name","hint":"one short care tip"}}',
};

export async function synthesizeArcadeRound(p: {
  gameKey: string;
  gameTitle: string;
  subject: string;
  engine: ArcadeEngine;
  language: string;
  variant: number;
}): Promise<ArcadeData> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured on this project.");

  const system =
    "Act as an elite game data synthesis engine. Return ONLY a valid JSON string payload with new, randomized question parameters, terms, and numerical answer cards fully translated in " +
    p.language +
    " script. No English or meta-text.";

  const user = `Game key: ${p.gameKey}. Game concept: ${p.gameTitle}. Subject: ${p.subject}. Target language: ${p.language}. Randomization seed: ${p.variant}.
Produce fresh, curriculum-accurate, India-contextual content for this exact game.
JSON layout required: ${SHAPES[p.engine]}.
Every human-readable string must be written in ${p.language} using its native script (Hindi/Marathi = Devanagari, Tamil = Tamil script, Kannada = Kannada script, Bengali = Bengali script, Telugu = Telugu script). Numerals, the ₹ symbol and emoji may stay as-is. Never mix English words or transliteration into the payload.
For choice games the "correct" index must point at the factually correct option, and distractors must be plausible. Return raw JSON only — no markdown fences, no commentary.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Lovable-API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted — add credits in Settings → Plans & credits.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const raw = (json.choices?.[0]?.message?.content ?? "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const match = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(match ? match[0] : raw) as ArcadeData;
  if (!parsed || typeof parsed !== "object") throw new Error("The AI returned an unexpected format.");
  return parsed;
}
