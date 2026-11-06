// Song Detail infobox facts. Release facts come from the Song Index entry, so the
// infobox and the index always agree on a song's first release.
import type { CollectionEntry } from "astro:content";
import { formatReleaseDate, releaseCoverPath } from "./releases.ts";
import { songCategoryLabel, type SongIndexEntry, type SongVersionView } from "./song-index.ts";
import type { SongCoverOf } from "./song-schema.ts";

type ReleaseInput = Pick<CollectionEntry<"releases">, "id" | "data">;

export interface InfoboxPerformer {
  name: string;
  /** Only Members with an existing page link; Characters never do yet. */
  href?: string;
}

export interface SongInfoboxFacts {
  /** The first-release Release's cover, linked to that Release. */
  cover?: { path: string; href: string; alt: string };
  firstRelease?: { date: string; dateText: string; href: string; text: string };
  /** Facts of the first (default) Version; labelled per Version when there are several. */
  version?: {
    /** Set when the Song has several Versions, e.g. "原版". */
    name?: string;
    /** 小组曲 / 角色曲 of this Version. */
    subCategories?: string;
    unit?: string;
    performers: InfoboxPerformer[];
  };
  /** Names of every declared Version, only when there are two or more. */
  versionNames: string[];
  /** 原创曲 or 翻唱曲, only when the work's origin is recorded. */
  kind?: string;
  coverOf?: string;
}

const quoted = (title: string) => `《${title}》`;

function versionFacts(version: SongVersionView, multiple: boolean, memberIds: ReadonlySet<string>): SongInfoboxFacts["version"] {
  const performers = version.performers.map((performer) => ({
    name: performer.name,
    ...(performer.type === "member" && performer.ref && memberIds.has(performer.ref) ? { href: `/member/${performer.ref}/` } : {}),
  }));
  const subCategories = version.categories.length ? version.categories.map(songCategoryLabel).join("、") : undefined;
  if (!subCategories && !version.unit && performers.length === 0) return undefined;
  return {
    ...(multiple ? { name: version.name } : {}),
    ...(subCategories ? { subCategories } : {}),
    ...(version.unit ? { unit: version.unit } : {}),
    performers,
  };
}

const coverOfText = ({ artist, titleJa }: SongCoverOf) => titleJa ? `${artist}${quoted(titleJa)}` : artist;

export function songInfoboxFacts(
  entry: SongIndexEntry,
  releases: readonly ReleaseInput[],
  memberIds: ReadonlySet<string>,
): SongInfoboxFacts {
  const first = entry.firstRelease;
  const release = first ? releases.find(({ id }) => id === first.releaseId) : undefined;
  const coverPath = release ? releaseCoverPath(release.data) : undefined;
  // The Release's full title only; its type and number stay on the Release page.
  const releaseText = first?.titleJa;
  const multiple = entry.versions.length > 1;
  const version = versionFacts(entry.versions[0], multiple, memberIds);
  return {
    ...(first && coverPath ? { cover: { path: coverPath, href: first.href, alt: `${releaseText} 封面` } } : {}),
    ...(first ? { firstRelease: { date: first.date, dateText: formatReleaseDate(first.date), href: first.href, text: releaseText! } } : {}),
    ...(version ? { version } : {}),
    versionNames: multiple ? entry.versions.map(({ name }) => name) : [],
    ...(entry.origin ? { kind: songCategoryLabel(entry.origin) } : {}),
    ...(entry.origin === "cover" && entry.coverOf ? { coverOf: coverOfText(entry.coverOf) } : {}),
  };
}
