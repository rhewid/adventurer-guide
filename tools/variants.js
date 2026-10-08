// Alternative builds per class line, and a short note per era. Used by build.js.
// variants[line][branch] = { std: 'label for the main build in data.js', list: [{ name, paras }] }
// The main build is shown as the first choice; each entry in `list` is another way to play it.

const { b } = require('./data.js');

const variants = {
  1: {
    1: { std: 'Two-hand sword (Bowling Bash)', list: [
      { name: 'Spear Knight on Peco (Pierce / Brandish)', paras: [
        b('Stats') + ': STR 99 / AGI 50 / VIT 50 / DEX 40. Spears hit Medium and Large hard and the Peco gives speed and weight.',
        b('Skills') + ': ' + b('Spear Mastery 10, Pierce 10, Spear Stab 10, Brandish Spear 10, Cavalry Mastery 5, Peco Peco Ride, Endure, Provoke') + '. Brandish Spear is a big line AoE; Pierce is the single-target hit. Skip Two-Hand Quicken (it needs a 2H sword).',
      ]},
    ]},
    2: { std: 'Holy Cross (spear and shield)', list: [
      { name: 'Grand Cross (holy AoE)', paras: [
        b('Stats') + ': INT 90 / VIT 90 / STR 40 / DEX 40. Grand Cross scales with your own stats and also damages you, so you need HP and holy resistance.',
        b('Skills') + ': ' + b('Grand Cross 10, Faith 10, Heal 10, Cure, Divine Protection 10, Providence 5, Auto Guard 10, Devotion 5') + '. Grand Cross is a huge holy AoE on undead and demon packs (Glast Heim, Abbey, Pyramids, Thanatos). Faith adds Max HP and holy resistance; Heal keeps you up.',
        b('Gear') + ': Evil Druid style undead armor is risky for you here; prefer Pupa or Marc armor, Thara Frog or Khalitzburg shield, and Max HP shoes (Matyr, Verit).',
      ]},
      { name: 'Spear Quicken Peco (2H spear)', paras: [
        b('Stats') + ': STR 99 / AGI 70 / VIT 40 / DEX 40. Fast two-hand spear on a Peco.',
        b('Skills') + ': ' + b('Spear Quicken 10, Spear Mastery 10, Holy Cross 10, Cavalier Mastery 5, Peco Peco Ride, Faith, Auto Guard') + '. Spear Quicken raises ASPD and Flee; no shield while you wield a 2H spear. Pair with Holy Cross while on foot.',
      ]},
      { name: 'Shield Charge / Shield Boomerang (shield user)', paras: [
        b('Stats') + ': STR 99 / VIT 70 / AGI 40 / DEX 40. Shield skills scale with shield weight and refine.',
        b('Skills') + ': ' + b('Shield Charge 5, Shield Boomerang 5, Auto Guard 10, Reflect Shield 10, Defender 5, Faith 10, Spear Mastery 10') + '. Boomerang is a ranged opener and Charge stuns. Put your best shield (Thara Frog, Khalitzburg) on and refine it high.',
      ]},
      { name: 'Tank and party protector', paras: [
        b('Stats') + ': VIT 90+ / STR 60 / INT 30 / DEX 40. Max HP and defence first.',
        b('Skills') + ': ' + b('Auto Guard 10, Reflect Shield 10, Shield Charge 5, Devotion 5, Providence 5, Defender 5, Faith 10, Cure') + '. Devotion takes damage for party members; Defender and Auto Guard keep you alive. Carry a shield with Thara Frog / Khalitzburg cards.',
      ]},
    ]},
  },
  2: {
    1: { std: 'Balanced caster (Jupitel, LoV, Storm Gust)', list: [
      { name: 'AoE farmer (Storm Gust / Meteor Storm)', paras: [
        b('Stats') + ': INT 99 / DEX 80 / VIT 40 / AGI 30. Cast time and SP are everything.',
        b('Skills') + ': ' + b('Storm Gust 10, Meteor Storm 10, Quagmire 5, Sight Rasher, Ice Wall, Energy Coat, SP Recovery, Sight') + '. Quagmire slows a pack, Storm Gust or Meteor kills it. Bring Blue Potions and a tank or Ice Wall.',
      ]},
      { name: 'Single target (Jupitel Thunder, Earth Spike)', paras: [
        b('Stats') + ': INT 99 / DEX 90 / VIT 30 / AGI 30. Short cast time matters most.',
        b('Skills') + ': ' + b('Jupitel Thunder 10, Earth Spike 5, Heaven\'s Drive 5, Soul Strike 10, Fire Bolt / Cold Bolt / Lightning Bolt 10, Napalm Beat, Energy Coat') + '. Jupitel Thunder knocks enemies back: good vs bosses and in dungeons with few monsters.',
      ]},
    ]},
    2: { std: 'Auto Spell caster (bolts)', list: [
      { name: 'Support and field Sage', paras: [
        b('Stats') + ': INT 80 / DEX 60 / VIT 50 / AGI 40.',
        b('Skills') + ': ' + b('Volcano / Deluge / Violent Gale 5, Land Protector 5, Dispell 5, Spell Breaker 5, Endow Blaze / Tsunami / Quake / Tornado 5, Cast Cancel 5, Free Cast 10') + '. Elemental fields boost the whole party; Endow lets melee friends exploit weaknesses; Dispell removes buffs from bosses.',
      ]},
    ]},
  },
  3: {
    1: { std: 'DEX archer (Double Strafe)', list: [
      { name: 'Falcon hunter (Blitz Beat)', paras: [
        b('Stats') + ': DEX 90 / INT 50-70 / LUK 30 / AGI 40. Blitz Beat damage uses DEX, INT and Falconry Mastery.',
        b('Skills') + ': ' + b('Falconry Mastery 1, Blitz Beat 5, Steel Crow 10, Double Strafe 10, Owl\'s Eye 10, Vulture\'s Eye 10') + '. Blitz Beat triggers on its own while you hit; keep a falcon and use Double Strafe as a filler.',
      ]},
      { name: 'Trapper (Land Mine / Claymore / Ankle Snare)', paras: [
        b('Stats') + ': INT 90+ / DEX 70 / VIT 50 / AGI 30. Trap damage scales with INT and DEX.',
        b('Skills') + ': ' + b('Land Mine 5, Claymore Trap 5, Blast Mine 5, Ankle Snare 5, Freezing Trap 5, Shockwave Trap 5, Remove Trap, Detect') + '. Lay traps in a line on a pack, snare the boss, then shoot. Needs Trap items from the Tool Dealer.',
      ]},
    ]},
    2: { std: 'Support Bard / Dancer', list: [
      { name: 'Damage Bard / Dancer', paras: [
        b('Stats') + ': DEX 90 / AGI 70 / INT 50 / VIT 30. Bards need a Violin / Lute, Dancers a Whip.',
        b('Skills') + ': ' + b('Bard: Musical Strike 5, Dissonance 5. Dancer: Throw Arrow 5, Ugly Dance 5. Both: the same ensemble skills') + '. Quick ranged damage; keep a Sage or Priest around for sustain. Ensemble skills still need a partner.',
      ]},
    ]},
  },
  4: {
    1: { std: 'Support Priest (Heal, Blessing)', list: [
      { name: 'Offensive Priest (Magnus / Turn Undead)', paras: [
        b('Stats') + ': INT 99 / DEX 80 / VIT 30 / AGI 20. Holy damage scales with INT.',
        b('Skills') + ': ' + b('Magnus Exorcismus 10, Turn Undead 10, Lex Aeterna, Lex Divina, Heal 10, Kyrie Eleison, Magnificat, Blessing, Increase AGI') + '. Magnus clears undead and demon dungeons (Glast Heim, Abbey, Pyramids). Soloing elsewhere is slow.',
      ]},
      { name: 'Battle Priest (melee with a Mace)', paras: [
        b('Stats') + ': STR 80 / AGI 70 / VIT 50 / INT 40 / DEX 40. A frontline buffer.',
        b('Skills') + ': ' + b('Mace Mastery 10, Safety Wall, Kyrie Eleison 10, Blessing 10, Increase AGI 10, Impositio Manus, Suffragium, Aspersio, Heal') + '. Blessing, Impositio Manus and Aspersio make your Mace hit like a warrior; you can still heal the party.',
      ]},
    ]},
    2: { std: 'Combo Monk (Triple / Chain / Finish)', list: [
      { name: 'Asura Monk (burst)', paras: [
        b('Stats') + ': INT 80 / STR 70 / VIT 70 / DEX 40. Asura Strike spends all your SP and scales with it.',
        b('Skills') + ': ' + b('Asura Strike 5, Summon Spirit Sphere 5, Absorb Spirits, Fury, Steel Body, Blade Stop, Investigate, Finger Offensive') + '. Fill spheres, use Steel Body, then a single Asura nukes a boss. Carry SP items.',
      ]},
      { name: 'Critical Monk (Fury)', paras: [
        b('Stats') + ': AGI 80 / STR 70 / LUK 50 / VIT 50. Critical hits power the combo.',
        b('Skills') + ': ' + b('Fury 5, Triple Attack 10, Chain Combo 5, Combo Finish 5, Iron Hands 10, Steel Body') + '. Fury raises crit; stack LUK and crit cards.',
      ]},
    ]},
  },
  5: {
    1: { std: 'Weapon buffer (Adrenaline / Power-Thrust)', list: [
      { name: 'Battle Smith (axe / mace)', paras: [
        b('Stats') + ': STR 90 / DEX 60 / VIT 50 / AGI 30. A front-liner with a cart.',
        b('Skills') + ': ' + b('Hammerfall, Adrenaline Rush 5, Weapon Perfection 5, Power-Thrust 5, Maximize Power 5, Cart Revolution 5, Skin Tempering') + '. Adrenaline Rush needs an axe or mace; Cart Revolution is the AoE.',
      ]},
      { name: 'Forge Smith (crafting)', paras: [
        b('Stats') + ': DEX 99 / LUK 70 / STR 60 / INT 40. Forging success depends on DEX, LUK and job level.',
        b('Skills') + ': ' + b('Weapon Repair, Skin Tempering, Hilt Binding, Weaponry Research 10, Adrenaline Rush, Weapon Perfection, Hammerfall') + '. Forge elemental weapons and sell them. Bring Iron, Steel and elemental stones.',
      ]},
    ]},
    2: { std: 'Acid Demonstration', list: [
      { name: 'Potion maker (Pharmacy)', paras: [
        b('Stats') + ': DEX 99 / INT 80 / LUK 60 / VIT 30. Pharmacy success scales with INT, DEX and LUK.',
        b('Skills') + ': ' + b('Pharmacy 10, Potion Pitcher 5, Chemical Protection set, Acid Terror, Summon Flora, Homunculus') + '. Brew potions and stat boosters: always profitable and gets you party invites.',
      ]},
      { name: 'Homunculus support build', paras: [
        b('Stats') + ': INT 90 / VIT 70 / DEX 50 / AGI 30.',
        b('Skills') + ': ' + b('Call Homunculus, Rest, Resurrect Homunculus, Potion Pitcher, Bioethics, Summon Flora') + '. Your Homunculus levels with you; Vanilmirth (damage) or Filir (speed) pair well with Acid Demonstration.',
      ]},
    ]},
  },
  6: {
    1: { std: 'Katar crit (Sonic Blow)', list: [
      { name: 'Dual dagger / sword (no katar)', paras: [
        b('Stats') + ': AGI 99 / STR 70 / DEX 50 / LUK 20. Dual wielding is raw attack speed.',
        b('Skills') + ': ' + b('Right Hand Mastery 5, Left Hand Mastery 5, Double Attack 10, Enchant Poison 10, Cloaking 10, Poison React 10, Improve Dodge 10') + '. Sonic Blow and Grimtooth need a katar equipped, so this build relies on Double Attack and auto-attacks with two daggers (or a dagger and a one-hand sword). Great ASPD, lower burst.',
      ]},
      { name: 'Poison and Grimtooth (AoE katar)', paras: [
        b('Stats') + ': AGI 90 / DEX 60 / STR 50 / LUK 30.',
        b('Skills') + ': ' + b('Grimtooth 5, Venom Dust 10, Enchant Poison 10, Cloaking 10, Poison React 10, Katar Mastery 10, Sonic Blow 10') + '. Cloak and hit from stealth with Grimtooth; Enchant Poison adds a poison chance. Needs a katar.',
      ]},
    ]},
    2: { std: 'Dagger Back Stab', list: [
      { name: 'Bow Rogue (Back Stab with a bow)', paras: [
        b('Stats') + ': DEX 99 / AGI 80 / LUK 30 / STR 30. A ranged Rogue.',
        b('Skills') + ': ' + b('Double Strafe 10, Vulture\'s Eye 10, Back Stab 10, Raid 5, Plagiarism 10') + '. Rogues keep the Archer skills Double Strafe and Vulture\'s Eye, and Back Stab has no weapon limit, so a bow works. Strip skills still apply.',
      ]},
      { name: 'Strip and Plagiarism utility', paras: [
        b('Stats') + ': AGI 80 / DEX 70 / STR 50 / INT 30.',
        b('Skills') + ': ' + b('Strip Weapon, Strip Shield, Strip Armor, Strip Helm, Plagiarism 10, Close Confine 5, Gangster\'s Paradise, Mug, Snatcher') + '. Strip a boss\'s weapon or armor for the party. Plagiarism copies the last skill you were hit by.',
      ]},
    ]},
  },
};

