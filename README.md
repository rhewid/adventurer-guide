# Adventurer Guide

A mod for [Ragnarok Offline](https://github.com/Flux159/ragnarokoffline.app). The **Adventurer Guide** is an NPC in Prontera at **136,171** who knows your class and your level and tells you:

- where to level, with a hunting tip for your class at every spot
- what gear and cards to buy, farm and collect, and where
- which stats and skills to take, in several playstyles per class
- which MVPs could be worth a try, and which of their skills to look out for
- what this server's EXP and drop rates are

Everything is worked out from the server's own item, monster, shop and spawn data, separately for **pre-renewal** and **renewal** (the app's renewal data re-levels most dungeons), so the maps, levels, prices and drop rates match the mode you play.

Needs Ragnarok Offline 1.4.3 or newer. Works in both game modes: the app loads the right files for the mode you run.

## Install

1. Download `adventurer-guide-<version>.zip` from [Releases](https://github.com/rhewid/adventurer-guide/releases) and unpack it so that `adventurer-guide` is a folder, or copy the folder to `%APPDATA%\Ragnarok Offline\state\mods`. You can also use **Settings → Mods → Add mod from folder**.
2. Switch it on in Settings → Mods and press **Apply**.
3. Talk to the Guide in Prontera.

The `tools` folder is only for editing the content; the game ignores it (the release zip leaves it out).

## What the Guide offers

The Guide detects your class (rebirth and baby classes use their base line). "Show another class" opens the pages of any other class: Novice / Super Novice, Swordman, Mage, Archer, Acolyte, Merchant, Thief, Taekwon, Gunslinger and Ninja, each with its 2nd-class lines.

| Menu | What it shows |
|---|---|
| **Where should I level** | Fields and dungeons for your base level: the monsters, the map ids and a **tip for your class** at each spot. Pre-renewal has 10 level ranges, renewal 17 (up to 165+). Any other range can be opened too. |
| **Gear and cards** | **Buy from NPCs** (starter tiers by level, plus everything else your class can buy, with price and town); **weapon cards**; **weapons only monsters drop** (slotted versions of shop weapons, element katars / bows / whips / guitars, weapons with skill bonuses); armor, shield, garment, shoes, accessory and headgear **cards**; **armor and accessories only monsters drop**; a **general card guide** (defence by race, damage by race / element / size, elemental armor and garments, status immunities). Every pick shows the monster, its level, the drop rate and the map. Gear your class cannot wear is left out. |
| **Stats and skills** | A stat spread and skill list for the first class and every 2nd-class line, with **several playstyles** where they exist (for example Assassin: katar crit, dual dagger, poison / Grimtooth; Hunter: DEX archer, falcon, trapper; Crusader: Holy Cross, Grand Cross, Spear Quicken, shield, tank). Rebirth classes get an extra page for their added skills, renewal a third-class summary, and each page ends with a short note on the rules of your mode. |
| **Bosses (MVP)** | MVPs by level range with element, HP, location and card, how well your class matches them (as a rough pointer, never a promise) and a page of **skills to watch for**: big AoEs, status attacks, gear breakers, Pneuma / Safety Wall / Shield Reflect, minions, with what helps. |
| **Server rates** | Base, job, MVP and quest EXP and item, equipment, card and boss drop rates, read live from the server, and what the card rate means in kills per card. |

### Hunting tips

Under each level spot the Guide gives a tip for **your** class, worked out from the monsters there (element, race, size, DEF / MDEF, how crowded the map is): the spells to use or skip, trap lines for Hunters, Grimtooth crowds from Cloaking for Assassins, Pierce on Large monsters for Knights, Turn Undead for Priests, and so on. A few spots have hand-written tips (Juperos, Stalactic Golems, Glast Heim Chivalry).

### Gear that only drops

Shops sell armor without card slots; the slotted `[1]` version only drops. The Guide says so and lists where each slotted piece drops, plus the drop-only weapons and equipment worth farming for your class, for example Katar of Raging Blaze from Eddga, Krierg for Back Stab, Falken Blitz, Combo Battle Glove, Cross Shield or Sniping Suit. Rates shown are the normal ones; multiply by the drop rate on the Server rates page.

## Known limits

- **Builds are classic community advice**, not hard rules. Skill names and levels were checked against the app's skill data, but stat splits and playstyles are suggestions.
- **MVP ratings are a rule of thumb** (element weakness, DEF / MDEF, HP, the skills a boss uses). Even a boss rated "could be possible" needs good gear, potions and a Fly Wing.
- Some picks have no source in one mode (for example a card no ordinary monster drops in renewal); they are simply left out of that mode.
- **Doram and Gangsi** have no page yet (they see the Novice guide and can open another class).
- Star Gladiator, Soul Linker, Kagerou / Oboro and Rebellion have fewer playstyles than the main lines.
- Not every page has been checked in game in both modes. Bug reports and wishes are welcome.

## Settings (Settings → Mods)

| Setting | Default |
|---|---|
| NPC look: custom view id | 0 (old crusader sprite) |

## Editing the content

All text lives in `tools/` and the two NPC files are generated from it. Do not edit `*/npc/adventurer_guide.txt` by hand.

| File | Holds |
|---|---|
| `tools/data.js` | classes, level spots (separately for pre-renewal and renewal) |
| `tools/builds.js`, `tools/variants.js` | main builds, extra playstyles, rebirth and third-class pages, era notes |
| `tools/gear.js` | gear and card picks, starter tiers, drop-only gear, the general card guide |
| `tools/strategy.js`, `tools/mvp.js`, `tools/mobwatch.js` | the hunting tips, MVP ratings and boss skill warnings |
| `tools/itemdata-*.json`, `tools/spotstats-*.json`, `tools/mvps-*.json` | data pulled from the server |

```
node tools/extract.js "<path to rathena>"        # prices, shops, drops and maps for gear.js picks
node tools/extract-spots.js "<path to rathena>"  # monster stats for the tips and the MVP guide
node tools/build.js                              # writes both NPC scripts
```

`<path to rathena>` defaults to `../../ragnarokoffline.app/vendor/rathena` (the app checkout next to this folder). Run the two extract scripts only after changing `gear.js` or updating the app.

## Changelog

- **0.5.0** First public release.

## License

MIT, see [LICENSE](LICENSE).
