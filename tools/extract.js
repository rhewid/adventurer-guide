// Reads the server's item, monster and shop data and writes tools/itemdata-pre-renewal.json and
// tools/itemdata-renewal.json for every item named in tools/gear.js.
// Run only when gear.js or the server data change:
//   node tools/extract.js "<path to rathena>"
// default path: ../../ragnarokoffline.app/vendor/rathena (the app checkout next to this mod)

const fs = require('fs');
const path = require('path');
const G = require('./gear.js');

const root = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'ragnarokoffline.app', 'vendor', 'rathena'));
const read = (f) => fs.readFileSync(f, 'utf8');
const walk = (d, o = []) => {
  if (!fs.existsSync(d)) return o;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    f.isDirectory() ? walk(p, o) : p.endsWith('.txt') && o.push(p);
  }
  return o;
};

// shop map -> city label and, for Prontera, the door that leads inside
const CITY = {
  prt_in: 'Prontera', prt_church: 'Prontera Church', prt_monk: 'Prontera Monastery', geffen_in: 'Geffen', payon_in01: 'Payon',
  payon_in02: 'Payon', morocc_in: 'Morocc', izlude_in: 'Izlude', alberta_in: 'Alberta', aldeba_in: 'Aldebaran', cmd_in01: 'Comodo',
  ein_in01: 'Einbroch', yuno_in01: 'Juno', hu_in01: 'Hugel', xmas_in: 'Lutie', ama_in01: 'Amatsu', ayo_in01: 'Ayothaya',
  lou_in02: 'Louyang', mosk_in: 'Moscovia', lhz_in02: 'Lighthalzen', nif_in: 'Niflheim', um_in: 'Umbala', prontera: 'Prontera',
  que_ng: 'Ninja Village', gonryun: 'Gonryun', einbroch: 'Einbroch', alb2trea: 'Alberta',
};
const PREF = ['Prontera', 'Prontera Church', 'Prontera Monastery', 'Geffen', 'Payon', 'Morocc', 'Izlude', 'Alberta', 'Aldebaran', 'Comodo'];
const DOOR = { prt_in: ' (door 177,221)', prt_church: ' (door 237,317)' };

const names = new Set();
const addPick = (p) => names.add(p.split('|')[0]);
for (const l of Object.values(G.lines)) for (const sec of Object.values(l)) sec.forEach(addPick);
for (const b of Object.values(G.branches)) for (const sec of Object.values(b)) sec.forEach(addPick);
for (const gr of G.general) gr[2].forEach(addPick);
for (const arr of Object.values(G.dropOnly.weapons)) arr.forEach(addPick);
for (const arr of Object.values(G.dropOnly.other)) arr.forEach(addPick);
for (const tiers of Object.values(G.starter)) for (const t of tiers) t.items.forEach((n) => names.add(n));

const pickMaps = (m) => {
  const all = Object.entries(m).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  const real = all.filter((x) => !/^gld/.test(x));
  return (real.length ? real : all).slice(0, 2);
};

const JOBS_RE = /\n    Jobs:\n((?:      .*\n)+)/;
const ENTRY_RE = /(\w+): (true|false)/g;
// who can wear it: { all: true, except: [...] } or { only: [...] }
function parseJobs(blk) {
  const jb = blk.match(JOBS_RE);
  if (!jb) return { all: true, except: [] };
  const entries = [...jb[1].matchAll(ENTRY_RE)];
  const all = entries.some((e) => e[1] === 'All' && e[2] === 'true');
  if (all) return { all: true, except: entries.filter((e) => e[2] === 'false').map((e) => e[1]) };
  return { only: entries.filter((e) => e[2] === 'true').map((e) => e[1]) };
}

