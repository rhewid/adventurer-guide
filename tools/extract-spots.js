// Reads monster data for every level spot and writes tools/spotstats-*.json (used for the
// per-class strategy lines) and tools/mvps-*.json (the MVP guide).
//   node tools/extract-spots.js "<path to rathena>"
// default path: ../../ragnarokoffline.app/vendor/rathena

const fs = require('fs');
const path = require('path');
const D = require('./data.js');
const { watchFor } = require('./mobwatch.js');

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

// "c_tower1 ... c_tower4" / "gefenia01 - gefenia04" / "a, b" -> map ids
function expandMaps(str) {
  const out = [];
  const parts = str.split(',').map((s) => s.trim());
  for (const p of parts) {
    const r = p.match(/^([a-z_]+?)(\d+)\s*(?:\.\.\.|-)\s*(?:[a-z_]+?)(\d+)$/);
    if (r) {
      const w = r[2].length;
      for (let i = +r[2]; i <= +r[3]; i++) out.push(r[1] + String(i).padStart(w, '0'));
    } else if (/^[a-z_0-9]+$/.test(p)) out.push(p);
  }
  return out;
}

function build(era) {
  const dir = path.join(root, 'db', era);
  // elemental table: ATTACK ELEMENT -> DEFENCE element, by element level
  const attr = {};
  let lvl = 0, atk = null;
  for (const line of read(path.join(dir, 'attr_fix.yml')).split('\n')) {
    let m;
    if ((m = line.match(/^  - Level: (\d+)/))) { lvl = +m[1]; attr[lvl] = {}; atk = null; }
    else if ((m = line.match(/^    (\w+):\s*$/))) { atk = m[1]; attr[lvl][atk] = {}; }
    else if ((m = line.match(/^      (\w+): (-?\d+)/)) && atk) attr[lvl][atk][m[1]] = +m[2];
  }
  const mobs = {};
  const mvps = [];
  for (const blk of read(path.join(dir, 'mob_db.yml')).split('\n  - Id: ').slice(1)) {
    const g = (k) => { const r = blk.match(new RegExp('\\n    ' + k + ': (.+)')); return r ? r[1] : null; };
    const nm = g('Name');
    const rec = {
      id: +blk.split('\n')[0], name: nm, lv: +(g('Level') || 1), hp: +(g('Hp') || 0), def: +(g('Defense') || 0), mdef: +(g('MagicDefense') || 0),
      atk: +(g('Attack') || 0), size: g('Size') || 'Medium', race: g('Race') || 'Formless', ele: g('Element') || 'Neutral', eleLv: +(g('ElementLevel') || 1),
      range: +(g('AttackRange') || 1), cls: g('Class') || 'Normal', aegis: g('AegisName'),
      mvp: /MvpExp/.test(blk),
    };
    const mvpDrops = blk.match(/\n    MvpDrops:\n((?:      .*\n?)+)/);
    rec.mvpItems = mvpDrops ? [...mvpDrops[1].matchAll(/- Item: (\w+)/g)].map((m) => m[1]) : [];
    const dr = blk.match(/\n    Drops:\n((?:      .*\n?)+)/);
    rec.drops = dr ? [...dr[1].matchAll(/- Item: (\w+)\n\s+Rate: (\d+)/g)].map((m) => [m[1], +m[2]]) : [];
    if (!mobs[nm] || (rec.mvp && !/^EVENT/.test(rec.aegis || "")) || !mobs[nm].mvp) { if (!(mobs[nm] && mobs[nm].mvp && !rec.mvp)) mobs[nm] = rec; }
  }
  const spawn = {};
  for (const f of [...walk(path.join(root, 'npc', era, 'mobs')), ...walk(path.join(root, 'npc', 'mobs'))]) {
    for (const line of read(f).split('\n')) {
      const mm = line.match(/^([\w@]+)(?:,\d+){2,4}\s+(?:boss_)?monster\s+(.+?)\s+(\d+),(\d+)(?:,(\d+))?/);
      if (mm && !/^(1@|2@|3@|ev_|pvp|g_|force|quiz|turbo)/.test(mm[1])) {
        (spawn[mm[2]] ??= {})[mm[1]] = ((spawn[mm[2]] ??= {})[mm[1]] || 0) + +mm[4];
      }
    }
  }
  const byMap = {};
  for (const [mob, maps] of Object.entries(spawn)) for (const [mp, n] of Object.entries(maps)) (byMap[mp] ??= []).push([mob, n]);

  // item names for MVP cards
  const cardName = {};
  for (const blk of read(path.join(dir, 'item_db_etc.yml')).split('\n  - Id: ').slice(1)) {
    const a = (blk.match(/\n    AegisName: (.+)/) || [])[1]; const n = (blk.match(/\n    Name: (.+)/) || [])[1];
    if (a) cardName[a] = n;
  }

  // weaknesses for a defender element
  const weak = (ele, eLv) => {
    const out = [];
    for (const [a, row] of Object.entries(attr[eLv] || attr[1] || {})) {
      const v = row[ele];
      if (v >= 125) out.push({ ele: a, mult: v });
    }
    return out.sort((x, y) => y.mult - x.mult);
  };

  const resist = (ele, eLv) => {
    const out = [];
    for (const [a, row] of Object.entries(attr[eLv] || attr[1] || {})) {
      const v = row[ele];
      if (v !== undefined && v <= 50) out.push({ ele: a, mult: v });
    }
    return out.sort((x, y) => x.mult - y.mult);
  };

  // mob skills worth warning about
  const NOTABLE = {
    NPC_SUMMONSLAVE: 'summons minions', NPC_CALLSLAVE: 'calls minions', WZ_METEOR: 'Meteor Storm', WZ_STORMGUST: 'Storm Gust', WZ_VERMILION: 'Lord of Vermilion',
    WZ_JUPITEL: 'Jupitel Thunder', MG_THUNDERSTORM: 'Thunderstorm', WZ_HEAVENDRIVE: 'Heavens Drive', MG_FIREWALL: 'Fire Wall', MG_COLDBOLT: 'Cold Bolt',
    NPC_STUNATTACK: 'stun', NPC_SLEEPATTACK: 'sleep', NPC_BLINDATTACK: 'blind', NPC_SILENCEATTACK: 'silence', NPC_CURSEATTACK: 'curse',
    NPC_STONEATTACK: 'stone', NPC_POISON: 'poison', NPC_BLEEDING: 'bleeding', NPC_CONFUSIONATTACK: 'confusion', NPC_FREEZEATTACK: 'freeze',
    NPC_UNDEADATTACK: 'undead curse', NPC_WIDEBLEEDING: 'bleeding', NPC_WIDESTONE: 'stone', NPC_WIDECURSE: 'curse', NPC_WIDESLEEP: 'sleep',
    NPC_WIDESILENCE: 'silence', NPC_WIDESTUN: 'stun', NPC_WIDEBLIND: 'blind', NPC_WIDECONFUSE: 'confusion', NPC_WIDEFREEZE: 'freeze',
    AL_HEAL: 'heals itself', NPC_POWERUP: 'powers up', NPC_GRANDDARKNESS: 'Grand Darkness', NPC_EARTHQUAKE: 'earthquake',
  };
  const mobSkills = {};
  const mobAll = {};
  const skillFile = path.join(dir, 'mob_skill_db.txt');
  if (fs.existsSync(skillFile)) {
    for (const line of read(skillFile).split(String.fromCharCode(10))) {
      if (line.startsWith('//') || !line.trim()) continue;
      const f = line.split(',');
      const id = +f[0];
      const sk = (f[1] || '').split('@')[1];
      if (sk) (mobAll[id] ??= new Set()).add(sk);
      if (sk && NOTABLE[sk]) (mobSkills[id] ??= new Set()).add(NOTABLE[sk]);
    }
  }

  // ---- spots ----
  const spots = {};
  const brackets = era === 're' ? D.spotsRe : D.spotsPre;
  for (const br of brackets) {
    for (const s of br.spots) {
      if (spots[s.map]) continue;
      const maps = expandMaps(s.map);
      const agg = {};
      for (const mp of maps) for (const [mob, n] of byMap[mp] || []) {
        const m = mobs[mob];
        if (!m || m.mvp) continue;
        agg[mob] = (agg[mob] || 0) + n;
      }
      const list = Object.entries(agg).map(([name, n]) => ({ name, n, ...mobs[name] })).filter((m) => m.lv > 1 || true);
      const total = list.reduce((a, m) => a + m.n, 0);
      if (!total) { spots[s.map] = null; continue; }
      // ignore trivial plants and the odd lone spawn
      const main = list.filter((m) => m.n >= total * 0.06 && !(m.lv === 1 && /Plant|Mushroom/.test(m.name))).sort((a, b) => b.n - a.n);
      const mt = main.reduce((a, m) => a + m.n, 0) || 1;
      const share = (key) => {
        const c = {};
        for (const m of main) c[m[key]] = (c[m[key]] || 0) + m.n;
        const best = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
        return { value: best[0], share: best[1] / mt };
      };
      const ele = share('ele');
      const eleLvAvg = Math.round(main.filter((m) => m.ele === ele.value).reduce((a, m) => a + m.eleLv * m.n, 0) / main.filter((m) => m.ele === ele.value).reduce((a, m) => a + m.n, 0));
      const wavg = (k) => Math.round(main.reduce((a, m) => a + m[k] * m.n, 0) / mt);
      spots[s.map] = {
        maps, perMap: Math.round(total / Math.max(1, maps.filter((m) => byMap[m]).length)),
        mobs: main.slice(0, 4).map((m) => ({ name: m.name, lv: m.lv, n: m.n, ele: m.ele, eleLv: m.eleLv, race: m.race, size: m.size, hp: m.hp, def: m.def, mdef: m.mdef })),
        ele: ele.value, eleShare: +ele.share.toFixed(2), eleLv: eleLvAvg,
        race: share('race').value, raceShare: +share('race').share.toFixed(2),
        size: share('size').value, sizeShare: +share('size').share.toFixed(2),
        def: wavg('def'), mdef: wavg('mdef'), hp: wavg('hp'), lv: wavg('lv'),
        weak: weak(ele.value, eleLvAvg),
        resist: resist(ele.value, eleLvAvg),
      };
    }
  }

  // ---- MVPs ----
  for (const m of Object.values(mobs)) {
    if (!m.mvp) continue;
    const maps = Object.entries(spawn[m.name] || {}).filter(([k]) => !/^(1@|2@|3@|ev_|pvp|g_)/.test(k)).map(([k]) => k);
    if (!maps.length) continue;
    mvps.push({
      name: m.name, lv: m.lv, hp: m.hp, def: m.def, mdef: m.mdef, atk: m.atk, ele: m.ele, eleLv: m.eleLv, race: m.race, size: m.size,
      maps: maps.slice(0, 3), card: (m.mvpItems.concat(m.drops.map((d) => d[0])).map((a) => cardName[a]).find((n) => n && /Card$/.test(n))) || null,
      weak: weak(m.ele, m.eleLv).slice(0, 3),
      dangers: [...(mobSkills[m.id] || [])],
      watch: watchFor(mobAll[m.id] || new Set()),
    });
  }
  mvps.sort((a, b) => a.lv - b.lv);
  return { spots, mvps };
}

for (const era of ['pre-re', 're']) {
  const { spots, mvps } = build(era);
  const tag = era === 're' ? 'renewal' : 'pre-renewal';
  fs.writeFileSync(path.join(__dirname, 'spotstats-' + tag + '.json'), JSON.stringify(spots, null, 1));
  fs.writeFileSync(path.join(__dirname, 'mvps-' + tag + '.json'), JSON.stringify(mvps, null, 1));
  console.log(era, Object.keys(spots).length, 'spots', Object.values(spots).filter((x) => !x).length, 'without data;', mvps.length, 'MVPs');
}
