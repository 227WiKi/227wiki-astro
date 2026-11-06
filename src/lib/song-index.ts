// Song Index model. Pure functions shared by the build (cards), the browser
// (search, filters, sort) and tests. No runtime import of astro:content.
import type { CollectionEntry } from "astro:content";
import { releaseHref, releaseLabel } from "./releases.ts";
import type {
  SongCoverOf, SongFormation, SongOrigin, SongPerformer, SongPersona, SongVersionData, SongVersionKind,
} from "./song-schema.ts";

/**
 * Two levels. The kind (原创曲 / 翻唱曲) comes from the work's `origin`; the
 * sub-categories (小组曲 / 角色曲) from a Version's `formation: unit` and
 * `persona: character`, and may apply to originals and covers alike. Group and
 * solo formations stay in the data but are not categories.
 */
export type SongKind = "original" | "cover";
export type SongSubCategory = "unit" | "character";
export type SongCategory = SongKind | SongSubCategory;
/** Filter values are the categories themselves; a song with no recorded kind has no category. */
export type SongCategoryFilter = SongCategory;
export type SongIndexSort = "date-asc" | "date-desc" | "name";

export const songKindOptions: readonly { value: SongKind; label: string }[] = [
  { value: "original", label: "原创曲" },
  { value: "cover", label: "翻唱曲" },
];
export const songSubCategoryOptions: readonly { value: SongSubCategory; label: string }[] = [
  { value: "unit", label: "小组曲" },
  { value: "character", label: "角色曲" },
];
export const songCategoryOptions: readonly { value: SongCategoryFilter; label: string }[] = [...songKindOptions, ...songSubCategoryOptions];
const kindValues: ReadonlySet<SongCategoryFilter> = new Set(songKindOptions.map(({ value }) => value));
const subCategoryOrder: readonly SongSubCategory[] = ["unit", "character"];
export const songCategoryLabel = (value: SongCategoryFilter): string =>
  songCategoryOptions.find((option) => option.value === value)!.label;

export const songSortOptions: readonly { value: SongIndexSort; label: string }[] = [
  { value: "date-asc", label: "最早发行" },
  { value: "date-desc", label: "最新发行" },
  { value: "name", label: "歌名" },
];

export const versionKindLabels: Record<SongVersionKind, string> = {
  original: "原版",
  "alternate-vocal": "不同演唱者版本",
  "re-recording": "重新录音版本",
  "re-arrangement": "重新编曲版本",
  other: "其他版本",
};

interface SongInput {
  id: string;
  data: {
    titleJa: string;
    titleZh?: string;
    origin?: SongOrigin;
    coverOf?: SongCoverOf;
    versions?: SongVersionData[];
  };
}
type ReleaseInput = Pick<CollectionEntry<"releases">, "id" | "data">;

export interface SongFirstRelease {
  releaseId: string;
  href: string;
  label: string;
  titleJa: string;
  date: string;
  releaseType: "single" | "album";
}

export interface SongVersionView {
  id: string;
  kind: SongVersionKind;
  /** False for the implicit Version of a Song that declares none. */
  declared: boolean;
  /** What readers see: the official label or title, else the kind. */
  name: string;
  titleJa?: string;
  titleZh?: string;
  label?: string;
  formation?: SongFormation;
  persona?: SongPersona;
  unit?: string;
  performers: SongPerformer[];
  categories: SongSubCategory[];
  /** Unit name, else credited names; undefined when nobody is credited. */
  performerText?: string;
  firstRelease?: SongFirstRelease;
  /** The Single this Version belongs to, else its Album; see homeReleaseForSong(). */
  homeRelease?: SongFirstRelease;
}

export interface SongIndexEntry {
  id: string;
  href: string;
  titleJa: string;
  titleZh?: string;
  origin?: SongOrigin;
  coverOf?: SongCoverOf;
  /** The kind first (when recorded), then the union of Version sub-categories. */
  categories: SongCategory[];
  versions: SongVersionView[];
  /** The work's first release; see firstReleaseForSong(). Drives date sorting. */
  firstRelease?: SongFirstRelease;
  /** The work's Single, else its Album; what the index shows. */
  homeRelease?: SongFirstRelease;
  /** Release order rank and track position of firstRelease, for stable date ties. */
  releaseRank?: number;
  trackPosition?: number;
  /** Normalized search fields, one per line. */
  search: string;
}

