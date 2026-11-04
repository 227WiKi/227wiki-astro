import test from "node:test";
import assert from "node:assert/strict";
import { getLiveAppearancesForSong, groupLiveAppearancesByYear, splitLiveHistory } from "../src/lib/songs.ts";
import { showAnchorId, showHref, showIdFromHash } from "../src/lib/live-detail.ts";

// Isolated fixtures: never written to src/content.
const linked = (song, titleJa = song) => ({ type: "song", titleJa, song });
const unlinked = (titleJa) => ({ type: "song", titleJa });
const live = (id, shows, extra = {}) => ({ id, data: { titleJa: `${id} タイトル`, kind: "live", shows, ...extra } });

const events = [
  live("2024/single", [{ id: "show-2024-05-01-1", date: "2024-05-01", venue: "会場A", setlist: [
    { type: "section", label: "Encore" }, linked("target"), linked("other"), { type: "note", text: "MC" },
  ] }]),
  live("2025/tour", [
    { id: "show-2025-03-01-1", date: "2025-03-01", label: "大阪", venue: "Zepp Osaka", setlist: [linked("target")] },
    { id: "show-2025-03-08-1", date: "2025-03-08", label: "東京", venue: "Zepp Tokyo", setlist: [linked("target"), linked("target")] },
    { id: "show-2025-03-15-1", date: "2025-03-15", label: "名古屋", venue: "Zepp Nagoya" },
  ], { format: "tour" }),
  live("2025/same-day", [
    { id: "show-2025-06-01-2", date: "2025-06-01", label: "夜场", venue: "会場B", setlist: [linked("target")] },
    { id: "show-2025-06-01-1", date: "2025-06-01", label: "昼场", venue: "会場B", setlist: [linked("target")] },
  ]),
  live("2025/another-same-day", [{ id: "show-2025-06-01-1", date: "2025-06-01", venue: "会場C", setlist: [linked("target")] }]),
  live("2026/unlinked", [{ id: "show-2026-01-01-1", date: "2026-01-01", venue: "会場D", setlist: [unlinked("target"), linked("other")] }]),
];

test("only setlist entries whose song equals the Song ID are linked", () => {
  const rows = getLiveAppearancesForSong(events, "target");
  assert(!rows.some(({ liveId }) => liveId === "2026/unlinked"), "title match must not create a link");
  assert(!rows.some(({ showId }) => showId === "show-2025-03-15-1"), "missing setlist is not an appearance");
  assert.deepEqual(getLiveAppearancesForSong(events, "other").map(({ liveId }) => liveId), ["2026/unlinked", "2024/single"]);
  assert.deepEqual(getLiveAppearancesForSong(events, "missing"), []);
  assert.deepEqual(getLiveAppearancesForSong([live("empty", [{ id: "s", date: "2024-01-01", venue: "v" }])], "target"), []);
});

test("rows are one per Show, newest first, with stable same-day order", () => {
  const rows = getLiveAppearancesForSong(events, "target");
  assert.deepEqual(rows.map(({ liveId, showId }) => `${liveId}#${showId}`), [
    "2025/another-same-day#show-2025-06-01-1",
    "2025/same-day#show-2025-06-01-2", // source order within an event, not ID order
    "2025/same-day#show-2025-06-01-1",
    "2025/tour#show-2025-03-08-1",
    "2025/tour#show-2025-03-01-1",
    "2024/single#show-2024-05-01-1",
  ]);
  assert.deepEqual(getLiveAppearancesForSong([...events].reverse(), "target"), rows, "input order must not change output");
  const tokyo = rows.find(({ showId }) => showId === "show-2025-03-08-1");
  assert.deepEqual(tokyo, {
    liveId: "2025/tour", showId: "show-2025-03-08-1", date: "2025-03-08", liveTitle: "2025/tour タイトル",
    venue: "Zepp Tokyo", showLabel: "東京", liveFormat: "tour", occurrences: 2,
    href: "/live/2025/tour/#show-show-2025-03-08-1",
  });
  assert(!("showLabel" in rows.at(-1)) && !("liveFormat" in rows.at(-1)));
});

test("duplicate input events collapse into one row per Show", () => {
  const rows = getLiveAppearancesForSong([events[0], events[0]], "target");
  assert.equal(rows.length, 1);
});

