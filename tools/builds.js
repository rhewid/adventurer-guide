// Main stat / skill build per class line and branch, and third-class summaries (renewal only).
// build[line][branch] = [paragraphs]; extra playstyles live in variants.js.
//
// Skill names and maximum levels were checked against the app's skill_tree.yml and skill_db.yml.
// Where the client renames a skill, the classic name is used and the other name is in brackets.

const { b } = require('./data.js');

const build = {
  0: {
    0: [
      b('Stats') + ': early on put points into whatever your target class needs: Swordman STR/VIT, Mage INT/DEX, Archer DEX/AGI, Acolyte INT/VIT, Merchant STR/VIT, Thief AGI/STR/DEX.',
      b('Skills') + ': take ' + b('Basic Skill Lv 9') + ' and use First Aid as needed. Change job at job level 10. Levelling a Novice to job level 10 is fast: use Prontera South Field.',
    ],
    1: [
      b('Stats') + ': STR for damage, AGI for speed, VIT for HP, DEX for hit. A balanced split such as STR 70 / AGI 70 / VIT 50 / DEX 50 works because Super Novices can use any 1H gear.',
      b('Skills') + ': ' + b('Basic Skill Lv 9, First Aid') + '. Super Novices rely mostly on Novice skills and gear, so cards and buffs matter more than skill points.',
    ],
  },
  1: {
    0: [
      b('Stats') + ': STR first (damage and weight), then VIT and AGI. A common 1st class split: STR 60+ / AGI 40 / VIT 50 / DEX 30.',
      b('Skills') + ': ' + b('Sword Mastery 10, Two-Handed Sword Mastery 10, Bash 10, Endure 10, Provoke 10, Magnum Break 10, Increase HP Recovery 10, Auto Berserk 1') + '. Bash plus Magnum Break are your main attacks. Take Two-Handed Sword Mastery if you plan a 2H sword.',
    ],
    1: [
      b('Stats') + ': STR 99 / AGI 60+ / VIT 40+ / DEX 50, adding INT 20 only for SP. Knights hit hard with Bowling Bash and Two-Hand Quicken.',
      b('Skills') + ': ' + b('Two-Hand Quicken 10, Bowling Bash 10, Magnum Break 10, Cavalier Mastery 5, Peco Peco Riding, Counter Attack 5, Pierce / Spear Stab / Brandish Spear 10 (spear)') + '. Level with Bowling Bash on crowds; Magnum Break clears groups around you. Two-Hand Quicken needs a 2H sword.',
    ],
    2: [
      b('Stats') + ': STR / VIT (tank) with INT for Grand Cross. A balanced STR 70 / VIT 80 / INT 40 / DEX 50 is typical.',
      b('Skills') + ': ' + b('Auto Guard 10, Shield Charge 5, Shield Boomerang 5, Holy Cross 10, Grand Cross 10, Devotion 5, Providence 5, Faith 10, Spear Mastery 10, Heal 10, Cure') + '. Holy Cross is the main damage skill; Grand Cross hits undead and demons hard but hurts you. Crusaders can Heal themselves.',
    ],
  },
  2: {
    0: [
      b('Stats') + ': INT 80+ first, then DEX for cast time and VIT for survival. INT 80 / DEX 50 / VIT 30 / AGI 30 is a sound start.',
      b('Skills') + ': ' + b('Fire Bolt 10, Cold Bolt 10, Lightning Bolt 10, Napalm Beat 10, Sight, Frost Diver 10, Fire Ball 10, Safety Wall 10, Soul Strike 10, Thunderstorm 10, Energy Coat') + '. Cast bolts from range; use Frost Diver to freeze.',
    ],
    1: [
      b('Stats') + ': INT 99, DEX 80+, VIT 40, AGI 30. Cast time is everything for Wizards.',
      b('Skills') + ': ' + b('Jupitel Thunder 10, Lord of Vermilion 10, Storm Gust 10, Meteor Storm 10, Earth Spike 5, Heaven\'s Drive 5, Quagmire 5, Sightrasher 10, Ice Wall 10, Frost Nova 10, Water Ball 5, Fire Pillar 10') + '. Level on crowds with Storm Gust (ice) or Meteor Storm (fire); use Quagmire to slow groups.',
    ],
    2: [
      b('Stats') + ': INT 90+, DEX 70+, VIT 40, AGI 30. Sage damage comes from auto-casts.',
      b('Skills') + ': ' + b('Hindsight (Auto Spell) 10, Free Cast 10, Cast Cancel 5, Endow Blaze / Tsunami / Tornado / Quake 5, Volcano / Deluge / Violent Gale 5, Dispell 5, Spell Breaker 5, Land Protector 5, Dragonology 5, Earth Spike 5, Heaven\'s Drive 5') + '. Hindsight plus a good weapon farms fast; field spells boost party elemental damage.',
    ],
  },
  3: {
    0: [
      b('Stats') + ': DEX first, then AGI for ASPD. DEX 70 / AGI 50 / INT 20 / VIT 30 is a good opening.',
      b('Skills') + ': ' + b('Owl\'s Eye 10, Vulture\'s Eye 10, Double Strafe 10, Arrow Shower 10, Improve Concentration 10, Arrow Crafting, Arrow Repel') + '. Double Strafe is your main attack from range; retreat as monsters approach.',
    ],
    1: [
      b('Stats') + ': DEX 99, AGI 60-80, INT 40 (Blitz Beat), LUK 30 (crit / Steel Crow) as a hybrid. Pure DEX / AGI is simpler.',
      b('Skills') + ': ' + b('Double Strafe 10, Blitz Beat 5, Steel Crow 10, Falconry Mastery, Beast Bane 10, Beast Strafing, Ankle Snare 5, Land Mine 5, Claymore Trap 5, Blast Mine 5, Freezing Trap 5, Shockwave Trap 5') + '. Blitz Beat triggers by itself with a falcon; traps control crowds and bosses.',
    ],
    2: [
      b('Stats') + ': DEX / INT / AGI. Bards and Dancers support first, damage second.',
      b('Skills') + ': ' + b('Bard: Musical Strike (Melody Strike) 5, Poem of Bragi (Magic Strings) 10, Assassin Cross of Sunset (Impressive Riff) 10, Apple of Idun (Song of Lutie) 10, A Whistle 10, Dissonance 5, Lullaby. Dancer: Throw Arrow (Slinging Arrow) 5, Service For You 10, Humming 10, Fortune\'s Kiss 10, Don\'t Forget Me 10, Ugly Dance 5') + '. Songs and dances buff the whole party; ensemble skills need a partner of the other sex.',
    ],
  },
  4: {
    0: [
      b('Stats') + ': INT and DEX for casting, VIT for HP. INT 70 / DEX 40 / VIT 40 / AGI 20.',
      b('Skills') + ': ' + b('Heal 10, Blessing 10, Increase AGI 10, Divine Protection 10, Demon Bane 10, Ruwach, Pneuma, Cure, Holy Light 1, Signum Crucis 10, Angelus 10') + '. Heal also damages undead; Blessing / Increase AGI make you a sought-after party member.',
    ],
    1: [
      b('Stats') + ': INT 99, DEX 70+, VIT 40, AGI 30. Priests are casters with a lot of utility.',
      b('Skills') + ': ' + b('Kyrie Eleison 10, Magnificat 5, Gloria 5, Sanctuary 10, Resurrection 4, Safety Wall 10, Lex Aeterna, Lex Divina 10, Magnus Exorcismus 10, Turn Undead 10, Aspersio 5, Impositio Manus 5, Suffragium 3, Aqua Benedicta') + '. Turn Undead and Magnus Exorcismus level you fast in undead dungeons; Sanctuary heals the party.',
    ],
    2: [
      b('Stats') + ': STR 70 / AGI 70 / VIT 60 / DEX 40 for combo; add INT 40-60 if you plan Asura Strike. Monks need SP to chain skills.',
      b('Skills') + ': ' + b('Iron Hands 10, Summon Spirit Sphere 5, Investigate 5, Finger Offensive 5, Triple Attack 10, Chain Combo 5, Combo Finish 5, Absorb Spirits, Steel Body 5, Blade Stop 5, Dodge 10, Asura Strike 5') + '. Combo (Triple -> Chain -> Combo Finish) is the main damage source; Asura Strike is an all-SP burst for bosses.',
    ],
  },
  5: {
    0: [
      b('Stats') + ': STR for weight and damage, VIT for HP, DEX. STR 70 / VIT 50 / DEX 40 / AGI 30.',
      b('Skills') + ': ' + b('Enlarge Weight Limit 10, Discount 10, Overcharge 10, Mammonite 10, Pushcart 10, Vending 10, Cart Revolution, Item Appraisal, Change Cart') + '. Discount and Overcharge pay for themselves quickly. Mammonite is your damage skill (it costs zeny).',
    ],
    1: [
      b('Stats') + ': STR 90+, DEX 60+, VIT 50, AGI 30. Blacksmith damage is mostly through weapon buffs.',
      b('Skills') + ': ' + b('Hammerfall 5, Adrenaline Rush 5, Weapon Perfection 5, Power-Thrust 5, Maximize Power 5, Hilt Binding, Weaponry Research 10, Skin Tempering 5, Weapon Repair, Cart Revolution (Merchant skill)') + '. Cart Revolution is the AoE for crowds. Forging is how you earn zeny.',
    ],
    2: [
      b('Stats') + ': INT 70+, DEX 70+, VIT 50, AGI 30. Acid Terror and Acid Demonstration scale with INT and DEX.',
      b('Skills') + ': ' + b('Acid Terror 5, Acid Demonstration (Bomb) 5, Potion Pitcher 5, Pharmacy 10, Summon Flora 5, the Chemical Protection set, Bioethics, Homunculus (Lif / Amistr / Filir / Vanilmirth)') + '. Demonstration plus Homunculus melts bosses; Potion Pitcher keeps the party healed.',
    ],
  },
  6: {
    0: [
      b('Stats') + ': AGI first, then STR and DEX. AGI 60 / STR 40 / DEX 40 / LUK 20.',
      b('Skills') + ': ' + b('Double Attack 10, Improve Dodge 10, Steal 10, Hiding 10, Envenom 10, Detoxify, Stone Fling') + '. Double Attack with a dagger is your steady damage; Hiding avoids bad fights.',
    ],
    1: [
      b('Stats') + ': AGI 99 / STR 70 / DEX 60 / LUK 40 for crit builds. Assassins want ASPD and Flee.',
      b('Skills') + ': ' + b('Katar Mastery 10, Sonic Blow 10, Grimtooth 5, Enchant Poison 10, Venom Dust 10, Cloaking 10, Righthand Mastery 5, Lefthand Mastery 5, Poison React 10') + '. Sonic Blow is the burst for single targets; Grimtooth hits groups from stealth. Both need a katar.',
    ],
    2: [
      b('Stats') + ': AGI / STR / DEX, with LUK for crit. AGI 80 / STR 60 / DEX 60 / LUK 40.',
      b('Skills') + ': ' + b('Back Stab 10, Raid 5, Intimidate 5, Strip Weapon / Shield / Armor / Helm 5, Snatcher 10, Mug 10, Plagiarism 10, Close Confine, Gangster\'s Paradise') + '. Back Stab is your main damage; Strip skills defang bosses.',
    ],
  },
  7: {
    0: [
      b('Stats') + ': AGI / STR / DEX. Taekwon use kicks that scale with level and AGI. AGI 70 / STR 50 / DEX 40 / VIT 40.',
      b('Skills') + ': ' + b('Running 10, Tumbling, Tornado Kick 7, Heel Drop 7, Roundhouse Kick 7, Counter Kick 7, Flying Kick 7, Kihop 5, Mild Wind 7') + '. Kicks and combos are your damage; use Running to chase and flee.',
    ],
    1: [
      b('Stats') + ': STR / AGI / VIT. Star Gladiators gain from raised HP and defences.',
      b('Skills') + ': ' + b('Feeling of the Sun, Moon and Stars 3, Warmth of the Sun / Moon / Stars 3, Comfort of the Sun / Moon / Stars 4, Hatred of the Sun, Moon and Stars 3, Anger of the Sun / Moon / Stars 3, Blessing of the Sun / Moon / Stars 5, Union 1') + '. Pick your Feeling and Hatred targets for the monsters you will actually farm.',
    ],
    2: [
      b('Stats') + ': INT / DEX / VIT. Soul Linkers are support casters.',
      b('Skills') + ': ' + b('Kaizel 7, Kaahi 7, Kaupe 3, Kaite 7, Kaina 7, Estin 7, Estun 7, Esma 10, Eswoo 7, Eske 3, Eska 3, and the Spirit of ... skills') + '. Most are buffs for you or an ally; Esma is the damage spell. Spirit skills link a partner of a specific class.',
    ],
  },
  8: {
    0: [
      b('Stats') + ': DEX / AGI / LUK. Gunslingers need hit and speed. DEX 80 / AGI 60 / LUK 30 / VIT 30.',
      b('Skills') + ': ' + b('Single Action 10, Snake Eyes 10, Chain Action 10, Increase Accuracy, Triple Action, Bull\'s Eye, Magical Bullet, Rapid Shower 10 (revolver), Desperado 10 (revolver), Tracking 10 (revolver / rifle), Piercing Shot 5 (revolver / rifle), Gatling Fever 10 (gatling), Dust / Full Buster / Spread Attack 10 (shotgun)') + '. Your weapon type decides which skills work, so pick one: revolver, rifle, gatling or shotgun.',
    ],
    1: [
      b('Stats') + ': DEX / AGI / LUK / VIT. Rebellion leans on DEX and LUK.',
      b('Skills') + ': ' + b('Rifle: Hammer of God 10, Mass Spiral 5, Anti-Material Blast 5. Shotgun: Banishing Buster 10, Shatter Storm 5, Slug Shot 5. Revolver: Fire Dance 10. Gatling: Round Trip 10, Fire Rain 5. Grenade launcher: Dragon Tail 10. Any gun: Eternal Chain 10, Heat Barrel 5') + '. Your weapon decides your skills, so build around one.',
    ],
  },
  9: {
    0: [
      b('Stats') + ': INT / DEX / AGI. Ninja spells scale with INT. INT 70 / DEX 50 / AGI 40 / VIT 30.',
      b('Skills') + ': ' + b('Flaming Petals (Crimson Fire Petal) 10, Exploding Dragon (Raging Fire Dragon) 5, Freezing Spear (Spear of Ice) 10, Snow Flake Draft (Ice Meteor) 5, Wind Blade 10, Lightning Jolt (Lightning Strike of Destruction) 5, Thunderstorm (Kamaitachi) 5, Ninja Aura (Spirit of the Blade) 10, Cicada Skin Shed 5, Mirror Image 10, Final Strike 10') + '. Match the element to the monster: use @mi <monster> to see its element.',
    ],
    1: [
      b('Stats') + ': STR / AGI / DEX for a close-range thrower. Kagerou mixes throwing and melee.',
      b('Skills') + ': ' + b('Cross Slash 10, Soul Cutter 5, Kunai Explosion 5, Kunai Splash 5, Rapid Throw 10, Swirling Petal 10 (huuma), Makibishi 5, Illusion - Shadow / Shock / Death 5, Shadow Warrior 5, Right / Left Hand Mastery 5') + '. Kunai Explosion and Kunai Splash are your crowd damage; the Illusion skills control bosses.',
    ],
    2: [
      b('Stats') + ': INT / DEX / AGI. Oboro leans on moon magic and talismans.',
      b('Skills') + ': ' + b('Distorted Crescent 5, Moonlight Fantasy 5, Ominous Moonlight 5, Cross Slash 10, Soul Cutter 5, Illusion - Shadow / Shock / Death 5, Pure Soul 5, Fire / Ice / Wind / Earth Charm') + '. Cast Ninja Spell, then release it for a big hit; the charms feed your spells.',
    ],
  },
};

