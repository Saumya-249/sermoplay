export type LiveQuestion = { q: string; options: string[]; correct: number };

export type SubjectRow = { subject: string; topic: string };

export function buildQuizPrompt(p: {
  subject: string;
  topic: string;
  classLevel: string;
  language: string;
  difficulty: string;
  variant: number;
  count?: number;
  mode?: "single" | "multi";
  rows?: SubjectRow[];
}) {
  const count = p.count ?? 5;
  const rows = p.rows ?? [];
  const scope =
    p.mode === "multi" && rows.length > 0
      ? `Generate exactly ${count} questions split evenly across these subjects and topics: ${rows
          .map((r, i) => `(${i + 1}) Subject: ${r.subject} — Topic: ${r.topic}`)
          .join("; ")}. Distribute the ${count} questions as evenly as possible across those pairs.`
      : `Generate exactly ${count} questions on the single subject ${p.subject} and topic ${p.topic}.`;

  return `Act as an expert primary and secondary school curriculum text designer. ${scope} Class: ${p.classLevel}, Language: ${p.language}. Difficulty: ${p.difficulty}. Questions must be non-repetitive.

Write every question and every option fully in ${p.language} using its native script (Hindi = Devanagari). Ask only direct academic curriculum questions about the requested topic(s) — never study habits, opinions, or meta questions, and never mention the class, subject, or language names inside the text.${p.variant > 0 ? ` This is alternative set ${p.variant}; produce a completely different set from previous ones.` : ""}

STRICT RULE: Return ONLY a raw, valid JSON array of exactly ${count} objects. Do not include any conversational text, markdown formatting, or '\`\`\`json' code blocks. The structural JSON layout must strictly be:
[
  {"q": "Factual academic question about the topic", "options": ["Correct Answer", "Wrong Distractor 1", "Wrong Distractor 2", "Wrong Distractor 3"], "correct": 0}
]`;
}
