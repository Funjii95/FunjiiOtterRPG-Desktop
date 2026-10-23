import {it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import catalog from '../../expansions/tides/catalog.json';
import art from '../src/tides-art.json';
import {mapProfile,catalogView} from '../src/remote/model';
import {statsText} from '../src/presentation';
import {profile} from './remote-fixtures';

it('maps all 66 expansion items and their persisted rolls without generating values',()=>{
 const raw:any=profile();raw.rpg.inventory=catalog.items.map((i,n)=>({...i,InstanceId:`saved-${n}`,Generation:null,Attributes:{Damage:n+0.5,Armor:12,HealingPower:6,AttackSpeed:8},FoundAt:'2026-10-23T12:00:00Z'}));
 const state=mapProfile(raw,{sets:catalog.sets});expect(state.inventory).toHaveLength(66);
 for(let n=0;n<66;n++){expect(state.inventory[n].attributes.damage).toBe(n+0.5);expect(state.inventory[n].attributes.armor).toBe(12);expect(state.inventory[n].itemId).toBe(catalog.items[n].ItemId);}
 expect(statsText(state.inventory[0].attributes).join(' ')).toContain('Heilungswirkung');
 expect(new Set(state.inventory.map(i=>i.itemId)).size).toBe(66);
});
it('preserves six real set descriptions and 2/4/6 thresholds with no cosmetic sets',()=>{
 const sets=catalogView({sets:catalog.sets}).sets;expect(sets).toHaveLength(6);
 for(const set of sets){expect(set.bonuses.map(b=>b.pieces)).toEqual(set.itemIds.length===6?[2,4,6]:[2]);expect(set.bonuses.every(b=>b.description.length>0)).toBe(true);}
 expect(catalog.items.filter(i=>i.SetId)).toHaveLength(24);
 expect(catalog.items.filter(i=>i.Rarity==='Epic'||i.Rarity==='Uncommon').every(i=>!i.SetId)).toBe(true);
});
it('ships 66 individual illustrations with verified provenance and files',()=>{
 expect(Object.keys(art)).toHaveLength(66);
 for(const item of catalog.items){const entry=art[item.ItemId as keyof typeof art];expect(entry).toBeDefined();const path=resolve('public',entry.src.slice(2));expect(existsSync(path)).toBe(true);const content=readFileSync(path);expect(createHash('sha256').update(content).digest('hex')).toBe(entry.assetSha256);expect(entry.name).toBe(item.DisplayName);expect(content.subarray(8,12).toString()).toBe("WEBP");expect(entry.sourceSha256).toMatch(/^[a-f0-9]{64}$/);}
});
it('shows authoritative shield points while older profiles remain compatible',()=>{
 const raw:any=profile();raw.rpg.health.setShieldHp=42;
 expect(mapProfile(raw).player.shieldHp).toBe(42);expect(mapProfile(profile()).player.shieldHp).toBe(0);
});

