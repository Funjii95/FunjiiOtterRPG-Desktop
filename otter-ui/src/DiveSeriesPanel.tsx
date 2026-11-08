import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {ItemArtwork} from './item-art';
import {materialNames} from './UpgradePanel';
import art from './zone-art.json';
import './adventure-popup.css';
export type DiveSeries={Id:string;ZoneId:string;Count:number;Completed:number;Status:'active'|'completed'|'defeated'|'stopped';Reason:string;Damage:number;Pearls:number;Experience:number;Items:{ItemId:string;Name:string;Quantity:number}[];Materials:Record<string,number>};
export function DiveSeriesPanel({owner,series,busy,onCommand,onSingle,cooldown=0}:{owner:string;series?:DiveSeries;busy:boolean;onCommand:(args:Record<string,string>)=>Promise<unknown>;onSingle:()=>Promise<unknown>;cooldown?:number}){
 const [error,setError]=useState(''),[pending,setPending]=useState(false),[count,setCount]=useState(1);const active=series?.Status==='active';
 useEffect(()=>{setCount(1);setError('');},[owner]);
 async function send(stop=false){setPending(true);setError('');try{if(stop)await onCommand({operation:'stop'});else if(count===1)await onSingle();else await onCommand({operation:'start',count:String(count)});}catch(e){setError(e instanceof Error?e.message:String(e));}finally{setPending(false);}}
 return <section aria-label="Tauchserie" className="dive-series-panel"><div className="dive-start-controls"><label>Anzahl Tauchgänge<select aria-label="Anzahl Tauchgänge" value={count} disabled={busy||pending||active} onChange={e=>setCount(Number(e.target.value))}>{[1,10,25,50,100].map(n=><option key={n} value={n}>{n} × Tauchen</option>)}</select></label><button className="primary" disabled={busy||pending||active||cooldown>0} onClick={()=>void send()}>{cooldown>0?`Abklingzeit: ${Math.ceil(cooldown)} s`:'Hier tauchen'}</button></div><p>Mehrere Tauchgänge werden sofort simuliert, mit fortlaufenden HP. Bei 0 HP endet die Serie; verdiente Beute bleibt erhalten.</p>{active&&<button disabled={busy||pending} onClick={()=>void send(true)}>Tauchserie beenden</button>}{series&&<div role="status"><strong>{active?'Tauchgänge werden gemeinsam simuliert':series.Reason}</strong><progress value={series.Completed} max={series.Count} aria-label="Tauchfortschritt"/><DiveSeriesSummary series={series}/></div>}{error&&<p role="alert">{error}</p>}</section>;
}
export function DiveSeriesSummary({series:s}:{series:DiveSeries}){return <><p>{s.Completed} / {s.Count} Tauchgänge · {s.Damage.toLocaleString('de-DE')} Schaden erlitten</p><p><strong>{s.Pearls.toLocaleString('de-DE')} Perlen · {s.Experience.toLocaleString('de-DE')} EP</strong></p><div className="adventure-popup-loot">{s.Items.map(i=><div className="adventure-popup-reward" key={i.ItemId}><ItemArtwork id={i.ItemId} name={i.Name} small/><strong>{i.Quantity} × {i.Name}</strong></div>)}{Object.entries(s.Materials).map(([id,n])=><div className="adventure-popup-reward" key={id}><ItemArtwork id={id} name={materialNames[id]??id} small/><strong>{n} × {materialNames[id]??id}</strong></div>)}</div></>;}
export function DiveSeriesPopup({owner,series}:{owner:string;series?:DiveSeries}){
 const [popup,setPopup]=useState<DiveSeries>();const seen=useRef('');
 useEffect(()=>{seen.current='';setPopup(undefined);try{seen.current=localStorage.getItem('funjii.dive-series:'+owner)??'';}catch{}},[owner]);
 useEffect(()=>{
  if(!series)return;
  if(series.Status==='active'){
   if(seen.current!==series.Id)setPopup(previous=>previous?.Id===series.Id&&previous.Status!=='active'?previous:series);
   return;
  }
  if(seen.current===series.Id)return;
  seen.current=series.Id;try{localStorage.setItem('funjii.dive-series:'+owner,series.Id);}catch{}setPopup(series);
 },[series,owner]);
 useEffect(()=>{if(!popup||popup.Status==='active')return;const timer=setTimeout(()=>setPopup(undefined),5000);return()=>clearTimeout(timer);},[popup]);
 return popup?createPortal(<section className="adventure-popup" role="status" aria-label="Tauchbelohnungen"><button className="adventure-popup-close" aria-label="Tauchbelohnungen schließen" onClick={()=>setPopup(undefined)}>×</button><header><small>{popup.Status==='active'?'TAUCHSERIE LÄUFT':'TAUCHSERIE BEENDET'}</small><h2>{popup.Status==='active'?'Tauchgänge werden ausgewertet …':popup.Reason}</h2></header><img className="dive-series-biome" src={art[popup.ZoneId as keyof typeof art]?.src} alt="Tauchgebiet"/><DiveSeriesSummary series={popup}/><p>{popup.Status==='active'?'Das Ergebnis wird automatisch nachgeladen.': 'Alle Belohnungen wurden gespeichert.'}</p>{popup.Status!=='active'&&<footer>Verschwindet nach 5 Sekunden <span className="adventure-popup-time" aria-hidden="true"/></footer>}</section>,document.body):null;
}
