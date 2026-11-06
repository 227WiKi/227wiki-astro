import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "astro/zod";
import {
  buildSongIndex, defaultSongIndexState, filterSongIndex, normalizeSearchText, parseSongIndexState,
  resolveSongVersions, serializeSongIndexState, songContextItems, songMatchesQuery, toSongIndexKey, versionSearchText,
} from "../src/lib/song-index.ts";
import { checkSongClassification, songCoverOf, songOrigin, songVersions } from "../src/lib/song-schema.ts";
import { assertSongPerformerReferences, assertSongReferences } from "../src/lib/songs.ts";
import { assertLiveReferences } from "../src/lib/live-detail.ts";
import { fixtureReleases, fixtureSongs, scaleFixture } from "./fixtures/song-index.ts";

// Isolated fixtures only; production content is read, never written.
const index = buildSongIndex(fixtureSongs, fixtureReleases);
const keys = index.map(toSongIndexKey);
const byId = new Map(index.map((entry) => [entry.id, entry]));
const ids = (state) => filterSongIndex(keys, { ...defaultSongIndexState, ...state }).map(({ id }) => id);

test("schema keeps Versions, formation and persona explicit and consistent", () => {
  const ok = [{ id: "original", kind: "original", formation: "unit", unit: "U", persona: "member", performers: [{ type: "member", name: "A" }] }];
  assert(songVersions.safeParse(ok).success);
  assert(!songVersions.safeParse([...ok, ok[0]]).success, "duplicate Version IDs");
  assert(!songVersions.safeParse([{ id: "b", kind: "re-recording" }, { id: "a", kind: "original" }]).success, "original must come first");
  assert(!songVersions.safeParse([{ id: "a", kind: "original", formation: "solo", unit: "U" }]).success, "unit needs a Unit formation");
  assert(!songVersions.safeParse([{ id: "a", kind: "original", persona: "member", performers: [{ type: "character", name: "C" }] }]).success, "persona and performers agree");
  assert(!songVersions.safeParse([{ id: "a", kind: "original", performers: [{ type: "member", name: "A" }, { type: "member", name: "A" }] }]).success, "unique performers");
  assert(!songVersions.safeParse([{ id: "a", kind: "original", songType: "group" }]).success, "no catch-all type field");
  const song = z.object({ origin: songOrigin.optional(), coverOf: songCoverOf.optional() }).superRefine(checkSongClassification);
  assert(song.safeParse({}).success, "classification is optional");
  assert(song.safeParse({ origin: "cover", coverOf: { artist: "X" } }).success);
  assert(!song.safeParse({ coverOf: { artist: "X" } }).success, "coverOf requires origin: cover");
});

test("a Song without declared Versions has one implicit Version and no categories", () => {
  const [version] = resolveSongVersions({ titleJa: "x" });
  assert.equal(resolveSongVersions({ titleJa: "x" }).length, 1);
  assert.deepEqual({ id: version.id, kind: version.kind, declared: version.declared, categories: version.categories, performers: version.performers, performerText: version.performerText },
    { id: "original", kind: "original", declared: false, categories: [], performers: [], performerText: undefined });
  assert.deepEqual(byId.get("fixture-unclassified").categories, [], "unclassified is never Group by default");
});

test("categories: kind from origin, sub-categories from Versions, both explicit", () => {
  const categories = Object.fromEntries(index.map(({ id, categories }) => [id, categories]));
  assert.deepEqual(categories["fixture-group"], ["original"], "a group formation is not a category");
  assert.deepEqual(categories["fixture-unit-cover"], ["cover", "unit"], "covers can carry sub-categories");
  // A solo formation is not a category; the Character Version of the same Song is.
  assert.deepEqual(categories["fixture-solo"], ["original", "character"]);
  assert.deepEqual(categories["fixture-character-cover"], ["cover", "unit", "character"]);
  assert.deepEqual(categories["fixture-unclassified"], [], "no origin: no kind, never 原创曲 by default");
  // Titles never imply a category.
  const guessed = buildSongIndex([{ id: "t", data: { titleJa: "全員ソロカバー曲 Unit キャラ" } }], []);
  assert.deepEqual(guessed[0].categories, []);
  // Performer counts or types never imply a sub-category.
  const counted = buildSongIndex([{ id: "c", data: { titleJa: "c", versions: [{ id: "original", kind: "original", performers: [{ type: "member", name: "A" }, { type: "member", name: "B" }] }] } }], []);
  assert.deepEqual(counted[0].categories, []);
});

