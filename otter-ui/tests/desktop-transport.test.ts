import {it,expect} from 'vitest';
import {desktopTransport,type NativeBridge} from '../src/desktop-transport';
import {backend} from '../src/live/client';
function fixture(){const listeners=new Set<(event:{data:any})=>void>();const messages:any[]=[];const bridge:NativeBridge={postMessage:value=>{messages.push(value)},addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>{listeners.delete(fn)}};return {fetch:desktopTransport(bridge),messages,listeners,reply:(value:any)=>{for(const fn of [...listeners])fn({data:value})}};}
it('sends only API path, intent and session to native host, without exposing authorization',async()=>{
 const f=fixture();const pending=f.fetch(backend+'/api/v1/play/actions',{method:'POST',headers:{Authorization:'Bearer native-session','X-Rpg-Session':'123'},body:'{"actionId":"same-id"}'});
 expect(f.messages).toHaveLength(1);const message=f.messages[0];expect(message.path).toBe('/api/v1/play/actions');expect(message.session).toBe('123');expect(JSON.stringify(message)).not.toContain('Bearer');
 f.reply({id:'unrelated',status:200,body:'{}'});expect(f.listeners.size).toBe(1);
 f.reply({id:message.id,status:202,body:'{"state":"queued"}'});expect((await pending).status).toBe(202);expect(f.listeners.size).toBe(0);
});
it('rejects unknown hosts and aborted requests without sending',async()=>{
 const f=fixture();await expect(f.fetch('https://evil.example/api/v1/me')).rejects.toThrow();
 const abort=new AbortController();abort.abort();await expect(f.fetch(backend+'/api/v1/me',{signal:abort.signal})).rejects.toThrow();expect(f.messages).toHaveLength(0);expect(f.listeners.size).toBe(0);
});