// Short note per era: caps and rules that change how to read the build pages.
const eraNote = {
  pre: [
    b('Pre-renewal rules') + ': base level tops out at 99 and every stat caps at 99. There are no third classes, so the 2nd-class pages are your endgame. Stats count the classic way: Flee, HIT, Critical and plain ATK.',
  ],
  re: [
    b('Renewal rules') + ': base level goes up to 175 in this app. Stats cap at 99 for normal classes and 130 for third classes (and Kagerou / Oboro / Rebellion). Weapon ATK and MATK scale with level, so refine your weapon and replace gear as you level.',
  ],
};

// ---- More variants: first classes, Knight, Taekwon, Gunslinger, Ninja ----------------------
const more = {
  1: {
    0: { std: 'Bash and Magnum Break', list: [
      { name: 'Tank-first (Knight / Crusader prep)', paras: [
        b('Stats') + ': VIT 70 / STR 60 / AGI 30 / DEX 30. Take hits so friends can kill.',
        b('Skills') + ': ' + b('HP Recovery 10, Endure 10, Provoke 10, Magnum Break 10, Bash 10') + '. Provoke pulls monsters, Endure stops flinching. Good prep for a Crusader.',
      ]},
      { name: 'Speed (AGI) Knight prep', paras: [
        b('Stats') + ': STR 70 / AGI 60 / DEX 40 / VIT 30. Faster hits level quicker with a one-hand sword.',
        b('Skills') + ': ' + b('Sword Mastery 10, Bash 10, Magnum Break 10, Endure 5, Provoke 5') + '. Plan for Two-Hand Quicken and Bowling Bash at second job.',
      ]},
    ]},
    1: { add: [
      { name: 'One-hand sword Knight (Counter Attack)', paras: [
        b('Stats') + ': STR 80 / AGI 80 / LUK 40 / DEX 40. One-Hand Quicken needs a 1H sword; Counter Attack answers a hit with a critical strike.',
        b('Skills') + ': ' + b('Sword Mastery 10, One-Hand Quicken 1, Counter Attack 5, Bowling Bash 10, Magnum Break 10, Endure 10, Provoke 10, Auto Berserk 1') + '. A one-hand sword and shield is sturdier than two-hand. Add Soldier Skeleton and Goblin Archer cards for crit.',
      ]},
    ]},
  },
  2: {
    0: { std: 'Bolt farmer (Fire / Cold / Lightning)', list: [
      { name: 'Kiter (Fire Wall / Frost Diver)', paras: [
        b('Stats') + ': INT 70 / DEX 40 / AGI 40 / VIT 30. Stay out of melee.',
        b('Skills') + ': ' + b('Fire Wall 10, Frost Diver 10, Cold Bolt 10, Napalm Beat 10, Safety Wall 10, Energy Coat') + '. Freeze or wall off monsters, then bolt. Easier on the budget since you need fewer potions.',
      ]},
    ]},
  },
  3: {
    0: { std: 'Double Strafe', list: [
      { name: 'Arrow Shower (AoE farmer)', paras: [
        b('Stats') + ': DEX 70 / AGI 50 / INT 20 / VIT 30.',
        b('Skills') + ': ' + b('Arrow Shower 10, Owl\'s Eye 10, Vulture\'s Eye 10, Improve Concentration 10, Arrow Repel') + '. Shower hits a pack and pushes it away: easy EXP in open fields. Carry plenty of arrows.',
      ]},
    ]},
  },
  4: {
    0: { std: 'Support (Heal / Blessing)', list: [
      { name: 'Holy Light caster (undead farming)', paras: [
        b('Stats') + ': INT 80 / DEX 50 / VIT 40. Ranged holy damage.',
        b('Skills') + ': ' + b('Holy Light 1, Divine Protection 10, Demon Bane 10, Heal 10, Ruwach, Cure') + '. Holy Light and Heal both hurt undead: Payon Cave, Pyramids, Glast Heim.',
      ]},
      { name: 'Mace fighter (Monk prep)', paras: [
        b('Stats') + ': STR 70 / AGI 50 / VIT 50 / DEX 30.',
        b('Skills') + ': ' + b('Mace Mastery, Divine Protection 10, Demon Bane 10, Increase AGI, Blessing, Heal 5') + '. A hands-on acolyte with buffs on itself. Good prep for a Monk.',
      ]},
    ]},
  },
  5: {
    0: { std: 'Mammonite and zeny', list: [
      { name: 'Vender (Discount / Overcharge / Vending)', paras: [
        b('Stats') + ': STR 60 / VIT 50 / DEX 40 / LUK 30.',
        b('Skills') + ': ' + b('Discount 10, Overcharge 10, Enlarge Weight Limit 10, Pushcart 10, Vending 10, Identify') + '. Sit in Prontera or Payon and sell what you farm; the best way to make zeny with a Merchant.',
      ]},
    ]},
  },
  6: {
    0: { std: 'Dagger (Double Attack)', list: [
      { name: 'Assassin prep (Envenom / Dodge)', paras: [
        b('Stats') + ': AGI 70 / STR 50 / DEX 40 / LUK 20.',
        b('Skills') + ': ' + b('Double Attack 10, Improve Dodge 10, Envenom 10, Hiding 10, Steal') + '. Envenom poisons; Dodge adds Flee. Straight into Katar Mastery at second job.',
      ]},
      { name: 'Rogue prep (Steal / Hiding)', paras: [
        b('Stats') + ': AGI 60 / DEX 60 / STR 40 / LUK 30.',
        b('Skills') + ': ' + b('Steal, Hiding 10, Double Attack 10, Detoxify, Throw Stone') + '. Steal monsters\' drops for extra loot. Fits a Rogue, Strip and Plagiarism later.',
      ]},
    ]},
  },
  7: {
    0: { std: 'Kick combo (Running)', list: [
      { name: 'Counter Kick (Tumbling / Flee)', paras: [
        b('Stats') + ': AGI 80 / STR 40 / VIT 40 / DEX 40.',
        b('Skills') + ': ' + b('Tumbling, Counter Kick, Tornado Kick, Heel Drop, Running') + '. Dodge-focused; stand your ground until Counter Kick triggers.',
      ]},
    ]},
  },
  8: {
    0: { std: 'Revolver (Rapid Shower / Desperado)', list: [
      { name: 'Rifle (Tracking / Piercing Shot)', paras: [
        b('Stats') + ': DEX 99 / AGI 60 / LUK 30 / VIT 30. Slower, harder single shots.',
        b('Skills') + ': ' + b('Tracking 10, Piercing Shot 5, Bull\'s Eye, Magical Bullet, Single Action 10, Snake Eyes 10, Increase Accuracy') + '. Tracking and Piercing Shot work with a rifle or revolver. Bull\'s Eye is a one-point skill for brute and demi-human targets.',
      ]},
      { name: 'Gatling (Gatling Fever)', paras: [
        b('Stats') + ': AGI 80 / DEX 80 / VIT 40 / LUK 20. A gatling gun fires fast but slows you down.',
        b('Skills') + ': ' + b('Gatling Fever 10, Chain Action 10, Single Action 10, Snake Eyes 10, Triple Action, Dust') + '. Gatling Fever raises attack speed and damage with a gatling gun equipped; it is a short, powerful burst.',
      ]},
      { name: 'Shotgun (Dust / Full Buster / Spread Attack)', paras: [
        b('Stats') + ': DEX 80 / AGI 60 / STR 40 / VIT 40. Close-range crowd damage.',
        b('Skills') + ': ' + b('Dust 10, Full Buster 10, Spread Attack 10, Single Action 10, Snake Eyes 10, Chain Action 10') + '. All three attacks need a shotgun. Full Buster stuns and hurts you a little, so keep HP up.',
      ]},
    ]},
    1: { std: 'Rifle (Hammer of God)', list: [
      { name: 'Shotgun (Banishing Buster / Shatter Storm)', paras: [
        b('Stats') + ': DEX 99 / AGI 60 / LUK 30 / STR 30.',
        b('Skills') + ': ' + b('Banishing Buster 10, Shatter Storm 5, Slug Shot 5, Eternal Chain 10, Heat Barrel 5') + '. Close-range shotgun burst with an extra-chain finisher.',
      ]},
      { name: 'Gatling / Revolver crowds', paras: [
        b('Stats') + ': AGI 80 / DEX 80 / LUK 30 / VIT 30.',
        b('Skills') + ': ' + b('Revolver: Fire Dance 10. Gatling: Round Trip 10, Fire Rain 5. Grenade launcher: Dragon Tail 10. Any gun: Eternal Chain 10, Heat Barrel 5') + '. Pick one weapon and fill its skills; Heat Barrel boosts attack speed while you keep firing.',
      ]},
    ]},
  },
  9: {
    0: { std: 'Elemental caster (spells)', list: [
      { name: 'Shuriken thrower (physical)', paras: [
        b('Stats') + ': DEX 80 / AGI 70 / STR 40 / LUK 30. A ranged physical ninja.',
        b('Skills') + ': ' + b('Throw Shuriken 10, Throw Kunai 5, Throw Huuma Shuriken 5, Shuriken Training 10, Cicada Skin Shed 5') + '. Cheap shuriken and kunai are your damage; Huuma hits crowds. Carry shuriken and kunai stacks.',
      ]},
    ]},
    1: { std: 'Kagerou (kunai and combos)', list: [
      { name: 'Illusion and boss control', paras: [
        b('Stats') + ': AGI 80 / DEX 70 / STR 50 / LUK 30.',
        b('Skills') + ': ' + b('Illusion - Shadow 5, Illusion - Shock 5, Illusion - Death 5, Shadow Warrior 5, Cross Slash 10, Soul Cutter 5, Makibishi 5, Pure Soul 5') + '. Use the Illusion skills to disable or finish bosses; Cross Slash handles trash.',
      ]},
    ]},
    2: { std: 'Oboro (moon skills)', list: [
      { name: 'Charm caster', paras: [
        b('Stats') + ': INT 90 / DEX 60 / VIT 40 / AGI 30.',
        b('Skills') + ': ' + b('Fire Charm, Ice Charm, Wind Charm, Earth Charm, Cast Ninja Spell, Release Ninja Spell, Distorted Crescent 5, Moonlight Fantasy 5, Ominous Moonlight 5') + '. Cast Ninja Spell stores a spell; Release fires it for a big hit with the charm element.',
      ]},
    ]},
  },
};

