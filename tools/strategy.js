// Per-class hunting tips for a level spot, worked out from the spot's monster data
// (tools/spotstats-*.json: element, race, size, DEF / MDEF, crowd size), plus a few
// hand-written tips for notable combinations.
//
// key = line * 10 + branch (same numbers as the NPC script uses), e.g. 61 = Assassin line.

const SPELLS = {
  mage: { Fire: 'Fire Bolt', Water: 'Cold Bolt / Frost Diver', Wind: 'Lightning Bolt / Thunderstorm', Ghost: 'Soul Strike' },
  wizard: { Fire: 'Fire Bolt / Meteor Storm', Water: 'Cold Bolt / Storm Gust', Wind: 'Jupitel Thunder / Lord of Vermilion', Earth: 'Earth Spike / Heaven\'s Drive', Ghost: 'Soul Strike' },
  sage: { Fire: 'Fire Bolt', Water: 'Cold Bolt', Wind: 'Lightning Bolt', Earth: 'Earth Spike / Heaven\'s Drive', Ghost: 'Soul Strike' },
  ninja: { Fire: 'Flaming Petals / Exploding Dragon', Water: 'Freezing Spear / Snow Flake Draft', Wind: 'Wind Blade / Thunderstorm' },
};

const MAGE_KEY = { 20: 'mage', 21: 'wizard', 22: 'sage', 90: 'ninja', 91: 'ninja', 92: 'ninja' };

function top(list, n) { return (list || []).filter((w) => w.mult >= 150).slice(0, n); }
const names = (arr) => arr.map((w) => w.ele).join(' / ');

function crowd(s) { return s.perMap >= 220 ? 'huge' : s.perMap >= 130 ? 'big' : 'small'; }
function heavyDef(s, era) { return era === 'renewal' ? s.def >= 150 && s.mdef <= s.def * 0.4 : s.def >= 25 && s.mdef <= s.def * 0.75; }
function undeadish(s) { return s.ele === 'Undead' || s.race === 'Undead'; }
function demonish(s) { return s.race === 'Demon' || s.ele === 'Dark'; }
function holyWeak(s) { return (s.weak || []).some((w) => w.ele === 'Holy' && w.mult >= 150); }

