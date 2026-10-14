import config from '../../shared/characters.json';
export const catalog=config;
export type Slot='hair'|'top'|'bottom'|'shoes'|'hat'|'accessory'|'weapon';
export type Appearance={characterId:string;equipped:Record<Slot,string|null>;revision:number};
export type GameState={coins:number;bank:number;power:number;basePower:number;hp:number;maxHp:number;reviveCard:number;defenseCards:number;speedCards:number;boost:boolean;protectedUntil:number;claimed:boolean;checkInAt:number;inviteClaimed:boolean;foodStock:Record<string,number>;battleResult?:{win:boolean;rivalHp:number}};
export type Wardrobe={appearance:Appearance;ownedItems:string[];coins:number;stats:{attack:number;defense:number;maxHp:number;gear:{attack:number;defense:number;health:number}};game:GameState};
export function attributes(a:Appearance,basePower:number){const gear={attack:0,defense:0,health:0};for(const id of Object.values(a.equipped)){const item=catalog.items.find(i=>i.itemId===id);if(item)for(const key of ['attack','defense','health']as const)gear[key]+=item.stats[key];}const char=catalog.characters.find(c=>c.characterId===a.characterId)||catalog.characters[0];return {attack:basePower+(char.baseStats.attack-catalog.characters[0].baseStats.attack)+gear.attack,defense:char.baseStats.defense+gear.defense,maxHp:char.baseStats.health+gear.health,gear};}
