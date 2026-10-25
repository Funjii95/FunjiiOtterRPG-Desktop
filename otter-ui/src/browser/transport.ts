import {backend} from '../live/client';
import type {BrowserLogin} from './login';
export function browserTransport(login:BrowserLogin,origin=location.origin,transport:typeof fetch=fetch):typeof fetch{
 return async(input,init)=>{
  const requested=new URL(String(input));if(requested.origin!==new URL(backend).origin||requested.username||requested.password||requested.hash||!(requested.pathname==='/api/v1/me'||requested.pathname.startsWith('/api/v1/play/'))||!['GET','POST'].includes(init?.method??'GET'))throw Error('Unbekanntes Browser-API-Ziel.');
  const user=login.current?.userId;if(!user)throw Error('Bitte mit Twitch anmelden.');
  if((login.current?.expiresAt??0)<Date.now()+30000)await login.resume();
  const send=()=>{if(login.current?.userId!==user)throw Error('Twitch-Konto gewechselt. Bitte die Seite neu laden.');const headers=new Headers(init?.headers);headers.set('Authorization','Desktop '+login.current!.accessToken);return transport(origin+requested.pathname+requested.search,{...init,headers,credentials:'omit',redirect:'error',cache:'no-store'});};
  const response=await send();if(response.status!==401)return response;
  // A rejected authentication cannot execute gameplay. Retry only this same request with its existing action ID.
  await login.resume();return send();
 };
}
