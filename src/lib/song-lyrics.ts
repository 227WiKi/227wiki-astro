import { z } from "astro/zod";
import { slug } from "./song-schema.ts";

// Full texts live in Markdown bodies, never in Song frontmatter or components.
export const songLyricsSchema = z.strictObject({
  song: slug,
  language: z.enum(["ja", "zh-Hans"]),
  status: z.enum(["available", "permission-pending", "missing"]),
  sourceUrl: z.url().regex(/^https?:\/\//),
  sourceLabel: z.string().trim().min(1),
  attribution: z.string().trim().min(1),
  permission: z.string().trim().min(1).optional(),
}).superRefine((entry, ctx) => {
  if (entry.status === "available" && !entry.permission) {
    ctx.addIssue({ code: "custom", path: ["permission"], message: "Available lyrics require a permission or licence record" });
  }
});

export function assertSongLyrics(
  entries: readonly { id: string; body?: string; data: z.infer<typeof songLyricsSchema> }[],
  songs: readonly { id: string }[],
): void {
  const ids = new Set(songs.map(({ id }) => id));
  const seen = new Set<string>();
  for (const entry of entries) {
    const key = `${entry.data.song}/${entry.data.language}`;
    if (!ids.has(entry.data.song)) throw new Error(`Unknown Song in lyrics: ${entry.id}`);
    if (seen.has(key)) throw new Error(`Duplicate lyrics language: ${key}`);
    if (entry.data.status === "available" && !entry.body?.trim()) throw new Error(`Empty available lyrics: ${entry.id}`);
    if (entry.data.status !== "available" && entry.body?.trim()) throw new Error(`Unapproved lyrics body: ${entry.id}`);
    seen.add(key);
  }
}
