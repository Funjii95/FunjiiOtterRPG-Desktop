import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {AdminControlCenter} from '../src/AdminControlCenter';
import {ZonePanel,type Zone} from '../src/ZonePanel';
import {SetOverview} from '../src/SetOverview';
import {inventoryView} from '../src/inventoryView';
import type {InventoryItem,ItemSet} from '../src/types';
import catalog from '../../expansions/eternal-eight/catalog.json';
import art from '../src/eternal-eight-art.json';
const defaults={search:'',slot:'all',rarity:'all',status:'all',sort:'rarity'};
const item=(id:string,rarity='Common',rest:Partial<InventoryItem>={}):InventoryItem=>({instanceId:id,itemId:id,name:id,rarity,slot:'Helmet',kind:'Equipment',attributes:{},effects:[],favorite:false,locked:false,salvageValue:1,dropWeight:1,activities:[],...rest} as InventoryItem);
it('combines slot, rarity, ownership and text filters without changing authoritative inventory',()=>{const data=[item('Krone','Eternal',{favorite:true}),item('Stiefel','Eternal',{slot:'Boots',favorite:true}),item('Helm','Rare')];const before=JSON.stringify(data);expect(inventoryView(data,{Helmet:'Krone'},{...defaults,search:'krone',slot:'Helmet',rarity:'Eternal',status:'equipped'}).map(i=>i.itemId)).toEqual(['Krone']);expect(JSON.stringify(data)).toBe(before);});
it('sorts upgrades numerically and excludes collection objects',()=>{const data=[item('A','Rare',{upgradeLevel:2}),item('B','Epic',{upgradeLevel:9}),item('C','Divine',{slot:undefined,kind:'Treasure',collector:{} as any})];expect(inventoryView(data,{}, {...defaults,sort:'upgrade'}).map(i=>i.itemId)).toEqual(['B','A']);expect(inventoryView(data,{}, {...defaults,status:'unequipped'})).toHaveLength(2);});
it('shows exactly ten selectable area cards with a separate confirmed selection preview',()=>{const zones=Array.from({length:10},(_,i)=>({Id:'z'+i,Name:'Gebiet '+i,Level:(i+1)*10,Enemies:['Eins','Zwei','Drei'],Materials:[],MaximumRarity:0,ChestChance:8,MimicChance:1} as Zone));const html=renderToStaticMarkup(createElement(ZonePanel,{zones,desktop:true,diving:'z4',fishing:'z1',busy:false,cooldown:20,onSelect:async()=>{},onStart:()=>{}}));expect((html.match(/class="codex-zone-card/g)??[])).toHaveLength(10);expect(html).toContain('Ausgewähltes Gebiet');expect(html).toContain('Abklingzeit: 20 s');expect(html).toContain('codex-zone-card selected');});
it('all three eight-piece overviews use existing distinct item images and both rings',()=>{for(const raw of catalog.sets){const set={id:raw.Id,name:raw.Name,itemIds:raw.ItemIds,bonuses:[],description:'',demoOnly:false} as ItemSet;const html=renderToStaticMarkup(createElement(SetOverview,{set,equipped:new Set<string>()}));for(const id of set.itemIds){expect(art).toHaveProperty(id);expect(html).toContain((art as any)[id].src);}expect(html).toContain('Ring 1');expect(html).toContain('Ring 2');expect((html.match(/<img /g)??[])).toHaveLength(8);}});

it('moderator administration never renders owner-only item, Divine, role or configuration sections',()=>{const html=renderToStaticMarkup(createElement(AdminControlCenter,{source:{} as any,identity:{userId:'104100016',channelId:'42',connected:true},owner:false}));for(const label of ['Dashboard','Spieler','Bosse','Minispiele','Events'])expect(html).toContain(label);for(const label of ['Items &amp; Loot','Moderator freigeben','Divine','System &amp; Debug','Einstellungen suchen'])expect(html).not.toContain(label);});
