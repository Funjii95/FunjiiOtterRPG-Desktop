import {ItemHover} from './ItemHover';
import type {DemoState,CharacterStats,InventoryItem,ItemSet} from './types';
import {slots} from './types';
import {ItemArtwork} from './item-art';
import {labels,numberStat} from './presentation';
import {isCollectionItem} from './collectionInventory';
const names={Weapon:'Waffe',Helmet:'Helm',Chest:'Brust',Gloves:'Handschuhe',Boots:'Stiefel',Ring1:'Ring links',Ring2:'Ring rechts',Amulet:'Amulett'};
export function CodexCharacter({state,stats,sets=[],onItem}:{state:DemoState;stats:CharacterStats;sets?:ItemSet[];onItem:(i:InventoryItem)=>void}){
 const gear=state.inventory.filter(i=>!isCollectionItem(i));
 const equippedIds=new Set(state.inventory.filter(i=>Object.values(state.equipment).includes(i.instanceId)).map(i=>i.itemId));
 const hover=(item:InventoryItem,child:React.ReactElement<React.HTMLAttributes<HTMLElement>>)=><ItemHover key={item.instanceId} item={item} set={sets.find(s=>s.id===item.setId)} equippedIds={equippedIds} equipped={Object.values(state.equipment).includes(item.instanceId)}>{child}</ItemHover>;
 return <section className="codex-character-workspace"><article className="codex-paperdoll"><h3>Charakter &amp; Ausrüstung</h3><div className="paperdoll-stage"><div className="paperdoll-portrait"><img className="paperdoll-otter" src={state.player.avatarUrl} alt="Dein Otter in der Tiefe"/></div>
 {slots.map((slot,n)=>{const item=state.inventory.find(i=>i.instanceId===state.equipment[slot]);const button=<button key={slot} className={`paper-slot paper-slot-${n} ${item?.rarity??''}`} aria-label={names[slot]} onClick={()=>item&&onItem(item)}><small>{names[slot]}</small>{item?<><ItemArtwork id={item.itemId} name={item.name} small/><span>+{item.upgradeLevel??0}</span></>:<span>✧</span>}</button>;return item?hover(item,button):button;})}</div><p>{state.player.username} · Level {state.player.level}</p></article>
 <article className="codex-values"><h3>Werte</h3>{Number.isFinite(state.player.mana)&&<><p>✦ {state.player.mana} / {state.player.maxMana} Mana</p><progress aria-label="Mana" value={state.player.mana} max={state.player.maxMana}/><p>Waffenzauber werden automatisch ausgelöst. Ohne Mana bleiben normale Angriffe möglich.</p></>}<p>♥ {Number.isFinite(state.player.hp)?state.player.hp:'–'} / {Number.isFinite(state.player.maxHp)?state.player.maxHp:'–'} Leben</p>{Object.entries(stats).filter(([,value])=>value!==0).map(([key,value])=><div className="codex-stat" key={key}><span>{labels[key as keyof CharacterStats]??key}</span><strong>{numberStat(key,value)}</strong></div>)}</article>
 <article className="codex-bag-preview"><h3>Inventar</h3><p>{gear.length} Gegenstände · Sammelobjekte unter Sammlungen</p><div>{gear.slice(0,24).map(i=>hover(i,<button key={i.instanceId} className={i.rarity} onClick={()=>onItem(i)} aria-label={i.name}><ItemArtwork id={i.itemId} name={i.name} small/><small>{i.upgradeLevel?`+${i.upgradeLevel}`:''}</small></button>))}</div>{!gear.length&&<p>Dein Inventar ist noch leer.</p>}</article></section>;
}