function rule(s, key, era) {
  const line = Math.floor(key / 10);
  const isCrowd = crowd(s) !== 'small';
  const weak = top(s.weak, 2);

  // ---- casters: pick spells by weakness, avoid resisted elements ----
  if (MAGE_KEY[key]) {
    const table = SPELLS[MAGE_KEY[key]];
    const picks = weak.filter((w) => table[w.ele]);
    const bad = (s.resist || []).filter((r) => table[r.ele] && r.mult <= 50).map((r) => r.ele);
    const parts = [];
    if (picks.length) parts.push(names(picks) + '-weak monsters here: ' + picks.map((w) => table[w.ele]).join(' or ') + '.');
    if (bad.length) parts.push('They resist ' + bad.join(' / ') + ', so skip those spells.');
    if (s.mdef <= 10 && s.def >= 15) parts.push('Very low MDEF, so spells beat melee here.');
    if (MAGE_KEY[key] === 'sage' && picks.length) parts.push('Let Hindsight (Auto Spell) cast the weak bolt.');
    return parts.length ? parts.join(' ') : null;
  }

  switch (key) {
    case 10: // Swordman
      return isCrowd ? 'Pull a pack, Endure, and use Magnum Break on the crowd; Bash the leftovers.' : null;
    case 11: { // Knight
      if (s.size === 'Large') return 'Large targets take three Pierce hits: ride a Peco and use Pierce or Brandish Spear.';
      if (isCrowd) return 'Pull the pack and use Bowling Bash; Magnum Break clears what is left around you.';
      return null;
    }
    case 12: { // Crusader
      if (undeadish(s) || demonish(s) || holyWeak(s)) return 'Holy damage is strong here: Grand Cross (AoE) and Holy Cross, with Faith and Heal keeping you alive.';
      return isCrowd ? 'Auto Guard, then Holy Cross into the crowd.' : null;
    }
    case 30: // Archer
    case 31: { // Hunter
      const out = [];
      if (key === 31) {
        if (isCrowd) out.push('Lay Claymore Trap / Land Mine lines where they walk.');
        if (heavyDef(s, era) || s.def >= 40) out.push('Traps ignore DEF, so they work on armoured targets.');
        if (s.race === 'Brute' || s.race === 'Insect') out.push('Beast Bane and Beast Strafing hit ' + s.race.toLowerCase() + 's extra hard.');
        if (!out.length) out.push('Blitz Beat with the falcon, Double Strafe for the rest.');
      } else if (isCrowd) out.push('Arrow Shower pushes the pack back and hits the lot.');
      if (holyWeak(s)) out.push('Silver Arrows hit holy-weak monsters hard.');
      else if ((s.weak || []).some((w) => w.ele === 'Fire' && w.mult >= 150)) out.push('Fire Arrows do extra damage.');
      return out.length ? out.join(' ') : null;
    }
    case 32: // Bard/Dancer
      return null;
    case 40: // Acolyte
      return undeadish(s) ? 'Holy Light and Heal both damage Undead: heal yourself while you fight.' : null;
    case 41: { // Priest
      if (s.ele === 'Undead') return 'Undead element: Turn Undead and Magnus Exorcismus kill whole packs. Lex Aeterna the tough ones.';
      if (demonish(s)) return 'Demon / Dark here: Magnus Exorcismus and Holy damage work well. Lex Aeterna before big hits.';
      return null;
    }
    case 42: { // Monk
      if (heavyDef(s, era) || s.def >= 30) return 'High DEF: Investigate (Occult Impaction) hits harder the more DEF they have.';
      return 'Combo (Triple, Chain, Finish); keep spirit spheres up for Asura Strike on the big ones.';
    }
    case 50: // Merchant
      return isCrowd ? 'Cart Revolution on a pack; sell the loot when full.' : null;
    case 51: // Blacksmith
      return isCrowd ? 'Hammerfall stuns a group, then Cart Revolution; keep Adrenaline Rush up.' : null;
    case 52: // Alchemist
      return 'Acid Terror breaks armor on hard targets; Bomb (Acid Demonstration) and your Homunculus do the damage.';
    case 60: // Thief
      return isCrowd ? 'Double Attack with a dagger; Hiding lets you rest between pulls.' : null;
    case 61: { // Assassin
      const out = [];
      if (isCrowd) out.push('Cloak, then hit crowds with Grimtooth from hiding (katar).');
      else out.push('Sonic Blow on single targets.');
      return out.join(' ');
    }
    case 62: { // Rogue
      if (isCrowd) return 'Raid (stealth AoE) into the pack, then Back Stab the survivors.';
      return 'Back Stab for single targets; Strip Armor on high-DEF monsters.';
    }
    case 80: // Gunslinger
      return isCrowd ? 'Revolver: Desperado on yourself in a crowd. Shotgun: Spread Attack. Keep HP up.' : 'Tracking / Piercing Shot for single targets.';
    default:
      return null;
  }
}

// Hand-written tips for specific spots: curated[spot.map] = { key: text, ... }
const curated = {
  'juperos_01, juperos_02': {
    61: 'Venatu and Apocalypse come in hundreds in tight lines: stay in Cloaking and sweep them with Grimtooth (katar). Keep Sonic Blow for strays.',
    31: 'The machines pack tight in the corridors: lay Claymore Traps and Land Mines in a row and let the falcon finish.',
  },
  'jupe_core': {
    61: 'Dense packs again: Cloaking plus Grimtooth, and Sonic Blow on Archdam.',
  },
  'beach_dun2': {
    31: 'Stalactic Golems are big, slow and armoured: Claymore Traps ignore DEF, so lay them in their path and shoot from range.',
    20: 'Stalactic Golems have very low MDEF: spells (Napalm, Soul Strike, bolts) beat the DEF-heavy melee approach.',
    21: 'Stalactic Golems have very low MDEF: stay out of melee and nuke them (Jupitel Thunder, Storm Gust).',
    22: 'Stalactic Golems have very low MDEF: let Hindsight cast bolts while you kite.',
  },
  'gl_knt01, gl_knt02': {
    31: 'Raydric and Khalitzburg have high DEF: traps ignore it. Put traps at the chokepoints.',
    21: 'High DEF, low MDEF: spells beat melee here. Dark element is weak to Holy only, so use neutral spells and stay back.',
  },
};

function tipFor(stat, key, era, spotMap) {
  if (!stat) return null;
  const c = curated[spotMap] && curated[spotMap][key];
  const r = rule(stat, key, era);
  if (c) return c;
  return r;
}

module.exports = { tipFor, MAGE_KEY };
