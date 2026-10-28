import {cloneElement,useEffect,useId,useLayoutEffect,useRef,useState,type ReactElement,type ReactNode,type HTMLAttributes} from 'react';
import {createPortal} from 'react-dom';
import type {InventoryItem,ItemSet} from './types';
import {statsText,collectorText} from './presentation';
import {ItemArtwork} from './item-art';
import './item-hover.css';
const slots:Record<string,string>={Weapon:'Waffe',Helmet:'Helm',Chest:'Brust',Gloves:'Handschuhe',Boots:'Stiefel',Ring1:'Ring',Ring2:'Ring',Amulet:'Amulett'};
export function ItemDetails({item,set,equippedIds=new Set<string>(),equipped=false}:{item:InventoryItem;set?:ItemSet;equippedIds?:Set<string>;equipped?:boolean}){
 const count=set?set.itemIds.filter(id=>equippedIds.has(id)).length:0;
 return <><div className="item-hover-heading"><ItemArtwork rarity={item.rarity} id={item.itemId} name={item.name} fallback={item.icon} small/><div><strong>{item.name}{item.upgradeLevel?` +${item.upgradeLevel}`:''}</strong><small>{item.rarity} · {slots[item.slot??'']??'Fundstück'}{item.isRefined?' · Veredelt':''}</small></div></div>{item.description&&<p>{item.description}</p>}<ul>{statsText(item.attributes).map(text=><li key={text}>{text}</li>)}</ul>{item.effects.filter(e=>e.description).map(e=><p key={e.id} className="item-hover-effect">{e.description}</p>)}{item.collector&&<ul>{collectorText(item.collector).map(text=><li key={text}>{text}</li>)}</ul>}{set&&<section className="item-hover-set"><strong>{set.name} · {count}/{set.itemIds.length}</strong>{set.bonuses.map(b=><p key={b.pieces} className={count>=b.pieces?'active':''}>{count>=b.pieces?'✓':'○'} {b.pieces} Teile · {b.description||statsText(b.attributes).join(', ')}</p>)}</section>}<p className="item-hover-flags">{[equipped?'Ausgerüstet':'',item.favorite?'★ Favorit':'',item.locked?'Gesperrt':''].filter(Boolean).join(' · ')}</p><small>{item.rarity==='Divine'?'ADMIN ONLY · Nicht zerlegbar':`Zerlegewert: ${item.salvageValue.toLocaleString('de-DE')} Perlen`}</small></>;
}
export function ItemHover({item,set,equippedIds,equipped,children,details}:{details?:ReactNode;item:InventoryItem;set?:ItemSet;equippedIds?:Set<string>;equipped?:boolean;children:ReactElement<HTMLAttributes<HTMLElement>>}){
 const id=useId(),anchor=useRef<HTMLSpanElement>(null),popup=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [rect,setRect]=useState<DOMRect>(),[position,setPosition]=useState({left:12,top:12});
 const keep=()=>{if(timer.current)clearTimeout(timer.current);};
 const close=()=>{keep();setRect(undefined);};
 const open=()=>{keep();const child=anchor.current?.firstElementChild;if(child)setRect(child.getBoundingClientRect());};
 const leave=()=>{keep();timer.current=setTimeout(()=>setRect(undefined),140);};
 useEffect(()=>()=>keep(),[]);
 useEffect(()=>{if(!rect)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close();};window.addEventListener('keydown',key);window.addEventListener('resize',close);const scroll=(e:Event)=>{if(!popup.current?.contains(e.target as Node))close();};window.addEventListener('scroll',scroll,true);return()=>{window.removeEventListener('keydown',key);window.removeEventListener('resize',close);window.removeEventListener('scroll',scroll,true);};},[rect]);
 useLayoutEffect(()=>{if(!rect||!popup.current)return;const box=popup.current.getBoundingClientRect(),gap=12;const left=rect.right+gap+box.width<=innerWidth-gap?rect.right+gap:Math.max(gap,rect.left-gap-box.width);setPosition({left:Math.min(left,Math.max(gap,innerWidth-box.width-gap)),top:Math.max(gap,Math.min(rect.top,innerHeight-box.height-gap))});},[rect,item,set]);
 return <span className="item-hover-anchor" ref={anchor} onMouseEnter={open} onMouseLeave={leave} onFocus={open} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node)&&!popup.current?.contains(e.relatedTarget as Node))close();}}>{cloneElement(children,{'aria-describedby':rect?id:undefined})}{rect&&createPortal(<div id={id} ref={popup} className={'item-hover-tooltip '+item.rarity} role="tooltip" style={position} onMouseEnter={keep} onMouseLeave={leave}>{details??<ItemDetails item={item} set={set} equippedIds={equippedIds} equipped={equipped}/>}</div>,document.body)}</span>;
}
