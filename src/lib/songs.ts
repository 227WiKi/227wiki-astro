import type { CollectionEntry } from "astro:content";
import { showHref } from "./live-detail.ts";

export type SongData = CollectionEntry<"songs">["data"];

/** Fail static route generation instead of emitting a broken canonical link. */
export function assertSongReferences(
  releases: readonly CollectionEntry<"releases">[],
  songs: readonly CollectionEntry<"songs">[],
): void {
  const songIds = new Set(songs.map(({ id }) => id));
  for (const release of releases) {
    for (const edition of release.data.editions) {
      for (const [index, disc] of edition.audioDiscs.entries()) {
        for (const track of disc.tracks) {
          if (track.song && !songIds.has(track.song)) {
            throw new Error(`Unknown Song "${track.song}" in Release "${release.id}", Edition "${edition.id}", disc ${index + 1}, track ${track.number}`);
          }
        }
      }
    }
  }
}

type ReleaseEntry = Pick<CollectionEntry<"releases">, "id" | "data">;

const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const releaseTypeOrder = { single: 0, album: 1 } as const;

/**
 * The Releases (Singles and Albums) that contain a Song, each exactly once.
 * Only tracks whose `song` equals the Song ID count, on any Edition or disc;
 * titles are never matched. Order: release date ascending; same date by
 * Single before Album, then release number, then Release ID, so the result
 * never depends on collection order.
 */
export function releasesForSong<T extends ReleaseEntry>(releases: readonly T[], songId: string): T[] {
  const matches = new Map<string, T>();
  for (const release of releases) {
    if (matches.has(release.id)) continue;
    const containsSong = release.data.editions.some((edition) =>
      edition.audioDiscs.some((disc) => disc.tracks.some((track) => track.song === songId)),
    );
    if (containsSong) matches.set(release.id, release);
  }
  return [...matches.values()].sort((a, b) =>
    compareText(a.data.releaseDate, b.data.releaseDate)
    || releaseTypeOrder[a.data.releaseType] - releaseTypeOrder[b.data.releaseType]
    || a.data.releaseNumber - b.data.releaseNumber
    || compareText(a.id, b.id),
  );
}

type LiveEventEntry = Pick<CollectionEntry<"liveEvents">, "id" | "data">;

/** One Show in which a Song was performed. A Show is one row regardless of reprises. */
export interface SongLiveAppearance {
  liveId: string;
  showId: string;
  date: string;
  liveTitle: string;
  venue: string;
  showLabel?: string;
  liveFormat?: "tour";
  /** Setlist entries linked to the Song within this Show (2+ for reprises). */
  occurrences: number;
  href: string;
}

/** One card: a LiveEvent's Shows within a year, in chronological order. */
export interface SongLiveEventGroup {
  liveId: string;
  liveTitle: string;
  /** Single-Show cards link straight to the Show; others to the Live page. */
  href: string;
  venues: string[];
  appearances: SongLiveAppearance[];
}

export interface SongLiveYearGroup {
  year: string;
  appearances: SongLiveAppearance[];
  lives: SongLiveEventGroup[];
}

/**
 * Derive a Song's Live history from Setlists. Only entries whose `song` equals
 * the Song ID count; unlinked titles and missing Setlists are never guessed.
 * Order: date descending; same date by Live ID, then the Show's source order.
 */
export function getLiveAppearancesForSong(
  liveEvents: readonly LiveEventEntry[],
  songId: string,
): SongLiveAppearance[] {
  const rows = new Map<string, SongLiveAppearance & { order: number }>();
  for (const { id: liveId, data } of liveEvents) {
    data.shows.forEach((show, order) => {
      const occurrences = show.setlist?.filter((entry) => entry.type === "song" && entry.song === songId).length ?? 0;
      if (occurrences === 0) return;
      const key = `${liveId}\u0000${show.id}`;
      const existing = rows.get(key);
      if (existing) {
        existing.occurrences += occurrences;
        return;
      }
      rows.set(key, {
        liveId,
        showId: show.id,
        date: show.date,
        liveTitle: data.titleJa,
        venue: show.venue,
        ...(show.label ? { showLabel: show.label } : {}),
        ...(data.format ? { liveFormat: data.format } : {}),
        occurrences,
        href: showHref(liveId, show.id),
        order,
      });
    });
  }
  return [...rows.values()]
    .sort((a, b) => compareText(b.date, a.date) || compareText(a.liveId, b.liveId) || a.order - b.order)
    .map(({ order: _order, ...appearance }) => appearance);
}

/**
 * Year groups preserve input order (newest first). Within a year, each LiveEvent
 * becomes one card positioned by its newest Show; its Shows read chronologically.
 */
export function groupLiveAppearancesByYear(appearances: readonly SongLiveAppearance[]): SongLiveYearGroup[] {
  type YearBucket = { appearances: SongLiveAppearance[]; lives: Map<string, SongLiveAppearance[]> };
  const years = new Map<string, YearBucket>();
  for (const appearance of appearances) {
    const year = appearance.date.slice(0, 4);
    const bucket: YearBucket = years.get(year) ?? { appearances: [], lives: new Map() };
    bucket.appearances.push(appearance);
    const shows = bucket.lives.get(appearance.liveId) ?? [];
    shows.push(appearance);
    bucket.lives.set(appearance.liveId, shows);
    years.set(year, bucket);
  }
  return [...years].map(([year, bucket]) => ({
    year,
    appearances: bucket.appearances,
    lives: [...bucket.lives].map(([liveId, items]): SongLiveEventGroup => {
      // Stable sort: chronological, while same-day Shows keep their source order.
      const shows = [...items].sort((a, b) => compareText(a.date, b.date));
      return {
        liveId,
        liveTitle: shows[0].liveTitle,
        href: shows.length === 1 ? shows[0].href : `/live/${liveId}/`,
        venues: [...new Set(shows.map(({ venue }) => venue))],
        appearances: shows,
      };
    }),
  }));
}

/**
 * Split year groups into an always-visible head and a collapsible tail, counted
 * in cards. Whole years are kept together so each year heading appears once.
 */
export function splitLiveHistory(
  groups: readonly SongLiveYearGroup[],
  { collapseAbove = 8, minVisible = 6 }: { collapseAbove?: number; minVisible?: number } = {},
): { visible: SongLiveYearGroup[]; hidden: SongLiveYearGroup[] } {
  const total = groups.reduce((count, group) => count + group.lives.length, 0);
  if (total <= collapseAbove) return { visible: [...groups], hidden: [] };
  let shown = 0;
  let index = 0;
  while (index < groups.length && shown < minVisible) shown += groups[index++].lives.length;
  return { visible: groups.slice(0, index), hidden: groups.slice(index) };
}
