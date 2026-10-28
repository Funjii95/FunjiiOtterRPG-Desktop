import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {DemoState} from './types';
import {ItemArtwork} from './item-art';
import {materialNames} from './UpgradePanel';
import {creatureImage} from './creature-art';
import zoneArt from './zone-art.json';
import './adventure-popup.css';
export const adventurePopupDuration=5000;
type Result=NonNullable<DemoState['result']>;
export function AdventurePopup({result,owner}:{result?:Result;owner:string}){
 const seen=useRef(result?.resultId),[visible,setVisible]=useState<Result>();
 useEffect(()=>{seen.current=undefined;setVisible(undefined);},[owner]);
 useEffect(()=>{
  if(!result?.resultId||result.resultId===seen.current)return;
  seen.current=result.resultId;setVisible(result);
 },[result]);
 useEffect(()=>{if(!visible)return;const timer=setTimeout(()=>setVisible(undefined),adventurePopupDuration);return()=>clearTimeout(timer);},[visible]);
 if(!visible)return null;
 return createPortal(<AdventurePopupContent key={visible.resultId} result={visible} onClose={()=>setVisible(undefined)}/>,document.body);
}
export function AdventurePopupContent({result,onClose}:{result:Result;onClose:()=>void}){
 const enemy=result.kind==='dive'?result.enemy:undefined;
 const scene=zoneArt[result.zoneId as keyof typeof zoneArt]?.src;
 return <section className="adventure-popup" role="status" aria-live="polite" aria-atomic="true" aria-label="Abenteuer-Ergebnis">
  {scene&&<div className="adventure-popup-biome" aria-hidden="true" style={{backgroundImage:`url("${scene}")`}}/>}
  <button className="adventure-popup-close" onClick={onClose} aria-label="Ergebnis schließen">×</button>
  <header><small>{result.kind==='dive'?'AUS DER TIEFE':'FRISCHER FANG'}</small><h2>{enemy?(enemy.victory?'Gegner besiegt!':'Kampf beendet'):result.kind==='dive'?'Tauchgang abgeschlossen':'Angelausflug abgeschlossen'}</h2></header>
  {enemy&&<div className="adventure-popup-enemy"><img src={creatureImage(enemy.name)} alt={enemy.name}/><div><h3>{enemy.name}</h3><strong className={enemy.victory?'victory':'defeat'}>{enemy.victory?'Besiegt':'Nicht besiegt'}</strong><p>{enemy.rounds} Runden · −{enemy.damageTaken.toLocaleString('de-DE')} HP</p><p>+{enemy.experience.toLocaleString('de-DE')} EXP</p></div></div>}
  <p className="adventure-popup-message">{result.message}</p>
  <div className="adventure-popup-loot" aria-label="Erhaltene Beute">
   <div className="adventure-popup-reward"><span aria-hidden="true">◉</span><strong>{result.pearls.toLocaleString('de-DE')} Perlen</strong></div>
   {result.kind==='fishing'&&result.fish&&<div className={`adventure-popup-reward ${result.fish.rarity}`}><ItemArtwork id={`fish-${result.fish.id}`} name={result.fish.name} fallback={result.fish.icon} small/><strong>{result.fish.name}</strong></div>}
   {result.items.map(item=><div className={`adventure-popup-reward ${item.rarity}`} key={item.instanceId}><ItemArtwork rarity={item.rarity} id={item.itemId} name={item.name} small/><strong>{item.name}</strong></div>)}
   {Object.entries(result.materials??{}).map(([id,n])=><div className="adventure-popup-reward" key={id}><ItemArtwork id={id} name={materialNames[id]??id} small/><strong>{n} × {materialNames[id]??id}</strong></div>)}
   {!!result.shells&&<div className="adventure-popup-reward"><span aria-hidden="true">🐚</span><strong>{result.shells} × Muschel</strong></div>}
  </div>
  <footer>Verschwindet nach 5 Sekunden <span className="adventure-popup-time" aria-hidden="true"/></footer>
 </section>;
}
