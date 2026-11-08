import {it,expect} from 'vitest';
import {BackendRpgDataSource} from '../src/remote/BackendRpgDataSource';
import {profile,catalog,availability,authorization,memoryStorage} from './remote-fixtures';
it('obtains completed series directly from the plugin while the cloud still returns the active series',async()=>{
 const series={Id:'a'.repeat(32),ZoneId:'sunny_lagoon',Count:100,Completed:0,Status:'active',Reason:'',Damage:0,Pearls:0,Experience:0,Items:[],Materials:{}};
 const active=profile();(active.rpg as any).DiveSeries=series;
 const completed=profile();(completed.rpg as any).DiveSeries={...series,Status:'stopped',Completed:39,Pearls:780,Reason:'Inventar voll'};
 const posts:string[]=[];
 const fetcher:typeof fetch=async(input,init)=>{
  const path=new URL(String(input),'https://test.invalid').pathname;
  const json=(data:any)=>new Response(JSON.stringify(data),{status:200});
  if(path.endsWith('/me'))return json(active);
  if(path.endsWith('/state'))return json({...availability(),catalogJson:JSON.stringify({...catalog(),supported:['diveSeries','status']})});
  if(init?.method==='POST'){const intent=JSON.parse(String(init.body));posts.push(intent.kind);return json({actionId:intent.actionId,state:'applied',outcome:{success:true,dataJson:JSON.stringify({profile:completed})}});}
  throw Error('Unexpected request '+path);
 };
 const source=new BackendRpgDataSource({fetch:fetcher,storage:memoryStorage().storage,helper:{onAuthorized:cb=>cb(authorization)},loadStats:false});
 await source.refresh(true);
 expect(source.getSnapshot().remote?.diveSeries).toMatchObject({Status:'stopped',Completed:39,Pearls:780});
 expect(posts).toContain('status');expect(posts).not.toContain('diveSeries');source.dispose();
});