// Merge `more` into variants: `add` appends to an existing entry, otherwise it creates one.
for (const [line, brs] of Object.entries(more)) {
  variants[line] = variants[line] || {};
  for (const [br, v] of Object.entries(brs)) {
    if (v.add) variants[line][br].list.push(...v.add);
    else variants[line][br] = v;
  }
}

// ---- Rebirth (transcendent) pages. trans[line][branch] ------------------------------------
// A rebirth class keeps every skill of its 2nd class and adds the ones listed here.
// Lists checked against skill_tree.yml (Lord_Knight, Paladin, High_Wizard, Professor, Sniper, ...).
const transIntro = 'Rebirth classes start with extra stat points and more HP / SP than a normal 2nd class. You keep every skill of the 2nd class (a Sniper still has all Hunter traps, a Paladin all Crusader skills) and add the skills below. Gear and spots above still apply.';
const trans = {
  1: {
    1: [transIntro,
      b('Lord Knight') + ' adds: Aura Blade 5, Concentration 5, Parrying 10, Spiral Pierce 5, Berserk 1, Tension Relax 1, Head Crush 5 (Traumatic Blow), Joint Beat 10 (Vital Strike).',
      b('Builds') + ': 2H sword LK: Aura Blade + Concentration + Parrying + Berserk, Bowling Bash. Spear LK: Spiral Pierce on a Peco. Berserk boosts attack and ASPD but drains HP; Tension Relax recovers HP when you rest.'],
    2: [transIntro,
      b('Paladin') + ' adds: Pressure 5, Gospel 10 (Battle Chant), Sacrifice 5 (Martyr\'s Reckoning), Shield Chain 5 (Rapid Smiting).',
      b('Builds') + ': Shield Chain Paladin: Shield Chain plus Holy Cross, high STR. Support Paladin: Gospel, Devotion, Providence, Defender, Auto Guard, high VIT. Pressure ignores defence; Gospel buffs a party.'],
  },
  2: {
    1: [transIntro,
      b('High Wizard') + ' adds: Soul Drain 10, Mystical Amplification 10, Napalm Vulcan 5, Magic Crasher 1, Gravitation Field 5, Ganbantein 1.',
      b('Builds') + ': AoE: Mystical Amplification + Storm Gust or Meteor Storm. Neutral: Napalm Vulcan for mass farming. Soul Drain returns SP when you kill; Gravitation Field is a ground AoE.'],
    2: [transIntro,
      b('Professor') + ' adds: Double Casting 5, Soul Burn 5, Mind Breaker 5, Indulge 5 (Hp Conversion), Soul Change 1, Memorize 1, Fiber Lock 1, Fog Wall 1.',
      b('Builds') + ': Caster Professor: Double Casting with bolts / Soul Strike, Memorize speeds up your next spells. Support Professor: Soul Change, Indulge, Fiber Lock, Fog Wall. Soul Burn and Mind Breaker add damage based on SP.'],
  },
  3: {
    1: [transIntro,
      b('Sniper') + ' adds: Focused Arrow Strike 5 (Sharp Shooting), Falcon Assault 5, Wind Walk 10, True Sight 10 (Falcon Eyes). Hunter traps, Blitz Beat and Steel Crow all stay.',
      b('Builds') + ': Crit / Focused Arrow Strike: DEX and LUK, bow. Falcon Assault / Blitz Beat: DEX and INT with a falcon. Trapper Sniper: INT for Land Mine, Claymore Trap and Ankle Snare, then Focused Arrow Strike to finish.'],
    2: [transIntro,
      b('Clown / Gypsy') + ' add: Arrow Vulcan 10 (Clown), Marionette Control 1, Longing for Freedom 5, Wand of Hermode 5, Tarot Card of Fate 5, Moonlit Water Mill 5 (Sheltering Bliss).',
      b('Builds') + ': Clown: Arrow Vulcan damage plus songs. Gypsy: Tarot Card and Wand of Hermode support. Marionette Control shares your stats with a partner; Longing for Freedom frees you while moving.'],
  },
  4: {
    1: [transIntro,
      b('High Priest') + ' adds: Assumptio 5, Basilica 5, Meditatio 10, Mana Recharge 5.',
      b('Builds') + ': Support High Priest: Assumptio, Basilica, Meditatio, Kyrie, Heal. Offensive: Magnus Exorcismus and Turn Undead with Mana Recharge to keep SP cost down. Basilica creates a safe zone for bosses.'],
    2: [transIntro,
      b('Champion') + ' adds: Chain Crush Combo 10, Raging Palm Strike 5 (Palm Push Strike), Tiger Knuckle Fist 5 (Glacier Fist), Zen 1.',
      b('Builds') + ': Combo Champion: Chain Crush Combo and Zen, high STR / AGI. Burst: Tiger Knuckle Fist and Palm Push Strike for single targets. Zen stores spirit spheres for combos.'],
  },
  5: {
    1: [transIntro,
      b('Whitesmith') + ' adds: Cart Termination 10, Maximum Power Thrust 5, Shattering Strike 10 (Meltdown), Upgrade Weapon 10, Create Coins 3, Create Nuggets 3, Cart Boost, Auto Attack System.',
      b('Builds') + ': Cart Termination Whitesmith: heavy cart, STR; Maximum Power Thrust and Adrenaline Rush buff it. Meltdown destroys a boss\'s weapon or armor. Upgrade Weapon refines gear for zeny.'],
    2: [transIntro,
      b('Creator') + ' adds: Acid Demonstration 10, Slim Potion Pitcher 10 (Aid Condensed Potion), Full Chemical Protection 5, Plant Cultivation 2, Alchemy 5, Potion Synthesis 5.',
      b('Builds') + ': Acid Demonstration Creator: INT and DEX. Support Creator: Slim Pitcher, Full Chemical Protection, Plant Cultivation. Homunculus still helps. Plant Cultivation spawns mushrooms and plants to farm.'],
  },
  6: {
    1: [transIntro,
      b('Assassin Cross') + ' adds: Enchant Deadly Poison 5, Meteor Assault 10, Soul Destroyer 10, Advanced Katar Mastery 5, Create Deadly Poison 1.',
      b('Builds') + ': EDP Assassin Cross: Enchant Deadly Poison plus Sonic Blow, AGI / STR. AoE: Meteor Assault and Grimtooth. Soul Destroyer is a ranged finisher that uses your attack and INT.'],
    2: [transIntro,
      b('Stalker') + ' adds: Chase Walk 5, Reject Sword 5, Preserve 1, Full Strip 5 (Divest All).',
      b('Builds') + ': Strip Stalker: Full Strip to disarm bosses. Copy Stalker: Preserve keeps a Plagiarised skill so you can use it later. Reject Sword reflects melee hits; Chase Walk gives stealth speed.'],
  },
};

module.exports = { variants, eraNote, trans };
