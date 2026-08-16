import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildQuestions } from "./quiz-bank";

const input = z.object({
  topic: z.string().min(1),
  subject: z.string(),
  classLevel: z.string(),
  language: z.string(),
  difficulty: z.string(),
  set: z.number().optional().default(0),
});

export type GeneratedQuestion = {
  prompt_en: string;
  prompt_hi: string;
  options_en: string[];
  options_hi: string[];
  answer: number;
};

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }): Promise<{ questions: GeneratedQuestion[]; simulated: boolean }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { questions: buildQuestions(data), simulated: true };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash",
          messages: [
            {
              role: "system",
              content:
                "You write school quiz questions for Indian classrooms. You are fluent in Indian regional languages and always write the localized fields in that language's native script (Hindi = Devanagari), never transliterated English. Use ₹ for money. Always return strict JSON only.",
            },
            {
              role: "user",
              content: `Create exactly 5 multiple-choice questions (4 options each) for ${data.classLevel} ${data.subject}, topic "${data.topic}", difficulty ${data.difficulty}.
Selected language: ${data.language}.
"prompt_hi"/"options_hi" MUST be written fully in ${data.language} (native script), including word problems localized with ₹ (e.g. "248 + 176 का योग क्या होगा?"). "prompt_en"/"options_en" are the English equivalents. Both arrays must be in the same order, so index "answer" is correct in both.
Return JSON only: {"questions":[{"prompt_en":"","prompt_hi":"","options_en":["","","",""],"options_hi":["","","",""],"answer":0}]} where answer is the 0-based index of the correct option.`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`gateway ${res.status}`);
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const raw = json.choices?.[0]?.message?.content ?? "";
      const match = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : raw) as { questions?: GeneratedQuestion[] };
      const questions = (parsed.questions ?? []).slice(0, 5).filter((q) => q?.prompt_en && Array.isArray(q.options_en));
      if (questions.length === 0) throw new Error("empty");
      return { questions, simulated: false };
    } catch {
      return { questions: buildQuestions(data), simulated: true };
    }
  });
