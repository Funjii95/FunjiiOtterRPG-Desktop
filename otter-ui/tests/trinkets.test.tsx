import {it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import plan from '../../docs/trinkets-plan.json';
import {itemArt,ItemArtwork} from '../src/item-art';
import {inventoryItem,mapProfile} from '../src/remote/model';
import {ItemDetails} from '../src/ItemHover';
import {CodexCharacter} from '../src/CodexCharacter';
import {emptyStats} from '../src/presentation';
import {profile} from './remote-fixtures';
it('ships twenty distinct trinket pictures and rarity frames',()=>{
 expect(plan).toHaveLength(20);const hashes=new Set<string>();
 for(const item of plan){const art=itemArt[item.id];expect(art.name).toBe(item.name);expect(art.width).toBe(256);const hash=createHash('sha256').update(readFileSync('public/'+art.src.replace(/^\.\//,''))).digest('hex');expect(hash).toBe(art.assetSha256);hashes.add(hash);expect(renderToStaticMarkup(<ItemArtwork id={item.id}/>)).toContain(`data-rarity="${item.rarity}"`);}
 expect(hashes.size).toBe(20);
});
it('reads persisted trinket slots and shows both equipped items with effect descriptions',()=>{
 const raw:any=profile();raw.rpg.inventory=plan.slice(0,2).map((item,index)=>({InstanceId:`trinket-${index}`,ItemId:item.id,DisplayName:item.name,Description:item.description,Rarity:0,Slot:index+9,Kind:1,Attributes:{Attack:item.attack},Effects:[]}));raw.rpg.equipment={'9':'trinket-0','10':'trinket-1'};
 const state=mapProfile(raw);expect(state.equipment.Trinket1).toBe('trinket-0');expect(state.equipment.Trinket2).toBe('trinket-1');
 const html=renderToStaticMarkup(<CodexCharacter state={state} stats={emptyStats()} onItem={()=>{}}/>);expect(html).toContain('aria-label="Trinket 1"');expect(html).toContain('aria-label="Trinket 2"');
 const css=['style.css','desktop.css','item-hover.css'].map(file=>readFileSync('src/'+file,'utf8')).join('\n');
 writeFileSync('../artifacts/trinket-character.html',`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="codex-app" style="padding:24px">${html}</main></body></html>`);
 expect(renderToStaticMarkup(<ItemDetails item={inventoryItem(raw.rpg.inventory[0])}/>)).toContain('25 % Angriffsschaden');
});