/** The minimum each browser-side record needs to search, filter and sort. */
export type SongIndexKey = Pick<SongIndexEntry, "id" | "titleJa" | "titleZh" | "categories" | "releaseRank" | "trackPosition" | "search"> & {
  date?: string;
};

export interface SongIndexState {
  query: string;
  categories: SongCategoryFilter[];
  sort: SongIndexSort;
}
export const defaultSongIndexState: SongIndexState = { query: "", categories: [], sort: "date-asc" };

const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const releaseTypeOrder = { single: 0, album: 1 } as const;
const collator = new Intl.Collator("ja", { numeric: true, sensitivity: "base", usage: "sort" });

/** Release order shared with releasesForSong(): date, Single before Album, number, ID. */
function compareReleases(a: ReleaseInput, b: ReleaseInput): number {
  return compareText(a.data.releaseDate, b.data.releaseDate)
    || releaseTypeOrder[a.data.releaseType] - releaseTypeOrder[b.data.releaseType]
    || a.data.releaseNumber - b.data.releaseNumber
    || compareText(a.id, b.id);
}

function versionCategories(version: Pick<SongVersionData, "formation" | "persona">): SongSubCategory[] {
  return subCategoryOrder.filter((category) => category === "unit" ? version.formation === "unit" : version.persona === "character");
}

/**
 * The Song's Versions. A Song that declares none has one implicit `original`
 * Version with no performer or category data.
 */
export function resolveSongVersions(data: SongInput["data"]): SongVersionView[] {
  const declared = data.versions ?? [];
  const versions = declared.length > 0 ? declared : [{ id: "original", kind: "original" as const }];
  return versions.map((version) => {
    const performers = "performers" in version ? version.performers ?? [] : [];
    const unit = "unit" in version ? version.unit : undefined;
    const names = performers.map(({ name }) => name).join("、");
    return {
      ...version,
      declared: declared.length > 0,
      name: ("label" in version && version.label) || ("titleJa" in version && version.titleJa) || versionKindLabels[version.kind],
      performers,
      categories: versionCategories(version),
      performerText: unit ?? (names || undefined),
    };
  });
}

/** Linked Songs of a Release in first-appearance order: Edition, disc, track number. */
export function songIdsInRelease(release: ReleaseInput): string[] {
  const positions = new Map<string, number>();
  release.data.editions.forEach((edition, editionIndex) => edition.audioDiscs.forEach((disc, discIndex) => {
    for (const track of disc.tracks) {
      if (!track.song) continue;
      const position = editionIndex * 1_000_000 + discIndex * 1_000 + track.number;
      positions.set(track.song, Math.min(positions.get(track.song) ?? Infinity, position));
    }
  }));
  return [...positions].sort((a, b) => a[1] - b[1] || compareText(a[0], b[0])).map(([id]) => id);
}

/**
 * The work's first release. When the first Version is the `original`, only its
 * tracks count, so a re-recording never stands in for the work's debut; if the
 * original is in no catalogued Release, the date is unknown. Otherwise (no
 * declared original) the earliest track of any Version counts. Off-vocal tracks
 * belong to their Version like any other track.
 */
/**
 * The Release a Song is shown as belonging to: its earliest Single, else its
 * earliest Album. Follows the same Version rule as firstReleaseForSong(): when the
 * first Version is the original, only its tracks count.
 */
export function homeReleaseForSong(versions: readonly SongVersionView[]): SongFirstRelease | undefined {
  if (versions[0]?.kind === "original") return versions[0].homeRelease;
  const homes = versions.map(({ homeRelease }) => homeRelease).filter((release) => release !== undefined);
  return homes.find(({ releaseType }) => releaseType === "single") ?? homes.find(({ releaseType }) => releaseType === "album");
}

export function firstReleaseForSong(versions: readonly SongVersionView[]): SongFirstRelease | undefined {
  if (versions[0]?.kind === "original") return versions[0].firstRelease;
  return versions.map(({ firstRelease }) => firstRelease).filter((release) => release !== undefined)
    .sort((a, b) => compareText(a.date, b.date))[0];
}