test("Member and Character credits stay separate, with or without references", () => {
  const solo = byId.get("fixture-solo");
  assert.deepEqual(solo.versions.map(({ persona, performers }) => [persona, performers.map(({ type }) => type)]), [["member", ["member"]], ["character", ["character"]]]);
  assert.equal(solo.versions[1].performerText, "テスト角色甲", "the Character name, never a voice actor");
  assert.equal(byId.get("fixture-unit-cover").versions[0].performerText, "テストユニット", "Unit name first");
  assert.equal(byId.get("fixture-rerecorded").versions[0].performerText, undefined, "no credits, no performer text");
  assert.doesNotThrow(() => assertSongPerformerReferences(fixtureSongs, []), "name-only credits need no Member");
  const withRef = [{ id: "s", data: { titleJa: "s", versions: [{ id: "original", kind: "original", performers: [{ type: "member", name: "A", ref: "alice" }, { type: "character", name: "C", ref: "future-character" }] }] } }];
  assert.doesNotThrow(() => assertSongPerformerReferences(withRef, [{ id: "alice" }]), "Character refs are reserved, not checked against Members");
  assert.throws(() => assertSongPerformerReferences(withRef, []), /unknown Member "alice"/);
});

test("one entry per Song: Versions and off-vocal tracks never duplicate it", () => {
  assert.equal(index.length, fixtureSongs.length);
  assert.equal(new Set(index.map(({ id }) => id)).size, index.length);
  assert.equal(byId.get("fixture-group").versions.length, 1, "an off-vocal track is not a Version");
  const rerecorded = byId.get("fixture-rerecorded");
  assert.deepEqual(rerecorded.versions.map(({ id, kind, name }) => [id, kind, name]), [
    ["original", "original", "原版"], ["2024", "re-recording", "2024 ver."], ["acoustic", "re-arrangement", "Acoustic ver."],
  ]);
  assert.deepEqual(rerecorded.versions.map(({ firstRelease }) => firstRelease?.releaseId), ["fixture-2nd-single", "fixture-2nd-album", "fixture-2nd-album"]);
  assert.equal(byId.get("fixture-solo").versions[1].firstRelease.releaseId, "fixture-1st-album", "a Version links to its own Release track");
});

test("a Song shows its Single, else its Album, by full title", () => {
  assert.equal(byId.get("fixture-group").homeRelease.titleJa, "fixture-1st-single テスト作品");
  assert.equal(byId.get("fixture-solo").homeRelease.releaseType, "album", "no Single: the Album");
  assert.equal(byId.get("fixture-solo").versions[1].homeRelease.releaseId, "fixture-1st-album");
  assert.equal(byId.get("fixture-only-rerecording").homeRelease, undefined, "an unreleased original has no home");
  // An Album before the Single still yields the Single.
  const album = { id: "a", data: { titleJa: "Album 名", releaseType: "album", releaseNumber: 1, releaseDate: "2018-01-01", editions: [{ id: "r", name: "r", audioDiscs: [{ tracks: [{ number: 1, titleJa: "s", song: "s" }] }] }] } };
  const single = { id: "b", data: { ...album.data, titleJa: "Single 名", releaseType: "single", releaseDate: "2019-01-01" } };
  const [entry] = buildSongIndex([{ id: "s", data: { titleJa: "s" } }], [single, album]);
  assert.equal(entry.homeRelease.titleJa, "Single 名");
  assert.equal(entry.firstRelease.titleJa, "Album 名", "sorting still uses the debut");
});

test("same title, different Songs: kept apart and ordered stably", () => {
  const same = index.filter(({ titleJa }) => titleJa === "同じ名前の歌");
  assert.deepEqual(same.map(({ id, firstRelease }) => [id, firstRelease.releaseId]), [["fixture-same-name-a", "fixture-2nd-single"], ["fixture-same-name-b", "fixture-1st-album"]]);
  // Equal Japanese titles fall back to the Chinese title (乙 before 甲 in collation), then the ID.
  assert.deepEqual(ids({ sort: "name", query: "同じ名前" }), ["fixture-same-name-b", "fixture-same-name-a"]);
  assert.deepEqual(filterSongIndex([...keys].reverse(), { ...defaultSongIndexState, sort: "name" }), filterSongIndex(keys, { ...defaultSongIndexState, sort: "name" }));
});

