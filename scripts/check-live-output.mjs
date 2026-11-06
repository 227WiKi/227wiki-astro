/** Check generated internal links, Live-specific and Song → Release output invariants after build. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : entry.name.endsWith('.html') ? [path.join(dir, entry.name)] : []);
const files = walk(root);
// Expected Live history per Song, derived from content independently of the page: one per Show.
const contentRoot = fileURLToPath(new URL('../src/content/live-events/', import.meta.url));
const walkMarkdown = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walkMarkdown(path.join(dir, entry.name)) : entry.name.endsWith('.md') ? [path.join(dir, entry.name)] : []);
const expectedShows = new Map();
for (const file of walkMarkdown(contentRoot)) {
  const liveId = path.relative(contentRoot, file).split(path.sep).join('/').replace(/\.md$/, '');
  const data = YAML.parse(fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
  for (const show of data.shows) {
    for (const song of new Set((show.setlist ?? []).filter((entry) => entry.type === 'song' && entry.song).map((entry) => entry.song))) {
      const hrefs = expectedShows.get(song) ?? new Set();
      hrefs.add(`/live/${liveId}/#show-${show.id}`);
      expectedShows.set(song, hrefs);
    }
  }
}
// Every configured section must remain reachable through native header navigation.
const siteConfig = fs.readFileSync(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const navigationPaths = [...siteConfig.matchAll(/\bpath:\s*"([^"\n]+)"/g)].map((match) => match[1]);
if (!navigationPaths.length) throw new Error('No section paths found in site config');
const failures = []; let links = 0; let liveDetails = 0; let songPages = 0; const songHistory = {}; const songReleases = {};
// Expected Releases per Song, from Track → Song references only: one per Release, date ascending.
const releaseRoot = fileURLToPath(new URL('../src/content/releases/', import.meta.url));
const expectedReleases = new Map();
for (const file of walkMarkdown(releaseRoot)) {
  const releaseId = path.relative(releaseRoot, file).split(path.sep).join('/').replace(/\.md$/, '');
  const data = YAML.parse(fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
  const songs = new Set(data.editions.flatMap((edition) => edition.audioDiscs.flatMap((disc) => disc.tracks.map((track) => track.song).filter(Boolean))));
  for (const song of songs) {
    const list = expectedReleases.get(song) ?? [];
    list.push({ href: `/discography/releases/${releaseId}/`, date: data.releaseDate });
    expectedReleases.set(song, list);
  }
}
const releaseDates = new Map([...expectedReleases.values()].flat().map(({ href, date }) => [href, date]));
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  const fallbackNavs = [...html.matchAll(/<nav\b[^>]*data-site-nav-fallback(?:="")?[^>]*>([\s\S]*?)<\/nav>/g)];
  if (fallbackNavs.length !== 2) failures.push(`${relative}: expected desktop and mobile native navigation`);
  for (const [, nav] of fallbackNavs) {
    const hrefs = new Set([...nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]));
    for (const href of navigationPaths) if (!hrefs.has(href)) failures.push(`${relative}: missing native navigation link ${href}`);
  }

  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!(href.startsWith('/') || href.startsWith('#')) || href.startsWith('//')) continue;
    links++;
    const [pathname, fragment] = href.split('#');
    let target = pathname ? path.resolve(root, '.' + decodeURIComponent(pathname.split('?')[0])) : file;
    if (!(target === root || target.startsWith(root + path.sep)) || !fs.existsSync(target)) {
      failures.push(`${relative}: ${href}`); continue;
    }
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) { failures.push(`${relative}: ${href}`); continue; }
    if (fragment && target.endsWith('.html')) {
      const targetHtml = fs.readFileSync(target, 'utf8');
      const id = decodeURIComponent(fragment);
      const ids = [...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
      if (!ids.includes(id)) failures.push(`${relative}: missing anchor ${href}`);
    }
  }
  const pageIds = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(pageIds.filter((id, index) => pageIds.indexOf(id) !== index))];
  // Scoped to pages that own Show anchors; other pages have pre-existing inline-SVG/demo IDs.
  if (duplicateIds.length && /^(live|discography\/songs)\//.test(relative)) failures.push(`${relative}: duplicate ids ${duplicateIds.join(', ')}`);
  if (/^discography\/songs\/.+\/index\.html$/.test(relative)) {
    songPages++;
    // Only real, marked <a href> elements count. Island props are not navigation.
    // Ignore inert markup so a URL in a script, template or comment cannot pass.
    const navigationHtml = html.replace(/<!--[\s\S]*?-->|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
    const showLinks = new Set();
    const releaseLinks = [];
    for (const [tag] of navigationHtml.matchAll(/<a\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
      const attributes = new Map([...tag.matchAll(/([^\s=<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)].map(([, name, double, single]) => [name.toLowerCase(), double ?? single ?? '']));
      if (attributes.has('data-live-show-link') && attributes.has('href')) showLinks.add(attributes.get('href').replaceAll('&amp;', '&'));
      if (attributes.has('data-song-release-link') && attributes.has('href')) releaseLinks.push(attributes.get('href').replaceAll('&amp;', '&'));
    }
    const songId = relative.split('/')[2];
    const expectedReleaseHrefs = new Set((expectedReleases.get(songId) ?? []).map(({ href }) => href));
    if (new Set(releaseLinks).size !== releaseLinks.length) failures.push(`${relative}: duplicate Release card`);
    for (const href of expectedReleaseHrefs) {
      if (!releaseLinks.includes(href)) failures.push(`${relative}: missing Release card ${href}`);
    }
    for (const href of releaseLinks) {
      if (!expectedReleaseHrefs.has(href)) failures.push(`${relative}: unexpected Release card ${href}`);
    }
    for (let i = 1; i < releaseLinks.length; i++) {
      if (releaseDates.get(releaseLinks[i - 1]) > releaseDates.get(releaseLinks[i])) failures.push(`${relative}: Release cards out of date order`);
    }
    if (!releaseLinks.length && !html.includes('已整理的单曲和专辑里还没有这首歌。')) failures.push(`${relative}: missing Release empty state`);
    songReleases[relative] = releaseLinks;
    const expected = expectedShows.get(songId) ?? new Set();
    for (const href of expected) {
      if (!showLinks.has(href)) failures.push(`${relative}: missing HTML Show link ${href}`);
    }
    for (const href of showLinks) {
      if (!expected.has(href)) failures.push(`${relative}: unexpected HTML Show link ${href}`);
    }
    if (!showLinks.size && !html.includes('已整理的 Setlist 里还没有出现本曲。')) failures.push(`${relative}: missing Live history empty state`);
    songHistory[relative] = { shows: showLinks.size, expected: expected.size };
  }
  if (/^live\/\d{4}\/.+\/index\.html$/.test(relative)) {
    liveDetails++;
    if (/<iframe\b/i.test(html)) failures.push(`${relative}: iframe remains`);
    if ([...html.matchAll(/<h1\b/g)].length !== 1) failures.push(`${relative}: expected one H1`);
    if (!html.includes('id="setlist"')) failures.push(`${relative}: missing Setlist section`);
    if (/qa-live-detail|临时 QA/.test(html)) failures.push(`${relative}: QA content remains`);
  }
}
// The Song Index lists each Song once, links every Song Detail page, and ships no fixtures.
const songIndexFile = path.join(root, 'discography/songs/index.html');
const songDetailIds = fs.existsSync(path.join(root, 'discography/songs'))
  ? fs.readdirSync(path.join(root, 'discography/songs'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name) : [];
let songIndexRows = 0;
if (!fs.existsSync(songIndexFile)) failures.push('discography/songs/index.html: missing Song Index');
else {
  const html = fs.readFileSync(songIndexFile, 'utf8');
  const rows = [...html.matchAll(/data-song-id="([^"]+)"/g)].map((match) => match[1]);
  songIndexRows = rows.length;
  if (new Set(rows).size !== rows.length) failures.push('discography/songs/index.html: duplicate Song rows');
  if (rows.slice().sort().join() !== songDetailIds.slice().sort().join()) failures.push(`discography/songs/index.html: rows ${rows.join(',')} != Song pages ${songDetailIds.join(',')}`);
  if (/fixture-|テスト/.test(html)) failures.push('discography/songs/index.html: test fixtures leaked');
}
if (fs.existsSync(path.join(root, 'lab/song-index'))) failures.push('Song Index lab route remains in dist');
if (fs.existsSync(path.join(root, 'qa-live-detail'))) failures.push('Temporary QA route remains in dist');
console.log(JSON.stringify({ pages: files.length, liveDetails, songPages, songIndexRows, songHistory, songReleases, internalLinks: links, failures }, null, 2));
if (failures.length) process.exitCode = 1;
