import redesignedArtwork from './redesigned-art.json';
import rarityMap from './item-rarities.json';
import starterArtwork from './starter-art.json';
import {useState} from 'react';
import artwork from './item-art.json';
import tidesArtwork from './tides-art.json';
import depthsArtwork from './depths-art.json';
import eternalArtwork from './eternal-art.json';
import cuisineArtwork from './cuisine-art.json';
import weaponArtwork from './weapons-art.json';
import eternalEightArtwork from './eternal-eight-art.json';
import fishArtwork from './fish-art.json';
type Entry={src:string;name:string;width:number;height:number;sourceSha256:string;assetSha256:string};
export const itemArt:Readonly<Record<string,Entry>>={...starterArtwork,...artwork.entries,...tidesArtwork,...depthsArtwork,...eternalArtwork,...cuisineArtwork,...weaponArtwork,...eternalEightArtwork,...fishArtwork,...redesignedArtwork};
export function ItemArtwork({id,name,fallback='✧',small=false,rarity}:{id:string;name?:string;fallback?:string;small?:boolean;rarity?:string}){
 const frameRarity=rarity??(rarityMap as Record<string,string>)[id];
 const [failedId,setFailedId]=useState<string>();const entry=itemArt[id];
 if(!entry||failedId===id)return <span className="item-art-fallback item-art-framed" data-rarity={frameRarity} aria-hidden="true">{fallback}</span>;
 return <img data-rarity={frameRarity} className={small?'item-art item-art-small item-art-framed':'item-art item-art-framed'} src={entry.src} alt={name??entry.name} width={entry.width} height={entry.height} loading="lazy" decoding="async" onError={()=>setFailedId(id)}/>;
}