test("first release is the work's debut, not a re-recording; missing dates stay last", () => {
  assert.equal(byId.get("fixture-rerecorded").firstRelease.date, "2018-06-01");
  assert.equal(byId.get("fixture-only-rerecording").firstRelease, undefined, "no date is invented from a re-recording");
  assert.equal(byId.get("fixture-only-rerecording").versions[1].firstRelease.date, "2024-04-04", "the Version keeps its own date");
  // Without a declared original, the earliest Version counts.
  const noOriginal = buildSongIndex([{ id: "n", data: { titleJa: "n", versions: [{ id: "a", kind: "alternate-vocal" }, { id: "b", kind: "re-recording" }] } }],
    [fixtureReleases[3], { ...fixtureReleases[0], data: { ...fixtureReleases[0].data, editions: [{ id: "r", name: "r", audioDiscs: [{ tracks: [{ number: 1, titleJa: "n", song: "n", version: "b" }] }] }] } }]);
  assert.equal(noOriginal[0].firstRelease.date, "2018-01-10");
  const asc = ids({ sort: "date-asc" });
  assert.deepEqual(asc, [
    "fixture-group", "fixture-unit-cover", // same Release: track order
    "fixture-rerecorded", "fixture-same-name-a",
    "fixture-solo", "fixture-character-cover", "fixture-same-name-b",
    // Undated, by name in gojūon order: テ before と.
    "fixture-similar", "fixture-only-rerecording", "fixture-unclassified", "fixture-long-title",
  ]);
  const desc = ids({ sort: "date-desc" });
  assert.deepEqual(desc.slice(0, 7), asc.slice(0, 7).reverse());
  assert.deepEqual(desc.slice(7), asc.slice(7), "undated songs keep their place in both directions");
});

test("search: Japanese, Chinese, kana, width, case, spaces, Versions and performers", () => {
  assert.deepEqual(ids({ query: "テスト全員" }), ["fixture-group"]);
  assert.deepEqual(ids({ query: "测试全员" }), ["fixture-group"]);
  assert.deepEqual(ids({ query: "てすと全員" }), ["fixture-group"], "hiragana finds katakana");
  assert.deepEqual(ids({ query: "  ＴＥＳＴ　全員 " }).length, 0, "full-width Latin is normalized, not translated");
  assert.equal(normalizeSearchText("ＡＢＣ Ver."), "abcver");
  assert.deepEqual(ids({ query: "テスト 全員" }), ["fixture-group"], "terms may be separated by spaces");
  assert.deepEqual(ids({ query: "2024 VER" }), ["fixture-rerecorded", "fixture-only-rerecording"], "a Version label finds its Song once");
  assert.deepEqual(ids({ query: "重新录音" }), ["fixture-rerecorded", "fixture-only-rerecording"]);
  assert.deepEqual(ids({ query: "acoustic" }), ["fixture-rerecorded"]);
  assert.deepEqual(ids({ query: "テスト角色甲" }), ["fixture-solo", "fixture-character-cover"]);
  assert.deepEqual(ids({ query: "テスト原唱者" }), ["fixture-unit-cover", "fixture-character-cover"]);
  assert.deepEqual(ids({ query: "テストの歌" }), ["fixture-similar"], "similar titles do not cross-match");
  assert.deepEqual(ids({ query: "存在しない曲名" }), []);
  assert(songMatchesQuery(byId.get("fixture-group").search, ""));
  assert.equal(versionSearchText(byId.get("fixture-rerecorded").versions[1]).split("\n").includes("2024ver"), true);
});

test("filters: OR within a level, AND between kind and sub-category", () => {
  assert.deepEqual(ids({ categories: ["original"] }), ["fixture-group", "fixture-rerecorded", "fixture-solo"]);
  assert.deepEqual(ids({ categories: ["cover"] }), ["fixture-unit-cover", "fixture-character-cover"]);
  assert.equal(ids({ categories: ["original", "cover"] }).length, 5);
  assert.equal(ids({ categories: ["original", "cover"] }).length, 5, "songs without a kind match no kind filter");
  assert.deepEqual(ids({ categories: ["unit"] }), ["fixture-unit-cover", "fixture-character-cover"]);
  assert.deepEqual(ids({ categories: ["character"] }), ["fixture-solo", "fixture-character-cover"]);
  assert.deepEqual(ids({ categories: ["original", "character"] }), ["fixture-solo"], "原创曲 that are 角色曲");
  assert.deepEqual(ids({ categories: ["cover", "character"] }), ["fixture-character-cover"]);
  assert.deepEqual(ids({ categories: ["character"], query: "翻唱" }), ["fixture-character-cover"]);
  // Descending reverses track order within a Release too.
  assert.deepEqual(ids({ categories: ["unit", "character"], sort: "date-desc" }), ["fixture-character-cover", "fixture-solo", "fixture-unit-cover"]);
  assert.equal(ids({ categories: [] }).length, index.length, "clearing filters shows everything");
});

