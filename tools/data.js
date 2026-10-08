// Content tables for the Adventurer Guide. Edit here, then run:  node tools/build.js
// Never edit pre-renewal/npc/adventurer_guide.txt or renewal/npc/adventurer_guide.txt by hand.
//
// Text is plain strings. ^0000FF...^000000 colours a phrase (the builder re-opens the colour on
// wrapped lines). Avoid double quotes. One array entry = one paragraph.
//
// Level spots were picked from the monster spawn tables and mob_db that ship with the app
// (median level of what actually spawns on each map), separately for pre-renewal and renewal,
// because renewal re-levelled most dungeons.

const B = '^0000FF', E = '^000000', R = '^FF0000';
const b = (s) => B + s + E;

// ---- Classes -------------------------------------------------------------------------------
// line = eA base job (EAJ_*), branch 0 = first class, 1 = "2-1" line, 2 = "2-2" line.
const classes = [
  { name: 'Novice',     branches: ['Novice', 'Super Novice'] },
  { name: 'Swordman',   branches: ['Swordman', 'Knight line', 'Crusader line'] },
  { name: 'Mage',       branches: ['Mage', 'Wizard line', 'Sage line'] },
  { name: 'Archer',     branches: ['Archer', 'Hunter line', 'Bard / Dancer line'] },
  { name: 'Acolyte',    branches: ['Acolyte', 'Priest line', 'Monk line'] },
  { name: 'Merchant',   branches: ['Merchant', 'Blacksmith line', 'Alchemist line'] },
  { name: 'Thief',      branches: ['Thief', 'Assassin line', 'Rogue line'] },
  { name: 'Taekwon',    branches: ['Taekwon', 'Star Gladiator line', 'Soul Linker line'] },
  { name: 'Gunslinger', branches: ['Gunslinger', 'Rebellion line'] },
  { name: 'Ninja',      branches: ['Ninja', 'Kagerou line', 'Oboro line'] },
];

// ---- Level spots ---------------------------------------------------------------------------
// spot(name, map, 'mobs and why', { lineIndex: 'extra tip for that class line' })
const spot = (name, map, text, hints) => ({ name, map, text, hints: hints || {} });

const UNDEAD = { 4: 'Undead here: Holy Light, Turn Undead and Magnus Exorcismus are very strong.', 2: 'Undead: bring plenty of SP, they come in groups. Cast from range.' };
const WATER = { 2: 'Water element: Lightning Bolt (wind) does the most damage.' };

