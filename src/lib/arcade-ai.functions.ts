import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { synthesizeArcadeRound } from "./arcade-ai.server";

export const generateArcadeRound = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        gameKey: z.string().min(1),
        gameTitle: z.string().min(1),
        subject: z.string().min(1),
        engine: z.enum(["tokens", "fraction", "choice", "sort", "order", "meters"]),
        language: z.string().min(1),
        variant: z.number().default(0),
      })
      .parse(data),
  )
  .handler(async ({ data }) => ({ data: await synthesizeArcadeRound(data) }));