// Third classes (renewal only): third[line][branch]. They keep every skill of their 2nd class.
const third = {
  1: {
    1: [b('Rune Knight') + ' keeps all Knight skills and adds Dragon Breath 10, Hundred Spear 10, Ignition Break 5, Wind Cutter 5, Sonic Wave 10, Death Bound 10, Enchant Blade 10, Phantom Thrust 5, Dragon Howling 5, Rune Mastery 10. Dragon Breath for bosses, Hundred Spear and Ignition Break for crowds.'],
    2: [b('Royal Guard') + ' keeps all Crusader skills and adds Over Brand 5, Cannon Spear 5, Banding 5, Pinpoint Attack 5, Exceed Break 5, Moon Slasher 5, Shield Press 10, Shield Spell 3, Prestige 5, Ray of Genesis 10, Earth Drive 5, Hesperus Lit 5. Banding with a party is key; Over Brand and Ray of Genesis for AoE.'],
  },
  2: {
    1: [b('Warlock') + ' keeps all Wizard skills and adds Comet 5, Chain Lightning 5, Crimson Rock 5, Hell Inferno 5, Jack Frost 5, Tetra Vortex 10, Soul Expansion 5, White Imprison 5, Reading Spellbook. Keep SP high: Comet and Chain Lightning are SP-heavy.'],
    2: [b('Sorcerer') + ' keeps all Sage skills and adds the elemental spirits (Agni, Aqua, Ventus, Tera), Psychic Wave 5, Varetyr Spear 10, Diamond Dust 5, Earth Grave 5, Poison Buster 5, Cloud Kill 5, Spell Fist 10. Your spirits do most of the work.'],
  },
  3: {
    1: [b('Ranger') + ' keeps all Hunter skills (traps included) and adds Arrow Storm 10, Aimed Bolt 10, Fear Breeze 5, Cluster Bomb 5, Warg Rider 3, Warg Strike 5, Warg Bite 5, Camouflage 5, Research Trap 10, Firing Trap 5, Icebound Trap 5. Arrow Storm for single targets, Aimed Bolt for range.'],
    2: [b('Minstrel / Wanderer') + ' keep all Bard / Dancer skills and add Severe Rainstorm 5, Reverberation 5, Gloomy Day 5, Metallic Sound 10, Echo Song / Swing Dance, Voice of Siren 5, Frigg\'s Song 5, Lerad\'s Dew 5. Buff the party, then Severe Rainstorm for AoE.'],
  },
  4: {
    1: [b('Archbishop') + ' keeps all Priest skills and adds Adoramus 10, Judex 10, Clementia 3, Canto Candidus 3, Praefatio 10, Coluseo Heal 3, Epiclesis 5, Renovatio 4, Highness Heal 5, Oratio 10, Lauda Agnus / Ramus 4, Sacrament 5, Offertorium 5. Adoramus for damage; Clementia and Canto give party buffs.'],
    2: [b('Sura') + ' keeps all Monk skills and adds Dragon Combo 10, Sky Net Blow 5, Rampage Blaster 5, Tiger Cannon 10, Knuckle Arrow 10, Earth Shaker 5, Fallen Empire 10, Gate of Hell 10, Raising Dragon 10, Lightning Walk 5, Gentle Touch skills. Rampage Blaster uses your Spirit Spheres for AoE.'],
  },
  5: {
    1: [b('Mechanic') + ' keeps all Blacksmith skills and adds Axe Boomerang 5, Axe Tornado 5, Power Swing 10, Arm Cannon 5, Boost Knuckle 5, Pile Bunker 3, Vulcan Arm 3, Flame Launcher 3, Cold Slower 3 and Mado Gear (Mado License 5). The Mado License lets you ride a Mado Gear for the Mechanic skills.'],
    2: [b('Genetic') + ' keeps all Alchemist skills and adds Cart Cannon 5, Cart Tornado 10, Cart Boost 5, Crazy Weed 10, Spore Explosion 10, Hell\'s Plant 5, Demonic Fire 5, Fire Expansion 5, Thorn Trap 5, Blood Sucker 5, Wall of Thorns 5, Special Pharmacy 10. Genetic mixes bomb damage with plants and healing.'],
  },
  6: {
    1: [b('Guillotine Cross') + ' keeps all Assassin skills and adds Cross Impact 5, Counter Slash 10, Rolling Cutter 5, Cross Ripper Slasher 5, Phantom Menace, Dark Illusion 5, Venom Impress 5, Venom Pressure 5, Poisoning Weapon 5, Weapon Crush 5, Poison Smoke 5, Cloaking Exceed 5. Counter Slash and Rolling Cutter for combos.'],
    2: [b('Shadow Chaser') + ' keeps all Rogue skills and adds Triangle Shot 10, Feint Bomb 10, Reproduce 10, Auto Shadow Spell 10, Fatal Menace 10, Invisibility 5, Masquerade debuffs 3, Man Hole 3, Dimension Door 3, Chaos Panic 3, Maelstrom 3, Bloody Lust 3. Reproduce copies a skill; Triangle Shot for ranged burst.'],
  },
};

module.exports = { build, third };