/** Normalize for search: NFKC, case, katakana as hiragana, no spaces or punctuation. */
export function normalizeSearchText(text: string): string {
  return text.normalize("NFKC").toLowerCase()
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

/** Every space-separated term must appear within one field. */
export function songMatchesQuery(search: string, query: string): boolean {
  const terms = query.split(/\s+/).map(normalizeSearchText).filter(Boolean);
  if (terms.length === 0) return true;
  const fields = search.split("\n");
  return terms.every((term) => fields.some((field) => field.includes(term)));
}

/** Build one entry per Song (the work), with its Versions nested, never one per Version. */
export function buildSongIndex(songs: readonly SongInput[], releases: readonly ReleaseInput[]): SongIndexEntry[] {
  const versionsBySong = new Map(songs.map((song) => [song.id, resolveSongVersions(song.data)]));
  const sortedReleases = [...releases].sort(compareReleases);
  const releaseRank = new Map(sortedReleases.map((release, index) => [release.id, index]));
  const trackPositions = new Map<string, number>();

  // Releases in order, so the first release seen for a Version is its earliest.
  for (const release of sortedReleases) {
    songIdsInRelease(release).forEach((songId, position) => {
      if (!trackPositions.has(`${release.id}\n${songId}`)) trackPositions.set(`${release.id}\n${songId}`, position);
    });
    for (const edition of release.data.editions) {
      for (const disc of edition.audioDiscs) {
        for (const track of disc.tracks) {
          const versions = track.song ? versionsBySong.get(track.song) : undefined;
          const version = versions?.find(({ id }) => id === (track.version ?? versions[0].id));
          if (!version) continue;
          const info: SongFirstRelease = {
            releaseId: release.id,
            href: releaseHref(release.id),
            label: releaseLabel(release.data),
            titleJa: release.data.titleJa,
            date: release.data.releaseDate,
            releaseType: release.data.releaseType,
          };
          version.firstRelease ??= info;
          // Releases arrive in date order: keep the first Single, else the first Album.
          if (!version.homeRelease || (version.homeRelease.releaseType === "album" && info.releaseType === "single")) version.homeRelease = info;
        }
      }
    }
  }

  return songs.map(({ id, data }) => {
    const versions = versionsBySong.get(id)!;
    const categories: SongCategory[] = [
      ...(data.origin ? [data.origin] : []),
      ...subCategoryOrder.filter((category) => versions.some((version) => version.categories.includes(category))),
    ];
    const firstRelease = firstReleaseForSong(versions);
    const homeRelease = homeReleaseForSong(versions);
    const fields = [
      data.titleJa, data.titleZh, data.coverOf?.artist, data.coverOf?.titleJa,
      ...versions.flatMap((version) => [
        version.titleJa, version.titleZh, version.label, version.unit,
        version.declared && version.kind !== "original" ? versionKindLabels[version.kind] : undefined,
        ...version.performers.map(({ name }) => name),
      ]),
    ];
    return {
      id,
      href: `/discography/songs/${id}/`,
      titleJa: data.titleJa,
      ...(data.titleZh ? { titleZh: data.titleZh } : {}),
      ...(data.origin ? { origin: data.origin } : {}),
      ...(data.coverOf ? { coverOf: data.coverOf } : {}),
      categories,
      versions,
      ...(homeRelease ? { homeRelease } : {}),
      ...(firstRelease ? {
        firstRelease,
        releaseRank: releaseRank.get(firstRelease.releaseId),
        trackPosition: trackPositions.get(`${firstRelease.releaseId}\n${id}`),
      } : {}),
      search: [...new Set(fields.filter((field) => field !== undefined).map(normalizeSearchText).filter(Boolean))].join("\n"),
    };
  });
}

export function toSongIndexKey(entry: SongIndexEntry): SongIndexKey {
  return {
    id: entry.id,
    titleJa: entry.titleJa,
    ...(entry.titleZh ? { titleZh: entry.titleZh } : {}),
    categories: entry.categories,
    ...(entry.firstRelease ? { date: entry.firstRelease.date, releaseRank: entry.releaseRank, trackPosition: entry.trackPosition } : {}),
    search: entry.search,
  };
}

/** Japanese title, then Chinese title, then ID: stable whatever the input order. */
function compareByName(a: SongIndexKey, b: SongIndexKey): number {
  return collator.compare(a.titleJa, b.titleJa) || collator.compare(a.titleZh ?? "", b.titleZh ?? "") || compareText(a.id, b.id);
}

/** Dated songs by first release (Release order, then track order); undated songs last, by name. */
function compareByDate(direction: 1 | -1) {
  return (a: SongIndexKey, b: SongIndexKey): number => {
    if (!a.date || !b.date) return a.date ? -1 : b.date ? 1 : compareByName(a, b);
    return direction * (compareText(a.date, b.date)
      || (a.releaseRank ?? 0) - (b.releaseRank ?? 0)
      || (a.trackPosition ?? 0) - (b.trackPosition ?? 0))
      || compareByName(a, b);
  };
}

/**
 * Apply search, categories and sort together. Within a level, selections combine
 * with OR; the kind level and the sub-category level combine with AND. A song
 * with no recorded kind matches no kind filter.
 */
export function filterSongIndex<T extends SongIndexKey>(keys: readonly T[], state: SongIndexState): T[] {
  const kinds = state.categories.filter((value) => kindValues.has(value));
  const subs = state.categories.filter((value) => !kindValues.has(value));
  return keys
    .filter((key) => {
      return (kinds.length === 0 || key.categories.some((category) => kinds.includes(category)))
        && (subs.length === 0 || key.categories.some((category) => subs.includes(category)));
    })
    .filter((key) => songMatchesQuery(key.search, state.query))
    .sort(state.sort === "name" ? compareByName : compareByDate(state.sort === "date-desc" ? -1 : 1));
}

const categoryValues = new Set(songCategoryOptions.map(({ value }) => value));
const sortValues = new Set(songSortOptions.map(({ value }) => value));

/** Read `?q=&category=a,b&sort=` leniently: unknown values are dropped. */
export function parseSongIndexState(params: URLSearchParams): SongIndexState {
  const sort = params.get("sort");
  const categories = (params.get("category") ?? "").split(",")
    .filter((value): value is SongCategoryFilter => categoryValues.has(value as SongCategoryFilter));
  return {
    query: params.get("q") ?? "",
    categories: songCategoryOptions.map(({ value }) => value).filter((value) => categories.includes(value)),
    sort: sort && sortValues.has(sort as SongIndexSort) ? sort as SongIndexSort : defaultSongIndexState.sort,
  };
}

/** The query string for a state, omitting defaults; "" for the default state. */
export function serializeSongIndexState(state: SongIndexState): string {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.categories.length) params.set("category", state.categories.join(","));
  if (state.sort !== defaultSongIndexState.sort) params.set("sort", state.sort);
  const search = params.toString();
  return search ? `?${search}` : "";
}

