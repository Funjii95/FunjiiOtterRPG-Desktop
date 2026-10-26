import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {ItemArtwork} from './item-art';
import {materialNames} from './UpgradePanel';
import art from './zone-art.json';
import './adventure-popup.css';
export type DiveSeries={Id:string;ZoneId:string;Count:number;Completed:number;Status:'active'|'completed'|'defeated'|'stopped';Reason:string;Damage:number;Pearls:number;Experience:number;Items:{ItemId:string;Name:string;Quantity:number}[];Materials:Record<string,number>};
export function DiveSeriesPanel({owner,series,busy,onCommand}:{owner:string;series?:DiveSeries;busy:boolean;onCommand:(args:Record<string,string>)=>Promise<unknown>}){
 const [error,setError]=useState(''),[pending,setPending]=useState(false);const active=series?.Status==='active';
 async function send(args:Record<string,string>){setPending(true);setError('');try{await onCommand(args);}catch(e){setError(e instanceof Error?e.message:String(e));}finally{setPending(false);}}

 return <section aria-label="Tauchserie" className="dive-series-panel"><h3>Mehrfach tauchen</h3><p>Fortlaufende HP und reguläre Tauchpausen. Die Serie endet bei 0 HP; alle verdienten Belohnungen bleiben erhalten.</p><div role="group" aria-label="Anzahl Tauchgänge">{[10,20,100].map(count=><button key={count} disabled={busy||pending||active} onClick={()=>void send({operation:'start',count:String(count)})}>{count} × Tauchen</button>)}{active&&<button disabled={busy||pending} onClick={()=>void send({operation:'stop'})}>Tauchserie beenden</button>}</div>{series&&<div role="status"><strong>{active?'Tauchserie läuft':series.Reason}</strong><progress value={series.Completed} max={series.Count} aria-label="Tauchfortschritt"/><DiveSeriesSummary series={series}/></div>}{error&&<p role="alert">{error}</p>}</section>;
}
export function DiveSeriesSummary({series:s}:{series:DiveSeries}){return <><p>{s.Completed} / {s.Count} Tauchgänge · {s.Damage.toLocaleString('de-DE')} Schaden erlitten</p><p><strong>{s.Pearls.toLocaleString('de-DE')} Perlen · {s.Experience.toLocaleString('de-DE')} EP</strong></p><div className="adventure-popup-loot">{s.Items.map(i=><div className="adventure-popup-reward" key={i.ItemId}><ItemArtwork id={i.ItemId} name={i.Name} small/><strong>{i.Quantity} × {i.Name}</strong></div>)}{Object.entries(s.Materials).map(([id,n])=><div className="adventure-popup-reward" key={id}><ItemArtwork id={id} name={materialNames[id]??id} small/><strong>{n} × {materialNames[id]??id}</strong></div>)}</div></>;}
export function DiveSeriesPopup({owner,series}:{owner:string;series?:DiveSeries}){
 const [popup,setPopup]=useState<DiveSeries>();const seen=useRef('');
 useEffect(()=>{seen.current='';setPopup(undefined);try{seen.current=localStorage.getItem('funjii.dive-series:'+owner)??'';}catch{}},[owner]);
 useEffect(()=>{if(!series||series.Status==='active'||seen.current===series.Id)return;seen.current=series.Id;try{localStorage.setItem('funjii.dive-series:'+owner,series.Id);}catch{}setPopup(series);},[series,owner]);
 useEffect(()=>{if(!popup)return;const timer=setTimeout(()=>setPopup(undefined),5000);return()=>clearTimeout(timer);},[popup]);
 return popup?createPortal(<section className="adventure-popup" role="status" aria-label="Tauchbelohnungen"><button className="adventure-popup-close" aria-label="Tauchbelohnungen schließen" onClick={()=>setPopup(undefined)}>×</button><header><small>TAUCHSERIE BEENDET</small><h2>{popup.Reason}</h2></header><img className="dive-series-biome" src={art[popup.ZoneId as keyof typeof art]?.src} alt="Tauchgebiet"/><DiveSeriesSummary series={popup}/><p>Alle Belohnungen wurden gespeichert.</p><footer>Verschwindet nach 5 Sekunden <span className="adventure-popup-time" aria-hidden="true"/></footer></section>,document.body):null;
}
