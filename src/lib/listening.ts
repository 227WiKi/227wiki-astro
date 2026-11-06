/** Content links remain usable independently of the optional player. */
export interface ListeningLink {
  provider: string;
  label: string;
  url: string;
  embedUrl?: string;
}

export interface ListeningEmbed {
  provider: "apple-music" | "spotify";
  url: string;
  height: number;
}

function officialUrl(value: string, hostname: string): URL | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== hostname || url.username || url.password || url.port) return;
    return url;
  } catch {
    return;
  }
}

/** Whitelist content paths and rebuild queries: never forward autoplay or arbitrary parameters. */
export function getListeningEmbed(link: Pick<ListeningLink, "provider" | "url" | "embedUrl">): ListeningEmbed | undefined {
  if (link.provider === "spotify") {
    const url = officialUrl(link.embedUrl ?? link.url, "open.spotify.com");
    if (!url) return;
    const path = link.embedUrl ? /^\/embed\/track\/([a-zA-Z0-9]{22})\/?$/ : /^\/(?:embed\/)?track\/([a-zA-Z0-9]{22})\/?$/;
    const id = url.pathname.match(path)?.[1];
    if (!id) return;
    return { provider: "spotify", url: `https://open.spotify.com/embed/track/${id}`, height: 152 };
  }
  if (link.provider === "apple-music" && link.embedUrl) {
    const url = officialUrl(link.embedUrl, "embed.music.apple.com");
    if (!url) return;
    // Apple-generated song players may use a song path or an album path with the song's i parameter.
    const match = url.pathname.match(/^\/([a-z]{2})\/(song|album)\/(?:[^/]+\/)?([1-9]\d*)\/?$/);
    if (!match) return;
    const trackIds = url.searchParams.getAll("i");
    if (trackIds.length > 1 || (trackIds.length === 1 && !/^[1-9]\d*$/.test(trackIds[0]))) return;
    if (match[2] === "album" && trackIds.length !== 1) return;
    const safe = new URL(url.pathname, "https://embed.music.apple.com");
    if (trackIds.length) safe.searchParams.set("i", trackIds[0]);
    return { provider: "apple-music", url: safe.href, height: 175 };
  }
}

/** Collapse exact duplicate links, retaining distinct editions/regions on the same platform. */
export function prepareListeningLinks(links: readonly ListeningLink[]) {
  const unique = new Map<string, ListeningLink & { embed?: ListeningEmbed }>();
  for (const link of links) {
    const key = `${link.provider}\n${link.url}`;
    const embed = getListeningEmbed(link);
    const previous = unique.get(key);
    if (!previous || (!previous.embed && embed)) unique.set(key, { ...link, embed });
  }
  return [...unique.values()];
}

/** Prefer Apple Music regardless of editorial link order; otherwise use the first playable link. */
export function preferredListeningEntry<T extends { provider: string; embed?: ListeningEmbed }>(entries: readonly T[]): T | undefined {
  return entries.find((entry) => entry.provider === "apple-music" && entry.embed)
    ?? entries.find((entry) => entry.embed);
}
