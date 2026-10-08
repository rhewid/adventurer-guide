// Turns the skills a monster uses (constants from mob_skill_db) into short "skills to watch" notes.
// watchFor(Set of skill constants) -> [{ n: 'Name', t: 'what it does and what helps' }], most important first.

// single skills: constant -> [rank, name, text]   (lower rank = more important)
const SINGLE = {
  NPC_HELLJUDGEMENT: [1, 'Hell\'s Judgement', 'huge AoE, its hardest hit. Keep your HP full and spread out.'],
  WZ_METEOR: [1, 'Meteor Storm', 'fire AoE dropped around you. Keep moving.'],
  WZ_VERMILION: [1, 'Lord of Vermilion', 'wind AoE that can blind (Deviruchi Card).'],
  WZ_STORMGUST: [1, 'Storm Gust', 'ice AoE that can freeze (Marc Card).'],
  WZ_JUPITEL: [2, 'Jupitel Thunder', 'wind hit that knocks you back.'],
  MG_THUNDERSTORM: [2, 'Thunderstorm', 'wind AoE.'],
  WZ_HEAVENDRIVE: [2, 'Heaven\'s Drive', 'earth AoE.'],
  NPC_GRANDDARKNESS: [1, 'Grand Cross of Darkness', 'dark AoE.'],
  CR_GRANDCROSS: [1, 'Grand Cross', 'holy AoE.'],
  NPC_EARTHQUAKE: [1, 'Earthquake', 'big AoE around it. Do not stand next to it.'],
  NPC_DARKBREATH: [2, 'Breath attacks', 'line / cone AoE. Stay out of its facing.'],
  NPC_FIREBREATH: [2, 'Breath attacks', 'line / cone AoE. Stay out of its facing.'],
  NPC_ACIDBREATH: [2, 'Breath attacks', 'line / cone AoE. Stay out of its facing.'],
  NPC_DARKNESSBREATH: [2, 'Breath attacks', 'line / cone AoE. Stay out of its facing.'],
  NPC_DRAGONFEAR: [2, 'Dragon Fear', 'AoE that can cause several statuses.'],
  NPC_PULSESTRIKE: [3, 'Pulse Strike', 'ground AoE.'],
  NPC_EVILLAND: [3, 'Evil Land', 'ground AoE.'],
  SM_MAGNUM: [3, 'Magnum Break', 'fire AoE with knockback.'],
  KN_BRANDISHSPEAR: [3, 'Brandish Spear', 'heavy line AoE in front of it.'],
  LK_SPIRALPIERCE: [3, 'Spiral Pierce', 'heavy single hit.'],
  BS_HAMMERFALL: [3, 'Hammer Fall', 'stuns everyone around it.'],
  WZ_QUAGMIRE: [4, 'Quagmire', 'slows you and lowers AGI / DEX.'],
  AL_DECAGI: [4, 'Decrease AGI', 'slows you.'],
  NPC_SLOWCAST: [4, 'Slow Cast', 'raises your cast time.'],
  AL_PNEUMA: [2, 'Pneuma', 'ranged physical attacks do nothing for a while. Use melee or magic.'],
  MG_SAFETYWALL: [2, 'Safety Wall', 'melee attacks do nothing for a while. Use ranged or magic.'],
  CR_REFLECTSHIELD: [2, 'Shield Reflect', 'sends melee damage back at you. Use ranged attacks.'],
  NPC_DEFENDER: [3, 'Defender', 'cuts ranged damage.'],
  HP_ASSUMPTIO: [3, 'Assumptio', 'halves the damage it takes for a while.'],
  CR_AUTOGUARD: [4, 'Guard', 'blocks some hits.'],
  NPC_MAGICMIRROR: [2, 'Magic Mirror', 'can reflect your spell back.'],
  NPC_STONESKIN: [3, 'Stone Skin', 'raises its DEF for a while.'],
  NPC_INVISIBLE: [3, 'Invisible', 'you cannot see it without Sight or Ruwach.'],
  AL_TELEPORT: [4, 'Teleport', 'it can teleport away when hit. Burst it down or trap it.'],
  SA_DISPELL: [3, 'Dispell', 'strips your buffs. Buff again.'],
  NPC_CRITICALSLASH: [3, 'Defense-ignoring attack', 'ignores your DEF.'],
  NPC_GUIDEDATTACK: [4, 'Guided Attack', 'never misses, so Flee will not help.'],
  NPC_EXPULSION: [4, 'Expulsion', 'teleports you away from it.'],
  NPC_POWERUP: [5, 'Power Up', 'hits harder when it is hurt.'],
  AL_HEAL: [5, 'Heal', 'heals itself. Burst it.'],
  NPC_ALLHEAL: [5, 'Full Heal', 'heals itself. Burst it.'],
};

