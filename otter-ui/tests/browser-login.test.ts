import {it,expect,vi,afterEach} from 'vitest';
import {BrowserLogin} from '../src/browser/login';
import {browserTransport} from '../src/browser/transport';
import type {BrowserSession,SessionStore} from '../src/browser/session';
import {backend} from '../src/live/client';
const config={enabled:true,clientId:'publicclient12345',channelId:'42'};
const session:BrowserSession={clientId:config.clientId,accessToken:'validcredential12345',refreshToken:'refreshcredential12345',userId:'1001',displayName:'otter',expiresAt:Date.now()+3600000};
class Store implements SessionStore{constructor(public value?:BrowserSession){}saved:BrowserSession[]=[];async load(){return this.value;}async save(v:BrowserSession){this.value=v;this.saved.push(v);}async clear(){this.value=undefined;}}
const verified=()=>Response.json({client_id:config.clientId,user_id:'1001',login:'otter',expires_in:3600});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
it('uses the registered public client with no additional scopes and validates the Twitch link',async()=>{
 const fetcher=vi.fn(async(_url:any,init:any)=>{expect(init.body.get('client_id')).toBe(config.clientId);expect(init.body.get('scopes')).toBe('');return Response.json({device_code:'devicecredential12345',user_code:'ABCDEFGH',verification_uri:'https://evil.example/activate',expires_in:1800,interval:5});});
 await expect(new BrowserLogin(config,new Store(),fetcher as any).begin()).rejects.toThrow('Anmeldeadresse');
});
it('polls the same device code, verifies identity and persists a successful login',async()=>{
 vi.useFakeTimers();let count=0;const store=new Store();const fetcher=vi.fn(async(url:any,init:any)=>{if(String(url).endsWith('/validate'))return verified();expect(init.body.get('device_code')).toBe('devicecredential12345');count++;return count===1?Response.json({message:'authorization_pending'},{status:400}):Response.json({access_token:session.accessToken,refresh_token:session.refreshToken,expires_in:3600});});
 const login=new BrowserLogin(config,store,fetcher as any);const work=login.poll({device_code:'devicecredential12345',user_code:'ABCDEFGH',verification_uri:'https://www.twitch.tv/activate',expires_in:60,interval:5},new AbortController().signal,()=>{});
 await vi.advanceTimersByTimeAsync(10000);expect((await work).userId).toBe('1001');expect(store.value?.accessToken).toBe(session.accessToken);expect(count).toBe(2);
});
it('restores login without refreshing a valid token',async()=>{const store=new Store(session),fetcher=vi.fn(async()=>verified());const login=new BrowserLogin(config,store,fetcher);expect((await login.resume())?.userId).toBe('1001');expect(fetcher).toHaveBeenCalledOnce();});
it('stores a rotated refresh pair before any further identity request can fail',async()=>{
 const store=new Store(session);let validations=0;const fetcher=vi.fn(async(url:any)=>{if(String(url).endsWith('/token'))return Response.json({access_token:'rotatedcredential12345',refresh_token:'rotatedrefresh12345',expires_in:3600});validations++;return validations===1?new Response('',{status:401}):new Response('',{status:503});});
 await expect(new BrowserLogin(config,store,fetcher).resume()).rejects.toThrow('gerade nicht geprüft');expect(store.value?.refreshToken).toBe('rotatedrefresh12345');expect(store.value?.userId).toBe('1001');
});
it('rejects a token for another Twitch client or another saved player',async()=>{
 for(const data of [{client_id:'wrongclient12345',user_id:'1001',login:'other',expires_in:3600},{client_id:config.clientId,user_id:'9999',login:'other',expires_in:3600}])await expect(new BrowserLogin(config,new Store(session),async()=>Response.json(data)).resume()).rejects.toThrow('Identität');
});
it('logout removes persistent and in-memory login',async()=>{const store=new Store(session),login=new BrowserLogin(config,store,async()=>verified());await login.resume();await login.logout();expect(login.current).toBeUndefined();expect(store.value).toBeUndefined();});
it('browser transport sends credentials only to the same-origin game API',async()=>{
 const login=new BrowserLogin(config,new Store());login.current=session;const fetcher=vi.fn(async()=>Response.json({}));const transport=browserTransport(login,'https://rpg.example',fetcher);
 await transport(backend+'/api/v1/me',{headers:{Authorization:'Bearer browser-session'}});expect(fetcher.mock.calls[0][0]).toBe('https://rpg.example/api/v1/me');expect(new Headers((fetcher.mock.calls[0] as any)[1].headers).get('Authorization')).toBe('Desktop '+session.accessToken);
 for(const url of ['https://evil.example/api/v1/me',backend+'/api/v1/plugin/actions/claim',backend+'/browser/'])await expect(transport(url)).rejects.toThrow('API-Ziel');expect(fetcher).toHaveBeenCalledOnce();
});
it('retries only an authentication refusal with the original body and action ID',async()=>{
 const login=new BrowserLogin(config,new Store());login.current=session;vi.spyOn(login,'resume').mockImplementation(async()=>{login.current={...session,accessToken:'rotatedcredential12345'};return login.current;});let attempts=0;const bodies:any[]=[];
 const transport=browserTransport(login,'https://rpg.example',async(_url,init)=>{attempts++;bodies.push(init?.body);return new Response('{}',{status:attempts===1?401:200});});const body='{"actionId":"same-id","kind":"dive"}';await transport(backend+'/api/v1/play/actions',{method:'POST',body});expect(bodies).toEqual([body,body]);expect(login.resume).toHaveBeenCalledOnce();
});
it('does not replay an unknown gameplay outcome after a network failure',async()=>{const login=new BrowserLogin(config,new Store());login.current=session;const fetcher=vi.fn(async()=>{throw Error('timeout');});await expect(browserTransport(login,'https://rpg.example',fetcher)(backend+'/api/v1/play/actions',{method:'POST',body:'same-action'})).rejects.toThrow('timeout');expect(fetcher).toHaveBeenCalledOnce();});
