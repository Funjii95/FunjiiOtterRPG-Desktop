import {it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import plan from '../../docs/mythic-role-art.json';
import {itemArt,ItemArtwork} from '../src/item-art';
import {SetOverview} from '../src/SetOverview';
import type {ItemSet} from '../src/types';
it('renders twenty-two unique mythic images with correct names and frames',()=>{
 expect(plan).toHaveLength(22);const hashes=new Set<string>();
 for(const item of plan){const art=itemArt[item.id];expect(art.name).toBe(item.name);const hash=createHash('sha256').update(readFileSync('public/'+art.src.replace(/^\.\//,''))).digest('hex');expect(hash).toBe(art.assetSha256);hashes.add(hash);expect(renderToStaticMarkup(<ItemArtwork id={item.id}/>)).toContain('data-rarity="Mythic"');}
 expect(hashes.size).toBe(22);
});
it('shows all eleven named parts including belt and two trinkets for both sets',()=>{
 let body='';
 for(const [id,name] of [['mythic_stormkraken','Zorn des Sturmkrakens'],['mythic_lifespring','Gesang der Lebensquelle']]){
 const items=plan.filter(i=>i.id.startsWith(id));const set:ItemSet={id,name,description:'Mythisches 11-Teile-Set',demoOnly:false,itemIds:items.map(i=>i.id),bonuses:[]};
 const html=renderToStaticMarkup(<SetOverview set={set} equipped={new Set()} guide={items.map(i=>({Id:i.id,Name:i.name,Rarity:'Mythic',SetId:id,Ranges:[{Attribute:'Stamina',Min:14,Max:14,Optional:false}],Effects:[],Sources:[{ZoneId:'abyss',Kind:'dungeon'}]}))}/>);
 expect(html).toContain('11 SETTEILE');expect(html).toContain('Gürtel');expect(html).toContain('Trinket 1');expect(html).toContain('Trinket 2');expect(html.match(/class="loot-tile Mythic"/g)).toHaveLength(11);expect(html).not.toContain('Wertebereiche noch nicht verfügbar');body+=html;
 }
 const css=['style.css','desktop.css','loot-preview.css','item-hover.css'].map(f=>readFileSync('src/'+f,'utf8')).join('\n');
 mkdirSync('../artifacts',{recursive:true});
 writeFileSync('../artifacts/mythic-set-preview.html',`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="codex-app" style="padding:24px">${body}</main></body></html>`);
});