// grouped skills: one note for several constants
const GROUPS = [
  { rank: 2, name: 'Equipment breakers', test: /^(NPC_ARMORBRAKE|NPC_WEAPONBRAKER|NPC_HELMBRAKE|NPC_SHIELDBRAKE|ST_FULLSTRIP|RG_STRIP\w+)$/,
    text: 'breaks or strips your gear. Carry spares; Cornutus Card keeps your armor from breaking.' },
  { rank: 3, name: 'Minions', test: /^(NPC_SUMMONSLAVE|NPC_CALLSLAVE|NPC_SUMMONMONSTER)$/,
    text: 'summons and recalls minions. Kill or AoE them first, or they swarm you.' },
  { rank: 3, name: 'Element change', test: /^NPC_CHANGE\w+$|^NPC_ATTRICHANGE$/,
    text: 'changes its element mid-fight. Check it again with @mi.' },
  { rank: 4, name: 'SP drain', test: /^(NPC_ENERGYDRAIN|NPC_MENTALBREAKER|NPC_WIDESOULDRAIN)$/,
    text: 'drains your SP. Carry Blue Potions.' },
  { rank: 4, name: 'HP drain', test: /^(NPC_BLOODDRAIN|NPC_VAMPIRE_GIFT)$/,
    text: 'drains HP to heal itself.' },
];

// status attacks, aggregated, each with the card that helps
const STATUS = [
  [/^(NPC_WIDESILENCE|NPC_SILENCEATTACK)$/, 'silence', 'Marduk Card'],
  [/^(NPC_WIDESTONE|NPC_PETRIFYATTACK|MG_STONECURSE)$/, 'petrify', 'Seeker Card / Argos Card'],
  [/^(NPC_WIDEFREEZE|MG_FROSTDIVER)$/, 'freeze', 'Marc Card'],
  [/^NPC_WIDESLEEP$/, 'sleep', 'Nightmare Card'],
  [/^(NPC_WIDECURSE|NPC_CURSEATTACK)$/, 'curse', 'Flame Skull Card'],
  [/^(NPC_WIDESTUN|NPC_STUNATTACK)$/, 'stun', 'Stalactic Golem Card / Flame Skull Card'],
  [/^(NPC_WIDEBLEEDING|NPC_BLEEDING)$/, 'bleeding', 'Ungoliant Card'],
  [/^NPC_HALLUCINATION$/, 'hallucination', ''],
];

function watchFor(set) {
  const out = new Map();
  const add = (rank, n, t) => { if (!out.has(n)) out.set(n, { rank, n, t }); };
  for (const c of set) {
    if (SINGLE[c]) add(...SINGLE[c]);
    for (const g of GROUPS) if (g.test.test(c)) add(g.rank, g.name, g.text);
  }
  const st = [];
  for (const [re, label, card] of STATUS) if ([...set].some((c) => re.test(c))) st.push([label, card]);
  if (st.length) {
    const cards = [...new Set(st.map((s) => s[1]).filter(Boolean))].slice(0, 3);
    add(3, 'Status attacks', st.map((s) => s[0]).join(', ') + '.' + (cards.length ? ' Helpful: ' + cards.join(', ') + '.' : ''));
  }
  return [...out.values()].sort((a, b) => a.rank - b.rank).slice(0, 6).map(({ n, t }) => ({ n, t }));
}

module.exports = { watchFor };
