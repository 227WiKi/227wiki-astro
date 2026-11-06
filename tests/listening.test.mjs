import test from "node:test";
import assert from "node:assert/strict";
import { getListeningEmbed, prepareListeningLinks, preferredListeningEntry } from "../src/lib/listening.ts";
import { apple, spotify, listeningFixtures } from "./fixtures/listening.ts";

const id = "0Lr4kGOYn9l83EjuK6cZFQ";
const spotifyEmbed = `https://open.spotify.com/embed/track/${id}`;

test("default player prefers available Apple Music and falls back to another playable provider", () => {
  assert.equal(preferredListeningEntry(prepareListeningLinks([spotify, apple])).provider, "apple-music");
  assert.equal(preferredListeningEntry(prepareListeningLinks([spotify])).provider, "spotify");
  assert.equal(preferredListeningEntry(prepareListeningLinks([{ ...apple, embedUrl: undefined }, spotify])).provider, "spotify");
  assert.equal(preferredListeningEntry(prepareListeningLinks(listeningFixtures.external)), undefined);
  assert.equal(preferredListeningEntry([]), undefined);
});

test("Spotify standard Track and explicit official Embed URLs yield a single canonical audio player", () => {
  for (const url of [`https://open.spotify.com/track/${id}`, spotify.url, `${spotifyEmbed}/?utm_source=generator&autoplay=1#fragment`]) {
    assert.deepEqual(getListeningEmbed({ ...spotify, url }), { provider: "spotify", url: spotifyEmbed, height: 152 });
  }
  assert.equal(getListeningEmbed({ ...spotify, embedUrl: `${spotifyEmbed}?theme=0` }).url, spotifyEmbed);
});

test("Apple requires an explicit song Embed; marketing/tracking/autoplay parameters are not forwarded", () => {
  assert.equal(getListeningEmbed({ ...apple, embedUrl: undefined }), undefined);
  assert.equal(getListeningEmbed(apple).url, apple.embedUrl);
  assert.deepEqual(getListeningEmbed({ ...apple, embedUrl: "https://embed.music.apple.com/jp/song/example/123?autoplay=true&itsct=music_box#hash" }), {
    provider: "apple-music", url: "https://embed.music.apple.com/jp/song/example/123", height: 175,
  });
  assert.equal(getListeningEmbed({ ...apple, embedUrl: "https://embed.music.apple.com/jp/song/123" }).height, 175);
});

test("unsupported or ambiguous Apple paths safely retain only the original link", () => {
  for (const embedUrl of [apple.url, "https://embed.music.apple.com/us/album/example/123", "https://embed.music.apple.com/us/playlist/example/123", "https://embed.music.apple.com/us/album/example/123?i=abc", "https://embed.music.apple.com/us/album/example/123?i=1&i=2", "<iframe src='https://embed.music.apple.com/us/song/123'></iframe>", "not a URL"]) {
    assert.equal(getListeningEmbed({ ...apple, embedUrl }), undefined, embedUrl);
  }
});

test("official hostname, HTTPS, credentials and ports are checked before any iframe URL is produced", () => {
  for (const link of [apple, { ...spotify, embedUrl: spotifyEmbed }]) {
    const original = new URL(link.embedUrl);
    for (const prefix of ["http://", "javascript:", "https://user:secret@", "https://"]) {
      const suffixes = prefix === "https://" ? [".evil.example", ":444", "."] : [""];
      for (const suffix of suffixes) {
        const embedUrl = `${prefix}${original.hostname}${suffix}${original.pathname}${original.search}`;
        assert.equal(getListeningEmbed({ ...link, embedUrl }), undefined, embedUrl);
      }
    }
  }
});

test("Spotify short links and unsupported content cannot be guessed or redirected into an iframe", () => {
  for (const url of ["https://spotify.link/example", "https://spoti.fi/example", `http://open.spotify.com/track/${id}`, `https://open.spotify.com/album/${id}`, `https://open.spotify.com/track/${id}/extra`, "https://open.spotify.com/track/short", `https://open.spotify.com/intl-ja/track/${id}`]) {
    assert.equal(getListeningEmbed({ ...spotify, url }), undefined, url);
  }
  assert.equal(getListeningEmbed({ ...spotify, embedUrl: spotify.url }), undefined, "explicit embedUrl must itself be an embed path");
  assert.equal(getListeningEmbed({ ...spotify, embedUrl: "https://invalid.example/", url: spotify.url }), undefined, "invalid explicit Embed falls back to the original link");
});

test("other platforms remain external even if given an official player URL", () => {
  for (const provider of ["youtube-music", "youtube", "bilibili", "other"]) {
    assert.equal(getListeningEmbed({ ...spotify, provider, embedUrl: spotifyEmbed }), undefined);
  }
});

test("isolated fixture scenarios preserve every distinct original link and only expose valid embeds", () => {
  const expected = { apple: [1, 1], spotify: [1, 1], both: [2, 2], external: [2, 0], others: [2, 0], empty: [0, 0], invalid: [2, 0], duplicates: [2, 2] };
  for (const [name, links] of Object.entries(listeningFixtures)) {
    const entries = prepareListeningLinks(links);
    assert.deepEqual([entries.length, entries.filter((entry) => entry.embed).length], expected[name], name);
    assert.deepEqual(new Set(entries.map((entry) => entry.url)), new Set(links.map((entry) => entry.url)), `${name}: preserve original external URLs`);
  }
});

test("duplicate links prefer a valid explicit Embed; distinct links on the same platform survive", () => {
  const links = [{ ...apple, embedUrl: undefined }, apple, { ...spotify }, { ...spotify, url: "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl" }];
  const before = structuredClone(links);
  const entries = prepareListeningLinks(links);
  assert.equal(entries.length, 3);
  assert(entries.every((entry) => entry.embed));
  assert.deepEqual(links, before, "do not mutate content");
});
