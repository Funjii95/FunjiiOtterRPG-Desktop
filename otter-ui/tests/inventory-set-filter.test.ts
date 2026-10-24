import {it,expect} from 'vitest';
import {inventoryView} from '../src/inventoryView';
import type {InventoryItem} from '../src/types';
const items=[{instanceId:'forge',itemId:'forge_helmet',name:'Krone',rarity:'Eternal',slot:'Helmet',setId:'cosmic',salvageValue:0},{instanceId:'other',itemId:'other_helmet',name:'Krone',rarity:'Legendary',slot:'Helmet',setId:'other',salvageValue:0}] as InventoryItem[];
const filters={search:'',slot:'all',rarity:'all',status:'all',sort:'name',setNames:{cosmic:'Sternenschmied des Urkosmos',other:'Anderes Set'}};
it('finds equipment by its set name even when its item name differs',()=>{expect(inventoryView(items,{}, {...filters,search:'urkosmos'}).map(i=>i.instanceId)).toEqual(['forge']);});
it('restricts inventory to the selected set and combines it with other filters',()=>{expect(inventoryView(items,{}, {...filters,setId:'cosmic'}).map(i=>i.instanceId)).toEqual(['forge']);expect(inventoryView(items,{}, {...filters,setId:'cosmic',rarity:'Legendary'})).toEqual([]);});
