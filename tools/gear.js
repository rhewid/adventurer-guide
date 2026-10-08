// Equipment and card picks per class line. Edit here, then run:
//   node tools/extract.js <path to rathena>     (only when picks or the server data change)
//   node tools/build.js
//
// A pick is 'Item name|short note'. 'Name [1]' means the slotted version of an item
// (shops sell the slotless one; the slotted one only drops from monsters).
// Where to buy / which monster drops it is looked up per era from tools/itemdata-*.json,
// so the same pick can point to different maps in renewal and pre-renewal.
// Cards that no ordinary monster drops in an era are left out for that era.
//
// sections: weapon (buy), wcard (weapon cards), armor, shield, garment, shoes, head, acc
// branches add picks to a section for one 2nd-class line.

const lines = {
  0: {
    weapon: ['Sword|1H, level 2', 'Falchion|1H', 'Blade|1H', 'Rod|+15% MATK', 'Town Sword|Novice / Super Novice only, level 30', 'Cinquedea|dagger, Novice / Super Novice only, level 30'],
    wcard: ['Skeleton Card|+10 Base ATK, stun chance', 'Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Familiar Card|+5 Base ATK, blind chance'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Picky Card|STR +1, +10 Base ATK', 'Pupa Card|+700 Max HP', 'Roda Frog Card|+400 HP, +50 SP'],
    shield: ['Guard [1]|slotted shield', 'Thief Bug Egg Card|+400 Max HP', 'Ambernite Card|DEF +2', 'Thara Frog Card|-30% damage from humans'],
    garment: ['Hood [1]|slotted garment', 'Condor Card|Flee +10', 'Dustiness Card|-30% wind, Flee +5'],
    shoes: ['Sandals [1]|slotted shoes', 'Chonchon Card|AGI +1, Flee +2', 'Male Thief Bug Card|AGI +2', 'Eggyra Card|SP recovery +15%'],
    head: ['Hat [1]|slotted headgear', 'Willow Card|+80 Max SP', 'Stainer Card|silence resist', 'Coco Card|sleep resist'],
    acc: ['Novice Armlet|400z, 1 card slot, Novice / Super Novice only', 'Tarou Card|STR +2', 'Spore Card|VIT +2', 'Kukre Card|AGI +2'],
  },
  1: {
    weapon: ['Katana|2H sword, level 4', 'Slayer|2H sword, level 18', 'Bastard Sword|2H sword, level 18', 'Rapier|1H sword, level 14', 'Saber|1H sword, level 27', 'Pike|1H spear, level 4', 'Glaive|2H spear, level 18'],
    wcard: ['Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Zenorc Card|+10 Base ATK, poison', 'Skeleton Worker Card|+15% vs Medium', 'Minorous Card|+15% vs Large', 'Hydra Card|+20% vs humans'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Wooden Mail [1]|slotted, Swordman line', 'Chain Mail [1]|slotted, DEF 8', 'Picky Card|STR +1, +10 Base ATK', 'Pupa Card|+700 Max HP', 'Savage Card|VIT +3', 'Marc Card|freeze immunity', 'Cornutus Card|armor does not break'],
    shield: ['Buckler [1]|slotted shield', 'Shield [1]|slotted, Swordman line', 'Thara Frog Card|-30% damage from humans', 'Orc Warrior Card|-30% damage from beasts', 'Khalitzburg Card|-30% damage from demons', 'Horn Card|-35% ranged damage'],
    garment: ['Muffler [1]|slotted garment', 'Raydric Card|-20% neutral damage', 'Marionette Card|-30% ghost damage', 'Condor Card|Flee +10'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Verit Card|Max HP / SP +8%', 'Alarm Card|HP +300, VIT +1, auto Sight'],
    head: ['Helm|44000z, Swordman line', 'Cap [1]|slotted headgear', 'Giearth Card|confusion immune, -15% earth', 'Marduk Card|silence immunity', 'Ghoul Card|poison resist'],
    acc: ['Mantis Card|STR +3', 'Tarou Card|STR +2', 'Spore Card|VIT +2', 'Heater Card|+3 crit'],
  },
  2: {
    weapon: ['Rod|+15% MATK', 'Wand|INT +1, +15% MATK, level 12', 'Staff|Wizard / Sage only, level 12', 'Arc Wand|level 24', 'Survivor\'s Rod|INT +3, +400 HP, +15% MATK'],
    wcard: ['Hill Wind Card|Thunderstorm, Jupitel, LoV +5%', 'Pitman Card|Earth Spike, Heaven\'s Drive +5%', 'Red Ferus Card|Fire Pillar, Meteor +5%', 'Laurell Weinder Card|Frost Nova, Storm Gust +3%', 'Death Word Card|Napalm Beat, Soul Strike, Vulcan +5%'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Silk Robe [1]|slotted robe', 'Silver Robe [1]|slotted, Mage line', 'Roda Frog Card|+400 HP, +50 SP', 'Pupa Card|+700 Max HP', 'Agav Card|MATK +5%, Mage +100 SP (DEF -10)', 'Baby Desert Wolf Card|INT +1'],
    shield: ['Guard [1]|slotted shield', 'Thief Bug Egg Card|+400 Max HP', 'Frus Card|Mage MDEF +3, reflects magic', 'Thara Frog Card|-30% damage from humans'],
    garment: ['Hood [1]|slotted garment', 'Harpy Card|-15% neutral, Napalm Beat +5%', 'Isis Card|-30% shadow', 'Marionette Card|-30% ghost', 'Raydric Card|-20% neutral'],
    shoes: ['Sohee Card|Max SP +15%, SP regen', 'Eggyra Card|SP recovery +15%', 'Miyabi Doll Card|Max SP +10%, Frost Diver +5%', 'Verit Card|Max HP / SP +8%'],
    head: ['Circlet|7500z, Mage line', 'Wizard Hat|Max SP +100', 'Elder Willow Card|INT +2', 'Carat Card|INT +2, SP +150 at +9', 'Isilla Card|INT +2, cast speed boost', 'Tower Keeper Card|INT +1, cast time -5%'],
    acc: ['Zerom Card|DEX +3', 'Wormtail Card|DEX +2', 'Siroma Card|Cold Bolt +25%, cast -25%', 'Beholder Card|learn Cast Cancel', 'Phen Card|no cast interruption'],
  },
  3: {
    weapon: ['Bow|level 4', 'Composite Bow|level 4', 'Great Bow|level 18', 'Crossbow|level 18', 'Gakkung Bow|level 33', 'Arbalest|DEX +2, level 33', 'Hunter Bow|level 33', 'Arrow|1z', 'Silver Arrow|vs undead and holy'],
    wcard: ['Archer Skeleton Card|+10% ranged damage', 'Goblin Archer Card|crit damage +10%, +7% vs undead', 'Kobold Archer Card|crit damage +10%, +7% vs plants', 'Soldier Skeleton Card|+9 critical', 'Hunter Fly Card|drains HP', 'Drosera Card|+15 ranged critical'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Tights|71000z, Archer line, level 45', 'Rocker Card|DEX +1, +5 Base ATK', 'Pupa Card|+700 Max HP', 'Picky Card|STR +1, +10 Base ATK'],
    shield: ['Guard [1]|slotted shield', 'Horn Card|-35% ranged damage', 'Thief Bug Egg Card|+400 Max HP'],
    garment: ['Muffler [1]|slotted garment', 'Dragon Tail Card|Flee +10, AGI +1, Double Strafe / Arrow Shower +5%', 'Whisper Card|Flee +20 (ghost hits harder)'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Verit Card|Max HP / SP +8%', 'Wild Rose Card|AGI +1'],
    head: ['Cap [1]|slotted headgear', 'Ribbon|800z', 'Deviruchi Card|STR +1, blind immune', 'Stainer Card|silence resist'],
    acc: ['Zerom Card|DEX +3', 'Wormtail Card|DEX +2', 'Yoyo Card|Flee2 +5, AGI +1', 'Kukre Card|AGI +2'],
  },
  4: {
    weapon: ['Club|1H mace, level 2', 'Mace|1H mace, level 2', 'Smasher|level 14', 'Flail|level 14', 'Chain|level 14', 'Morning Star|level 27'],
    wcard: ['Skeleton Card|+10 Base ATK, stun chance', 'Andre Card|+20 Base ATK', 'Chepet Card|chance to cast Heal 5', 'Seal Card|Acolyte: crit vs undead and demon'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Scapulare|6500z, Acolyte line', 'Saint\'s Robe|54000z', 'Silk Robe [1]|slotted robe', 'Pupa Card|+700 Max HP', 'Roda Frog Card|+400 HP, +50 SP'],
    shield: ['Guard [1]|slotted shield', 'Buckler [1]|slotted shield', 'Thara Frog Card|-30% damage from humans', 'Muscipular Card|auto Heal + Increase AGI when hit'],
    garment: ['Muffler [1]|slotted garment', 'Raydric Card|-20% neutral', 'Isis Card|-30% shadow', 'Marionette Card|-30% ghost'],
    shoes: ['Sohee Card|Max SP +15%, SP regen', 'Eggyra Card|SP recovery +15%', 'Merman Card|HP and SP regen +10%', 'Matyr Card|Max HP +10%, AGI +1'],
    head: ['Biretta|9000z, Acolyte line', 'Marduk Card|silence immunity', 'Ghoul Card|poison resist', 'Isilla Card|INT +2, cast speed boost', 'Elder Willow Card|INT +2'],
    acc: ['Rosary|15000z, level 20', 'Cookie Card|LUK +2, Holy Light +10%', 'Greatest General Card|Acolyte: chance of spirit spheres', 'Zerom Card|DEX +3', 'Spore Card|VIT +2'],
  },
  5: {
    weapon: ['Axe|1H axe, level 3', 'Battle Axe|2H axe, level 3', 'Hammer|2H axe, level 16', 'Buster|2H axe, level 30', 'Two-Handed Axe|2H axe, level 30', 'Mace|1H mace, level 2', 'Chain|level 14'],
    wcard: ['Zipper Bear Card|+30 Base ATK (Merchant: unbreakable)', 'Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Skeleton Worker Card|+15% vs Medium'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Wooden Mail [1]|slotted, Merchant line', 'Padded Armor [1]|slotted, DEF 7', 'Chain Mail [1]|slotted, DEF 8', 'Baby Leopard Card|LUK +3, Merchant: unbreakable armor', 'Porcellio Card|+25 Base ATK, DEF -5', 'Pupa Card|+700 Max HP'],
    shield: ['Buckler [1]|slotted shield', 'Guard [1]|slotted shield', 'Thara Frog Card|-30% damage from humans', 'Thief Bug Egg Card|+400 Max HP'],
    garment: ['Muffler [1]|slotted garment', 'Manteau|32000z', 'Raydric Card|-20% neutral', 'Hode Card|-30% earth, Flee +5'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Verit Card|Max HP / SP +8%', 'Raggler Card|STR +1, VIT +1'],
    head: ['Cap [1]|slotted headgear', 'Giearth Card|confusion immune', 'Deviruchi Card|STR +1, blind immune'],
    acc: ['Pirate Skeleton Card|learn Discount 5', 'Mantis Card|STR +3', 'Tarou Card|STR +2', 'Spore Card|VIT +2'],
  },
  6: {
    weapon: ['Knife|dagger', 'Main Gauche|dagger', 'Dirk|dagger, level 12', 'Stiletto|dagger, level 12', 'Gladius|dagger, level 24', 'Damascus|dagger, level 24', 'Jur|katar, level 18', 'Katar|katar, level 33', 'Jamadhar|katar, level 33'],
    wcard: ['Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Zenorc Card|+10 Base ATK, poison', 'Soldier Skeleton Card|+9 critical', 'Desert Wolf Card|+15% vs Small', 'Injustice Card|chance to cast Sonic Blow'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Jacket [1]|slotted', 'Thief Clothes|74000z, Thief line, DEF 6', 'Padded Armor [1]|slotted, DEF 7', 'Rocker Card|DEX +1, +5 Base ATK', 'Pupa Card|+700 Max HP', 'Picky Card|STR +1, +10 Base ATK'],
    shield: ['Guard [1]|slotted shield', 'Buckler [1]|slotted shield', 'Thara Frog Card|-30% damage from humans', 'Horn Card|-35% ranged damage'],
    garment: ['Muffler [1]|slotted garment', 'Manteau|32000z', 'Nine Tail Card|AGI +2, Flee +20 at +9', 'Whisper Card|Flee +20 (ghost hits harder)', 'Kavach Icarus Card|Flee +20, +1 Flee2'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Male Thief Bug Card|AGI +2', 'Wild Rose Card|AGI +1, Thief: Flee2 +5'],
    head: ['Cap [1]|slotted headgear', 'Deviruchi Card|STR +1, blind immune', 'Stainer Card|silence resist', 'Coco Card|sleep resist'],
    acc: ['Kukre Card|AGI +2', 'Mantis Card|STR +3', 'Zerom Card|DEX +3', 'Kobold Card|STR +1, +4 crit', 'Heater Card|+3 crit', 'Joker Card|learn Steal 1'],
  },
  7: {
    weapon: [],
    wcard: [],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Picky Card|STR +1, +10 Base ATK', 'Pupa Card|+700 Max HP', 'Rocker Card|DEX +1, +5 Base ATK'],
    shield: ['Guard [1]|slotted shield', 'Thief Bug Egg Card|+400 Max HP'],
    garment: ['Muffler [1]|slotted garment', 'Manteau|32000z', 'Whisper Card|Flee +20 (ghost hits harder)'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Male Thief Bug Card|AGI +2', 'Verit Card|Max HP / SP +8%'],
    head: ['Hat [1]|slotted headgear', 'Deviruchi Card|STR +1, blind immune', 'Coco Card|sleep resist'],
    acc: ['Kukre Card|AGI +2', 'Mantis Card|STR +3', 'Zerom Card|DEX +3', 'Spore Card|VIT +2'],
  },
  8: {
    weapon: ['Branch|rifle, level 1', 'Cyclone|rifle, level 24', 'Rolling Stone|shotgun, level 14', 'Black Rose|shotgun, level 35', 'Crimson Bolt|revolver, level 35', 'Bullet|1z', 'Silver Bullet|15z'],
    wcard: ['Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Soldier Skeleton Card|+9 critical', 'Goblin Archer Card|crit damage +10%, +7% vs undead', 'Drosera Card|+15 ranged critical'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Rocker Card|DEX +1, +5 Base ATK', 'Pupa Card|+700 Max HP', 'Picky Card|STR +1, +10 Base ATK'],
    shield: ['Guard [1]|slotted shield', 'Horn Card|-35% ranged damage'],
    garment: ['Muffler [1]|slotted garment', 'Whisper Card|Flee +20 (ghost hits harder)', 'Dragon Tail Card|Flee +10, AGI +1'],
    shoes: ['Boots [1]|slotted shoes', 'Matyr Card|Max HP +10%, AGI +1', 'Verit Card|Max HP / SP +8%'],
    head: ['Hat [1]|slotted headgear', 'Deviruchi Card|STR +1, blind immune', 'Stainer Card|silence resist'],
    acc: ['Zerom Card|DEX +3', 'Wormtail Card|DEX +2', 'Kukre Card|AGI +2', 'Yoyo Card|Flee2 +5, AGI +1'],
  },
  9: {
    weapon: ['Shuriken|ammo, 2 to 4z'],
    wcard: ['Andre Card|+20 Base ATK', 'Wolf Card|+15 Base ATK, +1 crit', 'Soldier Skeleton Card|+9 critical'],
    armor: ['Cotton Shirt [1]|slotted armor for a card', 'Thief Clothes|74000z, Ninja can wear it, DEF 6', 'Pupa Card|+700 Max HP', 'Picky Card|STR +1, +10 Base ATK'],
    shield: ['Guard [1]|slotted shield', 'Thief Bug Egg Card|+400 Max HP'],
    garment: ['Muffler [1]|slotted garment', 'Isis Card|-30% shadow', 'Marionette Card|-30% ghost', 'Raydric Card|-20% neutral'],
    shoes: ['Sohee Card|Max SP +15%, SP regen', 'Matyr Card|Max HP +10%, AGI +1', 'Verit Card|Max HP / SP +8%'],
    head: ['Hat [1]|slotted headgear', 'Elder Willow Card|INT +2', 'Isilla Card|INT +2, cast speed boost'],
    acc: ['Zerom Card|DEX +3', 'Wormtail Card|DEX +2', 'Kukre Card|AGI +2'],
  },
};

// Extra picks for one 2nd-class line: branches['line:branch'][section] = [picks]
const branches = {
  '1:1': { weapon: ['Two-Handed Sword|2H sword, level 33', 'Halberd|2H spear, level 33'], wcard: ['Caramel Card|+20% vs insects'] },
  '1:2': { weapon: ['Mace|1H mace, level 2', 'Mirror Shield|60000z'], shield: ['Tamruan Card|Shield Charge / Boomerang +10%, DEF +2', 'Mirror Shield|60000z, level 0'] },
  '3:2': { weapon: ['Violin|bard instrument, level 2', 'Lute|bard instrument, level 14', 'Whip|dancer whip, level 16'], shield: ['Zealotus Card|LUK +2, Musical Strike / Throw Arrow +10%'] },
  '4:2': { weapon: ['Waghnak|knuckle, level 1', 'Knuckle Dusters|knuckle, level 12', 'Studded Knuckles|knuckle, level 12'], acc: ['Greatest General Card|chance of spirit spheres'] },
  '6:2': { wcard: ['Metaling Card|chance to strip weapon'], weapon: ['Great Bow|rogue bow, level 18'] },
};

// Starter equipment to buy from NPCs, by level tier.
const starter = {
  0: [
    { title: 'Levels 1-20', items: ['Sword', 'Rod', 'Cotton Shirt', 'Sandals', 'Guard', 'Hat', 'Novice Armlet'] },
    { title: 'Levels 20-40', items: ['Falchion', 'Blade', 'Hood', 'Adventurer\'s Suit', 'Belt'] },
    { title: 'Level 30+', items: ['Town Sword', 'Cinquedea'] },
  ],
  1: [
    { title: 'Levels 1-20', items: ['Katana', 'Pike', 'Wooden Mail', 'Cotton Shirt', 'Sandals', 'Guard', 'Hat'] },
    { title: 'Levels 20-40', items: ['Slayer', 'Bastard Sword', 'Rapier', 'Buckler', 'Boots', 'Muffler', 'Cap'] },
    { title: 'Levels 40+', items: ['Flamberge', 'Two-Handed Sword', 'Halberd', 'Shield', 'Helm', 'Full Plate', 'Manteau'] },
  ],
  2: [
    { title: 'Levels 1-20', items: ['Rod', 'Silk Robe', 'Silver Robe', 'Cotton Shirt', 'Sandals', 'Hood', 'Circlet'] },
    { title: 'Levels 20-40', items: ['Wand', 'Staff', 'Muffler', 'Shoes', 'Blue Gemstone'] },
    { title: 'Levels 40+', items: ['Arc Wand', 'Silver Robe', 'Manteau'] },
  ],
  3: [
    { title: 'Levels 1-20', items: ['Bow', 'Arrow', 'Cotton Shirt', 'Sandals', 'Guard', 'Hood', 'Bandana'] },
    { title: 'Levels 20-40', items: ['Composite Bow', 'Great Bow', 'Crossbow', 'Silver Arrow', 'Boots', 'Muffler', 'Cap'] },
    { title: 'Levels 40+', items: ['Gakkung Bow', 'Hunter Bow', 'Arbalest', 'Tights', 'Manteau'] },
  ],
  4: [
    { title: 'Levels 1-20', items: ['Club', 'Mace', 'Scapulare', 'Hood', 'Sandals', 'Guard'] },
    { title: 'Levels 20-40', items: ['Smasher', 'Flail', 'Chain', 'Biretta', 'Silk Robe', 'Rosary', 'Buckler', 'Shoes', 'Muffler'] },
    { title: 'Levels 40+', items: ['Morning Star', 'Saint\'s Robe', 'Coat', 'Manteau'] },
  ],
  5: [
    { title: 'Levels 1-20', items: ['Axe', 'Mace', 'Wooden Mail', 'Cotton Shirt', 'Sandals', 'Guard'] },
    { title: 'Levels 20-40', items: ['Battle Axe', 'Hammer', 'Chain', 'Buckler', 'Boots', 'Muffler', 'Cap'] },
    { title: 'Levels 40+', items: ['Buster', 'Two-Handed Axe', 'Padded Armor', 'Chain Mail', 'Manteau'] },
  ],
  6: [
    { title: 'Levels 1-20', items: ['Knife', 'Main Gauche', 'Cotton Shirt', 'Jacket', 'Sandals', 'Guard'] },
    { title: 'Levels 20-40', items: ['Dirk', 'Stiletto', 'Jur', 'Buckler', 'Boots', 'Muffler'] },
    { title: 'Levels 40+', items: ['Gladius', 'Damascus', 'Katar', 'Jamadhar', 'Thief Clothes', 'Padded Armor', 'Chain Mail', 'Manteau'] },
  ],
  7: [
    { title: 'Levels 1-20', items: ['Cotton Shirt', 'Jacket', 'Sandals', 'Hood'] },
    { title: 'Levels 20-40', items: ['Muffler', 'Boots', 'Guard'] },
    { title: 'Levels 40+', items: ['Manteau', 'Coat', 'Mantle'] },
  ],
  8: [
    { title: 'Levels 1-20', items: ['Branch', 'Bullet', 'Cotton Shirt', 'Sandals'] },
    { title: 'Levels 20-40', items: ['Rolling Stone', 'Cyclone', 'Boots', 'Muffler'] },
    { title: 'Levels 40+', items: ['Black Rose', 'Crimson Bolt', 'Silver Bullet', 'Coat'] },
  ],
  9: [
    { title: 'Levels 1-20', items: ['Shuriken', 'Cotton Shirt', 'Sandals'] },
    { title: 'Levels 20-40', items: ['Hood', 'Muffler', 'Jacket'] },
    { title: 'Levels 40+', items: ['Thief Clothes', 'Coat', 'Mantle'] },
  ],
};


// General card guide ('Cards worth collecting'): [title, intro, picks]
const general = [
  ['Always useful', 'Cards almost every class wants. Slot HP and resists first, damage second.', [
    'Pupa Card|armor: +700 Max HP',
    'Marc Card|armor: freeze immunity, -5% water',
    'Matyr Card|shoes: Max HP +10%, AGI +1',
    'Verit Card|shoes: Max HP / SP +8%',
    'Raydric Card|garment: -20% neutral damage',
    'Horn Card|shield: -35% ranged damage',
  ]],
  ['Damage taken from a race (shield)', 'Put one on your shield when you hunt that race.', [
    'Thara Frog Card|-30% from humans (also in PvP)',
    'Orc Warrior Card|-30% from beasts',
    'Bigfoot Card|-30% from insects',
    'Khalitzburg Card|-30% from demons',
    'Sky Petite Card|-30% from dragons',
    'Penomena Card|-30% from formless',
    'Teddy Bear Card|-30% from undead',
    'Anubis Card|-30% from angels',
  ]],
  ['Damage dealt to a race (weapon)', 'Weapon cards that hit one race harder.', [
    'Hydra Card|+20% vs humans',
    'Goblin Card|+20% vs beasts',
    'Caramel Card|+20% vs insects',
    'Scorpion Card|+20% vs plants',
    'Strouf Card|+20% vs demons',
    'Earth Petite Card|+20% vs dragons',
    'Flora Card|+20% vs fish',
    'Peco Peco Egg Card|+20% vs formless',
  ]],
  ['Damage dealt to an element (weapon)', 'Hit a monster element it is weak to.', [
    'Vadon Card|+20% vs fire',
    'Drainliar Card|+20% vs water',
    'Mandragora Card|+20% vs wind',
    'Kaho Card|+20% vs earth',
    'Anacondaq Card|+20% vs poison',
    'Orc Skeleton Card|+20% vs holy',
    'Santa Poring Card|+20% vs dark',
    'Mao Guai Card|+20% vs ghost',
  ]],
  ['Damage dealt to a size (weapon)', 'Flat damage rises when the size matches your target.', [
    'Desert Wolf Card|+15% vs small',
    'Skeleton Worker Card|+15% vs medium',
    'Minorous Card|+15% vs large',
  ]],
  ['Change your element (armor)', 'An elemental armor makes your body that element: you take less from the same element and more from its weakness. Match it to the dungeon.', [
    'Pasana Card|fire armor',
    'Swordfish Card|water armor',
    'Dokebi Card|wind armor',
    'Sandman Card|earth armor',
    'Argiope Card|poison armor',
    'Evil Druid Card|undead armor (INT +1)',
    'Bathory Card|dark armor',
  ]],
  ['Elemental resist (garment)', 'A garment card cuts damage from one element by 30% and gives a little Flee.', [
    'Dustiness Card|-30% wind',
    'Hode Card|-30% earth',
    'Marse Card|-30% water',
    'Jakk Card|-30% fire',
    'Myst Card|-30% poison',
    'Orc Zombie Card|-30% undead',
    'Marionette Card|-30% ghost',
    'Isis Card|-30% dark',
  ]],
  ['Status immunity (headgear)', 'Stops a status that ruins a dungeon for you.', [
    'Marduk Card|silence immunity',
    'Giearth Card|confusion immunity',
    'Deviruchi Card|blind immunity',
    'Nightmare Card|sleep immunity',
    'Ghoul Card|poison resist',
    'Megalodon Card|freeze resist (shield)',
    'Argos Card|stone resist (shield)',
  ]],
];


// ---- Gear that only drops from monsters (not sold by any NPC) -----------------------------
// weapons[type] = picks, best first. [N] is the number of card slots. Shop weapons appear here
// only in their slotted versions, which monsters drop. Sources are looked up per era; a pick
// with no source in an era is left out of that era.
const dropOnly = {
  weapons: {
    Dagger: [
      'Murasame [2]|water element, crit vs humans', 'Krierg [3]|Back Stab +15%, bleed chance', 'Weihna [2]|Raid poisons',
      'Assassin Dagger|HP +20%, SP +15%, ASPD +2, dark', 'Sucsamad|unbreakable, +10% vs earth and wind', 'Fortune Sword|LUK +5, Flee2 +20',
      'Poison Knife|poison element, poison chance', 'Kamaitachi|wind element, crit +3, ASPD +3%',
      'Stiletto [3]|3 slots', 'Gladius [3]|3 slots', 'Dagger [3]|3 slots', 'Dirk [3]|3 slots', 'Main Gauche [4]|4 slots', 'Cutter [4]|4 slots',
    ],
    Katar: [
      'Katar of Raging Blaze|fire element, silence chance', 'Katar of Frozen Icicle|water element, freeze chance',
      'Katar of Quaking|earth element, blind chance', 'Katar of Piercing Wind|wind element, sleep chance',
      'Krishna [2]|Grimtooth +10%, auto Sonic Blow', 'Chakram [2]|Meteor Assault, +10 hit at Katar Mastery 10',
      'Unholy Touch|dark element, curse chance', 'Sharpened Legbone of Ghoul|undead element', 'Inverse Scale|holy element, Dragon Fear',
      'Drill Katar [1]|hit +30, auto Divest All', 'Blood Tears [2]|bleeding AoE', 'Wild Beast Claw [1]|critical wounds',
      'Jamadhar [1]|1 slot', 'Katar [2]|2 slots', 'Jur [3]|3 slots',
    ],
    '1hSword': [
      'Ruber [1]|Bash and Bowling Bash +20% procs', 'Platinum Shotel [1]|crit +50', 'Curved Sword [2]|ASPD +10%, curse chance',
      'Star Dust Blade [1]|stun chance, unbreakable', 'Saber [3]|3 slots', 'Tsurugi [2]|2 slots',
      'Ring Pommel Saber [3]|3 slots', 'Scimitar [3]|3 slots', 'Rapier [3]|3 slots', 'Blade [4]|4 slots', 'Falchion [4]|4 slots',
    ],
    '2hSword': [
      'Muramasa|crit +30, ASPD +8%', 'Katzbalger|VIT +5, DEF +10', 'Zweihander|unbreakable, ATK 200', 'Muscle Cutter [2]|bleed, Decrease AGI',
      'Two-Handed Sword [2]|2 slots', 'Bastard Sword [3]|3 slots', 'Slayer [3]|3 slots', 'Katana [4]|4 slots',
    ],
    '1hSpear': ['Battle Hook [1]|stun, +20% vs humans, Pierce', 'Pole Axe [1]|STR +1, INT +2, DEX +1', 'Pike [4]|4 slots', 'Spear [4]|4 slots', 'Javelin [4]|4 slots'],
    '2hSpear': [
      'Ahlspiess|ignores DEF of normal and boss monsters', 'Crescent Scythe|crit +30, hit +10', 'Cardo [1]|DEF rises with refine',
      'Halberd [2]|2 slots', 'Trident [3]|3 slots', 'Partizan [2]|2 slots', 'Glaive [3]|3 slots', 'Guisarme [3]|3 slots',
    ],
    '1hAxe': ['Windhawk|wind element, ASPD +5%', 'Vecer Axe [2]|bonuses at 90 LUK / DEX', 'War Axe [1]|DEX +2, LUK +2', 'Orcish Axe|ATK 75 at level 3', 'Axe [4]|4 slots'],
    '2hAxe': [
      'Heart Breaker [1]|crit +20 and more with refine', 'Berdysz [2]|-13% damage from Medium, -15% from Large', 'Great Axe|Mammonite blow, stun chance',
      'Two-Handed Axe [2]|2 slots', 'Buster [2]|2 slots', 'Hammer [3]|3 slots', 'Battle Axe [4]|4 slots',
    ],
    Mace: [
      'Spike|crit +40 (but DEF -67%)', 'Nemesis|holy element, +10% vs undead and demon', 'Wrench|chance of several statuses',
      'Sword Mace [1]|1 slot, ATK 130', 'Morning Star [2]|2 slots', 'Chain [3]|3 slots', 'Flail [3]|3 slots', 'Smasher [3]|3 slots', 'Mace [4]|4 slots', 'Club [4]|4 slots',
    ],
    Staff: [
      'Croce Staff [1]|holy element, INT +4, auto Heal / Blessing', 'Lich\'s Bone Wand [2]|MATK +20%, undead element', 'Piercing Staff|INT +4, ignores some MDEF',
      'Thorn Staff of Darkness|INT +3, DEX +3, MATK +20%', 'Holy Stick [1]|holy, cheaper Holy Light / Turn Undead casts',
      'Wing Staff|cast time -5%', 'Release of Wish|stronger heals, regeneration', 'Healing Staff|heal power rises with refine',
      'Evil Bone Wand|INT +4, undead element', 'Wand of Occult|INT +3', 'Arc Wand [2]|2 slots', 'Staff [3]|3 slots', 'Wand [3]|3 slots', 'Rod [4]|4 slots',
    ],
    Knuckle: [
      'Combo Battle Glove [4]|Triple Attack, Chain Combo and Combo Finish +15%', 'Magma Fist [3]|auto Endow Blaze', 'Icicle Fist [3]|auto Endow Tsunami',
      'Electric Fist [3]|auto Endow Tornado', 'Seismic Fist [3]|auto Endow Quake', 'Claw [2]|STR +2', 'Finger [2]|2 slots',
      'Studded Knuckles [3]|3 slots', 'Waghnak [4]|4 slots',
    ],
    Bow: [
      'Falken Blitz [2]|Focused Arrow Strike, Double Strafe and Arrow Repel +10%', 'Burning Bow [1]|-10% fire damage taken', 'Frozen Bow [1]|freeze chance',
      'Gust Bow [1]|1 slot', 'Earth Bow [1]|1 slot', 'Nepenthes Bow [2]|auto Arrow Repel on Double Strafe', 'Double Bound [3]|auto Double Strafe',
      'Luna Bow [2]|DEF bonus with refine', 'Gakkung Bow [2]|2 slots', 'Arbalest [2]|DEX +2, 2 slots', 'Crossbow [3]|3 slots', 'Great Bow [3]|3 slots',
      'Composite Bow [4]|4 slots', 'Bow [4]|4 slots',
    ],
    Whip: [
      'Whip of Balance [3]|AGI +2, DEX +3, Throw Arrow knockback', 'Electric Eel [2]|wind element, auto Jupitel Thunder', 'Lariat Whip|DEX +5, AGI +1',
      'Red Flame Whip|fire element', 'Icicle Whip|water element', 'Gaia Whip|earth element', 'Electric Wire|wind element',
      'Skipping Rope|crit +20', 'Rante Whip [1]|ATK 135', 'Rope [4]|4 slots',
    ],
    Musical: [
      'Oriental Lute|Musical Strike and Arrow Vulcan +10%', 'Bass Guitar [1]|SP gain, auto Heaven\'s Drive when hit',
      'Burning Passion Guitar|fire element', 'Loner\'s Guitar|water element', 'Green Acre Guitar|earth element', 'Gentle Breeze Guitar|wind element',
      'Harp of Nepenthes [2]|INT +2, stun with Musical Strike', 'Harp [2]|INT +2', 'Guitar [1]|ATK 142', 'Lute [3]|3 slots', 'Mandolin [3]|3 slots', 'Violin [4]|4 slots',
    ],
    Book: [
      'Principles of Magic [2]|MATK +20%, INT +3, SP regeneration', 'Encyclopedia [2]|MATK +15%, INT +3, DEX +2, crit', 'Bible [2]|INT +2',
      'Ancient Magic [2]|MATK +15%', 'Book of Billows|water element', 'Book of Mother Earth|earth element', 'Book of the Blazing Sun|fire element',
      'Book of Gust of Wind|wind element', 'Book [3]|3 slots',
    ],
    Revolver: ['Wasteland\'s Outlaw [2]|more hit and ASPD with AGI', 'Garrison [1]|ATK 70', 'Crimson Bolt [2]|2 slots', 'Six Shooter [2]|2 slots'],
    Rifle: ['Long Barrel [1]|auto Tracking, crit +20', 'Lever Action Rifle [2]|crit +50, hit +20', 'Dusk [1]|ATK 150', 'Cyclone [2]|2 slots'],
    Shotgun: ['Gate Keeper|ATK 210, auto Spread Attack', 'Thunder P [2]|ASPD +20%', 'Gate Keeper-DD|auto Spread Attack, DEX +1'],
    Gatling: ['Butcher [1]|crit damage vs beasts', 'Drifter [1]|1 slot'],
    Huuma: ['Huuma Calm Mind [2]|Throw Huuma Shuriken +30%', 'Huuma Wing Shuriken|wind element', 'Huuma Blaze Shuriken|fire element, auto Fire Ball', 'Huuma Giant Wheel Shuriken [3]|3 slots'],
  },
  // class key (line * 10 + branch) -> weapon types to list
  classWeapons: {
    0: ['1hSword'], 1: ['1hSword', 'Mace'],
    10: ['2hSword', '1hSword', '1hSpear'], 11: ['2hSword', '2hSpear', '1hSpear', '1hSword'], 12: ['1hSpear', '2hSpear', '1hSword', 'Mace'],
    20: ['Staff'], 21: ['Staff'], 22: ['Staff', 'Book'],
    30: ['Bow'], 31: ['Bow'], 32: ['Musical', 'Whip'],
    40: ['Mace', 'Staff'], 41: ['Mace', 'Staff', 'Book'], 42: ['Knuckle'],
    50: ['1hAxe', '2hAxe', 'Mace'], 51: ['1hAxe', '2hAxe', 'Mace'], 52: ['1hAxe', 'Mace'],
    60: ['Dagger'], 61: ['Katar', 'Dagger'], 62: ['Dagger', 'Bow', '1hSword'],
    70: [], 71: [], 72: ['Staff'],
    80: ['Revolver', 'Rifle', 'Shotgun', 'Gatling'], 81: ['Rifle', 'Shotgun', 'Revolver', 'Gatling'],
    90: ['Huuma'], 91: ['Huuma', 'Dagger'], 92: ['Huuma', 'Dagger'],
  },
  other: {
    tank: [
      'Meteo Plate Armor [1]|DEF 10, 30% resist to stun and freeze', 'Cross Shield [1]|Shield Chain and Shield Boomerang +30% (Crusader)',
      'Platinum Shield|-15% from Medium and Large, -10% from undead', 'Strong Shield [1]|no knockback', 'Stone Buckler [1]|-5% from Large',
      'Magni\'s Cap|STR +2, DEF 5', 'Iron Wrist|Bash and Mammonite +6%', 'Falcon Muffler|Flee +15, Flee2 +5', 'Black Leather Boots|AGI +1 (+2 at +9)',
      'Poo Poo Hat|-10% damage from humans', 'Beret|-10% damage from humans',
    ],
    caster: [
      'Chameleon Armor|HP +7 per level, SP, 10% chance to nullify magic', 'Fricca\'s Circlet|MDEF 10, INT +2, SP +50', 'Angel\'s Kiss [1]|SP regeneration +5%',
      'Clip [1]|SP +10', 'Icarus Wings|SP +50, DEX +3', 'Librarian Glove [1]|SP +20', 'Musika [1]|chance to Heal you when hit',
      'Wool Scarf [1]|MDEF 4', 'Black Leather Boots|AGI +1 (+2 at +9)',
    ],
    support: [
      'Saint\'s Robe [1]|MDEF 5, Acolyte line', 'Divine Cloth [1]|5% resist to curse, silence, stun, stone', 'Magic Bible Vol1 [1]|INT +2, MDEF 3',
      'Musika [1]|chance to Heal you when hit', 'Angel\'s Kiss [1]|SP regeneration +5%', 'Clip [1]|SP +10', 'Black Leather Boots|AGI +1 (+2 at +9)',
    ],
    archer: [
      'Sniping Suit [1]|crit +6, less after-cast delay', 'Improved Tights [1]|Flee2 +3, MDEF 2', 'Bowman Scarf|SP +50, DEX +3', 'Icarus Wings|SP +50, DEX +3',
      'Falcon Muffler|Flee +15, Flee2 +5', 'Black Leather Boots|AGI +1 (+2 at +9)', 'Fricco\'s Shoes|AGI +2, potions heal +20%',
    ],
    thief: [
      'Kandura [1]|AGI +1, Flee +5, ASPD +2%', 'Falcon Muffler|Flee +15, Flee2 +5', 'Rider Insignia|AGI +2', 'Black Leather Boots|AGI +1 (+2 at +9)',
      'Fricco\'s Shoes|AGI +2, potions heal +20%', 'Ghost Bandana|AGI +2, -10% ghost damage', 'Goddess of Fortune\'s Cursed Brooch|crit +6',
    ],
  },
  classOther: {
    0: 'tank', 1: 'tank', 10: 'tank', 11: 'tank', 12: 'tank', 20: 'caster', 21: 'caster', 22: 'caster', 30: 'archer', 31: 'archer', 32: 'archer',
    40: 'support', 41: 'support', 42: 'tank', 50: 'tank', 51: 'tank', 52: 'tank', 60: 'thief', 61: 'thief', 62: 'thief',
    70: 'thief', 71: 'thief', 72: 'support', 80: 'archer', 81: 'archer', 90: 'caster', 91: 'thief', 92: 'caster',
  },
};

module.exports = { lines, branches, starter, general, dropOnly };
