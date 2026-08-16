import { buildQuizPrompt, type LiveQuestion } from "./ai-live";

export async function generateLiveQuestions(p: {
  subject: string;
  topic: string;
  classLevel: string;
  language: string;
  difficulty: string;
  variant: number;
}): Promise<LiveQuestion[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured on this project.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Lovable-API-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Indian school curriculum question writer. Return raw JSON only — no markdown, no commentary.",
        },
        { role: "user", content: buildQuizPrompt(p) },
      ],
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached — please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted — add credits in Settings → Plans & credits.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const raw = (json.choices?.[0]?.message?.content ?? "").replace(/```json/gi, "").replace(/```/g, "").trim();
  const match = raw.match(/\[[\s\S]*\]/);
  const parsed = JSON.parse(match ? match[0] : raw) as LiveQuestion[];
  if (!Array.isArray(parsed)) throw new Error("The AI returned an unexpected format.");

  const questions = parsed
    .filter((x) => x && typeof x.q === "string" && Array.isArray(x.options) && x.options.length >= 2)
    .slice(0, 5)
    .map((x) => ({
      q: x.q,
      options: x.options.slice(0, 4).map(String),
      correct: Number.isInteger(x.correct) ? Math.max(0, Math.min(3, x.correct)) : 0,
    }));
  if (questions.length === 0) throw new Error("The AI returned no usable questions — try again.");
  return questions;
}
