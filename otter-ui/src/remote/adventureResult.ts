import type {DemoState} from '../types';
import {field,inventoryItem} from './model';
export function adventureResult(data:any,kind:string|undefined,resultId:string):DemoState['result']{
 if(!['dive','fish'].includes(kind??'')||!data||field(data,'Success')!==true)return;
 const pearls=field(data,'Payout'),stake=field(data,'Stake');
 if(!Number.isSafeInteger(pearls)||pearls<0||!Number.isSafeInteger(stake)||stake<0)return;
 const primary=field(data,'Item'),additional=field(data,'AdditionalItems')??[];
 if(!Array.isArray(additional))return;
 const materials=Object.fromEntries(Object.entries(field(data,'MaterialRewards')??{}).filter(([,n])=>Number.isSafeInteger(n)&&Number(n)>0)) as Record<string,number>;
 const shells=field(data,'ShellsAwarded');
 const base={resultId,zoneId:typeof field(data,'ZoneId')==='string'?field(data,'ZoneId'):undefined,pearls,stake,materials,shells:Number.isSafeInteger(shells)&&shells>0?shells:0,message:(field(data,'ZoneName')?field(data,'ZoneName')+' · ':'')+(field(data,'Outcome')||'Aktion abgeschlossen.')};
 if(kind==='fish')return {...base,kind:'fishing',items:additional.map(inventoryItem),fish:primary?{id:field(primary,'ItemId'),name:field(primary,'DisplayName')??field(primary,'ItemId'),rarity:inventoryItem(primary).rarity,icon:field(primary,'IconId')??'🐟'}:undefined};
 const e=field(data,'Enemy');
 return {...base,kind:'dive',items:[primary,...additional].filter(Boolean).map(inventoryItem),enemy:e?{name:field(e,'Name'),victory:field(e,'Victory')===true,rounds:field(e,'Rounds'),damageTaken:field(e,'DamageTaken'),experience:field(e,'Experience')}:undefined};
}