/** Normalized search fields of one Version, so the page can reveal the Version a query hit. */
export function versionSearchText(version: SongVersionView): string {
  return [version.titleJa, version.titleZh, version.label, version.unit,
    version.kind !== "original" ? versionKindLabels[version.kind] : undefined,
    ...version.performers.map(({ name }) => name)]
    .filter((field) => field !== undefined).map(normalizeSearchText).filter(Boolean).join("\n");
}

export interface SongContextItem { label: string; href: string; current?: boolean }

/**
 * Song Detail side navigation: a link to the Song Index, then at most `radius`
 * songs on each side of the current one in default index order, so the list
 * stays short however many songs the wiki holds.
 */
export function songContextItems(entries: readonly SongIndexEntry[], currentId: string, radius = 4): SongContextItem[] {
  const ordered = filterSongIndex(entries.map((entry) => ({ ...toSongIndexKey(entry), entry })), defaultSongIndexState);
  const index = ordered.findIndex(({ id }) => id === currentId);
  const start = Math.max(0, Math.min(index - radius, ordered.length - radius * 2 - 1));
  return [
    { label: "全部歌曲", href: "/discography/songs/" },
    ...ordered.slice(start, start + radius * 2 + 1).map(({ entry }) => ({
      label: entry.titleJa,
      href: entry.href,
      ...(entry.id === currentId ? { current: true } : {}),
    })),
  ];
}
