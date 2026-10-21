/** Check generated internal links and Live-specific output invariants after build. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : entry.name.endsWith('.html') ? [path.join(dir, entry.name)] : []);
const files = walk(root);
const failures = []; let links = 0; let liveDetails = 0;
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
  if (/^live\/\d{4}\/.+\/index\.html$/.test(relative)) {
    liveDetails++;
    if (/<iframe\b/i.test(html)) failures.push(`${relative}: iframe remains`);
    if ([...html.matchAll(/<h1\b/g)].length !== 1) failures.push(`${relative}: expected one H1`);
    if (!html.includes('id="setlist"')) failures.push(`${relative}: missing Setlist section`);
    if (/qa-live-detail|临时 QA/.test(html)) failures.push(`${relative}: QA content remains`);
  }
}
if (fs.existsSync(path.join(root, 'qa-live-detail'))) failures.push('Temporary QA route remains in dist');
console.log(JSON.stringify({ pages: files.length, liveDetails, internalLinks: links, failures }, null, 2));
if (failures.length) process.exitCode = 1;
