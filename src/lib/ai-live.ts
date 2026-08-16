export type LiveQuestion = { q: string; options: string[]; correct: number };

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
