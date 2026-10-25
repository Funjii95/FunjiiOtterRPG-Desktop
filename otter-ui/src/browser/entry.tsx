import {createRoot} from 'react-dom/client';
import {useEffect,useRef,useState} from 'react';
import {App} from '../GraphicalApp';
import {AdminControlCenter} from '../AdminControlCenter';
import {BackendRpgDataSource} from '../remote/BackendRpgDataSource';
import {BrowserLogin,type DeviceCode,type BrowserConfig} from './login';
import {EncryptedSessionStore,type BrowserSession} from './session';
import {browserTransport} from './transport';
import '../desktop.css';
import './browser.css';
function BrowserGame({login,session}:{login:BrowserLogin;session:BrowserSession}){
 const [source]=useState(()=>new BackendRpgDataSource({fetch:browserTransport(login),helper:{onAuthorized:cb=>cb({userId:session.userId,channelId:login.config.channelId,token:'browser-session'})}}));
 const [state,setState]=useState(()=>source.getSnapshot());
 useEffect(()=>{const unsub=source.subscribe(()=>setState(source.getSnapshot()));source.start();return()=>{unsub();source.dispose();};},[source]);
 const identity={userId:session.userId,displayName:session.displayName,channelId:login.config.channelId,connected:true};
 const owner=session.userId===login.config.channelId;
 const moderator=state.remote?.staffAccess?.channelId===identity.channelId&&state.remote.staffAccess.moderators?.includes(identity.userId);
 return <App desktop source={source} minigameClient={source.minigames} desktopAdmin={owner||moderator?<AdminControlCenter source={source} identity={identity} owner={owner}/>:undefined}/>;
}
function BrowserApplication(){
 const [login,setLogin]=useState<BrowserLogin>(),[session,setSession]=useState<BrowserSession>(),[busy,setBusy]=useState(true),[message,setMessage]=useState('Verbindung wird vorbereitet …'),[device,setDevice]=useState<DeviceCode>(),[remember,setRemember]=useState(true),[attempt,setAttempt]=useState(0);
 const pending=useRef<AbortController|null>(null);
 useEffect(()=>{let mounted=true;setBusy(true);void(async()=>{try{
  if(!window.isSecureContext)throw Error('Bitte diese Seite über HTTPS öffnen.');
  const response=await fetch('/api/v1/desktop/config',{cache:'no-store',credentials:'omit',redirect:'error',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Backend ist gerade nicht erreichbar.');const config:BrowserConfig=await response.json();
  if(!config.enabled||!/^\w{10,100}$/.test(config.clientId)||!/^\d{1,25}$/.test(config.channelId))throw Error('Browser-Anmeldung ist noch nicht verfügbar.');
  const client=new BrowserLogin(config,new EncryptedSessionStore());if(mounted)setLogin(client);const saved=await client.resume();if(mounted){setLogin(client);setSession(saved);setMessage(saved?'Mit Twitch verbunden.':'Mit Twitch anmelden, um deinen gespeicherten Spielstand zu laden.');}
 }catch(e){if(mounted)setMessage(e instanceof Error?e.message:'Verbindung fehlgeschlagen.');}finally{if(mounted)setBusy(false);}})();return()=>{mounted=false;pending.current?.abort();};},[attempt]);
 async function signIn(){if(!login)return;pending.current?.abort();const controller=new AbortController();pending.current=controller;setBusy(true);setMessage('Twitch-Anmeldung wird gestartet …');login.remember=remember;
  try{const code=await login.begin(controller.signal);setDevice(code);setMessage('Bestätige die Anmeldung bei Twitch. Diese Seite bleibt geöffnet.');const saved=await login.poll(code,controller.signal,setMessage);setSession(saved);setDevice(undefined);setMessage('Mit Twitch verbunden.');}catch(e){if(!controller.signal.aborted)setMessage(e instanceof Error?e.message:'Anmeldung fehlgeschlagen.');}finally{if(pending.current===controller){pending.current=null;setBusy(false);}}
 }
 async function signOut(){if(!login)return;pending.current?.abort();try{await login.logout();setSession(undefined);setDevice(undefined);setMessage('Abgemeldet. Dein Spielstand bleibt gespeichert.');}catch(e){setMessage(e instanceof Error?e.message:'Abmelden fehlgeschlagen.');}}
 return <><div className="browser-toolbar"><strong>Funjii Otter RPG · Browser</strong>{session?<><span>Angemeldet als {session.displayName}</span><button onClick={()=>void signOut()}>Abmelden</button></>:<span>Dein Abenteuer in Chrome</span>}</div>{session&&login?<BrowserGame key={session.userId} login={login} session={session}/>:<main className="browser-login"><img src="./otter-logo.png" alt="Funjii Otter RPG" width="100" height="100"/><h1>Deep Sea Codex</h1><p>Dein Otter-Abenteuer direkt im Browser. Derselbe Spielstand, dieselben Items und Quests wie in der Windows-App.</p><p role="status">{message}</p>{device?<section><p>Dein Twitch-Anmeldecode</p><strong className="browser-device-code">{device.user_code}</strong><p><a className="browser-login-link" href={device.verification_uri} target="_blank" rel="noopener noreferrer">Bei Twitch bestätigen</a></p><p>Nach der Bestätigung kehrst du hierher zurück.</p><button onClick={()=>{pending.current?.abort();setDevice(undefined);setMessage('Anmeldung abgebrochen.');}}>Abbrechen</button></section>:<><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Anmeldung in diesem Browser speichern</label><button className="primary" disabled={busy||!login} onClick={()=>void signIn()}>{busy?'Wird verbunden …':'Mit Twitch anmelden'}</button></>}{!login&&!busy&&<button onClick={()=>setAttempt(n=>n+1)}>Verbindung erneut prüfen</button>}<p>Spielaktionen sind verfügbar, sobald das RaidClipPlugin verbunden ist. Ein gespeicherter Spielstand bleibt auch offline lesbar.</p></main>}</>;
}
createRoot(document.getElementById('root')!).render(<BrowserApplication/>);
