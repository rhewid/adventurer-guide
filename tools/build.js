// Builds the two NPC scripts from tools/data.js:
//   pre-renewal/npc/adventurer_guide.txt
//   renewal/npc/adventurer_guide.txt
// Run from the mod folder:  node tools/build.js
// Edit tools/data.js, run this, copy the mod over. Never edit the two outputs by hand.

const fs = require('fs');
const path = require('path');
const D = require('./data.js');
const BU = require('./builds.js');
D.build = BU.build;
D.third = BU.third;
const V = require('./variants.js');

const WIDTH = 44;      // visible characters per dialog line
const PAGE_LINES = 9;  // lines per dialog window, header excluded
const SPEAKER = '[Adventurer Guide]';

// ---- text helpers --------------------------------------------------------------------------
// Splits a paragraph into dialog lines. ^RRGGBB colours are zero-width; a colour that is open at a
// line break is closed on that line and re-opened on the next, so wrapped phrases keep their colour.
function wrap(text, width = WIDTH) {
  const chunks = text.split(/\s+/).filter((c) => c !== '');
  const lines = [];
  let cur = '', len = 0, color = null;
  const open = () => (color && color !== '^000000' ? color : '');
  for (const c of chunks) {
    const vis = c.replace(/\^[0-9A-Fa-f]{6}/g, '').length;
    if (len && len + 1 + vis > width) {
      lines.push(open() ? cur + '^000000' : cur);
      cur = open();
      len = 0;
    }
    if (len) { cur += ' '; len += 1; }
    cur += c; len += vis;
    for (const m of c.matchAll(/\^[0-9A-Fa-f]{6}/g)) color = m[0];
  }
  if (len) lines.push(cur);
  return lines;
}

