import {ItemArtwork} from './item-art';
import type {Zone} from './ZonePanel';
import type {Travel} from './LootPreview';
import {rarityName} from './LootPreview';
export type FishDefinition={Id:string;Name:string;Rarity:number;Zone?:string};
const rarities=['Common','Uncommon','Rare','Epic','Legendary','True','Cursed','Abyss','Eternal','Divine'];
export function FishIngredient({id,name,quantity,owned,zones=[],onTravel,disabled}:{id:string;name:string;quantity:number;owned:number;zones?:Zone[];onTravel?:Travel;disabled?:boolean}){
 const sources=zones.filter(z=>z.Fish?.includes(id));
 return <div className="fish-ingredient"><ItemArtwork id={'fish-'+id} name={name} fallback="🐟" small/><div><strong>{name} · {owned} / {quantity}</strong><div className="fish-sources">{sources.length?sources.map(z=><button key={z.Id} disabled={disabled||!onTravel} onClick={()=>onTravel?.(z.Id,'fish')}>Angeln: {z.Name} →</button>):<small>Fanggebiet noch nicht übermittelt.</small>}</div></div></div>;
}
export function FishPreview({zone,fish=[]}:{zone:Zone;fish?:FishDefinition[]}){
 const available=fish.filter(f=>zone.Fish?.includes(f.Id));
 return <section className="fish-preview"><h3>Fangbare Fische · {zone.Name}</h3><div className="fish-preview-grid">{available.map(f=><div key={f.Id} className={'fish-tile '+rarities[f.Rarity]}><ItemArtwork id={'fish-'+f.Id} name={f.Name} fallback="🐟" small/><strong>{f.Name}</strong><small>{rarityName[rarities[f.Rarity]]??'Seltenheit unbekannt'}</small></div>)}</div>{!available.length&&<p>Fischkatalog wird geladen …</p>}</section>;
}
