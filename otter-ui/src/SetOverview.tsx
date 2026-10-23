import {ItemArtwork,itemArt} from './item-art';
import type {ItemSet} from './types';
const partNames:Record<string,string>={helmet:'Helm',chest:'Brust',gloves:'Handschuhe',boots:'Stiefel',weapon:'Waffe',ring_1:'Ring 1',ring_2:'Ring 2',amulet:'Amulett'};
export function SetOverview({set,equipped}:{set:ItemSet;equipped:Set<string>}){
 return <section className={'codex-set-overview '+set.id} aria-label={set.name+' · acht Teile'}><header><small>ETERNAL · 8 TEILE</small><h3>{set.name}</h3></header><div className="codex-set-parts">{set.itemIds.map(id=>{const part=id.slice(set.id.length+1);return <div key={id} className={equipped.has(id)?'equipped':''}><ItemArtwork id={id}/><strong>{itemArt[id]?.name??id}</strong><small>{partNames[part]??part} {equipped.has(id)?'· Ausgerüstet':''}</small></div>;})}</div></section>;
}