// pre-renewal: monster levels top out around 99
const spotsPre = [
  { lo: 1, spots: [
    spot('Prontera South Field', 'prt_fild08', 'Poring, Lunatic, Fabre, Pupa. Safe and crowded, perfect for the first levels.', { 4: 'Fight with Heal in reserve; Porings are harmless, you will level fast.' }),
    spot('Geffen / Payon fields', 'gef_fild07, pay_fild03', 'Fabre, Chonchon, Pupa, Willow. Pupa drops the Pupa Card (+700 Max HP armor card).'),
    spot('Prontera Culvert F1', 'prt_sewb1', 'From about level 8: Thief Bug, Familiar, Tarou. More EXP, but they hit back. Carry potions.'),
  ]},
  { lo: 10, spots: [
    spot('Prontera Culvert F2 / F3', 'prt_sewb2, prt_sewb3', 'Thief Bugs (insects), Tarou, Spore. Dense spawns, fast EXP.'),
    spot('Payon Cave F1', 'pay_dun00', 'Skeleton, Zombie, Familiar, Poporing. Mostly undead.', UNDEAD),
    spot('Ant Hell F1', 'anthell01', 'Andre, Piere, Deniro (insects). Andre Card gives +20 Base ATK.'),
    spot('Byalan Dungeon F1 / F2', 'iz_dun00, iz_dun01', 'Plankton, Marina, Kukre, Vadon. Kukre Card gives AGI +2.', WATER),
    spot('Coal Mine F1', 'mjo_dun01', 'Tarou, Familiar, Martin. A gentle first dungeon.'),
  ]},
  { lo: 20, spots: [
    spot('Ant Hell F2', 'anthell02', 'Andre, Vitata, Piere, Deniro. More ants, more EXP.'),
    spot('Coal Mine F2', 'mjo_dun02', 'Martin, Giearth, Drainliar, Skeleton Worker. Skeleton Worker Card: +15% vs Medium size.'),
    spot('Orc Dungeon F1', 'orcsdun01', 'Orc Zombie, Orc Skeleton, Steel Chonchon. Undead orcs.', UNDEAD),
    spot('Payon Cave F2', 'pay_dun01', 'Soldier Skeleton, Archer Skeleton, Eggyra. Archer Skeleton Card: +10% ranged damage.', UNDEAD),
    spot('Sphinx F1', 'in_sphinx1', 'Drainliar, Zerom, Requiem, Matyr. Zerom Card: DEX +3. Matyr Card: Max HP +10%.'),
  ]},
  { lo: 30, spots: [
    spot('Orc Dungeon F2', 'orcsdun02', 'Orc Skeleton, Zenorc, Steel Chonchon. Zenorc Card: +10 Base ATK.', UNDEAD),
    spot('Pyramid F2 / F3', 'moc_pryd02, moc_pryd03', 'Mummy, Verit, Matyr, Skeleton archers. Verit Card: Max HP/SP +8% (shoes).', UNDEAD),
    spot('Coal Mine F3', 'mjo_dun03', 'Skeleton Worker, Myst, Martin, Giearth. Good for levels 30-38.'),
    spot('Payon Cave F4', 'pay_dun03', 'Sohee, Hydra, Mandragora, Whisper. Sohee Card and Muffler drop here.'),
    spot('Byalan Dungeon F4', 'iz_dun03', 'Phen, Marc, Swordfish, Hydra. Marc Card: freeze immunity.', WATER),
    spot('Geffen Dungeon F2', 'gef_dun01', 'Ghoul, Jakk, Nightmare, Zombie. Mixed, sturdier monsters.', UNDEAD),
  ]},
  { lo: 40, spots: [
    spot('Geffen Dungeon F3', 'gef_dun02', 'Nightmare, Deviruchi, Whisper, Marionette. Whisper/Marionette cards for garments.'),
    spot('Pyramid F5', 'moc_pryd05', 'Minorous, Verit, Mummy. Minorous Card: +15% vs Large.'),
    spot('Sphinx F3', 'in_sphinx3', 'Marduk, Pasana, Matyr, Mimic. Marduk Card gives silence immunity.'),
    spot('Ayothaya Dungeon', 'ayo_dun01, ayo_dun02', 'Leaf Cat, Ghoul, Whisper, Kraben, Tamruan.'),
    spot('Glast Heim Churchyard', 'gl_chyard', 'Wraith, Ghoul, Zombie, Evil Druid. Lots of undead.', UNDEAD),
    spot('Umbala Dungeon', 'um_dun01, um_dun02', 'Wootan Shooter / Fighter, Stone Shooter, Wooden Golem.'),
  ]},
  { lo: 50, spots: [
    spot('Glast Heim Church', 'gl_church', 'Evil Druid, Ghoul, Wraith, Mimic. Evil Druid drops the Biretta headgear.', UNDEAD),
    spot('Glast Heim Chivalry', 'gl_knt01, gl_knt02', 'Raydric, Raydric Archer, Khalitzburg, Rideword. Raydric Card (garment), Arbalest bow. Hits hard.'),
    spot('Clock Tower F1 - F4', 'c_tower1 ... c_tower4', 'Punk, Clock, Alarm, Rideword. Bathory drops the Wizard Hat. Clock and Alarm cards.'),
    spot('Rachel Sanctuary F1 / F2', 'ra_san01, ra_san02', 'Vanberk, Isilla, Gremlin, Hodremlin. Decent EXP, crowded.'),
    spot('Einbroch Dungeon F2', 'ein_dun02', 'Mineral, Obsidian, Teddy Bear, Old Stove.'),
    spot('Ice Cave F2 / F3', 'ice_dun02, ice_dun03', 'Snowier, Siroma, Ice Titan, Gazeti. Water/ice monsters.', { 2: 'Ice monsters: fire spells do the most damage.' }),
    spot('Comodo Cave F2', 'beach_dun2', 'Stalactic Golem, Tri Joint, Megalith, Nereid (up to level 60). Big, tough golems that drop good EXP.'),
    spot('Thanatos Tower F1 / F2', 'tha_t01, tha_t02', 'Plasma, Rideword, Mimic, Alice. Good EXP, dangerous for weak builds.'),
  ]},
  { lo: 60, spots: [
    spot('Rachel Sanctuary F3', 'ra_san03', 'Seeker, Hodremlin, Beholder, Gremlin.'),
    spot('Thanatos Tower F3 - F6', 'tha_t03 ... tha_t06', 'Death Word, Ancient Mimic, Elder, Plasma. High EXP, high risk. Party up.', UNDEAD),
    spot('Abyss Lake F1', 'abyss_01', 'Ferus, Novus, Mimic, Penomena. Dragons and formless.'),
    spot('Kiel Hyre', 'kh_dun01', 'Aliza, Alice, Constant, Aliot (dolls and toys).'),
    spot('Lighthalzen Bio Lab F2', 'lhz_dun02', 'Egnigem Cenia, Errende Ebecee, Kavach Icarus... human players-style monsters, Muffler / bow drops.'),
    spot('Magma Dungeon F2', 'mag_dun02', 'Deleter, Nightmare Terror, Blazer, Diabolic. Fire element.', { 2: 'Fire element: Cold Bolt / Frost Diver / Storm Gust (water).' }),
  ]},
  { lo: 70, spots: [
    spot('Turtle Island F3 / F4', 'tur_dun03, tur_dun04', 'Freezer, Assaulter, Permeter, Heater. Solid EXP, not too crowded.'),
    spot('Rachel Sanctuary F4 / F5', 'ra_san04, ra_san05', 'Echio, Agav, Seeker, Hodremlin.'),
    spot('Abyss Lake F2 / F3', 'abyss_02, abyss_03', 'Acidus, Ferus, Novus, Ancient Mimic.'),
    spot('Gefenia', 'gefenia01 - gefenia04', 'False Angel, Violy, Mini Demon, Succubus / Incubus. Demon types.'),
    spot('Cursed Abbey F1 / F2', 'abbey01, abbey02', 'Banshee, Ghoul, Zombie Slaughter, Flame Skull. Banshee Card is made for mages.', UNDEAD),
    spot('Juperos F1 / F2', 'juperos_01, juperos_02', 'Venatu, Dimik, Apocalypse. Huge, dense, machine-type crowds.'),
  ]},
  { lo: 80, spots: [
    spot('Juperos Core', 'jupe_core', 'Dimik, Venatu, Archdam. Big crowds for AoE builds.'),
    spot('Cursed Abbey F3', 'abbey03', 'Banshee, Flame Skull. Undead casters.', UNDEAD),
    spot('Nidhoggr Nest', 'nyd_dun01', 'Draco, Aqua Elemental, Dark Pinguicula. Dragons.'),
    spot('Lighthalzen Bio Lab F3', 'lhz_dun03', 'Cecil Damon, Kathryne Keyron, Seyren Windsor, Eremes Guile (levels 82-92). The best normal EXP; very dangerous alone.'),
  ]},
  { lo: 90, spots: [
    spot('Lighthalzen Bio Lab F3', 'lhz_dun03', 'Levels 82-92 humanoids. Still the best normal EXP before 99. Bring Endow/Blessing buffs and a party.'),
    spot('MVP and mini-boss hunting', 'various', 'Past 90 ordinary monsters give little. Hunt MVPs for EXP, cards and unique gear. Use @mi <name> to see their level, HP and drops.'),
  ]},
];

