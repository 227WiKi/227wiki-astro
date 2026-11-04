import type { CollectionEntry } from "astro:content";
import type { Performer, SetlistEntry } from "./live-schema";

export interface PerformerView {
  type: Performer["type"];
  name: string;
  href?: string;
  avatar?: string;
}
export type SetlistEntryView = Exclude<SetlistEntry, { type: "song" }> | {
  type: "song";
  number?: number | string;
  titleJa: string;
  href?: string;
  performers?: PerformerView[];
};
export interface ShowView {
  id: string;
  date: string;
  venue: string;
  label?: string;
  setlist?: SetlistEntryView[];
  cast?: PerformerView[];
}

/** Run before generating any Live routes; never emit dangling entity links. */
export function assertLiveReferences(
  events: readonly CollectionEntry<"liveEvents">[],
  songs: readonly CollectionEntry<"songs">[],
  members: readonly CollectionEntry<"members">[],
): void {
  const songMap = new Map(songs.map((song) => [song.id, song]));
  const memberIds = new Set(members.map(({ id }) => id));
  const errors: string[] = [];
  function checkCast(cast: readonly Performer[] | undefined, at: string) {
    for (const person of cast ?? []) {
      if (person.type === "member" && person.ref && !memberIds.has(person.ref)) {
        errors.push(`${at}: unknown Member "${person.ref}"`);
      }
    }
  }
  for (const event of events) {
    checkCast(event.data.cast, event.id);
    for (const show of event.data.shows) {
      const at = `${event.id}/${show.id}`;
      checkCast(show.cast, at);
      for (const entry of show.setlist ?? []) {
        if (entry.type !== "song") continue;
        checkCast(entry.performers, `${at}/${entry.titleJa}`);
        if (!entry.song) continue;
        const song = songMap.get(entry.song);
        if (!song) errors.push(`${at}: unknown Song "${entry.song}"`);
        else if (song.data.titleJa.normalize("NFC").trim() !== entry.titleJa.normalize("NFC").trim()) {
          errors.push(`${at}: "${entry.titleJa}" does not match Song "${song.data.titleJa}" (${entry.song})`);
        }
      }
    }
  }
  if (errors.length) throw new Error(`Invalid Live references:\n${errors.join("\n")}`);
}

/**
 * DOM ID of a Show on Live Detail. Show IDs already carry a `show-` prefix in
 * content, so anchors look like `#show-show-2026-04-04-1`; the format predates
 * deep links and is kept so existing URLs stay valid.
 */
export function showAnchorId(showId: string): string {
  return `show-${showId}`;
}

export function showHref(liveId: string, showId: string): string {
  return `/live/${liveId}/#${showAnchorId(showId)}`;
}

/** Resolve a location hash to one of the given Show IDs; unknown or malformed hashes return undefined. */
export function showIdFromHash(hash: string, showIds: readonly string[]): string | undefined {
  let anchor: string;
  try {
    anchor = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return undefined;
  }
  if (!anchor) return undefined;
  return showIds.find((showId) => showAnchorId(showId) === anchor);
}

export function showDisplayLabels(shows: readonly ShowView[]): string[] {
  // Venue and stable IDs distinguish records without inventing a part or time.
  const labels = shows.map((show) => show.label ?? show.venue);
  return labels.map((label, index) => labels.filter((value) => value === label).length > 1
    ? `${label} (${shows[index].id})` : label);
}
