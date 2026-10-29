import {ItemArtwork} from './item-art';
import {ItemHover} from './ItemHover';
import type {CharacterStats,InventoryItem,ItemSet,Rarity} from './types';
import type {Zone} from './ZonePanel';
import {labels,numberStat,statsText} from './presentation';
import './loot-preview.css';
export type LocatedItem={Id:string;Name:string;Rarity:Rarity;SetId:string;Ranges:{Attribute:string;Min:number;Max:number;Optional:boolean}[];Effects:string[];Sources:{ZoneId:string;Kind:string;BossId?:string}[]};
export type Travel=(zone:string,activity:'dive'|'fish',bossId?:string)=>void;
export function readLootGuide(value:unknown):LocatedItem[]|undefined{
 if(!Array.isArray(value))return;
 return value.map((row:any)=>Array.isArray(row)?{Id:row[0],Name:row[1],Rarity:row[2],SetId:row[3],Ranges:row[4].map((r:any[])=>({Attribute:r[0],Min:r[1],Max:r[2],Optional:r[3]})),Effects:row[5],Sources:row[6].map((s:any[])=>({ZoneId:s[0],Kind:s[1],BossId:s[2]??undefined}))}:row).filter(i=>i.Rarity!=='Divine');
}
export const rarityName:Record<string,string>={Mythic:'Mythisch',Common:'Gewöhnlich',Uncommon:'Ungewöhnlich',Rare:'Selten',Epic:'Episch',Legendary:'Legendär',Cursed:'Verflucht',True:'Wahr',Abyss:'Abyss',Eternal:'Eternal',Divine:'Divine'};
export function LootSources({item,zones=[],onTravel,disabled=false}:{item:LocatedItem;zones?:Zone[];onTravel?:Travel;disabled?:boolean}){
 if(item.Rarity==='Divine')return null;
 return <details className="loot-sources"><summary>Fundorte anzeigen</summary>{item.Sources.length?item.Sources.map((s,n)=><button key={s.ZoneId+s.Kind+n} disabled={disabled||!onTravel} onClick={()=>onTravel?.(s.ZoneId,'dive',s.BossId)}>{zones.find(z=>z.Id===s.ZoneId)?.Name??s.ZoneId} · {s.Kind==='dungeon'?'Mythischer Dungeon · Tankloot':s.Kind==='mimic'?'Mimic · 50 % Gebietsbeute':s.Kind==='boss'?'Bossbelohnung':s.Kind==='eternal'?'Seltener Kampf-Drop':s.Kind==='chest'?'Schatztruhe / Zusatzbeute':'Gebietskampf'}</button>):<small>Aktuell kein freigegebener Fundort.</small>}</details>;
}
export function LootDetails({item,sets=[],zones,onTravel,disabled}:{item:LocatedItem;sets?:ItemSet[];zones?:Zone[];onTravel?:Travel;disabled?:boolean}){
 const set=sets.find(s=>s.id===item.SetId);
 return <><h3>{item.Name}</h3><p>{rarityName[item.Rarity]??item.Rarity} · Grundwerte bei +0</p><ul>{item.Ranges.map(r=>{const key=(r.Attribute[0].toLowerCase()+r.Attribute.slice(1)) as keyof CharacterStats;return <li key={r.Attribute}>{labels[key]??r.Attribute}: {r.Min===r.Max?numberStat(key,r.Min):`${numberStat(key,r.Min)} – ${numberStat(key,r.Max)}`}{r.Optional?' · optionaler Roll':''}</li>;})}</ul>{item.Effects.map((e,n)=><p key={n}>{e}</p>)}{set&&<section className="item-hover-set"><strong>{set.name}</strong>{set.bonuses.map(b=><p key={b.pieces}>{b.pieces} Teile · {b.description||statsText(b.attributes).join(', ')}</p>)}</section>}<LootSources item={item} zones={zones} onTravel={onTravel} disabled={disabled}/></>;
}
export function LootTile({item,sets,zones,onTravel,disabled}:{item:LocatedItem;sets?:ItemSet[];zones?:Zone[];onTravel?:Travel;disabled?:boolean}){
 if(item.Rarity==='Divine')return null;
 const preview={instanceId:'preview:'+item.Id,itemId:item.Id,name:item.Name,rarity:item.Rarity,description:'',attributes:{},effects:[],favorite:false,locked:false,salvageValue:0,dropWeight:0,activities:[],kind:'Equipment',icon:'✧'} as InventoryItem;
 return <ItemHover item={preview} details={<LootDetails item={item} sets={sets} zones={zones} onTravel={onTravel} disabled={disabled}/>}><button className={'loot-tile '+item.Rarity} aria-label={'Beutevorschau: '+item.Name}><ItemArtwork id={item.Id} name={item.Name} small/><strong>{item.Name}</strong><small>{rarityName[item.Rarity]??item.Rarity}</small></button></ItemHover>;
}
export function LootPreview({items,sets,zones,onTravel,disabled,title='Mögliche Ausrüstung'}:{items?:LocatedItem[];sets?:ItemSet[];zones?:Zone[];onTravel?:Travel;disabled?:boolean;title?:string}){
 return <section className="loot-preview"><h3>{title}</h3>{items?<><p>Bild berühren oder fokussieren: Wertebereiche, Seteffekte und Fundorte.</p><div className="loot-preview-grid">{items.filter(i=>i.Rarity!=='Divine').map(i=><LootTile key={i.Id} item={i} sets={sets} zones={zones} onTravel={onTravel} disabled={disabled}/>)}</div>{!items.length&&<p>Keine Ausrüstungsdrops freigegeben.</p>}</>:<p>Beuteliste wird vom Plugin geladen …</p>}</section>;
}
