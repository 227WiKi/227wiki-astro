import test from "node:test";
import assert from "node:assert/strict";
import { releasesForSong } from "../src/lib/songs.ts";
import { formatReleaseDate, releaseCoverPath, releaseHref } from "../src/lib/releases.ts";

// Isolated fixtures: never written to src/content.
const track = (number, titleJa, extra = {}) => ({ number, titleJa, ...extra });
const edition = (id, tracks, extra = {}) => ({ id, name: id, audioDiscs: [{ tracks }], ...extra });
const release = (id, releaseType, releaseNumber, releaseDate, editions, extra = {}) => ({
  id, data: { titleJa: `${id} タイトル`, releaseType, releaseNumber, releaseDate, editions, ...extra },
});

const releases = [
  release("1st-album", "album", 1, "2021-07-14", [
    edition("limited-a", [track(1, "Overture"), track(2, "target", { song: "target" })]),
    edition("regular", [track(2, "target", { song: "target" })]),
  ]),
  release("1st-single", "single", 1, "2017-09-20", [
    edition("type-a", [track(1, "target", { song: "target" }), track(4, "target -off vocal ver.-", { song: "target", variant: "off-vocal" })]),
    edition("type-b", [track(1, "target", { song: "target" })]),
    edition("type-c", [track(1, "other", { song: "other" })]),
  ]),
  // Same date as the Album: Single first, then number, then ID.
  release("2nd-single", "single", 2, "2021-07-14", [edition("regular", [track(1, "target", { song: "target" })])]),
  release("best-b", "album", 3, "2023-01-01", [edition("regular", [track(1, "target", { song: "target" })])]),
  release("best-a", "album", 3, "2023-01-01", [edition("regular", [track(1, "target", { song: "target" })])]),
  // A matching title without a Song reference is not a link.
  release("3rd-single", "single", 3, "2018-01-01", [edition("regular", [track(1, "target")])]),
  // Only on a later disc of a non-first Edition.
  release("4th-single", "single", 4, "2019-01-01", [
    edition("regular", [track(1, "other", { song: "other" })]),
    { id: "limited", name: "limited", audioDiscs: [{ tracks: [track(1, "x")] }, { tracks: [track(1, "target", { song: "target" })] }] },
  ]),
];

test("each Release that references the Song appears exactly once", () => {
  const ids = releasesForSong(releases, "target").map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, "no duplicate Releases across Editions");
  assert(!ids.includes("3rd-single"), "title match must not create a link");
  assert(ids.includes("4th-single"), "any Edition and disc counts");
  assert.deepEqual(releasesForSong([releases[1], releases[1]], "target").map(({ id }) => id), ["1st-single"], "duplicate input collapses");
  assert.deepEqual(releasesForSong(releases, "other").map(({ id }) => id), ["1st-single", "4th-single"]);
  assert.deepEqual(releasesForSong(releases, "missing"), []);
  assert.deepEqual(releasesForSong([], "target"), []);
});

test("Releases are ordered by date with a stable tie-break", () => {
  const ids = releasesForSong(releases, "target").map(({ id }) => id);
  assert.deepEqual(ids, ["1st-single", "4th-single", "2nd-single", "1st-album", "best-a", "best-b"]);
  assert.deepEqual(releasesForSong([...releases].reverse(), "target").map(({ id }) => id), ids, "input order must not change output");
  // The original entries are returned, so callers keep full Release data.
  assert.equal(releasesForSong(releases, "target")[0], releases[1]);
});

test("Release card helpers", () => {
  assert.equal(releaseHref("1st-single"), "/discography/releases/1st-single/");
  assert.equal(formatReleaseDate("2017-09-20"), "2017.09.20");
  assert.equal(releaseCoverPath({ cover: "a.jpg", editions: [{ cover: "b.jpg" }] }), "a.jpg");
  assert.equal(releaseCoverPath({ editions: [{}, { cover: "b.jpg" }] }), "b.jpg");
  assert.equal(releaseCoverPath({ editions: [{}] }), undefined);
});
