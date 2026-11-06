import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { buildSongIndex } from "../src/lib/song-index.ts";
import { songInfoboxFacts } from "../src/lib/song-infobox.ts";
import { fixtureReleases, fixtureSongs } from "./fixtures/song-index.ts";

// Isolated fixtures only; production content is read, never written.
const facts = (songs, releases, id, members = []) =>
  songInfoboxFacts(buildSongIndex(songs, releases).find((entry) => entry.id === id), releases, new Set(members));
const fixture = (id, members) => facts(fixtureSongs, fixtureReleases, id, members);
const withCover = (release, cover) => ({ ...release, data: { ...release.data, ...cover } });

test("first release comes from the Song Index entry: Single, Album, re-recording", () => {
  assert.deepEqual(fixture("fixture-group").firstRelease, {
    date: "2018-01-10", dateText: "2018.01.10", href: "/discography/releases/fixture-1st-single/",
    text: "fixture-1st-single テスト作品",
  });
  assert.equal(fixture("fixture-solo").firstRelease.text, "fixture-1st-album テスト作品", "first on an Album");
  assert.equal(fixture("fixture-rerecorded").firstRelease.date, "2018-06-01", "never the 2024 re-recording");
  assert.equal(fixture("fixture-only-rerecording").firstRelease, undefined, "no date invented");
  assert.equal(fixture("fixture-unclassified").firstRelease, undefined, "no Release link, no row");
  for (const entry of buildSongIndex(fixtureSongs, fixtureReleases)) {
    assert.equal(fixture(entry.id).firstRelease?.date, entry.firstRelease?.date, `${entry.id} agrees with the index`);
  }
});

test("later Albums, several Editions and same-day Releases keep the stable first release", () => {
  const track = { number: 1, titleJa: "s", song: "s" };
  const make = (id, releaseType, releaseNumber, releaseDate, editions = 1) => ({ id, data: {
    titleJa: id, releaseType, releaseNumber, releaseDate,
    editions: Array.from({ length: editions }, (_, i) => ({ id: `e${i}`, name: `e${i}`, audioDiscs: [{ tracks: [track] }] })),
  } });
  const releases = [make("album-later", "album", 1, "2020-01-01"), make("same-day-album", "album", 2, "2018-01-01"), make("same-day-single", "single", 3, "2018-01-01", 3)];
  const result = facts([{ id: "s", data: { titleJa: "s" } }], releases, "s");
  assert.equal(result.firstRelease.href, "/discography/releases/same-day-single/", "same day: Single first");
});

test("cover image uses the first-release Release, falling back to an Edition, else none", () => {
  assert.equal(fixture("fixture-group").cover, undefined, "a Release without a cover");
  const top = [withCover(fixtureReleases[0], { cover: "covers/single.jpg" }), ...fixtureReleases.slice(1)];
  assert.deepEqual(facts(fixtureSongs, top, "fixture-group").cover, {
    path: "covers/single.jpg", href: "/discography/releases/fixture-1st-single/", alt: "fixture-1st-single テスト作品 封面",
  });
  const edition = structuredClone(fixtureReleases);
  edition[0].data.editions[0].cover = "covers/edition.jpg";
  assert.equal(facts(fixtureSongs, edition, "fixture-group").cover.path, "covers/edition.jpg");
  // A later Release's cover never stands in.
  const later = [fixtureReleases[0], withCover(fixtureReleases[1], { cover: "covers/later.jpg" }), ...fixtureReleases.slice(2)];
  assert.equal(facts(fixtureSongs, later, "fixture-group").cover, undefined);
});

test("performers: first Version only, Member links only to existing pages, Characters never", () => {
  assert.equal(fixture("fixture-unclassified").version, undefined, "no Versions: no rows, never 未分类");
  assert.equal(fixture("fixture-same-name-a").version, undefined);
  assert.deepEqual(fixture("fixture-group").version, {
    performers: [{ name: "テスト成员A" }, { name: "テスト成员B" }, { name: "テスト成员C" }],
  });
  assert.deepEqual(fixture("fixture-unit-cover").version, {
    subCategories: "小组曲", unit: "テストユニット", performers: [{ name: "テスト成员A" }, { name: "テスト成员B" }],
  });
  assert.deepEqual(fixture("fixture-character-cover").version.subCategories, "小组曲、角色曲", "unit and character are separate sub-categories");
  assert(fixture("fixture-character-cover").version.performers.every(({ href }) => href === undefined));
  const linked = [{ id: "s", data: { titleJa: "s", versions: [{ id: "original", kind: "original", formation: "solo", performers: [
    { type: "member", name: "A", ref: "alice" }, { type: "member", name: "B", ref: "gone" }, { type: "character", name: "C", ref: "c" },
  ] }] } }];
  assert.deepEqual(facts(linked, [], "s", ["alice"]).version.performers, [{ name: "A", href: "/member/alice/" }, { name: "B" }, { name: "C" }]);
});

test("several Versions: facts are labelled by Version and the Versions are listed", () => {
  const solo = fixture("fixture-solo");
  assert.equal(solo.version.name, "原版");
  assert.equal(solo.version.subCategories, undefined, "the Character Version does not leak into the original's row");
  assert.deepEqual(solo.versionNames, ["原版", "キャラクター ver."]);
  assert.deepEqual(fixture("fixture-group").versionNames, [], "a single Version is not announced");
  assert.equal(fixture("fixture-group").version.name, undefined);
});

test("cover songs name the original; originals add no row", () => {
  assert.equal(fixture("fixture-unit-cover").coverOf, "テスト原唱者《テスト原曲》");
  assert.equal(fixture("fixture-character-cover").coverOf, "テスト原唱者");
  assert.equal(fixture("fixture-group").coverOf, undefined);
  assert.deepEqual([fixture("fixture-group").kind, fixture("fixture-unit-cover").kind, fixture("fixture-unclassified").kind], ["原创曲", "翻唱曲", undefined]);
});

test("production songs: first release is the 1st Single, off-vocal adds no Version", () => {
  const read = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => ({
    id: f.replace(/\.md$/, ""), data: YAML.parse(fs.readFileSync(path.join(dir, f), "utf8").match(/^---\n([\s\S]*?)\n---/)[1]),
  }));
  const songs = read("src/content/songs");
  const releases = read("src/content/releases");
  for (const song of songs) {
    const result = facts(songs, releases, song.id);
    assert.equal(result.firstRelease.href, "/discography/releases/1st-single/");
    assert.equal(result.firstRelease.dateText, "2017.09.20");
    assert.deepEqual(result.versionNames, []);
    assert.equal(result.version, undefined, "no performer data yet");
  }
});