test("URL state round-trips and ignores unknown values", () => {
  const state = { query: "テスト 曲", categories: ["cover", "unit"], sort: "name" };
  assert.deepEqual(parseSongIndexState(new URLSearchParams(serializeSongIndexState(state))), state);
  assert.equal(serializeSongIndexState(defaultSongIndexState), "");
  assert.deepEqual(parseSongIndexState(new URLSearchParams("category=unit,bogus,group,cover&sort=popular")), { query: "", categories: ["cover", "unit"], sort: "date-asc" }, "group is no longer a category");
});

test("hundreds of songs filter and sort quickly and predictably", () => {
  const { songs, releases } = scaleFixture(600);
  const started = performance.now();
  const scaled = buildSongIndex(songs, releases).map(toSongIndexKey);
  const sorted = filterSongIndex(scaled, defaultSongIndexState);
  const filtered = filterSongIndex(scaled, { query: "テスト曲 1", categories: ["unit", "cover"], sort: "name" });
  const elapsed = performance.now() - started;
  assert.equal(sorted.length, 600);
  assert.equal(sorted.filter(({ date }) => !date).length, 60);
  assert(sorted.slice(-60).every(({ date }) => !date), "undated songs last");
  assert(filtered.length > 0 && filtered.every(({ categories }) => categories.some((c) => c === "unit" || c === "cover")));
  assert(elapsed < 1000, `took ${elapsed}ms`);
});

test("Song Detail side navigation stays short around the current song", () => {
  const { songs, releases } = scaleFixture(300);
  const entries = buildSongIndex(songs, releases);
  const items = songContextItems(entries, "fixture-scale-150");
  assert.equal(items[0].href, "/discography/songs/");
  assert.equal(items.length, 10);
  assert.equal(items.filter(({ current }) => current).length, 1);
  assert.equal(songContextItems(entries, "fixture-scale-0").length, 10, "the window shifts at the edges");
  assert.equal(songContextItems(buildSongIndex(fixtureSongs.slice(0, 2), []), "fixture-group").length, 3);
});

test("Release and track Version references are checked", () => {
  assert.doesNotThrow(() => assertSongReferences(fixtureReleases, fixtureSongs));
  const bad = structuredClone(fixtureReleases);
  bad[0].data.editions[0].audioDiscs[0].tracks[0].version = "missing";
  assert.throws(() => assertSongReferences(bad, fixtureSongs), /Unknown Version "missing"/);
  bad[0].data.editions[0].audioDiscs[0].tracks[0] = { number: 1, titleJa: "x", song: "fixture-unclassified", version: "original" };
  assert.throws(() => assertSongReferences(bad, fixtureSongs), /Unknown Version/, "only declared Versions are addressable");
});

const readCollection = (dir) => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []);
  return walk(dir).map((file) => ({
    id: path.relative(dir, file).replace(/\.md$/, ""),
    data: YAML.parse(fs.readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)[1]),
  }));
};

test("production songs keep their IDs, Release and Live links, and verified classification", () => {
  const songs = readCollection("src/content/songs");
  const releases = readCollection("src/content/releases");
  const events = readCollection("src/content/live-events");
  const members = readCollection("src/content/members");
  assert.doesNotThrow(() => assertSongReferences(releases, songs));
  assert.doesNotThrow(() => assertLiveReferences(events, songs, members));
  assert.doesNotThrow(() => assertSongPerformerReferences(songs, members));
  const real = buildSongIndex(songs, releases);
  assert.deepEqual(real.map(({ id, href }) => [id, href]).sort(), songs.map(({ id }) => [id, `/discography/songs/${id}/`]).sort());
  for (const entry of real) {
    assert.deepEqual(entry.categories, ["original"], `${entry.id} is a verified original group recording`);
    assert.equal(entry.versions[0].formation, "group");
    assert.equal(entry.versions[0].persona, "member");
    assert.equal(entry.versions.length, 1, `${entry.id}: off-vocal tracks are not Versions`);
    assert.equal(entry.firstRelease?.releaseId, "1st-single");
  }
  assert.deepEqual(filterSongIndex(real.map(toSongIndexKey), defaultSongIndexState).map(({ id }) => id),
    ["boku-wa-sonzai-shiteinakatta", "chikatetsu-teikou-shugi", "11nin-ga-atsumatta-riyuu"], "1st Single track order");
  assert.deepEqual(buildSongIndex([], releases), [], "an empty collection builds an empty index");
});
