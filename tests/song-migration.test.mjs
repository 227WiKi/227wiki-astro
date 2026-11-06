import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { songLyricsSchema, assertSongLyrics } from "../src/lib/song-lyrics.ts";
import { buildSongIndex } from "../src/lib/song-index.ts";
import { releasesForSong, getLiveAppearancesForSong, assertSongReferences } from "../src/lib/songs.ts";

const read = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => f.endsWith(".md")).map((f) => {
  const [, frontmatter, body] = fs.readFileSync(path.join(dir, f), "utf8").split("---");
  return { id: f.replace(/\.md$/, ""), body, data: YAML.parse(frontmatter) };
});
const songs = read("src/content/songs");
const releases = read("src/content/releases");
const lives = read("src/content/live-events");
const lyrics = read("src/content/song-lyrics");
const ids = ["boku-wa-sonzai-shiteinakatta", "chikatetsu-teikou-shugi", "11nin-ga-atsumatta-riyuu"];

test("first single migration preserves the six-track editions, one recording per song and derived release dates", () => {
  assert.doesNotThrow(() => assertSongReferences(releases, songs));
  const single = releases.find(({ id }) => id === "1st-single");
  assert.deepEqual(single.data.editions.map(({ id }) => id), ["type-a", "type-b"]);
  for (const edition of single.data.editions) {
    assert.deepEqual(edition.audioDiscs[0].tracks.map(({ song }) => song), [...ids, ...ids]);
    assert(edition.audioDiscs[0].tracks.slice(3).every(({ variant }) => variant === "off-vocal"));
  }
  for (const [i, id] of ids.entries()) {
    const song = songs.find((song) => song.id === id);
    assert.equal(song.data.duration, ["4:15", "4:31", "4:00"][i]);
    assert.deepEqual(song.data.credits.lyricists, ["秋元康"]);
    assert.deepEqual(song.data.credits.composers, [["目黒良子"], ["大塚剛毅"], ["キタムラタケシ", "田上陽一"]][i]);
    assert.deepEqual(song.data.credits.arrangers, [["野中雄一"], ['野中"まさ"雄一'], ["田上陽一"]][i]);
    assert.equal(song.data.versions.length, 1);
    assert.equal(song.data.versions[0].id, "original");
    assert.equal(song.data.versions[0].performers, undefined, "never guess individual members");
    const entry = buildSongIndex(songs, releases).find((entry) => entry.id === id);
    assert.equal(entry.firstRelease.date, "2017-09-20");
    assert.equal(song.data.releaseDate, undefined, "date remains derived");
    const apple = song.data.listeningLinks.find(({ provider }) => provider === "apple-music");
    assert.equal(apple.embedUrl, `https://embed.music.apple.com/jp/song/${1537751448 + i}`);
    assert.equal(new URL(apple.url).pathname.split("/").at(-1), String(1537751448 + i));
    if (i === 0) {
      assert.deepEqual(song.data.videos.map(({ type }) => type), ["music-video", "lyric-video"]);
      assert(!song.data.videos.some(({ url }) => url.includes("BV1vZ4y1g7uS")));
    } else assert.deepEqual(song.data.videos, []);
    assert.deepEqual(releasesForSong(releases, id).map(({ id }) => id), i === 1 ? ["1st-single"] : ["1st-single", "1st-album"]);
    const appearances = getLiveAppearancesForSong(lives, id);
    assert(appearances.length > 0);
    assert.equal(new Set(appearances.map(({ href }) => href)).size, appearances.length);
    for (const row of appearances) {
      assert(lives.find(({ id }) => id === row.liveId).data.shows.some((show) => show.id === row.showId));
    }
  }
});

test("lyric entries preserve both languages and attribution without publishing unapproved texts", () => {
  assert.equal(lyrics.length, 6);
  for (const entry of lyrics) assert(songLyricsSchema.safeParse(entry.data).success);
  assert.doesNotThrow(() => assertSongLyrics(lyrics, songs));
  for (const id of ids) {
    const entries = lyrics.filter(({ data }) => data.song === id);
    assert.deepEqual(entries.map(({ data }) => data.language).sort(), ["ja", "zh-Hans"]);
    assert(entries.every(({ data, body }) => data.status === "permission-pending" && !body.trim()));
    assert(entries.find(({ data }) => data.language === "zh-Hans").data.attribution.includes("22/7中文应援站"));
  }
});

test("lyric validation rejects missing permissions, orphan references, duplicate languages and premature full texts", () => {
  const entry = lyrics[0];
  const data = { ...entry.data, status: "available" };
  assert.equal(songLyricsSchema.safeParse(data).success, false);
  assert.equal(songLyricsSchema.safeParse({ ...data, permission: "Author permission: fixture" }).success, true);
  assert.throws(() => assertSongLyrics([{ ...entry, data: { ...entry.data, song: "missing" } }], songs), /Unknown Song/);
  assert.throws(() => assertSongLyrics([entry, entry], songs), /Duplicate lyrics/);
  assert.throws(() => assertSongLyrics([{ ...entry, data }], songs), /Empty available/);
  assert.throws(() => assertSongLyrics([{ ...entry, body: "fixture text" }], songs), /Unapproved lyrics/);
});
