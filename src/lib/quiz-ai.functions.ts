import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  topic: z.string().min(1),
  subject: z.string(),
  classLevel: z.string(),
  language: z.string(),
  difficulty: z.string(),
});

export type GeneratedQuestion = {
  prompt_en: string;
  prompt_hi: string;
  options_en: string[];
  options_hi: string[];
  answer: number;
};

function simulate(topic: string, classLevel: string): GeneratedQuestion[] {
  return Array.from({ length: 5 }, (_, i) => ({
    prompt_en: `${classLevel}: Question ${i + 1} about ${topic}?`,
    prompt_hi: `${classLevel}: ${topic} पर प्रश्न ${i + 1}?`,
    options_en: ["Option A", "Option B", "Option C", "Option D"],
    options_hi: ["विकल्प क", "विकल्प ख", "विकल्प ग", "विकल्प घ"],
    answer: i % 4,
  }));
}

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }): Promise<{ questions: GeneratedQuestion[]; simulated: boolean }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { questions: simulate(data.topic, data.classLevel), simulated: true };

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
                "You write school quiz questions for Indian classrooms. Always return strict JSON only.",
            },
            {
              role: "user",
              content: `Create exactly 5 multiple-choice questions (4 options each) for ${data.classLevel} ${data.subject}, topic "${data.topic}", difficulty ${data.difficulty}. Provide each question in English and in ${data.language}. Return JSON: {"questions":[{"prompt_en":"","prompt_hi":"","options_en":["","","",""],"options_hi":["","","",""],"answer":0}]} where answer is the 0-based index of the correct option.`,
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
      return { questions: simulate(data.topic, data.classLevel), simulated: true };
    }
  });
