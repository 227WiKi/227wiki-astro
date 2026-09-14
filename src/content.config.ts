import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const memberPhotoPath = z.string().min(1).regex(
  /^(?!\/)(?![a-z][a-z0-9+.-]*:)(?!.*(?:^|\/)\.\.(?:\/|$))[^\\?#]+$/i,
  "member photo must be an R2-relative resource path",
);

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
    themeColor: z.string().min(1).optional(),
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
    officialPhotos: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
          label: z.string().min(1),
          path: memberPhotoPath,
        }),
      )
      .default([])
      .refine(
        (photos) => new Set(photos.map(({ id }) => id)).size === photos.length,
        "official photo IDs must be unique within a member",
      ),
    officialProfileUrl: z.url().optional(),
    socials: z
      .array(
        z.object({
          platform: z.enum(["x", "instagram", "youtube", "tiktok", "showroom", "other"]),
          label: z.string().min(1),
          url: z.url(),
        }),
      )
      .default([]),
  }),
});

const resourcePath = z.string().min(1).regex(
  /^(?!\/)(?![a-z][a-z0-9+.-]*:)(?!.*(?:^|\/)\.\.(?:\/|$))[^\\?#]+$/i,
  "cover must be an R2-relative resource path",
);

const releaseTrack = z.object({
  song: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  number: z.number().int().positive(),
  titleJa: z.string().min(1),
  titleZh: z.string().min(1).optional(),
  duration: z.string().regex(/^\d{1,2}:[0-5]\d$/, "duration must be mm:ss").optional(),
  variant: z.literal("off-vocal").optional(),
});

const audioDisc = z.object({
  label: z.string().min(1).optional(),
  tracks: z.array(releaseTrack).min(1),
});

const bonusMedia = z.object({
  medium: z.enum(["dvd", "bluray"]),
  label: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).min(1),
});

const edition = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  catalogNumber: z.string().min(1).optional(),
  cover: resourcePath.optional(),
  audioDiscs: z.array(audioDisc).min(1),
  bonusMedia: z.array(bonusMedia).optional(),
});

const releases = defineCollection({
  loader: glob({ base: "./src/content/releases", pattern: "**/*.md" }),
  schema: z.object({
    titleJa: z.string().min(1),
    titleZh: z.string().min(1).optional(),
    releaseType: z.enum(["single", "album"]),
    releaseNumber: z.number().int().positive(),
    releaseDate: z.iso.date(),
    label: z.string().min(1).optional(),
    producer: z.string().min(1).optional(),
    cover: resourcePath.optional(),
    editions: z.array(edition).min(1).refine(
      (editions) => new Set(editions.map(({ id }) => id)).size === editions.length,
      "edition IDs must be unique within a release",
    ),
  }),
});

const provider = z.enum(["apple-music", "spotify", "youtube-music", "youtube", "bilibili", "other"]);
const externalLink = z.object({
  provider,
  label: z.string().min(1),
  url: z.url().regex(/^https?:\/\//i, "external links must use HTTP or HTTPS"),
});

const songs = defineCollection({
  loader: glob({ base: "./src/content/songs", pattern: "**/*.md" }),
  schema: z.object({
    titleJa: z.string().min(1),
    titleZh: z.string().min(1).optional(),
    duration: z.string().regex(/^\d{1,2}:[0-5]\d$/, "duration must be mm:ss").optional(),
    credits: z.object({
      lyricists: z.array(z.string().min(1)).default([]),
      composers: z.array(z.string().min(1)).default([]),
      arrangers: z.array(z.string().min(1)).default([]),
    }).optional(),
    listeningLinks: z.array(externalLink).default([]),
    videos: z.array(externalLink.extend({
      type: z.enum(["music-video", "lyric-video", "live", "other"]),
    })).default([]),
  }),
});

export const collections = { members, releases, songs };
