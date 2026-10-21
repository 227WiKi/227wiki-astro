import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { livePerformer, setlistEntry, liveShow, liveShows } from '../src/lib/live-schema.ts';
import { assertLiveReferences, showDisplayLabels } from '../src/lib/live-detail.ts';
const show = { id: 'first', date: '2026-02-28', venue: '会场' };
const song = { type: 'song', titleJa: '既存曲', song: 'existing' };
const songs = [{ id: 'existing', data: { titleJa: '既存曲' } }];
const members = [{ id: 'member', data: { nameJa: '出演者' } }];
const event = (entry, cast) => [{ id: 'event', data: { shows: [{ ...show, setlist: [entry] }], cast } }];

test('optional setlist stays absent; zero, reset, string and absent numbers are allowed', () => {
  assert.equal(liveShow.parse(show).setlist, undefined);
  for (const number of [0, 1, 'EN1', '01', undefined]) assert.equal(setlistEntry.parse({ type: 'song', titleJa: 'Overture', number }).number, number);
  assert(liveShow.safeParse({ ...show, setlist: [song, { type: 'section', label: 'Encore' }, { ...song, number: 1 }, { type: 'note', text: 'MC' }] }).success);
});
test('invalid dates, duplicate shows, empty entries and character refs are rejected', () => {
  assert(!liveShow.safeParse({ ...show, date: '2026-02-30' }).success);
  assert(!liveShows.safeParse([show, show]).success);
  for (const value of [{ type: 'song', titleJa: '' }, { type: 'section', label: ' ' }, { type: 'note', text: '' }, { ...song, performers: [] }]) assert(!setlistEntry.safeParse(value).success);
  assert(!livePerformer.safeParse({ type: 'character', name: '角色', ref: 'member' }).success);
  assert(livePerformer.safeParse({ type: 'member', name: '成员' }).success);
});
test('all three performer levels and song title/ID references fail on bad links', () => {
  assert.doesNotThrow(() => assertLiveReferences(event(song, [{ type: 'character', name: '角色' }]), songs, members));
  assert.throws(() => assertLiveReferences(event({ ...song, song: 'missing' }), songs, members), /unknown Song/);
  assert.throws(() => assertLiveReferences(event({ ...song, titleJa: '相似但不同' }), songs, members), /does not match/);
  assert.throws(() => assertLiveReferences(event(song, [{ type: 'member', name: '成员', ref: 'missing' }]), songs, members), /unknown Member/);
  const showCast = event(song); showCast[0].data.shows[0].cast = [{ type: 'member', name: '成员', ref: 'missing' }];
  assert.throws(() => assertLiveReferences(showCast, songs, members), /unknown Member/);
  assert.throws(() => assertLiveReferences(event({ ...song, performers: [{ type: 'member', name: '成员', ref: 'missing' }] }), songs, members), /unknown Member/);
});
test('unlabelled same-day shows use venue and stable IDs rather than invented part names', () => {
  assert.deepEqual(showDisplayLabels([show, { ...show, id: 'second' }]), ['会场 (first)', '会场 (second)']);
});

test('migration audit agrees with the production setlists and preserves unresolved tables', () => {
  const audit = JSON.parse(fs.readFileSync(new URL('../docs/migration/live-setlist-audit.json', import.meta.url)));
  let linked = 0, unlinked = 0, sections = 0, notes = 0, tableCount = 0;
  for (const record of audit.records) {
    const source = fs.readFileSync(path.resolve('src/content/live-events', record.id + '.md'), 'utf8');
    const match = source.match(/^---\n([\s\S]*?)\n---\n/);
    const data = YAML.parse(match[1]); const body = source.slice(match[0].length);
    assert(!/<iframe\b/i.test(body), record.id);
    assert(!/^# /m.test(body), record.id);
    assert(liveShows.safeParse(data.shows).success, record.id);
    for (const s of data.shows) {
      const expected = [...record.tables, ...(record.notes ?? [])].filter((t) => t.show === s.id).sort((a, b) => a.line - b.line).flatMap((t) => t.entries);
      assert.deepEqual(s.setlist ?? [], expected, `${record.id}/${s.id}: table order changed`);
      for (const entry of expected) {
        if (entry.type === 'song') entry.song ? linked++ : unlinked++;
        if (entry.type === 'section') sections++;
        if (entry.type === 'note') notes++;
      }
    }
    tableCount += record.tables.filter((t) => !t.show).length;
    if (record.tables.some((t) => !t.show)) assert(body.includes('待核实场次的曲目记录'), record.id);
  }
  assert.deepEqual({ linked, unlinked, sections, notes, tableCount }, { linked: audit.stats.linkedSongs, unlinked: audit.stats.unlinkedSongs, sections: audit.stats.sections, notes: audit.stats.notes, tableCount: audit.stats.unresolvedTables });
});
