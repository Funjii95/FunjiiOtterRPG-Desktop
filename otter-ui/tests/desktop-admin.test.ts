import {it,expect} from 'vitest';
import {isDesktopAdmin} from '../src/DesktopAdmin';
import {LiveRpgClient} from '../src/live/client';
import {memoryStorage,authorization} from './remote-fixtures';
it('offers the admin UI only to the signed in channel owner',()=>{
 expect(isDesktopAdmin({connected:true,userId:'42',channelId:'42'})).toBe(true);
 expect(isDesktopAdmin({connected:true,userId:'1001',channelId:'42'})).toBe(false);
 expect(isDesktopAdmin({connected:false,userId:'42',channelId:'42'})).toBe(false);
 expect(isDesktopAdmin(undefined)).toBe(false);
});
it('keeps an uncertain item grant in the shared action journal and never silently repeats it',async()=>{
 const {storage,data}=memoryStorage();const calls:any[]=[];
 const transport:typeof fetch=async(url,init)=>{
  if(String(url).endsWith('/state'))return Response.json({available:true,sessionId:'11111111-1111-4111-8111-111111111111'});
  calls.push(JSON.parse(init!.body as string));throw Error('Connection interrupted');
 };
 const client=new LiveRpgClient(()=>authorization,storage,transport);
 const args={itemId:'tide_king_helmet',targetUserId:'42',count:'2',roll:'custom',stats:JSON.stringify(Object.fromEntries(Array.from({length:20},(_,n)=>['attribute'+n,1])))};
 await expect(client.submit('adminGrant',args)).rejects.toThrow('Connection interrupted');
 const pending=client.current();expect(pending?.kind).toBe('adminGrant');expect(data.size).toBe(1);
 await expect(client.submit('adminGrant',args)).rejects.toThrow('Vorherige Aktion');expect(calls).toHaveLength(1);
});
