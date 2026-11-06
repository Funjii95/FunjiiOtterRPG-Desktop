import {it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import plan from '../../docs/mythic-dawn-art.json';
import {itemArt,ItemArtwork} from '../src/item-art';
import {SetOverview} from '../src/SetOverview';

it('renders eleven unique named dawn icons with mythic frames and all equipment slots',()=>{
 expect(plan).toHaveLength(11);const hashes=new Set<string>();
 for(const item of plan){const art=itemArt[item.id];expect(art.name).toBe(item.name);const hash=createHash('sha256').update(readFileSync('public/'+art.src.replace(/^\.\//,''))).digest('hex');expect(hash).toBe(art.assetSha256);hashes.add(hash);expect(renderToStaticMarkup(<ItemArtwork id={item.id}/>)).toContain('data-rarity="Mythic"');}
 expect(hashes.size).toBe(11);
 const html=renderToStaticMarkup(<SetOverview set={{id:'mythic_dawn',name:'Gnade der Morgenflut',description:'Ab Level 1 tragbar',demoOnly:false,itemIds:plan.map(i=>i.id),bonuses:[]}} equipped={new Set()} guide={plan.map(i=>({Id:i.id,Name:i.name,Rarity:'Mythic',SetId:'mythic_dawn',Ranges:[{Attribute:'HealingPower',Min:5,Max:5,Optional:false}],Effects:[],Sources:[{ZoneId:'abyss',Kind:'dungeon'}]}))}/>);
 expect(html).toContain('11 SETTEILE');expect(html).toContain('Gürtel');expect(html).toContain('Trinket 1');expect(html).toContain('Trinket 2');expect(html.match(/class="loot-tile Mythic"/g)).toHaveLength(11);expect(html).not.toContain('Wertebereiche noch nicht verfügbar');
 let preview=html;for(const item of plan){const art=itemArt[item.id];preview=preview.replaceAll(art.src,'data:image/webp;base64,'+readFileSync('public/'+art.src.replace(/^\.\//,'')).toString('base64'));}
 const css=['style.css','desktop.css','loot-preview.css','item-hover.css'].map(f=>readFileSync('src/'+f,'utf8')).join('\n');
 mkdirSync('../artifacts/mythic-dawn',{recursive:true});writeFileSync('../artifacts/mythic-dawn/preview.html',`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><main class="codex-app" style="padding:24px">${preview}</main></body></html>`);
});
