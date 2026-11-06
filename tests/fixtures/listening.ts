import type { SongData } from "../../src/lib/songs.ts";
type ListeningLink = SongData["listeningLinks"][number];

// Official public examples for isolated UI testing, never Song → platform mappings.
export const apple: ListeningLink = {
  provider: "apple-music", label: "Apple Music",
  url: "https://music.apple.com/us/album/anti-hero/1649434004?i=1649434293",
  embedUrl: "https://embed.music.apple.com/us/album/anti-hero/1649434004?i=1649434293",
};
export const spotify: ListeningLink = {
  provider: "spotify", label: "Spotify",
  url: "https://open.spotify.com/track/0Lr4kGOYn9l83EjuK6cZFQ?si=example",
};
export const listeningFixtures: Record<string, ListeningLink[]> = {
  apple: [apple],
  spotify: [spotify],
  both: [apple, spotify],
  external: [{ ...apple, embedUrl: undefined }, { ...spotify, url: "https://spotify.link/example" }],
  others: [
    { provider: "youtube-music", label: "YouTube Music", url: "https://music.youtube.com/" },
    { provider: "bilibili", label: "Bilibili", url: "https://www.bilibili.com/" },
  ],
  empty: [],
  invalid: [
    { ...apple, embedUrl: "https://embed.music.apple.com.evil.example/us/song/123" },
    { ...spotify, embedUrl: "https://open.spotify.com/embed/album/0Lr4kGOYn9l83EjuK6cZFQ" },
  ],
  duplicates: [apple, { ...apple }, spotify, { ...spotify }],
};
