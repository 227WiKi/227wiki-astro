import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const members = defineCollection({
  loader: glob({
    base: "./src/content/members",
    pattern: "**/*.md",
  }),
  schema: z.object({
    nameJa: z.string().min(1),
    nameZh: z.string().min(1).optional(),
    nameKana: z.string().min(1).optional(),
    nameRomanized: z.string().min(1).optional(),
    status: z.enum(["active", "graduated"]),
    birthday: z
      .object({
        month: z.number().int().min(1).max(12),
        day: z.number().int().min(1).max(31),
      })
      .optional(),
    birthplace: z.string().min(1).optional(),
    heightCm: z.number().positive().optional(),
    bloodType: z.enum(["A", "B", "AB", "O"]).optional(),
    avatar: z
      .string()
      .min(1)
      .regex(
        /^(?!\/)(?![a-z][a-z0-9+.-]*:\/\/).+/i,
        "avatar must be an R2-relative resource path",
      )
      .optional(),
    officialProfileUrl: z.url().optional(),
    socials: z
      .array(
        z.object({
          platform: z.enum(["x", "instagram", "youtube", "showroom", "other"]),
          label: z.string().min(1),
          url: z.url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { members };
