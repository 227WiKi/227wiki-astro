// Isolated Song Index fixtures for tests and the dev-only lab page. Every name is
// invented and marked as test data; nothing here is written to src/content.
import type { CollectionEntry } from "astro:content";
import type { SongCoverOf, SongOrigin, SongVersionData } from "../../src/lib/song-schema.ts";

export interface FixtureSong {
  id: string;
  data: { titleJa: string; titleZh?: string; origin?: SongOrigin; coverOf?: SongCoverOf; versions?: SongVersionData[] };
}
type FixtureRelease = Pick<CollectionEntry<"releases">, "id" | "data">;
type Track = FixtureRelease["data"]["editions"][number]["audioDiscs"][number]["tracks"][number];

const member = (name: string) => ({ type: "member" as const, name });
const character = (name: string) => ({ type: "character" as const, name });

export const fixtureSongs: FixtureSong[] = [
  {
    id: "fixture-group",
    data: {
      titleJa: "テスト全員曲", titleZh: "测试全员曲", origin: "original",
      versions: [{ id: "original", kind: "original", formation: "group", persona: "member", performers: [member("テスト成员A"), member("テスト成员B"), member("テスト成员C")] }],
    },
  },
  {
    id: "fixture-unit-cover",
    data: {
      titleJa: "テスト翻唱ユニット曲", titleZh: "测试翻唱 Unit 曲", origin: "cover",
      coverOf: { artist: "テスト原唱者", titleJa: "テスト原曲" },
      versions: [{ id: "original", kind: "original", formation: "unit", unit: "テストユニット", persona: "member", performers: [member("テスト成员A"), member("テスト成员B")] }],
    },
  },
  {
    id: "fixture-solo",
    data: {
      titleJa: "テストソロ曲", titleZh: "测试 Solo 曲", origin: "original",
      versions: [
        { id: "original", kind: "original", formation: "solo", persona: "member", performers: [member("テスト成员C")] },
        { id: "character", kind: "alternate-vocal", label: "キャラクター ver.", formation: "solo", persona: "character", performers: [character("テスト角色甲")] },
      ],
    },
  },
  {
    id: "fixture-character-cover",
    data: {
      titleJa: "テスト角色翻唱曲", origin: "cover", coverOf: { artist: "テスト原唱者" },
      versions: [{ id: "original", kind: "original", formation: "unit", persona: "character", performers: [character("テスト角色甲"), character("テスト角色乙")] }],
    },
  },
  { id: "fixture-unclassified", data: { titleJa: "テスト未分類曲", titleZh: "测试未分类曲" } },
  {
    id: "fixture-rerecorded",
    data: {
      titleJa: "テスト再録曲", titleZh: "测试重录曲", origin: "original",
      versions: [
        { id: "original", kind: "original", formation: "group" },
        { id: "2024", kind: "re-recording", label: "2024 ver.", formation: "group" },
        { id: "acoustic", kind: "re-arrangement", label: "Acoustic ver.", titleJa: "テスト再録曲 -Acoustic ver.-", formation: "group" },
      ],
    },
  },
  {
    // The original is in no catalogued Release; only the later re-recording is.
    id: "fixture-only-rerecording",
    data: {
      titleJa: "テスト原版未収録曲",
      versions: [{ id: "original", kind: "original" }, { id: "2024", kind: "re-recording", label: "2024 ver." }],
    },
  },
  // Same title, different works: never merged.
  { id: "fixture-same-name-a", data: { titleJa: "同じ名前の歌", titleZh: "同名之歌甲" } },
  { id: "fixture-same-name-b", data: { titleJa: "同じ名前の歌", titleZh: "同名之歌乙" } },
  { id: "fixture-similar", data: { titleJa: "テストの歌たち" } },
  {
    id: "fixture-long-title",
    data: { titleJa: "とても長いタイトルの歌が正しく改行されるかを確かめるためのテスト用の曲名～さらに長いサブタイトルも付いています～" },
  },
];

const track = (number: number, titleJa: string, extra: Partial<Track> = {}): Track => ({ number, titleJa, ...extra });
const release = (id: string, releaseType: "single" | "album", releaseNumber: number, releaseDate: string, tracks: Track[]): FixtureRelease => ({
  id,
  data: { titleJa: `${id} テスト作品`, releaseType, releaseNumber, releaseDate, editions: [{ id: "regular", name: "通常盘", audioDiscs: [{ tracks }] }] },
} as FixtureRelease);

export const fixtureReleases: FixtureRelease[] = [
  release("fixture-1st-single", "single", 1, "2018-01-10", [
    track(1, "テスト全員曲", { song: "fixture-group" }),
    track(2, "テスト翻唱ユニット曲", { song: "fixture-unit-cover" }),
    track(3, "テスト全員曲 -off vocal ver.-", { song: "fixture-group", variant: "off-vocal" }),
  ]),
  release("fixture-2nd-single", "single", 2, "2018-06-01", [
    track(1, "テスト再録曲", { song: "fixture-rerecorded" }),
    track(2, "同じ名前の歌", { song: "fixture-same-name-a" }),
  ]),
  release("fixture-1st-album", "album", 1, "2019-03-03", [
    track(1, "テストソロ曲", { song: "fixture-solo" }),
    track(2, "テストソロ曲 -キャラクター ver.-", { song: "fixture-solo", version: "character" }),
    track(3, "テスト角色翻唱曲", { song: "fixture-character-cover" }),
    track(4, "同じ名前の歌", { song: "fixture-same-name-b" }),
  ]),
  release("fixture-2nd-album", "album", 2, "2024-04-04", [
    track(1, "テスト再録曲 -2024 ver.-", { song: "fixture-rerecorded", version: "2024" }),
    track(2, "テスト原版未収録曲 -2024 ver.-", { song: "fixture-only-rerecording", version: "2024" }),
    track(3, "テスト再録曲 -Acoustic ver.-", { song: "fixture-rerecorded", version: "acoustic" }),
  ]),
];

/** A deterministic catalogue of `count` songs over `count / 10` Releases, for scale checks. */
export function scaleFixture(count: number): { songs: FixtureSong[]; releases: FixtureRelease[] } {
  const formations = ["group", "unit", "solo", undefined] as const;
  const songs: FixtureSong[] = Array.from({ length: count }, (_, index) => {
    const formation = formations[index % formations.length];
    return {
      id: `fixture-scale-${index}`,
      data: {
        titleJa: `テスト曲 ${index}`,
        ...(index % 3 ? { titleZh: `测试曲 ${index}` } : {}),
        ...(index % 7 === 0 ? { origin: "cover" as const } : index % 3 === 0 ? { origin: "original" as const } : {}),
        ...(formation ? { versions: [{ id: "original", kind: "original" as const, formation, ...(index % 5 === 0 ? { persona: "character" as const } : {}) }] } : {}),
      },
    };
  });
  const releases = Array.from({ length: Math.ceil(count / 10) }, (_, releaseIndex) => release(
    `fixture-scale-release-${releaseIndex}`, "single", releaseIndex + 1,
    `${2017 + Math.floor(releaseIndex / 12)}-${String((releaseIndex % 12) + 1).padStart(2, "0")}-15`,
    // Every tenth song stays out of every Release, so it has no date.
    songs.slice(releaseIndex * 10, releaseIndex * 10 + 9).map((song, position) => track(position + 1, song.data.titleJa, { song: song.id })),
  ));
  return { songs, releases };
}
