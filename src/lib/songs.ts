import type { CollectionEntry } from "astro:content";

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

/** Filtering at Release level includes each work once, regardless of editions. */
export function releasesForSong(releases: readonly CollectionEntry<"releases">[], songId: string) {
  return releases.filter(({ data }) => data.editions.some((edition) =>
    edition.audioDiscs.some((disc) => disc.tracks.some((track) => track.song === songId)),
  )).sort((a, b) => a.data.releaseDate.localeCompare(b.data.releaseDate));
}