const q = (s) => '"' + s.replace(/"/g, "'") + '"';

// Groups paragraphs into pages of at most PAGE_LINES lines (blank line between paragraphs).
function paginate(paragraphs) {
  const pages = [];
  let page = [];
  paragraphs.forEach((raw, idx) => {
    // a paragraph starting with "~" continues the previous one without a blank line (used for item lists)
    const tight = raw.startsWith('~');
    const ls = wrap(tight ? raw.slice(1) : raw);
    const gap = page.length && !tight ? 1 : 0;
    // keep a heading ("Katars:") on the same page as its first item
    let need = ls.length;
    const next = paragraphs[idx + 1];
    if (!tight && raw.endsWith(':') && next && next.startsWith('~')) need += wrap(next.slice(1)).length;
    if (page.length && page.length + gap + need > PAGE_LINES) { pages.push(page); page = []; }
    else if (gap) page.push('');
    page.push(...ls);
  });
  if (page.length) pages.push(page);
  return pages;
}

function emitPages(pages, indent) {
  const t = '\t'.repeat(indent);
  const out = [];
  pages.forEach((pg, i) => {
    if (i) out.push(t + 'next;');
    out.push(t + 'mes ' + q(SPEAKER) + ';');
    for (const l of pg) out.push(t + 'mes ' + q(l) + ';');
  });
  return out;
}

// ---- level spot labels ---------------------------------------------------------------------
function spotBlock(s, indent) {
  const t = '\t'.repeat(indent);
  const lines = [];
  lines.push(...wrap(D.B + s.name + D.E + ' (' + s.map + ')'));
  lines.push(...wrap(s.text));
  return lines;
}
const { tipFor } = require('./strategy.js');

// every valid class key (line * 10 + branch)
function allKeys() {
  const keys = [];
  D.classes.forEach((c, li) => c.branches.forEach((_, bi) => keys.push(li * 10 + bi)));
  return keys;
}

// Strategy tips for a spot, grouped by identical text: [{ text, keys: [..] }]
function spotTips(s, era, stats) {
  const groups = new Map();
  for (const key of allKeys()) {
    const t = tipFor(stats[s.map], key, era, s.map);
    if (!t) continue;
    if (!groups.has(t)) groups.set(t, []);
    groups.get(t).push(key);
  }
  return [...groups.entries()].map(([text, keys]) => ({ text, keys }));
}

function spotPages(spots, era, stats, noTips) {
  // greedy: worst case includes the longest tip of the spot
  const pages = [];
  let page = [];
  let used = 0;
  for (const s of spots) {
    const body = spotBlock(s, 0);
    s.tips = noTips ? [] : spotTips(s, era, stats);
    const tipLines = s.tips.map((t) => wrap('Tip: ' + t.text).length).reduce((a, b) => Math.max(a, b), 0);
    const worst = body.length + tipLines + (page.length ? 1 : 0);
    if (page.length && used + worst > PAGE_LINES) { pages.push(page); page = []; used = 0; }
    page.push(s);
    used += body.length + tipLines + (page.length > 1 ? 1 : 0);
  }
  if (page.length) pages.push(page);
  return pages;
}

function emitSpotLabel(brackets, name, era) {
  const stats = require('./spotstats-' + era + '.json');
  const out = [];
  out.push(name + ':');
  out.push('\t.@k = getarg(1);');
  out.push('\tswitch (getarg(0)) {');
  brackets.forEach((br, bi) => {
    out.push('\tcase ' + bi + ':');
    const hi = bi + 1 < brackets.length ? brackets[bi + 1].lo - 1 : null;
    const title = D.B + 'Level ' + br.lo + (hi ? '-' + hi : '+') + D.E;
    const pages = spotPages(br.spots, era, stats, br.lo < 10);
    pages.forEach((pg, pi) => {
      if (pi) out.push('\t\tnext;');
      out.push('\t\tmes ' + q(SPEAKER) + ';');
      out.push('\t\tmes ' + q(title + (pages.length > 1 ? ' (' + (pi + 1) + '/' + pages.length + ')' : '')) + ';');
      pg.forEach((s, si) => {
        if (si) out.push('\t\tmes "";');
        for (const l of spotBlock(s, 0)) out.push('\t\tmes ' + q(l) + ';');
        for (const t of s.tips) {
          out.push('\t\tif (' + t.keys.map((k) => '.@k == ' + k).join(' || ') + ') {');
          for (const l of wrap('Tip: ' + t.text)) out.push('\t\t\tmes ' + q(l) + ';');
          out.push('\t\t}');
        }
      });
    });
    out.push('\t\tbreak;');
  });
  out.push('\t}');
  out.push('\treturn;');
  return out;
}

// ---- gear / build / third labels -----------------------------------------------------------
// ---- gear: structured picks resolved against per-era item data --------------------------
const GEAR = require('./gear.js');
const { mapName } = require('./maps.js');
const ITEMS = {
  'pre-renewal': require('./itemdata-pre-renewal.json'),
  renewal: require('./itemdata-renewal.json'),
};

function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

// One pick -> one paragraph, or null when this era has no source for it.
function pickText(pick, era, key) {
  const [raw, note] = pick.split('|');
  const rec = ITEMS[era][raw];
  if (!rec) return null;
  if (!usable(rec, key)) return null;
  const label = D.B + raw + D.E;
  const isCard = rec.type === 'Card';
  let src = '';
  if (rec.shops && rec.shops.length) {
    src = 'Buy for ' + rec.shops.map((s) => money(s.price) + 'z at ' + s.cities.join(' or ')).join('; ');
  } else if (rec.drops && rec.drops.length) {
    const d = rec.drops[0];
    const where = [...new Set(d.maps.map(mapName))].join(' / ');
    src = d.mob + ' lv' + d.lv + (isCard ? '' : ', ' + (d.rate >= 1 ? Math.round(d.rate) : d.rate) + '%') + ' (' + where + ')';
    if (rec.drops[1] && !isCard) src += ' or ' + rec.drops[1].mob;
  } else {
    return null;
  }
  return label + (note ? ' - ' + note : '') + '. ' + (rec.shops && rec.shops.length ? '' : 'Drops from ') + src + '.';
}

// Gear menu sections (the NPC menu numbers them 2..7; 1 = buy list, 8 = general cards, 9 = tips):
//   2 weapon cards   3 drop-only weapons   4 armor + shield cards   5 garment / shoes / accessory cards
//   6 headgear cards   7 drop-only armor and accessories
const SECTIONS = {
  2: { parts: [['wcard', 'Weapon cards']] },
  4: { parts: [['armor', 'Armor'], ['shield', 'Shield']] },
  5: { parts: [['garment', 'Garment'], ['shoes', 'Shoes'], ['acc', 'Accessories']] },
  6: { parts: [['head', 'Headgear']] },
};

// job names as the item database writes them, per class key (line * 10 + branch)
const KEY_JOB = {
  0: 'Novice', 1: 'SuperNovice', 10: 'Swordman', 11: 'Knight', 12: 'Crusader', 20: 'Mage', 21: 'Wizard', 22: 'Sage', 30: 'Archer', 31: 'Hunter',
  32: 'BardDancer', 40: 'Acolyte', 41: 'Priest', 42: 'Monk', 50: 'Merchant', 51: 'Blacksmith', 52: 'Alchemist', 60: 'Thief', 61: 'Assassin',
  62: 'Rogue', 70: 'Taekwon', 71: 'StarGladiator', 72: 'SoulLinker', 80: 'Gunslinger', 81: 'Gunslinger', 90: 'Ninja', 91: 'Ninja', 92: 'Ninja',
};
// can this class use the item? Cards have no job limit; unknown class keys are not filtered.
function usable(rec, key) {
  if (!rec || rec.type === 'Card' || key === undefined || !rec.jobs) return true;
  const job = KEY_JOB[key];
  if (!job) return true;
  return rec.jobs.all ? !rec.jobs.except.includes(job) : rec.jobs.only.includes(job);
}

const SLOTTED_TIP = 'Shops sell armor WITHOUT a card slot. The slotted version ([1]) only drops from monsters, so to put a card in armor, shoes, garment or a shield you farm the slotted piece first. Weapons from shops already have slots.';

const TYPE_LABEL = {
  Dagger: 'Daggers', Katar: 'Katars', '1hSword': 'One-hand swords', '2hSword': 'Two-hand swords', '1hSpear': 'One-hand spears', '2hSpear': 'Two-hand spears',
  '1hAxe': 'One-hand axes', '2hAxe': 'Two-hand axes', Mace: 'Maces', Staff: 'Rods and staves', Knuckle: 'Knuckles', Bow: 'Bows', Whip: 'Whips',
  Musical: 'Instruments', Book: 'Books', Revolver: 'Revolvers', Rifle: 'Rifles', Shotgun: 'Shotguns', Gatling: 'Gatling guns', Huuma: 'Huuma shuriken',
};

function pickList(line, br, section) {
  const base = (GEAR.lines[line] || {})[section] || [];
  const add = ((GEAR.branches[line + ':' + br] || {})[section]) || [];
  return [...base, ...add];
}

const soldByShop = (name, era) => { const r = ITEMS[era][name.split('|')[0]]; return !!(r && r.shops && r.shops.length && !/\s\[\d\]$/.test(name.split('|')[0])); };

// A drop-only pick: best source first, with the numbers that make it worth farming.
function pickTextBest(pick, era, key) {
  const [raw, note0] = pick.split('|');
  const rec = ITEMS[era][raw];
  if (!rec || !rec.best || !rec.best.length) return null;
  if (!usable(rec, key)) return null;
  const note = (note0 || '').replace(/,? ?\d slots?$/, '').replace(/^\d slots?$/, '').trim();
  const stats = [];
  if (rec.type === 'Weapon' && rec.atk) stats.push('ATK ' + rec.atk);
  if (rec.lv && Number(rec.lv) > 1) stats.push('Lv ' + rec.lv);
  const src = rec.best.filter((b, i) => i === 0 || b.rate >= 0.05).map((b) => {
    const where = [...new Set(b.maps.map(mapName))].join(' / ');
    return b.mob + (b.mvp ? ' (MVP)' : '') + ' lv' + b.lv + ', ' + (b.rate >= 1 ? Math.round(b.rate * 10) / 10 : b.rate) + '% (' + where + ')';
  }).join(' or ');
  return D.B + raw + D.E + (stats.length ? ' (' + stats.join(', ') + ')' : '') + (note ? ' - ' + note : '') + '. Drops from ' + src + '.';
}

function dropOnlyWeapons(key, era) {
  const paras = [];
  const types = GEAR.dropOnly.classWeapons[key] || [];
  if (!types.length) {
    paras.push('Your class has no weapon to farm: Taekwon Kids and Star Gladiators fight bare-handed. Use the armor, shoes and accessory pages.');
    return paras;
  }
  paras.push('Weapons that only monsters drop (no NPC sells them): slotted versions of shop weapons, element weapons and weapons with skill bonuses. Rates are the normal ones; see Server rates.');
  for (const t of types) {
    const lines = (GEAR.dropOnly.weapons[t] || []).map((p) => pickTextBest(p, era, key)).filter(Boolean).slice(0, 7);
    if (!lines.length) continue;
    paras.push(D.B + (TYPE_LABEL[t] || t) + D.E + ':');
    for (const l of lines) paras.push('~' + l);
  }
  return paras;
}

function dropOnlyOther(key, era) {
  const prof = GEAR.dropOnly.classOther[key];
  const lines = ((GEAR.dropOnly.other[prof]) || []).map((p) => pickTextBest(p, era, key)).filter(Boolean);
  const paras = ['Armor, shields, shoes, garments and accessories that only monsters drop and that suit your class.'];
  paras.push(...lines.map((l) => '~' + l));
  if (!lines.length) paras.push('Nothing found for this game mode.');
  return paras;
}

function gearParagraphs(line, br, sec, era) {
  const key = Number(line) * 10 + br;
  if (sec === 3) return dropOnlyWeapons(key, era);
  if (sec === 7) return dropOnlyOther(key, era);
  const paras = [];
  if (sec === 4) paras.push(SLOTTED_TIP);
  for (const [section, title] of SECTIONS[sec].parts) {
    // anything an NPC sells is on the Buy page, not here
    const picks = pickList(line, br, section).filter((p) => !soldByShop(p, era));
    const lines = picks.map((p) => pickText(p, era, key)).filter(Boolean);
    if (!lines.length) continue;
    paras.push(D.B + title + D.E + ':');
    for (const l of lines) paras.push('~' + l);
  }
  if (paras.length <= (sec === 4 ? 1 : 0)) paras.push('No picks for this slot in this game mode.');
  return paras;
}

function emitGearSections(era) {
  const out = ['L_GearSec:', '	switch (getarg(0)) {'];
  for (const line of Object.keys(GEAR.lines)) {
    const maxBr = D.classes[line].branches.length - 1;
    for (let br = 0; br <= maxBr; br++) {
      for (const sec of [2, 3, 4, 5, 6, 7]) {
        out.push('	case ' + ((Number(line) * 10 + br) * 10 + sec) + ':');
        out.push(...emitPages(paginate(gearParagraphs(line, br, sec, era)), 2));
        out.push('		break;');
      }
    }
  }
  out.push('	}', '	return;');
  return out;
}

const WTYPE = { '1hSword': '1H sword', '2hSword': '2H sword', '1hSpear': '1H spear', '2hSpear': '2H spear', '1hAxe': '1H axe', '2hAxe': '2H axe', Dagger: 'dagger', Katar: 'katar', Bow: 'bow', Staff: 'rod / staff', Mace: 'mace', Rifle: 'rifle', Shotgun: 'shotgun', Revolver: 'revolver', Knuckle: 'knuckle', Musical: 'instrument', Whip: 'whip', Gatling: 'gatling', Huuma: 'huuma' };

function shopLine(name, era, key) {
  const rec = ITEMS[era][name];
  if (!rec || !rec.shops || !rec.shops.length) return null;
  if (!usable(rec, key)) return null;
  const lvl = rec.lv && Number(rec.lv) > 1 ? ' [Lv ' + rec.lv + ']' : '';
  const sub = rec.sub && rec.type === 'Weapon' ? ' (' + (WTYPE[rec.sub] || rec.sub) + ')' : '';
  return D.B + name + D.E + sub + lvl + ' ' + rec.shops.map((s) => money(s.price) + 'z ' + s.cities.map((c) => c.replace(/ \(door.*\)/, '')).join('/')).join(' / ');
}

// Buy page: starter tiers for the line, then everything else the picks mention that an NPC sells.
function starterParagraphs(line, br, era) {
  const key = Number(line) * 10 + br;
  const paras = [];
  paras.push('All of this is sold by NPCs. Prices are per item. Prontera: weapons and armor door at 177,221, tools door at 134,221, church door at 237,317. In other towns the dealers are inside the weapon and armor buildings.');
  const shown = new Set();
  for (const tier of GEAR.starter[line] || []) {
    const lines = [];
    for (const name of tier.items) {
      const l = shopLine(name, era, key);
      if (!l) continue;
      shown.add(name);
      lines.push(l);
    }
    if (!lines.length) continue;
    paras.push(D.B + tier.title + D.E + ':');
    paras.push(...lines.map((l) => '~' + l));
  }
  // other shop gear from this class's picks (headgear, shields, class armor, better weapons...)
  const extra = [];
  const sections = ['weapon', 'armor', 'shield', 'garment', 'shoes', 'head', 'acc'];
  for (const section of sections) {
    for (const p of pickList(line, br, section)) {
      const name = p.split('|')[0];
      if (shown.has(name) || /\s\[\d\]$/.test(name)) continue;
      const l = shopLine(name, era, key);
      if (!l) continue;
      shown.add(name);
      extra.push(l);
    }
  }
  if (extra.length) {
    paras.push(D.B + 'Also sold for your class' + D.E + ':');
    paras.push(...extra.map((l) => '~' + l));
  }
  return paras;
}

function emitStarter(era) {
  const out = ['L_Starter:', '	switch (getarg(0)) {'];
  for (const line of Object.keys(GEAR.starter)) {
    const maxBr = D.classes[line].branches.length - 1;
    for (let br = 0; br <= maxBr; br++) {
      out.push('	case ' + (Number(line) * 10 + br) + ':');
      out.push(...emitPages(paginate(starterParagraphs(line, br, era)), 2));
      out.push('		break;');
    }
  }
  out.push('	}', '	return;');
  return out;
}

function emitBuild() {
  const out = ['L_Build:', '	switch (getarg(0)) {'];
  for (const [line, brs] of Object.entries(D.build)) {
    for (const [br, paras] of Object.entries(brs)) {
      const key = Number(line) * 10 + Number(br);
      const vs = (V.variants[line] && V.variants[line][br] && V.variants[line][br].list) || [];
      out.push('	case ' + key + ':');
      out.push('		switch (getarg(1)) {');
      out.push('		case 0:');
      out.push(...emitPages(paginate(paras), 3));
      out.push('			break;');
      vs.forEach((v, i) => {
        out.push('		case ' + (i + 1) + ':');
        out.push(...emitPages(paginate(v.paras), 3));
        out.push('			break;');
      });
      out.push('		}');
      out.push('		break;');
    }
  }
  out.push('	}', '	return;');
  return out;
}

// Returns "main build:variant 1:variant 2" for lines that have variants, "" otherwise.
function emitBuildNames() {
  const out = ['L_BuildNames:', '	switch (getarg(0)) {'];
  for (const [line, brs] of Object.entries(V.variants)) {
    for (const [br, v] of Object.entries(brs)) {
      if (!v.list.length) continue;
      out.push('	case ' + (Number(line) * 10 + Number(br)) + ':');
      out.push('		return ' + q([v.std, ...v.list.map((x) => x.name)].join(':')) + ';');
    }
  }
  out.push('	}', '	return "";');
  return out;
}

function emitTrans() {
  const out = ['L_Trans:', '	switch (getarg(0)) {'];
  for (const [line, brs] of Object.entries(V.trans)) {
    for (const [br, paras] of Object.entries(brs)) {
      out.push('	case ' + (Number(line) * 10 + Number(br)) + ':');
      out.push('		next;');
      out.push(...emitPages(paginate(paras), 2));
      out.push('		break;');
    }
  }
  out.push('	}', '	return;');
  return out;
}

function emitEraNote(re) {
  return ['L_EraNote:', ...emitPages(paginate(re ? V.eraNote.re : V.eraNote.pre), 1), '	return;'];
}

function emitThird() {
  const out = ['L_Third:', '\tswitch (getarg(0)) {'];
  for (const [line, brs] of Object.entries(D.third)) {
    for (const [br, paras] of Object.entries(brs)) {
      out.push('\tcase ' + (Number(line) * 10 + Number(br)) + ':');
      out.push('\t\tnext;');
      out.push(...emitPages(paginate(paras), 2));
      out.push('\t\treturn 1;');
    }
  }
  out.push('\t}', '\treturn 0;');
  return out;
}

// ---- general card guide ------------------------------------------------------------------
const CARD_MENU = GEAR.general.map((g) => g[0]).join(':');
const CARD_COUNT = GEAR.general.length;

function emitCards(era) {
  const out = ['L_Cards:', '\tswitch (getarg(0)) {'];
  GEAR.general.forEach((g, i) => {
    const [title, intro, picks] = g;
    const paras = [D.B + title + D.E + ': ' + intro];
    for (const p of picks) {
      const t = pickText(p, era);
      if (t) paras.push('~' + t);
    }
    out.push('\tcase ' + i + ':');
    out.push(...emitPages(paginate(paras), 2));
    out.push('\t\tbreak;');
  });
  out.push('\t}', '\treturn;');
  return out;
}

// ---- MVP guide -----------------------------------------------------------------------------
const MVP = require('./mvp.js');

function mvpRanges(era) {
  const bounds = era === 'renewal' ? [50, 70, 80, 90, 100, 120, 140, 160] : [60, 70, 80, 90];
  return bounds.map((lo, i) => {
    const hi = i + 1 < bounds.length ? bounds[i + 1] - 1 : null;
    return { lo, hi, label: 'MVPs level ' + lo + (hi ? '-' + hi : '+') };
  });
}

function mvpList(era) {
  const all = require('./mvps-' + era + '.json');
  return all.filter((m) => !m.maps.every((x) => /^gld/.test(x)) && m.maps.length);
}

function mvpBodyParagraphs(m) {
  const where = [...new Set(m.maps.filter((x) => !/^gld/.test(x)).map(mapName))].join(' / ') || m.maps.map(mapName).join(' / ');
  const ele = m.ele + ' ' + m.eleLv;
  return [
    D.B + m.name + D.E + ' lv' + m.lv + ', ' + ele + ', ' + m.race + ', ' + m.size + ', HP ' + MVP.fmtHp(m.hp) + '. ' + where + '. Card: ' + (m.card || 'none') + '.',
  ];
}

function emitMvp(era) {
  const ranges = mvpRanges(era);
  const list = mvpList(era);
  const assess = MVP.makeAssessor(list, era);
  const out = ['L_Mvp:', '\t.@k = getarg(1);'];
  // class key -> profile index
  const idx = (p) => MVP.PROFILES.indexOf(p);
  out.push('\t.@p = ' + idx('melee') + ';');
  const byProfile = {};
  D.classes.forEach((c, li) => c.branches.forEach((_, bi) => { const k = li * 10 + bi; (byProfile[MVP.profileOf(k)] ??= []).push(k); }));
  for (const [prof, keys] of Object.entries(byProfile)) {
    if (prof === 'melee') continue;
    out.push('\tif (' + keys.map((k) => '.@k == ' + k).join(' || ') + ') .@p = ' + idx(prof) + ';');
  }
  out.push('\tswitch (getarg(0)) {');
  ranges.forEach((r, ri) => {
    out.push('\tcase ' + ri + ':');
    const inRange = list.filter((m) => m.lv >= r.lo && (r.hi === null || m.lv <= r.hi));
    // order: by level
    if (!inRange.length) {
      out.push('\t\tmes ' + q(SPEAKER) + ';', '\t\tmes "No MVPs in this range.";', '\t\tbreak;');
      return;
    }
    inRange.forEach((m, mi) => {
      if (mi) out.push("		next;");
      out.push('\t\tmes ' + q(SPEAKER) + ';');
      for (const l of wrap(mvpBodyParagraphs(m)[0])) out.push('\t\tmes ' + q(l) + ';');
      out.push('\t\tif (BaseLevel + 10 < ' + m.lv + ') mes "Far above your level for now.";');
      out.push('\t\telse if (BaseLevel + 3 < ' + m.lv + ') mes "A bit above your level.";');
      // per-profile outlook, grouped by identical text
      const groups = new Map();
      MVP.PROFILES.forEach((prof, pi) => {
        const a = assess(m, prof);
        let t = a.verdict + (a.how.length ? ': ' + a.how.join('; ') : '') + '.';
        if (a.warn.length) t += ' Skills to watch are on the next page.';
        if (!groups.has(t)) groups.set(t, []);
        groups.get(t).push(pi);
      });
      for (const [t, ps] of groups) {
        out.push('\t\tif (' + ps.map((p) => '.@p == ' + p).join(' || ') + ') {');
        for (const l of wrap('For your class: ' + t)) out.push('\t\t\tmes ' + q(l) + ';');
        out.push('\t\t}');
      }
      if (m.watch && m.watch.length) {
        out.push('\t\tnext;');
        const wp = [D.B + m.name + D.E + ' - skills to watch:', ...m.watch.map((w) => '~' + D.B + w.n + D.E + ': ' + w.t)];
        out.push(...emitPages(paginate(wp), 2));
      }
    });
    out.push('\t\tbreak;');
  });
  out.push('\t}', '\treturn;');
  return out;
}

// ---- server rates (read live from the server's battle config) -----------------------------
function emitRates() {
  const fmt = (v) => `(${v} / 100) + (${v} % 100 ? "." + (${v} % 100 < 10 ? "0" : "") + (${v} % 100) : "")`;
  const rows = [
    ['Base EXP', 'base_exp_rate'], ['Job EXP', 'job_exp_rate'], ['MVP EXP', 'mvp_exp_rate'], ['Quest EXP', 'quest_exp_rate'],
  ];
  const drops = [
    ['Normal items', 'item_rate_common'], ['Healing items', 'item_rate_heal'], ['Usable items', 'item_rate_use'],
    ['Equipment', 'item_rate_equip'], ['Cards', 'item_rate_card'], ['MVP rewards', 'item_rate_mvp'],
  ];
  const out = ['L_Rates:', '\tmes ' + q(SPEAKER) + ';', '\tmes "^0000FFExperience rates^000000 (1 = normal)";'];
  rows.forEach(([label, flag], i) => {
    out.push('\t.@r' + i + ' = getbattleflag("' + flag + '");');
    out.push('\tmes "' + label + ': x" + ' + fmt('.@r' + i) + ';');
  });
  out.push('\tnext;', '\tmes ' + q(SPEAKER) + ';', '\tmes "^0000FFDrop rates^000000 (1 = normal)";');
  drops.forEach(([label, flag], i) => {
    out.push('\t.@d' + i + ' = getbattleflag("' + flag + '");');
    out.push('\tmes "' + label + ': x" + ' + fmt('.@d' + i) + ';');
  });
  out.push('\t.@bc = getbattleflag("item_rate_card_boss");');
  out.push('\tmes "Cards from bosses: x" + ' + fmt('.@bc') + ';');
  out.push(
    '\tnext;',
    '\tmes ' + q(SPEAKER) + ';',
    '\tmes "^0000FFWhat that means for cards^000000";',
    '\tmes "A normal card has a base chance of 0.01% (1 in 10,000 kills).";',
    '\t.@n = (.@d4 > 0 ? 1000000 / .@d4 : 0);',
    '\tif (.@n > 0) mes "With your card rate that is about 1 in " + .@n + " kills.";',
    '\telse mes "Cards do not drop on this server.";',
    '\tmes "The drop chances on the gear pages are the normal rates; multiply them by the drop rate above.";',
    '\treturn;'
  );
  return out;
}

// ---- NPC -----------------------------------------------------------------------------------
function buildNpc(era) {
  const re = era === 'renewal';
  const brackets = re ? D.spotsRe : D.spotsPre;
  const suffix = re ? 're' : 'pre';
  const npcName = 'Adventurer Guide#advguide' + suffix;
  const maxbr = D.classes.map((c) => c.branches.length - 1);
  const out = [];

  out.push(
    '// Adventurer Guide (' + era + '): tells each class which monsters to hunt at its level, where to farm',
    '// gear and cards, and which stats and skills to take. Generated by tools/build.js from tools/data.js.',
    '//',
    '// The class is read from eaclass(): base job (EAJ_*), 2nd-class line (EAJL_2_1 / EAJL_2_2)' + (re ? ' and third class (EAJL_THIRD).' : '.'),
    '// Rebirth and baby classes use the page of their base line. The player can also open any other',
    '// class\'s page. No character variables are written.',
    '',
    'prontera,136,171,4\tscript\t' + npcName + '\t4_M_CRU_OLD,{',
    '\t.@eac = eaclass();',
    '\t.@line = 0; .@br = 0; .@known = 1;',
    '\tif (.@eac < 0) {',
    '\t\t.@known = 0;',
    '\t} else {',
    '\t\t.@line = .@eac & EAJ_BASEMASK;',
    '\t\tif (.@line > 9) { .@line = 0; .@known = 0; }',
    '\t\tif (.@eac & EAJL_2_1) .@br = 1;',
    '\t\telse if (.@eac & EAJL_2_2) .@br = 2;',
    '		if (.@eac & EAJL_UPPER) .@upper = 1;',
    '\t}',
    '\tsetarray .@maxbr[0], ' + maxbr.join(', ') + ';',
    '\tif (.@br > .@maxbr[.@line]) .@br = .@maxbr[.@line];',
    ''
  );

  // names, indexed line * 3 + branch
  const names = [];
  D.classes.forEach((c, li) => c.branches.forEach((bn, bi) => { names[li * 3 + bi] = bn; }));
  for (let i = 0; i < D.classes.length * 3; i++) if (names[i] === undefined) names[i] = '';
  out.push('\tsetarray .@bn$[0], ' + names.map(q).join(', ') + ';');
  out.push('\tsetarray .@cn$[0], ' + D.classes.map((c) => q(c.name)).join(', ') + ';');
  out.push('\tsetarray .@lo[0], ' + brackets.map((b) => b.lo).join(', ') + ';');
  out.push('\t.@nb = ' + brackets.length + ';');
  out.push('');

  out.push(
    '\t.@bracket = 0;',
    '\tfor (.@i = 0; .@i < .@nb; .@i++) { if (BaseLevel >= .@lo[.@i]) .@bracket = .@i; }',
    '',
    '',
    'L_Menu:',
    '\tmes ' + q(SPEAKER) + ';',
    '\tmes "Hello, " + strcharinfo(0) + ". I have walked every dungeon in Rune-Midgarts.";',
    '\tmes "You are a ^0000FF" + jobname(Class) + "^000000, base level ^0000FF" + BaseLevel + "^000000.";',
    '\tif (.@known == 0) mes "I do not have a page for your class yet. Showing the Novice guide; pick another class below.";',
    '\tmes "Guide shown for: ^0000FF" + .@bn$[.@line * 3 + .@br] + "^000000.";',
    '\tnext;',
    '\tswitch (select("Where should I level now?:Level spots for another level range:Gear and cards:Stats and skills:Bosses (MVP) I can try:Server rates:Show another class:How to look things up:Goodbye")) {',
    '\tcase 1:',
    '\t\tcallsub L_Spots, .@bracket, .@line * 10 + .@br;',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 2:',
    '\t\tmes ' + q(SPEAKER) + ';',
    '\t\tmes "Which level range?";',
    '\t\t.@m$ = "";',
    '\t\tfor (.@i = 0; .@i < .@nb; .@i++) {',
    '\t\t\t.@hi = (.@i + 1 < .@nb ? .@lo[.@i + 1] - 1 : 0);',
    '\t\t\t.@m$ += "Level " + .@lo[.@i] + (.@hi ? "-" + .@hi : "+") + (.@i == .@bracket ? " (you)" : "") + ":";',
    '\t\t}',
    '\t\t.@pick = select(.@m$ + "Back") - 1;',
    '\t\tif (.@pick >= .@nb) goto L_Menu;',
    '\t\tcallsub L_Spots, .@pick, .@line * 10 + .@br;',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 3:',
    '\t\tmes ' + q(SPEAKER) + ';',
    '\t\tmes "What do you need?";',
    '\t\t.@g = select("Buy from NPCs (starter and shop gear):Weapon cards:Weapons only monsters drop:Armor and shield cards:Garment, shoes, accessory cards:Headgear cards:Armor and accessories only monsters drop:Cards worth collecting:Tips on finding gear:Back");',
    '\t\tif (.@g == 10) goto L_Menu;',
    '\t\tif (.@g == 1) callsub L_Starter, .@line * 10 + .@br;',
    '\t\telse if (.@g == 8) {',
    '\t\t\tmes ' + q(SPEAKER) + ';',
    '\t\t\tmes "Which kind of card?";',
    '\t\t\t.@cg = select("' + CARD_MENU + ':Back") - 1;',
    '\t\t\tif (.@cg >= ' + CARD_COUNT + ') goto L_Menu;',
    '\t\t\tcallsub L_Cards, .@cg;',
    '\t\t}',
    '\t\telse if (.@g == 9) {',
    '\t\t\tmes ' + q(SPEAKER) + ';',
    ...D.common.flatMap((p) => wrap(p)).map((l) => '\t\t\tmes ' + q(l) + ';'),
    '\t\t}',
    '\t\telse callsub L_GearSec, (.@line * 10 + .@br) * 10 + .@g;',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 4:',
    '\t\t.@vn$ = callsub(L_BuildNames, .@line * 10 + .@br);',
    '\t\t.@v = 0;',
    '\t\tif (.@vn$ != "") {',
    '\t\t\tmes ' + q(SPEAKER) + ';',
    '\t\t\tmes "Which playstyle?";',
    '\t\t\t.@v = select(.@vn$) - 1;',
    '\t\t}',
    '\t\tcallsub L_Build, .@line * 10 + .@br, .@v;',
    '\t\tnext;',
    '\t\tcallsub L_EraNote;'
  );
  if (re) {
    out.push('\t\tif (.@br > 0) callsub L_Third, .@line * 10 + .@br;');
  }
  out.push('\t\tif (.@upper && .@br > 0) callsub L_Trans, .@line * 10 + .@br;');
  out.push(
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 5:',
    '\t\tsetarray .@mlo[0], ' + mvpRanges(era).map((r) => r.lo).join(', ') + ';',
    '\t\tsetarray .@mnames$[0], ' + mvpRanges(era).map((r) => q(r.label)).join(', ') + ';',
    '\t\t.@mrec = -1;',
    '\t\tfor (.@i = 0; .@i < ' + mvpRanges(era).length + '; .@i++) { if (BaseLevel + 5 >= .@mlo[.@i]) .@mrec = .@i; }',
    '\t\tmes ' + q(SPEAKER) + ';',
    ...wrap('These are only rough pointers from element weakness, DEF / MDEF, HP and the skills each boss uses. Even a boss that could be possible needs good gear, potions and a Fly Wing.').map((l) => '\t\tmes ' + q(l) + ';'),
    '\t\tif (.@mrec < 0) mes "The lowest boss listed is around level " + .@mlo[0] + ", so you are still early.";',
    '\t\tmes "Which boss level range?";',
    '\t\t.@m$ = "";',
    '\t\tfor (.@i = 0; .@i < ' + mvpRanges(era).length + '; .@i++) .@m$ += .@mnames$[.@i] + (.@i == .@mrec ? " (closest to your level)" : "") + ":";',
    '\t\t.@mp = select(.@m$ + "Back") - 1;',
    '\t\tif (.@mp >= ' + mvpRanges(era).length + ') goto L_Menu;',
    '\t\tcallsub L_Mvp, .@mp, .@line * 10 + .@br;',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 6:',
    '\t\tcallsub L_Rates;',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 7:',
    '\t\tmes ' + q(SPEAKER) + ';',
    '\t\tmes "Which class do you want to read about?";',
    '\t\t.@m$ = "";',
    '\t\tfor (.@i = 0; .@i < 10; .@i++) .@m$ += .@cn$[.@i] + ":";',
    '\t\t.@c = select(.@m$ + "Back") - 1;',
    '\t\tif (.@c >= 10) goto L_Menu;',
    '\t\t.@line = .@c;',
    '\t\t.@br = 0;',
    '\t\tif (.@maxbr[.@line] > 0) {',
    '\t\t\tmes ' + q(SPEAKER) + ';',
    '\t\t\tmes "Which branch?";',
    '\t\t\t.@m$ = "";',
    '\t\t\tfor (.@i = 0; .@i <= .@maxbr[.@line]; .@i++) .@m$ += .@bn$[.@line * 3 + .@i] + ":";',
    '\t\t\t.@br = select(.@m$) - 1;',
    '\t\t}',
    '\t\tgoto L_Menu;',
    '\tcase 8:',
    '\t\tmes ' + q(SPEAKER) + ';',
    '\t\tmes "^0000FF@mi <monster>^000000 shows a monster\'s level, HP, element and drops.";',
    '\t\tmes "^0000FF@whodrops <item>^000000 lists who drops an item.";',
    '\t\tmes "^0000FF@ii <item>^000000 shows an item\'s stats and effect.";',
    '\t\tmes "Check the monster\'s element before you cast or enchant.";',
    '\t\tmes "If a spot is too hard, go back one level range. If it is too easy, go forward.";',
    '\t\tnext;',
    '\t\tgoto L_Menu;',
    '\tcase 9:',
    '\t\tmes ' + q(SPEAKER) + ';',
    '\t\tmes "Good hunting!";',
    '\t\tclose;',
    '\t}',
    '\tend;',
    ''
  );

  out.push(...emitSpotLabel(brackets, 'L_Spots', era), '');
  out.push(...emitCards(era), '');
  out.push(...emitMvp(era), '');
  out.push(...emitRates(), '');
  out.push(...emitGearSections(era), '');
  out.push(...emitStarter(era), '');
  out.push(...emitBuild(), '');
  out.push(...emitBuildNames(), '');
  out.push(...emitEraNote(re), '');
  out.push(...emitTrans(), '');
  if (re) out.push(...emitThird(), '');
  out.push(
    'OnInit:',
    '\t.@custom = callfunc("F_ModSetting", "adventurer-guide", "sprite_id", 0);',
    '\tif (.@custom > 0) setnpcdisplay "' + npcName + '", "' + npcName + '", .@custom;',
    '\tend;',
    '}',
    ''
  );
  return out.join('\n');
}

for (const era of ['pre-renewal', 'renewal']) {
  const dir = path.join(__dirname, '..', era, 'npc');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'adventurer_guide.txt'), buildNpc(era), 'utf8');
  console.log('wrote', era);
}
