import { z } from "astro/zod";

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const livePerformer = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("member"), name: text, ref: slug.optional() }),
  z.strictObject({ type: z.literal("character"), name: text }),
]);
export const setlistEntry = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("song"),
    number: z.union([z.number().int().nonnegative(), text]).optional(),
    titleJa: text,
    song: slug.optional(),
    performers: z.array(livePerformer).min(1).optional(),
  }),
  z.strictObject({ type: z.literal("section"), label: text }),
  z.strictObject({ type: z.literal("note"), text }),
]);
export const liveShow = z.object({
  id: slug,
  date: z.iso.date(),
  label: text.optional(),
  venue: text,
  cast: z.array(livePerformer).min(1).optional(),
  setlist: z.array(setlistEntry).min(1).optional(),
});
export const liveShows = z.array(liveShow).min(1).refine(
  (shows) => new Set(shows.map(({ id }) => id)).size === shows.length,
  "show IDs must be unique within a live event",
);
export const liveReference = z.object({
  label: text,
  url: z.url().regex(/^https?:\/\//i, "references must use HTTP or HTTPS"),
});
export type Performer = z.infer<typeof livePerformer>;
export type SetlistEntry = z.infer<typeof setlistEntry>;
