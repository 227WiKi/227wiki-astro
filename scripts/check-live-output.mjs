/** Check generated internal links and Live-specific output invariants after build. */
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
  const data = YAML.parse(fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
  for (const show of data.shows) {
    for (const song of new Set((show.setlist ?? []).filter((entry) => entry.type === 'song' && entry.song).map((entry) => entry.song))) {
      expectedShows.set(song, (expectedShows.get(song) ?? 0) + 1);
    }
  }
}
const failures = []; let links = 0; let liveDetails = 0; let songPages = 0; const songHistory = {};
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
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
    // Every Show must be deep-linked, whether as a visible href or inside a "+N 场" menu's island props.
    const showLinks = [...new Set([...html.matchAll(/\/live\/[a-z0-9/-]+\/#show-show-[a-z0-9-]+/g)].map((match) => match[0]))];
    for (const href of showLinks) {
      const [pathname, fragment] = href.split('#');
      const target = path.join(root, pathname, 'index.html');
      if (!fs.existsSync(target) || !fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`)) failures.push(`${relative}: missing anchor ${href}`);
    }
    const songId = relative.split('/')[2];
    const expected = expectedShows.get(songId) ?? 0;
    if (expected !== showLinks.length) failures.push(`${relative}: Live history links ${showLinks.length} Shows, content has ${expected}`);
    if (!showLinks.length && !html.includes('已整理的 Setlist 里还没有出现本曲。')) failures.push(`${relative}: missing Live history empty state`);
    songHistory[relative] = { shows: showLinks.length, expected };
  }
  if (/^live\/\d{4}\/.+\/index\.html$/.test(relative)) {
    liveDetails++;
    if (/<iframe\b/i.test(html)) failures.push(`${relative}: iframe remains`);
    if ([...html.matchAll(/<h1\b/g)].length !== 1) failures.push(`${relative}: expected one H1`);
    if (!html.includes('id="setlist"')) failures.push(`${relative}: missing Setlist section`);
    if (/qa-live-detail|临时 QA/.test(html)) failures.push(`${relative}: QA content remains`);
  }
}
if (fs.existsSync(path.join(root, 'qa-live-detail'))) failures.push('Temporary QA route remains in dist');
console.log(JSON.stringify({ pages: files.length, liveDetails, songPages, songHistory, internalLinks: links, failures }, null, 2));
if (failures.length) process.exitCode = 1;