function build(era) {
  const dir = path.join(root, 'db', era);
  // ---- items ----
  const items = []; // every item with this name
  for (const f of ['item_db_equip', 'item_db_etc', 'item_db_usable']) {
    for (const blk of read(path.join(dir, f + '.yml')).split('\n  - Id: ').slice(1)) {
      const g = (k) => { const r = blk.match(new RegExp('\\n    ' + k + ': (.+)')); return r ? r[1] : null; };
      items.push({
        id: +blk.split('\n')[0], aegis: g('AegisName'), name: g('Name'), type: g('Type'), sub: g('SubType'),
        atk: g('Attack'), def: g('Defense'), slots: +(g('Slots') || 0), buy: g('Buy'), wl: g('WeaponLevel'),
        lv: (blk.match(/EquipLevelMin: (\d+)/) || [])[1] || null,
        jobs: parseJobs(blk),
      });
    }
  }
  // ---- shops ----
  const shopFiles = [...walk(path.join(root, 'npc', 'merchants')), ...walk(path.join(root, 'npc', era, 'merchants')),
    ...walk(path.join(root, 'npc', 'cities')), ...walk(path.join(root, 'npc', era, 'cities'))];
  const shops = [];
  for (const f of shopFiles) {
    for (const l of read(f).split('\n')) {
      const m = l.match(/^(\w+),(\d+),(\d+),\d+\s+shop\s+([^\t]+)\t+\d+,(.*)$/);
      if (m) shops.push({ map: m[1], npc: m[4], entries: m[5].split(',').map((p) => p.split(':')) });
    }
  }
  // ---- monsters ----
  const drops = {}; // aegis -> [{mob, lv, rate}]
  const mobs = {};
  for (const blk of read(path.join(dir, 'mob_db.yml')).split('\n  - Id: ').slice(1)) {
    const nm = (blk.match(/\n    Name: (.+)/) || [])[1];
    const lv = +((blk.match(/\n    Level: (\d+)/) || [])[1] || 1);
    const boss = /MvpExp/.test(blk);
    mobs[nm] = { lv, boss };
    const d = blk.match(/\n    Drops:\n((?:      .*\n?)+)/);
    if (d) for (const m of d[1].matchAll(/- Item: (\w+)\n\s+Rate: (\d+)/g)) (drops[m[1]] ??= []).push({ mob: nm, lv, rate: +m[2], boss });
  }
  const spawn = {};
  for (const f of [...walk(path.join(root, 'npc', era, 'mobs')), ...walk(path.join(root, 'npc', 'mobs'))]) {
    for (const line of read(f).split('\n')) {
      const mm = line.match(/^([\w@]+)(?:,\d+){2,4}\s+(?:boss_)?monster\s+(.+?)\s+(\d+),(\d+)/);
      if (mm && !/^(1@|2@|3@|ev_|pvp|g_|force|quiz|turbo|prt_maze|nameless_n)/.test(mm[1])) {
        const s = (spawn[mm[2]] ??= {});
        s[mm[1]] = (s[mm[1]] || 0) + +mm[4];
      }
    }
  }

  const out = {};
  for (const raw of names) {
    const slotMatch = raw.match(/\s\[(\d)\]$/);
    const slotted = !!slotMatch;
    const wantSlots = slotMatch ? +slotMatch[1] : null;
    const name = raw.replace(/\s\[\d\]$/, '');
    let cands = items.filter((i) => i.name === name);
    if (!cands.length) continue;
    // pick the right variant: slotted wanted -> a version with slots; else the one a shop sells, else the first
    const shopIds = new Set(shops.flatMap((s) => s.entries.map((e) => e[0])));
    let it;
    if (slotted) {
      const same = cands.filter((i) => i.slots === wantSlots && i.type !== 'Card');
      it = same.find((i) => (drops[i.aegis] || []).some((d) => d.lv <= 200 && Object.keys(spawn[d.mob] || {}).length)) || same[0] || null;
    }
    else it = cands.find((i) => shopIds.has(String(i.id))) || cands.find((i) => i.slots === 0 && i.type !== 'Card') || cands[0];
    if (!it) continue;
    const rec = { name, type: it.type, sub: it.sub, atk: it.atk, def: it.def, slots: it.slots, lv: it.lv, wl: it.wl, buy: it.buy, jobs: it.jobs, shops: [], drops: [] };

    // shop sources (not for slotted variants: shops do not sell them)
    if (!slotted) {
      const ids = new Set([String(it.id)]);
      const seen = new Set();
      for (const s of shops) {
        const e = s.entries.find((x) => ids.has(x[0]));
        if (!e) continue;
        const city = CITY[s.map] || s.map;
        const price = +e[1] > 0 ? +e[1] : +it.buy;
        const key = city + price;
        if (seen.has(key)) continue;
        seen.add(key);
        rec.shops.push({ city, door: DOOR[s.map] || '', price });
      }
      // only main towns (PREF); if the item is sold nowhere near, keep one far shop. Group by price.
      let near = rec.shops.filter((x) => PREF.includes(x.city));
      if (!near.length) near = rec.shops.slice(0, 1);
      near.sort((a, b) => PREF.indexOf(a.city) - PREF.indexOf(b.city));
      const byPrice = {};
      for (const x of near) (byPrice[x.price] ??= []).push(x.city + x.door);
      rec.shops = Object.entries(byPrice).map(([price, cities]) => ({ price: +price, cities: cities.slice(0, 2) })).slice(0, 2);
    }

    // monster sources
    const isCard = it.type === 'Card';
    let ds = (drops[it.aegis] || []).filter((d) => !d.boss && d.lv <= 200 && Object.keys(spawn[d.mob] || {}).length);
    ds.sort((a, b) => a.lv - b.lv || b.rate - a.rate);
    const seenMob = new Set();
    for (const d of ds) {
      if (seenMob.has(d.mob)) continue;
      seenMob.add(d.mob);
      const maps = pickMaps(spawn[d.mob]);
      rec.drops.push({ mob: d.mob, lv: d.lv, rate: d.rate / 100, maps });
      if (rec.drops.length >= 2) break;
    }
    rec.best = [];
    const anyDrops = (drops[it.aegis] || []).filter((d) => d.lv <= 200 && Object.keys(spawn[d.mob] || {}).length && d.rate >= 1);
    anyDrops.sort((a, b) => b.rate - a.rate || a.lv - b.lv);
    if (anyDrops.length) {
      const top = anyDrops[0].rate;
      const near = anyDrops.filter((d) => d.rate * 2 >= top).sort((a, b) => a.lv - b.lv);
      const rest = anyDrops.filter((d) => d.rate * 2 < top);
      anyDrops.splice(0, anyDrops.length, ...near, ...rest);
    }
    const seenBest = new Set();
    for (const d of anyDrops) {
      if (seenBest.has(d.mob)) continue;
      seenBest.add(d.mob);
      const maps = pickMaps(spawn[d.mob]);
      rec.best.push({ mob: d.mob, lv: d.lv, rate: d.rate / 100, maps, mvp: !!d.boss });
      if (rec.best.length >= 2) break;
    }
    out[raw] = rec;
  }
  return out;
}

for (const era of ['pre-re', 're']) {
  const out = build(era);
  const file = path.join(__dirname, 'itemdata-' + (era === 're' ? 'renewal' : 'pre-renewal') + '.json');
  fs.writeFileSync(file, JSON.stringify(out, null, 1));
  const missing = [...names].filter((n) => !out[n]);
  console.log(era, Object.keys(out).length, 'items', missing.length ? 'MISSING: ' + missing.join(', ') : '');
}