// renewal: this app re-levels dungeons, monsters go up to level ~195 (data from its renewal mob_db)
const spotsRe = [
  { lo: 1, spots: [
    spot('Prontera South Field', 'prt_fild08, prt_fild01', 'Poring, Lunatic, Fabre. Safe and crowded. Levels 1-8 pass quickly.'),
    spot('Geffen / Payon fields', 'gef_fild07, pay_fild03', 'Pupa, Chonchon, Fabre, Willow. Pupa Card: +700 Max HP armor card.'),
  ]},
  { lo: 10, spots: [
    spot('Payon Forest', 'pay_fild01', 'Willow, Poring, Fabre (level 8). Last of the soft spots.'),
    spot('Prontera West Field', 'prt_fild05, prt_fild07', 'Hornet, Thief Bug, Rocker, Savage Babe (11-15). Rocker Card: DEX +1 and Base ATK.'),
    spot('Morroc Field', 'moc_fild11', 'Baby Desert Wolf, Condor, Scorpion (12-16).'),
    spot('Payon fields', 'pay_fild02, pay_fild06', 'Wormtail, Boa, Spore (level 17-18).'),
  ]},
  { lo: 20, spots: [
    spot('Prontera Culvert F1 / F2', 'prt_sewb1, prt_sewb2', 'Thief Bugs, Familiar, Tarou (levels 18-24).'),
    spot('Prontera Culvert F3', 'prt_sewb3', 'Thief Bug Male / Female, Familiar (21-30).'),
    spot('Coal Mine F1', 'mjo_dun01', 'Tarou, Familiar, Martin (22).'),
    spot('Pyramid F1', 'moc_pryd01', 'Familiar, Poporing (24-30).'),
    spot('Payon Cave F1', 'pay_dun00', 'Skeleton, Zombie, Familiar (17-30). Undead.', { 4: 'Undead here: Holy Light, Turn Undead and Magnus Exorcismus are very strong.' }),
  ]},
  { lo: 30, spots: [
    spot('Ant Hell F1 / F2', 'anthell01, anthell02', 'Andre, Piere, Deniro, Vitata (24-35). Andre Card: +20 Base ATK.'),
    spot('Toy Factory F2', 'xmas_dun02', 'Myst Case, Cruiser, Cookie (35-41).'),
    spot('Payon Cave F2', 'pay_dun01', 'Soldier / Archer Skeleton, Eggyra (34). Archer Skeleton Card: +10% ranged damage.'),
    spot('Sunken Ship', 'treasure01', 'Hydra, Pirate Skeleton, Kukre (34).'),
  ]},
  { lo: 40, spots: [
    spot('Byalan Dungeon F1 - F3', 'iz_dun00, iz_dun01, iz_dun02', 'Plankton, Marina, Vadon, Kukre, Hydra, Cornutus (40-48).', WATER),
    spot('Coal Mine F2', 'mjo_dun02', 'Martin, Giearth, Skeleton Worker (39-47). Skeleton Worker Card: +15% vs Medium.'),
    spot('Pyramid F2', 'moc_pryd02', 'Soldier / Archer Skeleton, Mummy (30-55, mostly 47).'),
  ]},
  { lo: 50, spots: [
    spot('Orc Dungeon F1 / F2', 'orcsdun01, orcsdun02', 'Orc Skeleton, Zenorc, Steel Chonchon (47-54). Zenorc Card: +10 Base ATK.', { 4: 'Undead orcs: Holy damage works well.' }),
    spot('Byalan Dungeon F4', 'iz_dun03', 'Phen, Marc, Swordfish (52). Marc Card: freeze immunity.', WATER),
    spot('Pyramid F3 / F5', 'moc_pryd03, moc_pryd05', 'Mummy, Verit, Matyr, Minorous (55-58). Verit Card: Max HP/SP +8%.'),
    spot('Sphinx F1', 'in_sphinx1', 'Drainliar, Zerom, Requiem, Matyr (47-71).'),
  ]},
  { lo: 60, spots: [
    spot('Comodo Cave F2', 'beach_dun2', 'Stalactic Golem, Tri Joint, Megalith, Nereid (34-98 mixed). Stalactic Golems are the main EXP.'),
    spot('Byalan Dungeon F5', 'iz_dun04', 'Merman, Strouf, Marine Sphere (60).', WATER),
    spot('Geffen Dungeon F2', 'gef_dun01', 'Ghoul, Jakk, Nightmare, Zombie (mostly 61).'),
    spot('Ayothaya Dungeon F1', 'ayo_dun01', 'Leaf Cat, Ghoul, Whisper, Kraben (61-64).'),
    spot('Payon Cave F4 / F5', 'pay_dun03, pay_dun04', 'Sohee, Hydra, Dokebi, Horong, Nine Tail (64-68). Sohee Card and Muffler drop in F4.'),
  ]},
  { lo: 70, spots: [
    spot('Sphinx F2 / F3', 'in_sphinx2, in_sphinx3', 'Zerom, Requiem, Matyr, Marduk, Pasana (70-73). Marduk Card: silence immunity.'),
    spot('Ayothaya Dungeon F2', 'ayo_dun02', 'Tamruan, Whisper, Kraben (73).'),
    spot('Geffen Dungeon F4', 'gef_dun03', 'Wraith, Wind Ghost (77). Small map.'),
    spot('Glast Heim Church', 'gl_church', 'Evil Druid, Wraith, Mimic (77-80). Undead.', { 4: 'Undead here: Holy Light, Turn Undead and Magnus Exorcismus are very strong.' }),
    spot('Clock Tower F1', 'c_tower1', 'Rideword, Punk, Bathory (74-82). Bathory drops the Wizard Hat.'),
  ]},
  { lo: 80, spots: [
    spot('Moscovia Dungeon', 'mosk_dun01, mosk_dun02, mosk_dun03', 'Leshij, Lesavka, Baba-Yaga, Kikimora (81-87).'),
    spot('Clock Tower F2 / F3', 'c_tower2, c_tower3', 'Clock, Punk, Alarm, Mimic (81-88).'),
    spot('Clock Tower Basement', 'alde_dun03, alde_dun04', 'Penomena, Cramp, Bathory, Joker (82-90).'),
    spot('Dewata Dungeon', 'dew_dun01, dew_dun02', 'Comodo (81), Banaspaty, Butoijo (85-88).'),
    spot('Einbroch Dungeon F1', 'ein_dun01', 'Pitman, Porcellio, Noxious, Venomous (85-90).'),
  ]},
  { lo: 90, spots: [
    spot('Einbroch Dungeon F2', 'ein_dun02', 'Mineral, Obsidian, Teddy Bear, Old Stove (91-97).'),
    spot('Turtle Island F3 / F4', 'tur_dun03, tur_dun04', 'Freezer, Assaulter, Permeter, Heater (94-98).'),
    spot('Geffen Dungeon F3', 'gef_dun02', 'Deviruchi, Marionette, Nightmare, Whisper (90-93).'),
    spot('Glast Heim Prison', 'gl_prison, gl_prison1', 'Zombie Prisoner, Injustice, Skeleton Prisoner (89-98).', { 4: 'Undead here: Holy Light, Turn Undead and Magnus Exorcismus are very strong.' }),
    spot('Magma Dungeon F1', 'mag_dun01', 'Explosion, Kaho, Blazer, Lava Golem (98-103).'),
  ]},
  { lo: 100, spots: [
    spot('Ice Cave F1 - F3', 'ice_dun01, ice_dun02, ice_dun03', 'Siroma, Snowier, Gazeti, Ice Titan (98-110).', { 2: 'Ice monsters: fire spells do the most damage.' }),
    spot('Magma Dungeon F2', 'mag_dun02', 'Deleter, Nightmare Terror, Blazer, Diabolic (105).'),
    spot('Glast Heim Sewers', 'gl_sew03, gl_sew04', 'Sting, Gargoyle, Anolian (104-109).'),
    spot('Niflheim', 'niflheim, nif_fild01, nif_fild02', 'Quve, Lude, Gibbet, Dullahan, Heirozoist (101-110).'),
    spot('Glast Heim Underground', 'gl_dun01, gl_dun02', 'Arclouze, Sting, Majoruros (107).'),
    spot('Malaya', 'ma_dun01, ma_fild01', 'Tiyanak, Manananggal, Tikbalang (105-107).'),
  ]},
  { lo: 110, spots: [
    spot('Kiel Hyre', 'kh_dun01, kh_dun02', 'Aliza, Alicel, Aliot, Constant (112).'),
    spot('Juperos F1', 'juperos_01', 'Venatu, Dimik (113). Dense crowds.'),
    spot('Juperos Core', 'jupe_core', 'Dimik, Venatu, Archdam (116).'),
    spot('Nidhoggr Nest', 'nyd_dun01', 'Draco, Aqua Elemental, Dark Pinguicula (114).'),
    spot('Gefenia', 'gefenia01 - gefenia04', 'False Angel, Violy, Mini Demon (117-118).'),
    spot('Glast Heim Chivalry / Castle', 'gl_knt01, gl_knt02, gl_cas02', 'Raydric, Khalitzburg, Abysmal Knight (115). Raydric Card (garment).'),
    spot('Thanatos Tower F2 - F6', 'tha_t02 ... tha_t06', 'Death Word, Ancient Mimic, Elder, Plasma (112-114).'),
  ]},
  { lo: 120, spots: [
    spot('Rachel Sanctuary', 'ra_san01 ... ra_san05', 'Vanberk, Isilla, Seeker, Echio, Agav (123-128).'),
    spot('Cursed Abbey', 'abbey01, abbey02, abbey03', 'Zombie Slaughter, Banshee, Flame Skull (123-130).', { 4: 'Undead here: Holy Light, Turn Undead and Magnus Exorcismus are very strong.' }),
    spot('Abyss Lake', 'abyss_01 ... abyss_03', 'Ferus, Acidus, Novus, Ancient Mimic (126-130).'),
    spot('Thor Volcano', 'thor_v01, thor_v02', 'Imp, Magmaring, Knocker, Kaho (126-129).'),
    spot('Manuk / Dicastes', 'man_fild02, man_fild03, dic_dun01', 'Bradium Golem, Tatacho, Centipede, Scaraba (125-130).'),
  ]},
  { lo: 130, spots: [
    spot('Lighthalzen Bio Lab F2', 'lhz_dun02', 'Laurell Weinder, Wickebine Tres, Errende Ebecee (133).'),
    spot('Dicastes Dungeon', 'dic_dun02', 'Antler Scaraba, Rake Scaraba (136).'),
  ]},
  { lo: 140, spots: [
    spot('Lighthalzen Bio Lab F3 / F4', 'lhz_dun03, lhz_dun04', 'Cecil Damon, Kathryne Keyron, Celia, Gertie (141). Strong humans; best normal EXP around here.'),
    spot('Eclage dungeons', 'ecl_tdun01 ... ecl_tdun03', 'Cenere, Antique Book, Lichtern (146-155).'),
    spot('Prontera Prison', 'prt_prison', 'Taffy, Watcher, Frozen Wolf (140-145).'),
  ]},
  { lo: 150, spots: [
    spot('Clock Tower, Nightmare mode', 'c_tower2_, c_tower3_', 'Neo Punk, Big Ben, Big Bell, Time Keeper (143-168).'),
    spot('Glast Heim, Nightmare mode', 'gl_chyard_, gl_cas02_', 'Nightmare Wraith Dead, Nightmare Mimic, Nightmare Evil Druid (110-151).'),
    spot('Verus', 'verus01, verus02, ver_eju', 'Repair Robot, Explorer Robot, Recon Robot (150-171).'),
    spot('Nogg Road bunker', 'un_bunker', 'Smelly Zombie, Machine Component (148-155).'),
  ]},
  { lo: 165, spots: [
    spot('Rudus caves', 'sp_rudus2, sp_rudus3', 'Plaga, Mutant Dolor, Mutant Venenum (164-178).'),
    spot('Warehouse levels', 'ba_2whs01, ba_2whs02', 'Broken Cleaning Robot, Broken Warehouse Manager (175-186).'),
    spot('Late-game endpoint', 'ba_pw03', 'Spell Addicted Plaga / Sanare (192-194). Top-tier monsters.'),
  ]},
];

// ---- Gear: the structured picks live in gear.js ----------------------------------------------
const common = [
  'Tip: ' + b('@whodrops <item>') + ' and ' + b('@mi <monster>') + ' show who drops what, and where. Cards drop at about 0.01%, so a farm spot with many monsters on one screen is better than a rare one.',
];

module.exports = { classes, spotsPre, spotsRe, common, b, B, E, R };
