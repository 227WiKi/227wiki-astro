// Song classification and Version contracts. A Song is the work; a Version is one
// recording or performance of it. Every category comes from an explicit field here,
// never from titles, Release names or performer counts.
import { z } from "astro/zod";

const text = z.string().trim().min(1);
export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/**
 * Who is credited on a Version. Members and Characters are separate identities:
 * a Character is never replaced by, or inferred from, a voice actor. A Character
 * `ref` reserves a stable ID for a future Character collection and is not linked
 * until such pages exist.
 */
export const songPerformer = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("member"), name: text, ref: slug.optional() }),
  z.strictObject({ type: z.literal("character"), name: text, ref: slug.optional() }),
]);

export const songVersionKinds = ["original", "alternate-vocal", "re-recording", "re-arrangement", "other"] as const;
export const songFormations = ["group", "unit", "solo"] as const;
export const songPersonas = ["member", "character"] as const;

export const songVersion = z.strictObject({
  /** Stable within the Song; Release tracks point at it with `version`. */
  id: slug,
  kind: z.enum(songVersionKinds),
  /** Official title of this Version when it differs from the Song's title. */
  titleJa: text.optional(),
  titleZh: text.optional(),
  /** Short official identifier, such as "Album ver." or "2024 ver.". */
  label: text.optional(),
  /** Exclusive within one Version: the whole group, a Unit, or one person. */
  formation: z.enum(songFormations).optional(),
  /** Whether the Version is sung as members or as Characters. */
  persona: z.enum(songPersonas).optional(),
  /** Unit name as credited; only for a Unit formation. */
  unit: text.optional(),
  performers: z.array(songPerformer).min(1).optional(),
}).superRefine((version, ctx) => {
  if (version.unit && version.formation !== "unit") {
    ctx.addIssue({ code: "custom", path: ["unit"], message: "unit is only allowed when formation is unit" });
  }
  if (version.persona && version.performers?.some(({ type }) => type !== version.persona)) {
    ctx.addIssue({ code: "custom", path: ["performers"], message: `performers must all be ${version.persona} credits` });
  }
  const keys = version.performers?.map(({ type, ref, name }) => `${type}:${ref ?? name}`) ?? [];
  if (new Set(keys).size !== keys.length) {
    ctx.addIssue({ code: "custom", path: ["performers"], message: "performers must be unique within a version" });
  }
});

/**
 * The first Version is the one Release tracks without `version` belong to. An
 * `original` Version, when declared, must be that first one.
 */
export const songVersions = z.array(songVersion).min(1).superRefine((versions, ctx) => {
  if (new Set(versions.map(({ id }) => id)).size !== versions.length) {
    ctx.addIssue({ code: "custom", message: "version IDs must be unique within a song" });
  }
  versions.forEach((version, index) => {
    if (version.kind === "original" && index !== 0) {
      ctx.addIssue({ code: "custom", path: [index, "kind"], message: "the original version must be listed first" });
    }
  });
});

/** Original or cover is a property of the work, independent of who sings a Version. */
export const songOrigin = z.enum(["original", "cover"]);
export const songCoverOf = z.strictObject({ artist: text, titleJa: text.optional() });

export function checkSongClassification(
  song: { origin?: z.infer<typeof songOrigin>; coverOf?: z.infer<typeof songCoverOf> },
  ctx: z.RefinementCtx,
): void {
  if (song.coverOf && song.origin !== "cover") {
    ctx.addIssue({ code: "custom", path: ["coverOf"], message: "coverOf requires origin: cover" });
  }
}

export type SongPerformer = z.infer<typeof songPerformer>;
export type SongVersionData = z.infer<typeof songVersion>;
export type SongVersionKind = (typeof songVersionKinds)[number];
export type SongFormation = (typeof songFormations)[number];
export type SongPersona = (typeof songPersonas)[number];
export type SongOrigin = z.infer<typeof songOrigin>;
export type SongCoverOf = z.infer<typeof songCoverOf>;
