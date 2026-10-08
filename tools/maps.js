// Map id -> readable name. Unknown ids fall back to the id itself.
const FIELD = {
  prt_fild: 'Prontera field', gef_fild: 'Geffen field', pay_fild: 'Payon field', moc_fild: 'Morocc field',
  yuno_fild: 'Juno field', ein_fild: 'Einbroch field', lhz_fild: 'Lighthalzen field', hu_fild: 'Hugel field',
  ra_fild: 'Rachel field', ve_fild: 'Veins field', nif_fild: 'Niflheim field', cmd_fild: 'Comodo field',
  um_fild: 'Umbala field', ayo_fild: 'Ayothaya field', gon_fild: 'Gonryun field', mosk_fild: 'Moscovia field',
  xmas_fild: 'Lutie field', ama_fild: 'Amatsu field', lou_fild: 'Louyang field',
};

// [regex, name function]
const RULES = [
  [/^mjolnir_\d+$/, () => 'Mt. Mjolnir'],
  [/^prt_sewb(\d)$/, (m) => 'Prontera Culvert F' + m[1]],
  [/^anthell0(\d)$/, (m) => 'Ant Hell F' + m[1]],
  [/^mjo_dun0(\d)$/, (m) => 'Coal Mine F' + m[1]],
  [/^pay_dun0(\d)$/, (m) => 'Payon Cave F' + (+m[1] + 1)],
  [/^iz_dun0(\d)$/, (m) => 'Byalan Dungeon F' + (+m[1] + 1)],
  [/^orcsdun0(\d)$/, (m) => 'Orc Dungeon F' + m[1]],
  [/^in_sphinx(\d)$/, (m) => 'Sphinx F' + m[1]],
  [/^moc_pryd0(\d)$/, (m) => 'Pyramid F' + m[1]],
  [/^moc_prydn(\d)$/, () => 'Pyramid (Nightmare)'],
  [/^gef_dun0(\d)$/, (m) => 'Geffen Dungeon F' + (+m[1] + 1)],
  [/^c_tower(\d)$/, (m) => 'Clock Tower F' + m[1]],
  [/^alde_dun0(\d)$/, (m) => 'Clock Tower B' + m[1]],
  [/^gl_church$/, () => 'Glast Heim Church'],
  [/^gl_chyard$/, () => 'Glast Heim Churchyard'],
  [/^gl_knt0(\d)$/, () => 'Glast Heim Chivalry'],
  [/^gl_cas0(\d)$/, () => 'Glast Heim Castle'],
  [/^gl_in01$/, () => 'Glast Heim Inner'],
  [/^gl_prison1?$/, () => 'Glast Heim Prison'],
  [/^gl_sew0(\d)$/, () => 'Glast Heim Sewers'],
  [/^ra_san0(\d)$/, (m) => 'Rachel Sanctuary F' + m[1]],
  [/^tha_t0(\d)$/, (m) => 'Thanatos Tower F' + m[1]],
  [/^lhz_dun0(\d)$/, (m) => 'Bio Lab F' + m[1]],
  [/^abyss_0(\d)$/, (m) => 'Abyss Lake F' + m[1]],
  [/^abbey0(\d)$/, (m) => 'Cursed Abbey F' + m[1]],
  [/^mag_dun0(\d)$/, (m) => 'Magma Dungeon F' + m[1]],
  [/^kh_dun0(\d)$/, (m) => 'Kiel Hyre F' + m[1]],
  [/^tur_dun0(\d)$/, (m) => 'Turtle Island F' + m[1]],
  [/^gefenia0\d$/, () => 'Gefenia'],
  [/^ice_dun0(\d)$/, (m) => 'Ice Cave F' + m[1]],
  [/^thor_v0(\d)$/, (m) => 'Thor Volcano F' + m[1]],
  [/^xmas_dun0(\d)$/, (m) => 'Toy Factory F' + m[1]],
  [/^treasure(_n)?0?\d$/, () => 'Sunken Ship'],
  [/^beach_dun\d?$/, () => 'Comodo Cave'],
  [/^ama_dun0(\d)$/, (m) => 'Amatsu Dungeon F' + m[1]],
  [/^ayo_dun0(\d)$/, (m) => 'Ayothaya Dungeon F' + m[1]],
  [/^gon_dun0(\d)$/, (m) => 'Gonryun Dungeon F' + m[1]],
  [/^lou_dun0(\d)$/, (m) => 'Louyang Dungeon F' + m[1]],
  [/^um_dun0(\d)$/, (m) => 'Umbala Dungeon F' + m[1]],
  [/^ein_dun0(\d)$/, (m) => 'Einbroch Dungeon F' + m[1]],
  [/^odin_tem0(\d)$/, () => 'Odin Temple'],
  [/^jawaii$/, () => 'Jawaii'],
  [/^juperos_0(\d)$/, (m) => 'Juperos F' + m[1]],
  [/^jupe_core$/, () => 'Juperos Core'],
  [/^nyd_dun0\d$/, () => 'Nidhoggr Nest'],
  [/^mosk_dun0(\d)$/, (m) => 'Moscovia Dungeon F' + m[1]],
  [/^gld_dun0\d(_2)?$/, () => 'Guild dungeon'],
];

function mapName(id) {
  for (const [re, fn] of RULES) {
    const m = id.match(re);
    if (m) return fn(m);
  }
  const f = id.match(/^([a-z]+_fild)\d+$/);
  if (f && FIELD[f[1]]) return FIELD[f[1]];
  return id;
}

module.exports = { mapName };
