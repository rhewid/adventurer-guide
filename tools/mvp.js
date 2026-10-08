// MVP guide: which MVPs a class can try on its own, from the server's monster data.
// This is a rule of thumb (element weakness, DEF / MDEF, HP, dangerous skills), not a promise:
// gear, buffs and potions decide a real fight. The text says so in game.

// class key (line * 10 + branch) -> profile
const PROFILE_OF = {};
const set = (profile, keys) => keys.forEach((k) => { PROFILE_OF[k] = profile; });
set('mage', [20, 21, 22, 90, 91, 92]);
set('holycaster', [40, 41]);
set('holymelee', [12]);
set('trap', [31]);
set('ranged', [30, 32, 80, 81]);
set('rogue', [60, 61, 62]);
set('monk', [42]);
set('melee', [0, 1, 10, 11, 50, 51, 52, 70, 71, 72]);

const PROFILES = ['mage', 'holycaster', 'holymelee', 'trap', 'ranged', 'rogue', 'monk', 'melee'];
const profileOf = (key) => PROFILE_OF[key] || 'melee';

const SPELL = {
  Fire: 'Fire Bolt / Meteor Storm', Water: 'Cold Bolt / Storm Gust', Wind: 'Lightning Bolt / Lord of Vermilion',
  Earth: 'Earth Spike / Heaven\'s Drive', Ghost: 'Soul Strike',
};
const MAGE_ELEMS = Object.keys(SPELL);

function best(weak, elems) {
  let m = 100, e = null;
  for (const w of weak || []) if (elems.includes(w.ele) && w.mult > m) { m = w.mult; e = w.ele; }
  return { mult: m, ele: e };
}
const hpTier = (hp, era) => (era === 'renewal' ? (hp > 10e6 ? 2 : hp > 3e6 ? 1 : 0) : (hp > 2e6 ? 2 : hp > 8e5 ? 1 : 0));
const defTier = (m, era) => {
  const r = era === 'renewal' ? m.def / m.lv : m.def;
  const hi = era === 'renewal' ? 4.5 : 60, mid = era === 'renewal' ? 3.5 : 40;
  return r >= hi ? 2 : r >= mid ? 1 : 0;
};
const mdefTier = (m, era) => {
  const r = era === 'renewal' ? m.mdef / m.lv : m.mdef;
  const hi = era === 'renewal' ? 3 : 60, mid = era === 'renewal' ? 2 : 40;
  return r >= hi ? 2 : r >= mid ? 1 : 0;
};

const MAGIC_DANGER = ['Meteor Storm', 'Storm Gust', 'Lord of Vermilion', 'Jupitel Thunder', 'Thunderstorm', 'Heavens Drive', 'Grand Darkness'];
const STATUS = ['stun', 'sleep', 'curse', 'blind', 'silence', 'stone', 'confusion', 'freeze'];

function assessRaw(m, profile, era) {
  let score = 0;
  const how = [];
  const w = m.weak || [];
  if (profile === 'mage') {
    const b = best(w, MAGE_ELEMS);
    if (b.mult >= 175) { score += 3; how.push('weak to ' + b.ele + ': ' + SPELL[b.ele]); }
    else if (b.mult >= 150) { score += 2; how.push('weak to ' + b.ele + ': ' + SPELL[b.ele]); }
    else if (b.mult >= 125) { score += 1; how.push(b.ele + ' spells do a little extra'); }
    score -= mdefTier(m, era);
  } else if (profile === 'holycaster' || profile === 'holymelee') {
    const holy = best(w, ['Holy']).mult;
    const evil = m.race === 'Undead' || m.race === 'Demon' || m.ele === 'Undead';
    if (holy >= 150) { score += 3; how.push('weak to Holy: ' + (profile === 'holymelee' ? 'Grand Cross / Holy Cross' : 'Magnus Exorcismus / Turn Undead / Holy Light')); }
    else if (evil) { score += 1; how.push(m.ele === 'Undead' ? 'Undead: Turn Undead and Magnus work' : 'Demon: Magnus Exorcismus works'); }
    score -= profile === 'holycaster' ? mdefTier(m, era) : defTier(m, era);
  } else if (profile === 'trap') {
    const b = best(w, ['Fire', 'Earth']);
    if (b.mult >= 150) { score += 2; how.push('weak to ' + b.ele + ': ' + (b.ele === 'Fire' ? 'Claymore Trap' : 'Land Mine')); }
    if (defTier(m, era) >= 1) { score += 2; how.push('traps ignore its DEF'); } else how.push('Claymore Trap / Land Mine');
  } else if (profile === 'ranged') {
    if (best(w, ['Holy']).mult >= 150) { score += 1; how.push('Silver Arrows / Bullets hit it hard'); }
    score -= defTier(m, era);
  } else if (profile === 'monk') {
    if (defTier(m, era) >= 1) { score += 1; how.push('Investigate scales with its DEF'); }
    if (hpTier(m.hp, era) === 0) { score += 1; how.push('Asura Strike can end it fast'); }
  } else if (profile === 'rogue') {
    score -= defTier(m, era);
  } else {
    score -= defTier(m, era);
  }
  score -= hpTier(m.hp, era);
  const d = m.dangers || [];
  const warn = [];
  if (d.some((x) => /minions/.test(x))) { score -= 1; warn.push('summons minions'); }
  const mg = d.filter((x) => MAGIC_DANGER.includes(x));
  if (mg.length) { score -= 1; warn.push('casts ' + mg.slice(0, 2).join(' / ')); }
  const st = [...new Set(d.filter((x) => STATUS.includes(x)))];
  if (st.length >= 2) { score -= 1; warn.push('inflicts ' + st.slice(0, 3).join(', ')); }
  if (hpTier(m.hp, era) === 2) warn.push('very long fight');
  return { score, how, warn };
}

// Verdicts are relative to how the profile fares against ALL MVPs of the era, so a melee class
// still sees which bosses suit it best even though none is easy.
function makeAssessor(list, era) {
  const median = {};
  for (const p of PROFILES) {
    const sc = list.map((m) => assessRaw(m, p, era).score).sort((a, b) => a - b);
    median[p] = sc[Math.floor(sc.length / 2)];
  }
  function assess(m, profile) {
    const a = assessRaw(m, profile, era);
    const d = a.score - median[profile];
    // relative rank alone is not enough: the absolute score must also look reasonable
    let verdict;
    if (a.score >= 2 && d >= 1) verdict = 'Could be possible';
    else if (a.score >= -1 && d >= 0) verdict = 'Possible only with good preparation';
    else if (a.score >= -3) verdict = 'Unlikely alone';
    else verdict = 'Not realistic alone';
    return { ...a, verdict };
  }
  return assess;
}

function fmtHp(hp) {
  if (hp >= 1e6) return (hp / 1e6).toFixed(hp >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  return Math.round(hp / 1000) + 'k';
}

module.exports = { profileOf, PROFILES, makeAssessor, fmtHp };