test("year groups keep every Show exactly once", () => {
  const rows = getLiveAppearancesForSong(events, "target");
  const groups = groupLiveAppearancesByYear(rows);
  assert.deepEqual(groups.map(({ year, appearances }) => [year, appearances.length]), [["2025", 5], ["2024", 1]]);
  assert.equal(groups.flatMap(({ appearances }) => appearances).length, rows.length);
  assert.equal(groups.flatMap(({ lives }) => lives.flatMap(({ appearances }) => appearances)).length, rows.length);
  // A reprise is one Show row, with the repeat kept as a count.
  assert.equal(rows.length, 6);
  assert.equal(rows.reduce((total, { occurrences }) => total + occurrences, 0), 7);
});

test("each LiveEvent becomes one card per year with chronological Show links", () => {
  const [y2025, y2024] = groupLiveAppearancesByYear(getLiveAppearancesForSong(events, "target"));
  assert.deepEqual(y2025.lives.map(({ liveId }) => liveId), ["2025/another-same-day", "2025/same-day", "2025/tour"]);
  const tour = y2025.lives[2];
  assert.deepEqual(tour.appearances.map(({ showId }) => showId), ["show-2025-03-01-1", "show-2025-03-08-1"]);
  assert.equal(tour.href, "/live/2025/tour/", "multi-Show card title opens the Live page");
  assert.deepEqual(tour.venues, ["Zepp Osaka", "Zepp Tokyo"]);
  // Same-day source order is kept inside the card.
  assert.deepEqual(y2025.lives[1].appearances.map(({ showLabel }) => showLabel), ["夜场", "昼场"]);
  assert.equal(y2024.lives[0].href, "/live/2024/single/#show-show-2024-05-01-1", "single-Show card links to the Show");
  const crossYear = groupLiveAppearancesByYear(getLiveAppearancesForSong([
    live("x", [{ id: "a", date: "2024-12-31", venue: "v", setlist: [linked("t")] }, { id: "b", date: "2025-01-01", venue: "v", setlist: [linked("t")] }]),
  ], "t"));
  assert.deepEqual(crossYear.map(({ year, lives }) => [year, lives.length]), [["2025", 1], ["2024", 1]]);
});

test("long histories collapse whole older years by card count; short ones stay visible", () => {
  const group = (year, cards) => ({ year, appearances: [], lives: Array.from({ length: cards }, (_, i) => ({ liveId: `${year}-${i}` })) });
  const short = [group("2022", 1), group("2021", 7)];
  assert.deepEqual(splitLiveHistory(short), { visible: short, hidden: [] });
  const long = [group("2026", 2), group("2025", 3), group("2024", 4), group("2023", 9)];
  const { visible, hidden } = splitLiveHistory(long);
  assert.deepEqual(visible.map(({ year }) => year), ["2026", "2025", "2024"]);
  assert.deepEqual(hidden.map(({ year }) => year), ["2023"]);
  assert.deepEqual(splitLiveHistory([group("2026", 10), group("2025", 5)]).visible.map(({ year }) => year), ["2026"]);
  const all = [...visible, ...hidden].flatMap(({ lives }) => lives);
  assert.equal(new Set(all.map(({ liveId }) => liveId)).size, 18, "no card lost or duplicated");
});

test("Show anchors resolve hashes for Accordion, Tabs and single-show Lives", () => {
  assert.equal(showAnchorId("show-2026-04-04-2"), "show-show-2026-04-04-2");
  assert.equal(showHref("2026/2026-live-15", "show-2026-04-04-2"), "/live/2026/2026-live-15/#show-show-2026-04-04-2");
  const ids = ["show-2026-04-04-1", "show-2026-04-04-2"];
  assert.equal(showIdFromHash("#show-show-2026-04-04-2", ids), "show-2026-04-04-2");
  assert.equal(showIdFromHash("show-show-2026-04-04-1", ids), "show-2026-04-04-1");
  assert.equal(showIdFromHash("#show-show-2026-04-04-%32", ids), "show-2026-04-04-2");
  for (const invalid of ["", "#", "#setlist", "#show-2026-04-04-2", "#show-show-9999", "#%E0%A4%A"]) {
    assert.equal(showIdFromHash(invalid, ids), undefined, invalid);
  }
});
