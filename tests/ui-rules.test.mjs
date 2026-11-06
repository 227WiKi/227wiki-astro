// Static checks for docs/ui-rules.md. Each test name is quoted by the rule it checks.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

/** Files covered by source checks; inherited styles and rendered layout still need review. */
export const RULED_FILES = [
  "src/components/wiki/song/LyricsSection.astro",
  "src/pages/discography/songs/[slug].astro",
  "src/components/wiki/song/ListeningLinks.astro",
  "src/pages/lab/listening/[scenario].astro",
  "src/components/wiki/common/SectionCard.astro",
  "src/components/wiki/release/ReleaseInfobox.astro",
  "src/components/wiki/song/SongInfobox.astro",
  "src/components/wiki/live/LiveInfobox.astro",
  "src/components/wiki/common/PageHeader.astro",
  "src/components/site/StaticHeaderNav.astro",
  "src/components/wiki/member/VoiceSampleReferences.astro",
  "src/components/wiki/song/SongLiveHistory.astro",
  "src/components/wiki/song/SongLiveHistoryYear.astro",
  "src/components/wiki/song/SongLiveCard.tsx",
  "src/components/wiki/song/SongReleaseList.astro",
  "src/components/wiki/song/SongReleaseCard.tsx",
  "src/components/wiki/song/SongIndex.astro",
  "src/components/wiki/song/SongIndexItem.astro",
  "src/pages/discography/songs/index.astro",
  "src/pages/lab/song-index/[scenario].astro",
];

const sources = RULED_FILES.map((file) => ({ file, text: fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8") }));
const styleBlocks = (text) => [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]).join("\n");
const withoutComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

function eachFile(check) {
  for (const { file, text } of sources) check(file, withoutComments(text), styleBlocks(withoutComments(text)));
}

test("no capitals or wide letter spacing", () => {
  eachFile((file, text, css) => {
    assert(!/\buppercase\b|text-transform:\s*uppercase/.test(text), `${file}: uppercase`);
    assert(!/\btracking-(wide|wider|widest|\[)/.test(text), `${file}: wide tracking`);
    for (const [, value] of css.matchAll(/letter-spacing:\s*(-?[\d.]+)em/g)) assert(Number(value) <= 0.02, `${file}: letter-spacing ${value}em`);
  });
});

test("sizes come from the design system", () => {
  const typeRem = new Set([0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25]);
  eachFile((file, text, css) => {
    const half = text.match(/\b-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|bottom|left|right)-\d+\.5\b/);
    assert(!half, `${file}: half-step spacing ${half?.[0]}`);
    assert(!/\btext-\[/.test(text), `${file}: arbitrary font size`);
    assert(!/\btext-(?:[5-9]xl)\b/.test(text), `${file}: font size above the scale`);
    // Image dimensions are media layout, not overrides of coss control heights.
    const controls = text.replace(/<img\b[^>]*>/g, "");
    const height = controls.match(/\b(?:min-|max-)?h-(?:auto|\d|\[|px)/);
    assert(!height, `${file}: control height override ${height?.[0]} (use coss size variants)`);
    for (const [, value] of css.matchAll(/font-size:\s*([\d.]+)rem/g)) assert(typeRem.has(Number(value)), `${file}: font-size ${value}rem`);
    for (const [, prop, values] of css.matchAll(/\b(margin[\w-]*|padding[\w-]*|gap|column-gap|row-gap|grid-template-columns):\s*([^;}]+)/g)) {
      for (const [, n] of values.matchAll(/(-?[\d.]+)rem/g)) assert(Number.isInteger(Number(n) * 4), `${file}: ${prop} ${n}rem is not a multiple of 4px`);
      for (const [, n] of values.matchAll(/(-?[\d.]+)px/g)) assert(Number(n) % 4 === 0, `${file}: ${prop} ${n}px is not a multiple of 4px`);
    }
  });
});

test("colours come from tokens", () => {
  eachFile((file, text, css) => {
    assert(!/#[0-9a-f]{3,8}\b(?![\w-])/i.test(css), `${file}: hex colour`);
    assert(!/\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/.test(text), `${file}: colour literal`);
    assert(!/\b(?:bg|text|border|ring|fill|stroke)-(?:red|blue|green|yellow|purple|pink|indigo|violet|sky|cyan|teal|emerald|orange|amber|rose|slate|gray|zinc|neutral|stone|black|white)\b/.test(text), `${file}: palette colour instead of a token`);
    assert(!/(^|[;{\s])--[\w-]+\s*:/.test(css), `${file}: redefines a token`);
  });
});

test("no decorative effects", () => {
  eachFile((file, text) => {
    assert(!/gradient|backdrop-(?:blur|filter)|drop-shadow|\bshadow-(?:md|lg|xl|2xl|inner)\b|box-shadow|text-shadow|\bglow\b/.test(text), `${file}: decorative effect`);
  });
});

test("plain words", () => {
  eachFile((file, text) => {
    const copy = text.replace(/\b(?:className|class|href|key|id|aria-labelledby|data-[\w-]+)=(?:"[^"]*"|\{[^}]*\})/g, "");
    for (const term of ["关联", "曲目记录", "Song ID", "从未"]) assert(!copy.includes(term), `${file}: internal term "${term}"`);
    assert(!/\p{Extended_Pictographic}/u.test(copy), `${file}: emoji marker`);
    assert(!/（[^）]*）/.test(copy), `${file}: parenthetical aside`);
    assert(!/[·•]/.test(copy.replace(/\{\/\*[\s\S]*?\*\/\}/g, "")), `${file}: symbol used as a field separator (use a lucide icon)`);
  });
});
