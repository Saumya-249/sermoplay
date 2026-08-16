export type AIProvider = "gemini" | "openai";

export type LiveQuestion = { q: string; options: string[]; correct: number };

export const AI_KEY_STORAGE = "rglg.ai.apiKey";
export const AI_PROVIDER_STORAGE = "rglg.ai.provider";

export function buildQuizPrompt(p: {
  subject: string;
  topic: string;
  classLevel: string;
  language: string;
  difficulty: string;
  variant: number;
}) {
  return `Act as an expert primary and secondary school curriculum text designer. Generate exactly 5 non-repetitive multiple-choice questions matching these precise filters: Subject: ${p.subject}, Topic: ${p.topic}, Class: ${p.classLevel}, Language: ${p.language}. Difficulty: ${p.difficulty}.

Write every question and every option fully in ${p.language} using its native script (Hindi = Devanagari). Ask only direct academic curriculum questions about "${p.topic}" — never study habits, opinions, or meta questions, and never mention the class, subject, or language names inside the text.${p.variant > 0 ? ` This is alternative set ${p.variant}; produce a completely different set from previous ones.` : ""}

STRICT RULE: Return ONLY a raw, valid JSON array of objects. Do not include any conversational text, markdown formatting, or '\`\`\`json' code blocks. The structural JSON layout must strictly be:
[
  {"q": "Factual academic question about the topic", "options": ["Correct Answer", "Wrong Distractor 1", "Wrong Distractor 2", "Wrong Distractor 3"], "correct": 0}
]`;
}

function parseQuestions(raw: string): LiveQuestion[] {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  const parsed = JSON.parse(match ? match[0] : cleaned) as LiveQuestion[];
  if (!Array.isArray(parsed)) throw new Error("AI returned an unexpected format");
  return parsed
    .filter((x) => x && typeof x.q === "string" && Array.isArray(x.options) && x.options.length >= 2)
    .slice(0, 5)
    .map((x) => ({
      q: x.q,
      options: x.options.slice(0, 4).map(String),
      correct: Number.isInteger(x.correct) ? Math.max(0, Math.min(3, x.correct)) : 0,
    }));
}

export async function fetchAIQuizQuestions(args: {
  provider: AIProvider;
  apiKey: string;
  subject: string;
  topic: string;
  classLevel: string;
  language: string;
  difficulty: string;
  variant: number;
}): Promise<LiveQuestion[]> {
  const prompt = buildQuizPrompt(args);
  let text = "";

  if (args.provider === "gemini") {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(args.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, responseMimeType: "application/json" },
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini error ${res.status}: ${body.slice(0, 180)}`);
    }
    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${args.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.9,
        messages: [
          { role: "system", content: "You are an expert school curriculum question writer. Always return raw JSON only." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${body.slice(0, 180)}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    text = json.choices?.[0]?.message?.content ?? "";
  }

  const questions = parseQuestions(text);
  if (questions.length === 0) throw new Error("The AI returned no usable questions — try again.");
  return questions;
}
