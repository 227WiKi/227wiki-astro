/** One-time AST migration. Default is audit-only. Use --source <original snapshot> --write.
 * Requires the YAML and Satteri parsers already supplied by Astro; adds no dependency.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';
import { markdownToMdast } from 'satteri';

const root = process.cwd();
const args = process.argv.slice(2);
const source = args.includes('--source') ? path.resolve(args[args.indexOf('--source') + 1]) : path.join(root, 'src/content/live-events');
const write = args.includes('--write');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : undefined;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : entry.name.endsWith('.md') ? [path.join(dir, entry.name)] : []);
const text = (node) => node.type === 'html' ? (node.value ?? '').replace(/<br\s*\/?>/gi, ' / ').replace(/<[^>]+>/g, '') : node.value ?? node.children?.map(text).join('') ?? '';
const all = (node, type) => [ ...(node.type === type ? [node] : []), ...(node.children?.flatMap((child) => all(child, type)) ?? []) ];
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const split = (s) => { const match = s.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/); if (!match) throw new Error('Missing frontmatter'); return { doc: YAML.parseDocument(match[1]), body: s.slice(match[0].length) }; };
// Verified against the corresponding introductory prose, not names or show counts.
const tours = new Map([
  ['2021/2021-1st-album-release-tour', '是22/7于2021年7月举办的巡演'],
  ['2022/2022-live-tour-14', '以14人体制举办的首次巡演'],
  ['2022/2022-nananiji-natsumatsuri', '是22/7于2022年夏季举办的巡演'],
  ['2023/2023-nananiji-natsumatsuri', '是22/7于2023年夏季举办的巡演'],
  ['2023/2023-spring-parade', '是22/7于2023年春季举办的巡演'],
  ['2025/2025-spring-tour-casino-party', '是22/7于2025年春季举办的巡演'],
]);
// Explicit city headings checked against the venue names in the existing schedule.
const cities = { '羽田场': 'Haneda', '神奈川场': 'Yokohama', '大阪场': 'Namba', '爱知场': 'Nagoya', '名古屋场': 'Nagoya', '仙台场': 'SENDAI', '福冈场': 'Fukuoka' };
const pending = {
  '2017/2017-special-christmas-event': '共用曲目表未注明第一场或第二场；确认两场的曲序后再分配。朗读表保留原文。',
  '2018/2018-shampoo-release-events': '正文记载三场，当前 Show 只有两个日期；共用表未注明场次。需核实 4/14 两部的独立日程与曲序。',
  '2026/2026-star-travelers': 'Episode 曲目与 2/7、2/8、2/14 舞台见面会的对应关系未记录；不能按顺序猜测。',
};
function assign(id, data, context) {
  if (pending[id]) return { reason: pending[id] };
  const title = context.join(' ');
  let candidates = data.shows;
  const date = title.match(/(?:(\d{4})[.年])?(\d{1,2})[.月](\d{1,2})(?:日)?/);
  if (date) {
    candidates = candidates.filter((s) => Number(s.date.slice(5, 7)) === Number(date[2]) && Number(s.date.slice(8)) === Number(date[3]) && (!date[1] || s.date.startsWith(date[1])));
    if (!candidates.length) return { reason: '曲目表日期在现有 Show 中不存在；保留原表，需核实独立 Show 的日期和会场。' };
  }
  const exact = candidates.filter((s) => s.label === title || s.venue === title);
  if (exact.length === 1) return { show: exact[0], basis: '场次标签或会场完全一致' };
  const labelMatches = candidates.filter((s) => s.label && (title.startsWith(s.label + ' ') || title.startsWith(s.label + '（') || (s.label.startsWith(title + ' ') && title !== '曲目') || title.endsWith(s.label)));
  if (labelMatches.length === 1) return { show: labelMatches[0], basis: '日期与明确部次 / 标签一致' };
  const city = cities[title];
  if (city) { const match = candidates.filter((s) => s.venue.includes(city)); if (match.length === 1) return { show: match[0], basis: `原文城市标题对应已记录会场 ${match[0].venue}` }; }
  if (candidates.length === 1) return { show: candidates[0], basis: date ? '日期唯一对应' : '活动仅一场已记录 Show' };
  return { reason: '无法唯一匹配日期、部次或会场；需人工核实。' };
}
const songMap = new Map(walk(path.join(root, 'src/content/songs')).map((file) => { const data = split(fs.readFileSync(file, 'utf8')).doc.toJS(); return [data.titleJa, path.basename(file, '.md')]; }));
const linked = new Map(); const unlinked = new Map();
function entriesFor(table, part) {
  const entries = [];
  if (part) entries.push({ type: 'section', label: part });
  const rows = table.children.map((row) => row.children.map((cell) => text(cell).trim()));
  let form;
  for (const cells of rows.slice(1)) {
    let [number, title] = cells;
    if (cells.length === 3) {
      if (form !== cells[1]) { form = cells[1]; entries.push({ type: 'section', label: form }); }
      title = cells[2];
    } else if (cells.length !== 2) throw new Error('Unexpected setlist columns');
    if (!title || (!number && title)) { entries.push({ type: 'section', label: title || number }); continue; }
    if (/encore/i.test(number)) { entries.push({ type: 'section', label: number }); number = undefined; }
    if (/^(?:MC|幕间|幕間)(?:\s|$)/i.test(title)) { entries.push({ type: 'note', text: `${number ? number + ' ' : ''}${title}` }); continue; }
    const song = { type: 'song', ...(number ? { number: /^\d+[.]?$/.test(number) ? (/^0\d/.test(number) ? number.replace(/\.$/, '') : Number(number.replace(/\.$/, ''))) : number } : {}), titleJa: title };
    // These source rows explicitly name a character and CV. Keep the CV annotation as
    // supplied; never resolve it into a Member ref or infer a live-action performer.
    const character = title.match(/^(.*?) \/ (.+\(CV\.[^)]+\))$/);
    if (character) { song.titleJa = character[1]; song.performers = [{ type: 'character', name: character[2] }]; }
    if (songMap.has(song.titleJa)) { song.song = songMap.get(song.titleJa); linked.set(song.titleJa, (linked.get(song.titleJa) ?? 0) + 1); }
    else unlinked.set(song.titleJa, (unlinked.get(song.titleJa) ?? 0) + 1);
    entries.push(song);
  }
  return entries;
}
const reports = [];
const results = [];
for (const file of walk(source)) {
  const id = path.relative(source, file).replace(/\.md$/, '');
  if (only && id !== only) continue;
  const original = fs.readFileSync(file, 'utf8');
  const { doc, body } = split(original);
  const data = doc.toJS();
  if (data.shows.some((show) => show.setlist)) throw new Error(`${id}: source is already migrated; use an original snapshot`);
  const nodes = markdownToMdast(body).children;
  const removed = new Set(); const extraFacts = new Set(); const contexts = new Map(); const tables = []; const notes = [];
  const references = []; const referenceNotes = [];
  let headings = []; let part; let section;
  for (const node of nodes) {
    if (node.type === 'heading') {
      const title = text(node).trim();
      headings.length = node.depth - 1; headings[node.depth - 1] = title;
      if (node.depth === 2) section = title;
      part = undefined;
      if (node.depth === 1) removed.add(node);
    }
    contexts.set(node, { headings: [...headings], section, part });
    if (node.type === 'paragraph' && node.children.length === 1 && node.children[0].type === 'strong' && /^第[一二三]部$/.test(text(node).trim())) { part = text(node).trim(); contexts.get(node).part = part; }
    if (node.type === 'paragraph' && section === '曲目表' && !part) {
      const prose = text(node).trim();
      const venue = prose.replace(/^会场[:：]\s*/, '');
      if (venue !== prose && data.shows.some((show) => show.venue === venue)) {
        removed.add(node);
      } else {
        const mapping = assign(id, data, headings.slice(2));
        if (mapping.show) {
          const entry = { type: 'note', text: prose };
          mapping.show.setlist ??= []; mapping.show.setlist.push(entry);
          notes.push({ show: mapping.show.id, line: node.position.start.line, entries: [entry] });
          removed.add(node);
        }
      }
    }
    if (node.type === 'table' && section === '曲目表') {
      const context = [...headings.slice(2), ...(part ? [part] : [])];
      const mapping = assign(id, data, context);
      const partLabel = (data.shows.length === 1 && !/^曲目$/.test(context[0] ?? '')) || (context.some((label) => label.includes(' - '))) ? context.join(' / ') : undefined;
      const entries = mapping.show ? entriesFor(node, partLabel) : undefined;
      if (mapping.show) {
        mapping.show.setlist ??= []; mapping.show.setlist.push(...entries); removed.add(node);
      }
      tables.push({ heading: context.join(' / ') || '曲目', line: node.position.start.line, show: mapping.show?.id, basis: mapping.basis, reason: mapping.reason, rows: node.children.length - 1, entries });
    }
  }
  if (tours.has(id)) { if (!body.includes(tours.get(id))) throw new Error(`Missing tour evidence: ${id}`); doc.set('format', 'tour'); }
  let iframes = 0;
  const referenceSections = new Set(['参考', '观看', '下载', 'BD下载', '视频资源']);
  for (const node of nodes) {
    const context = contexts.get(node);
    const raw = body.slice(node.position.start.offset, node.position.end.offset);
    if (node.type === 'html' && /<iframe\b/i.test(raw)) {
      iframes += [...raw.matchAll(/<iframe\b/gi)].length;
      if (raw.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '').trim()) throw new Error(`${id}: mixed iframe node needs manual handling`);
      removed.add(node); continue;
    }
    if (context.section === 'Live信息') {
      if (node.type === 'heading' || node.type === 'thematicBreak' || /^<b>(?:Live名称|举办日期|会场):<\/b>/.test(raw)) { removed.add(node); continue; }
      const images = all(node, 'image');
      if (images.length && images.every((image) => data.poster && image.url.endsWith('/' + data.poster))) { removed.add(node); continue; }
      // Keep supplemental facts after the introduction rather than before it.
      extraFacts.add(node); removed.add(node);
    }
    if (referenceSections.has(context.section)) {
      removed.add(node);
      if (node.type === 'heading' || node.type === 'thematicBreak') continue;
      const links = all(node, 'link');
      const labelContext = context.headings.slice(2).filter(Boolean).join(' / ');
      for (const link of links) {
        if (!/^https?:\/\//i.test(link.url)) throw new Error(`${id}: non-http reference ${link.url}`);
        references.push({ label: [labelContext, text(link).trim() || link.url].filter(Boolean).join(' — '), url: link.url });
      }
      const prose = text(node).trim();
      if (prose && (links.length === 0 || text(node).replaceAll(/\s/g, '') !== links.map(text).join('').replaceAll(/\s/g, ''))) {
        referenceNotes.push([labelContext, prose].filter(Boolean).join(' — '));
      }
    }
  }
  // Remove only empty setlist headings/part markers; unresolved tables and prose stay.
  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index]; const context = contexts.get(node);
    if (context.section !== '曲目表' || !['heading', 'paragraph'].includes(node.type)) continue;
    if (node.type === 'paragraph' && !(node.children.length === 1 && node.children[0].type === 'strong' && /^第[一二三]部$/.test(text(node).trim()))) continue;
    const depth = node.type === 'heading' ? node.depth : 7;
    const next = nodes.slice(index + 1).findIndex((n) => n.type === 'heading' && n.depth <= depth);
    const children = nodes.slice(index + 1, next < 0 ? undefined : index + 1 + next);
    if (!children.some((n) => n.type !== 'heading' && !removed.has(n))) removed.add(node);
  }
  let migratedBody = nodes.filter((node) => !removed.has(node)).map((node) => body.slice(node.position.start.offset, node.position.end.offset)).join('\n\n');
  migratedBody += extraFacts.size ? '\n\n' + [...extraFacts].map((node) => body.slice(node.position.start.offset, node.position.end.offset)).join('\n\n') : '';
  const unresolved = tables.filter((table) => !table.show);
  if (unresolved.length) migratedBody = migratedBody.replace('## 曲目表', '## 待核实场次的曲目记录\n\n以下曲目表尚无法对应到确定场次，保留原始记录供核查。');
  doc.set('shows', doc.createNode(data.shows));
  data.shows.forEach((_, index) => { doc.getIn(['shows', index, 'date'], true).type = 'QUOTE_DOUBLE'; });
  if (references.length) doc.set('references', references);
  if (referenceNotes.length) doc.set('referenceNotes', referenceNotes);
  const output = `---\n${doc.toString({ lineWidth: 0 })}---\n\n${migratedBody.trim()}\n`;
  const target = path.join(root, 'src/content/live-events', id + '.md');
  if (write) {
    const current = fs.readFileSync(target, 'utf8');
    if (current !== original && current !== output) throw new Error(`Refusing to overwrite changed content: ${id}`);
    // All outputs are written only after the collection-wide conservation gates below.
  }
  reports.push({ id, sourceHash: hash(original), shows: data.shows.map(({ id }) => id), tables, notes, iframes, references: references.length, tourEvidence: tours.get(id) });
  results.push({ id, original, output, target });
}
// Independently compare every original table row to the converted entries. Character
// annotations reconstruct the original title rather than discarding the CV text.
for (const record of reports) {
  const sourceText = fs.readFileSync(path.join(source, record.id + '.md'), 'utf8');
  const originalTables = all(markdownToMdast(split(sourceText).body), 'table');
  for (const table of record.tables.filter((table) => table.show)) {
    const originalTable = originalTables.find((node) => node.position.start.line === table.line);
    const songs = table.entries.filter((entry) => entry.type === 'song');
    let index = 0;
    for (const row of originalTable.children.slice(1)) {
      const cells = row.children.map((cell) => text(cell).trim());
      const number = cells[0]; const title = cells.at(-1);
      if (!title || !number) {
        if (!table.entries.some((entry) => entry.type === 'section' && entry.label === (title || number))) throw new Error(`${record.id}: lost section`);
        continue;
      }
      if (/^(?:MC|幕间|幕間)(?:\s|$)/i.test(title)) continue;
      const entry = songs[index++];
      const reconstructed = entry.performers ? `${entry.titleJa} / ${entry.performers.map((person) => person.name).join('、')}` : entry.titleJa;
      if (reconstructed !== title) throw new Error(`${record.id}: song title/order changed: ${title}`);
      if (/encore/i.test(number)) {
        if (!table.entries.some((entry) => entry.type === 'section' && entry.label === number)) throw new Error(`${record.id}: lost encore`);
      } else if (String(entry.number) !== number.replace(/\.$/, '')) throw new Error(`${record.id}: changed number ${number}`);
      if (cells.length === 3 && !table.entries.some((entry) => entry.type === 'section' && entry.label === cells[1])) throw new Error(`${record.id}: lost performance form`);
    }
    if (index !== songs.length) throw new Error(`${record.id}: added song row`);
  }
}
const count = (f) => reports.reduce((sum, report) => sum + f(report), 0);
const migrated = reports.flatMap((r) => r.tables.filter((t) => t.show));
const remaining = reports.flatMap((r) => r.tables.filter((t) => !t.show).map((t) => ({ id: r.id, ...t })));
const entries = [...migrated, ...reports.flatMap((r) => r.notes)].flatMap((t) => t.entries);
const stats = { events: reports.length, shows: count((r) => r.shows.length), setlistTables: count((r) => r.tables.length), migratedTables: migrated.length, unresolvedTables: remaining.length, eventsWithMigration: reports.filter((r) => r.tables.some((t) => t.show)).length, populatedShows: new Set(reports.flatMap((r) => r.tables.filter((t) => t.show).map((t) => r.id + '/' + t.show))).size, linkedSongs: [...linked.values()].reduce((a, b) => a + b, 0), unlinkedSongs: [...unlinked.values()].reduce((a, b) => a + b, 0), sections: entries.filter((e) => e.type === 'section').length, notes: entries.filter((e) => e.type === 'note').length, performerRows: entries.filter((e) => e.type === 'song' && e.performers).length, iframes: count((r) => r.iframes), referenceLinks: count((r) => r.references) };
// Conservation gates run before reporting success. Row order is checked per table and
// unchanged body blocks come directly from AST source offsets, not string rewriting.
for (const { id, original, output } of results) {
  const before = split(original); const after = split(output);
  const beforeTree = markdownToMdast(before.body); const afterTree = markdownToMdast(after.body);
  let section;
  for (const node of beforeTree.children) {
    if (node.type === 'heading' && node.depth === 2) section = text(node);
    if (node.type === 'table' && section !== '曲目表' || ['信息', '简介', '相关活动', '朗读', '公演记录', '活动记录', '公演列表', '公演', '出演记录'].includes(section) && node.type !== 'heading') {
      const raw = before.body.slice(node.position.start.offset, node.position.end.offset);
      if (!after.body.includes(raw)) throw new Error(`${id}: lost factual body block at L${node.position.start.line}`);
    }
  }
  for (const link of all(beforeTree, 'link')) {
    if (!all(afterTree, 'link').some((l) => l.url === link.url) && !after.doc.toJS().references?.some((l) => l.url === link.url)) throw new Error(`${id}: lost link ${link.url}`);
  }
  if (/<iframe\b/i.test(after.body)) throw new Error(`${id}: iframe survived`);
  const report = reports.find((r) => r.id === id);
  for (const table of report.tables.filter((t) => !t.show)) {
    const node = all(beforeTree, 'table').find((n) => n.position.start.line === table.line);
    const raw = before.body.slice(node.position.start.offset, node.position.end.offset);
    if (!after.body.includes(raw)) throw new Error(`${id}: unresolved table changed`);
  }
}
if (write) for (const { target, output } of results) fs.writeFileSync(target, output);
if (!only) {
  fs.mkdirSync(path.join(root, 'docs/migration'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/migration/live-setlist-audit.json'), JSON.stringify({ stats, records: reports }, null, 2) + '\n');
  const escape = (s) => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
  let report = `# Live Setlist 迁移报告\n\n基线为迁移开始时当前 Astro 集合；未读取旧 MkDocs。逐表通过 Markdown AST 及源位置解析。编号去除排版用句点，前导零与 EN 编号保留；不假定全局连续。\n\n## 实际统计\n\n| 项目 | 数量 |\n| --- | ---: |\n${Object.entries(stats).map(([key, value]) => `| ${{events:'扫描活动',shows:'扫描公演',setlistTables:'旧曲目表',migratedTables:'已迁移曲目表',unresolvedTables:'待核实曲目表',eventsWithMigration:'已迁移活动',populatedShows:'已录入曲目公演',linkedSongs:'已关联 Song 的曲目条目',unlinkedSongs:'暂未关联 Song 的曲目条目',sections:'Section',notes:'Note',performerRows:'明确记录角色演唱者的曲目条目',iframes:'已移除 iframe',referenceLinks:'保留普通资料链接'}[key]} | ${value} |`).join('\n')}\n\n3 篇无曲目表活动维持 Setlist 缺失。未给缺失场次生成空数组。Member 引用未由在籍阵容或角色 CV 推断。明确写明角色与 CV 的逐曲原注保存在 character.name 中，保持纯文本，不映射为 Member。\n\n## 待核实原始记录\n\n| 文件 | 原表标题 | Show | 原因与核实方向 |\n| --- | --- | --- | --- |\n${remaining.map((r) => `| src/content/live-events/${r.id}.md | ${escape(r.heading)} | 未分配；现有 ID 见下方清单 | ${r.reason} |`).join('\n')}\n\n上述原表仍可读，未复制到多个 Show。2018 发售活动的两条既有 Show 未擅自改成三条，原文三场说明保留。Star Travelers 的角色姓名仍在原表中。\n\n## 曲目关联\n\n仅现存 Song 正式名称完全一致时关联（无模糊匹配）。\n\n| 已关联标题 | ID | 出现次数 |\n| --- | --- | ---: |\n${[...linked].map(([name, count]) => `| ${escape(name)} | ${songMap.get(name)} | ${count} |`).join('\n')}\n\n### 暂无 Song 关联的标题\n\n保留曲目文本；包含翻唱、子组合注释等，不创建空页面。数字为已迁移条目次数；未分配原表不计入这些条目统计。\n\n| 标题 | 次数 |\n| --- | ---: |\n${[...unlinked].sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => `| ${escape(name)} | ${count} |`).join('\n')}\n\n## 特殊记录\n\n- 2017 First Live 的 Character Live / Real Live 表列迁移为分段。\n- 2018 割り切れないライブ的 Virtual / Real 两表属于同一 Show，按原顺序分段合并。\n- 2020 LIVE 11 的小组曲、角色曲、下半场保留为 Section。\n- 2021 ナナニジライブ的 Unit Song Medley 保留原名及位置为 Section，不设计嵌套模型。\n- Encore、Double Encore、Encore 2 与原编号均保留；EN1 等保留为字符串，不自动重排。\n- 两条曲目核实说明按原位置迁移为 Note（2025 Casino Party 大阪场的曲序待核实、Toybox Piece 3 的安可未记录），其余正文舞台说明继续保留。\n- 所有非曲目表（朗读、角色公布、公演记录等）保留。普通资源链接及出处保留为正文链接或页面末尾 references；不请求媒体 URL。\n\n## 全量逐表清单\n\n下方每篇列出全部既有 Show ID、每张曲目表的映射与依据。源 SHA-256 与逐行迁移内容见相邻 audit.json，便于对照原提交核查。\n\n`;
  for (const r of reports) {
    report += `### ${r.id}\n\n文件：src/content/live-events/${r.id}.md\n\nShows：${r.shows.map((id) => '`' + id + '`').join(', ')}\n\n`;
    if (r.tourEvidence) report += `Tour 依据：正文“${r.tourEvidence}”。\n\n`;
    if (r.notes.length) report += 'Note：' + r.notes.map((note) => `${note.show} / L${note.line}：${note.entries[0].text}`).join('；') + '\n\n';
    report += r.tables.length ? `| 原标题 / 行 | 行数 | Show | 依据 / 风险 |\n| --- | ---: | --- | --- |\n${r.tables.map((t) => `| ${escape(t.heading)} / L${t.line} | ${t.rows} | ${t.show ?? '待核实，原表保留'} | ${escape(t.basis ?? t.reason)} |`).join('\n')}\n\n` : '原文无曲目表。\n\n';
  }
  report += '## 重跑与检查\n\n`scripts/migrate-live-setlists.mjs` 默认只审计；批量写入需明确 `--write`，建议传入迁移前快照 `--source /absolute/path`。若目标既非原文也非本次确定输出，脚本拒绝覆盖。`--only year/slug` 可先试迁移；全量使用同一快照。不得把已迁移目录当原始输入。无网络请求、无媒体抓取。\n';
  fs.writeFileSync(path.join(root, 'docs/migration/live-setlist-report.md'), report);
}
console.log(JSON.stringify({ mode: write ? 'write' : 'audit', ...stats, unresolved: remaining.map(({ id, heading, reason }) => ({ id, heading, reason })) }, null, 2));
