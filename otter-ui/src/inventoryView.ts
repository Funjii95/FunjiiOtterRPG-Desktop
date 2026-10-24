import type {InventoryItem,Equipment,Rarity} from './types';
import {isCollectionItem} from './collectionInventory';
export type InventoryFilters={search:string;slot:string;rarity:string;status:string;sort:string;setId?:string;setNames?:Record<string,string>};
const rarities:Rarity[]=['Common','Uncommon','Rare','Epic','Legendary','True','Cursed','Abyss','Eternal','Divine'];
export function inventoryView(items:InventoryItem[],equipment:Equipment,f:InventoryFilters){
 const equipped=new Set(Object.values(equipment));const query=f.search.trim().toLocaleLowerCase('de-DE');
 return items.filter(i=>!isCollectionItem(i)&&(!f.setId||f.setId==='all'||i.setId===f.setId)&&(!query||(i.name+' '+i.itemId+' '+i.rarity+' '+(i.setId??'')+' '+(f.setNames?.[i.setId??'']??'')).toLocaleLowerCase('de-DE').includes(query))&&(f.slot==='all'||i.slot===f.slot)&&(f.rarity==='all'||i.rarity===f.rarity)&&(f.status==='all'||f.status==='favorite'&&i.favorite||f.status==='locked'&&i.locked||f.status==='equipped'&&equipped.has(i.instanceId)||f.status==='unequipped'&&!equipped.has(i.instanceId)))
 .sort((a,b)=>(f.sort==='rarity'?rarities.indexOf(b.rarity)-rarities.indexOf(a.rarity):f.sort==='upgrade'?(b.upgradeLevel??0)-(a.upgradeLevel??0):f.sort==='salvage'?b.salvageValue-a.salvageValue:0)||a.name.localeCompare(b.name,'de')||a.instanceId.localeCompare(b.instanceId));
}
