import questNames from './quest-item-names.json';
import {ItemArtwork,itemArt} from './item-art';
import type {ItemSet} from './types';
import {LootTile,type LocatedItem,type Travel} from './LootPreview';
import type {Zone} from './ZonePanel';
const partNames:Record<string,string>={'0':'Helm','1':'Brust','2':'Handschuhe','3':'Stiefel','4':'Waffe','5':'Ring 1','6':'Ring 2','7':'Amulett',helmet:'Helm',chest:'Brust',gloves:'Handschuhe',boots:'Stiefel',weapon:'Waffe',ring_1:'Ring 1',ring_2:'Ring 2',amulet:'Amulett'};
export function SetOverview({set,equipped,guide,sets,zones,onTravel,disabled}:{set:ItemSet;equipped:Set<string>;guide?:LocatedItem[];sets?:ItemSet[];zones?:Zone[];onTravel?:Travel;disabled?:boolean}){
 if(set.id==='divine_infinity')return null;
 return <section className={'codex-set-overview '+set.id} aria-label={set.name+(set.itemIds.length===8?' · acht Teile':` · ${set.itemIds.length} Teile`)}><header><small>{set.itemIds.length} SETTEILE</small><h3>{set.name}</h3></header><div className="codex-set-parts">{set.itemIds.map(id=>{const part=id.slice(set.id.length+1),item=guide?.find(i=>i.Id===id&&i.Rarity!=='Divine');return <div key={id} className={equipped.has(id)?'equipped':''}>{item?<LootTile item={item} sets={sets??[set]} zones={zones} onTravel={onTravel} disabled={disabled}/>:<><ItemArtwork id={id}/><strong>{(questNames as Record<string,{name:string}>)[id]?.name??itemArt[id]?.name??id}</strong><small>Wertebereiche noch nicht verfügbar.</small></>}<small>{partNames[part]??part} {equipped.has(id)?'· Ausgerüstet':''}</small></div>;})}</div></section>;
}
