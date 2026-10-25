import {type BrowserSession,type SessionStore} from './session';
export type BrowserConfig={enabled:boolean;clientId:string;channelId:string};
export type DeviceCode={device_code:string;user_code:string;verification_uri:string;expires_in:number;interval:number};
const oauth='https://id.twitch.tv/oauth2/';
const credential=(v:unknown):v is string=>typeof v==='string'&&/^[a-zA-Z0-9]{10,2048}$/.test(v);
export class BrowserLogin{
 current?:BrowserSession;
 remember=true;
 constructor(readonly config:BrowserConfig,private store:SessionStore,private transport:typeof fetch=(input,init)=>fetch(input,init)){}
 private async locked<T>(work:()=>Promise<T>){return globalThis.navigator?.locks?await navigator.locks.request('funjii-twitch-login',work):await work();}
 private async form(path:string,data:Record<string,string>,signal?:AbortSignal){const r=await this.transport(oauth+path,{method:'POST',body:new URLSearchParams(data),credentials:'omit',cache:'no-store',redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(20000)]):AbortSignal.timeout(20000)});let value:any;try{value=await r.json();}catch{throw Error('Twitch antwortet gerade nicht. Bitte erneut versuchen.');}return {ok:r.ok,status:r.status,value};}
 async begin(signal?:AbortSignal):Promise<DeviceCode>{
  const r=await this.form('device',{client_id:this.config.clientId,scopes:''},signal);const d=r.value;
  if(!r.ok||!credential(d.device_code)||typeof d.user_code!=='string'||!/^[A-Z0-9-]{4,32}$/.test(d.user_code)||!Number.isInteger(d.expires_in)||d.expires_in<1||d.expires_in>3600||!Number.isInteger(d.interval)||d.interval<1)throw Error('Twitch-Anmeldung konnte nicht gestartet werden.');
  const url=new URL(d.verification_uri);if(url.origin!=='https://www.twitch.tv'||url.pathname!=='/activate'||url.username||url.password)throw Error('Ungültige Twitch-Anmeldeadresse.');return d;
 }
 async poll(code:DeviceCode,signal:AbortSignal,onWaiting:(message:string)=>void){
  let interval=Math.max(5,code.interval);const until=Date.now()+code.expires_in*1000;
  while(Date.now()<until){await this.delay(interval*1000,signal);const r=await this.form('token',{client_id:this.config.clientId,scopes:'',device_code:code.device_code,grant_type:'urn:ietf:params:oauth:grant-type:device_code'},signal);
   if(r.ok)return await this.locked(async()=>{const pending=this.pair(r.value);const session=await this.verify({...pending,userId:'',displayName:''},signal);this.current=session;if(this.remember)await this.store.save(session);else await this.store.clear();return session;});
   const error=r.value.message??r.value.error;if(error==='authorization_pending'){onWaiting('Warte auf deine Bestätigung bei Twitch …');continue;}if(error==='slow_down'){interval+=5;continue;}throw Error('Twitch-Anmeldung abgelehnt oder abgelaufen. Bitte erneut starten.');
  }throw Error('Der Anmeldecode ist abgelaufen. Bitte erneut starten.');
 }
 private pair(value:any){if(!credential(value.access_token)||!credential(value.refresh_token)||!Number.isFinite(value.expires_in)||value.expires_in<=0)throw Error('Ungültige Twitch-Sitzung.');return {clientId:this.config.clientId,accessToken:value.access_token,refreshToken:value.refresh_token,expiresAt:Date.now()+value.expires_in*1000};}
 private async verify(session:BrowserSession,signal?:AbortSignal){
  if(session.clientId!==this.config.clientId||!credential(session.accessToken))throw Error('Gespeicherte Anmeldung gehört zu einer anderen Anwendung.');
  const response=await this.transport(oauth+'validate',{headers:{Authorization:'OAuth '+session.accessToken},credentials:'omit',cache:'no-store',redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000)});
  if(response.status===401)throw new ExpiredLogin();if(!response.ok)throw Error('Twitch-Anmeldung konnte gerade nicht geprüft werden.');const v=await response.json();
  if(v.client_id!==this.config.clientId||!/^\d{1,25}$/.test(v.user_id)||typeof v.login!=='string'||v.login.length>100||!(v.expires_in>0)||session.userId&&session.userId!==v.user_id)throw Error('Twitch-Identität konnte nicht bestätigt werden.');
  return {...session,userId:v.user_id,displayName:v.login,expiresAt:Date.now()+v.expires_in*1000};
 }
 async resume(){return await this.locked(async()=>{
  let saved=this.remember?await this.store.load():this.current;if(!saved)return;
  try{this.current=await this.verify(saved);}catch(error){if(!(error instanceof ExpiredLogin))throw error;const refreshed=await this.form('token',{grant_type:'refresh_token',refresh_token:saved.refreshToken,client_id:this.config.clientId});if(!refreshed.ok){if([400,401,403].includes(refreshed.status)){await this.store.clear();this.current=undefined;}throw Error('Die Twitch-Anmeldung ist abgelaufen. Bitte erneut anmelden.');}
   saved={...saved,...this.pair(refreshed.value)};if(this.remember)await this.store.save(saved);this.current=saved;this.current=await this.verify(saved);
  }return this.current;
 });}
 async logout(){await this.locked(async()=>{await this.store.clear();this.current=undefined;});}
 private delay(ms:number,signal:AbortSignal){return new Promise<void>((resolve,reject)=>{if(signal.aborted){reject(Error('Anmeldung abgebrochen.'));return;}const abort=()=>{clearTimeout(timer);reject(Error('Anmeldung abgebrochen.'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);signal.addEventListener('abort',abort,{once:true});});}
}
class ExpiredLogin extends Error{}
