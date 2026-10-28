import {describe,expect,it} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {itemArt} from '../src/item-art';
import rarities from '../src/item-rarities.json';

const armorIds=['tide_king','reef_guardian','lagoon_runner','shell_speaker','kelp_collector','coast_runner','pearl_digger']
 .flatMap(set=>['helmet','chest','gloves','boots','ring','amulet'].map(slot=>`${set}_${slot}`));
const replaced=[...armorIds,...['tide_crown','leviathan_call','sunken_kings','eternal_coral','origin_current','reef_wardens','star_tide','infinite_tides','worldbreaker'].map(id=>`weapon_${id}`),
 ...['boots','ring','amulet'].map(slot=>`eternal_primordial_wrath_${slot}`)];

describe('complete effective item artwork catalog',()=>{
 it('resolves every effective image to a nonempty local asset',()=>{
  for(const [id,entry] of Object.entries(itemArt)){
   expect(entry.src,id).toMatch(/^\.\/(items|fish)\//);
   const file=resolve('public',entry.src.slice(2));
   expect(existsSync(file),id).toBe(true);
   expect(readFileSync(file).byteLength,id).toBeGreaterThan(100);
  }
 });
 it('replaces every identified strip crop with a distinct verified full-square illustration and retains rarity',()=>{
  expect(replaced).toHaveLength(54);
  const hashes=new Set<string>();
  for(const id of replaced){
   const entry=itemArt[id];
   expect(entry.src,id).toBe(`./items/audited/${id}.webp`);
   expect([entry.width,entry.height],id).toEqual([512,512]);
   expect(createHash('sha256').update(readFileSync(resolve('public',entry.src.slice(2)))).digest('hex'),id).toBe(entry.assetSha256);
   expect((rarities as Record<string,string>)[id],id).toBeTruthy();
   hashes.add(entry.assetSha256);
  }
  expect(hashes.size).toBe(54);
 });
});
