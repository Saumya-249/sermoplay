import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateLiveQuestions } from "./live-quiz.server";

export const generateLiveQuiz = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        subject: z.string(),
        topic: z.string().min(1),
        classLevel: z.string(),
        language: z.string(),
        difficulty: z.string(),
        variant: z.number().default(0),
        count: z.number().min(1).max(20).default(5),
        mode: z.enum(["single", "multi"]).default("single"),
        rows: z.array(z.object({ subject: z.string(), topic: z.string() })).default([]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => ({ questions: await generateLiveQuestions(data) }));
