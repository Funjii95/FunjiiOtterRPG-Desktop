import {it,expect,vi,afterEach} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {App} from '../src/GraphicalApp';
import {mapProfile} from '../src/remote/model';
import {BackendRpgDataSource} from '../src/remote/BackendRpgDataSource';
import {profile,catalog,authorization,memoryStorage} from './remote-fixtures';
afterEach(()=>vi.unstubAllGlobals());
it('character shows only equipped sets with count and readable active bonuses',()=>{
 vi.stubGlobal('location',{pathname:'/index.html'});
 const c=catalog();c.sets.push({Id:'unused',Name:'UNWORN SET',Description:'',ItemIds:['unused'],Bonuses:[]});
 c.sets[0].Bonuses=[{RequiredPieces:1,Attributes:{Damage:5}}];const state=mapProfile(profile(1234,true),c);
 const html=renderToStaticMarkup(createElement(App,{source:{mode:'remote',getSnapshot:()=>state,canDispatch:()=>false} as any}));
 expect(html).toContain('Ozeanset · 1/2 Teile');expect(html).not.toContain('UNWORN SET');expect(html).toContain('equipped-set-summary');
});
it('loads quest set metadata independently and retains it after heartbeat refresh',async()=>{
 let id='';const questSet={Id:'quest_lagoon',Name:'Sonnenwächter',Description:'Questbelohnung',ItemIds:['quest_lagoon_0'],Bonuses:[]};
 const fetcher:typeof fetch=async(url,request)=>{
  if(String(url).endsWith('/me'))return Response.json(profile());
  if(String(url).endsWith('/state'))return Response.json({available:true,sessionId:'11111111-1111-4111-8111-111111111111',catalogJson:JSON.stringify({...catalog(),supported:['questStatus','startQuest','claimQuest']})});
  if(request?.method==='POST'){const intent=JSON.parse(request.body as string);expect(intent.kind).toBe('questStatus');id=intent.actionId;return Response.json({actionId:id,state:'queued'});}
  return Response.json({actionId:id,state:'applied',outcome:{success:true,dataJson:JSON.stringify({quests:[],rewardSets:[questSet]})}});
 };
 const source=new BackendRpgDataSource({fetch:fetcher,storage:memoryStorage().storage,loadStats:false,actionPollMs:1,helper:{onAuthorized:cb=>cb(authorization)}});
 try{await source.refresh(true);await source.readPlugin('questStatus');expect(source.getSnapshot().remote!.sets.some(s=>s.id==='quest_lagoon')).toBe(true);await source.refresh(true);expect(source.getSnapshot().remote!.sets.filter(s=>s.id==='quest_lagoon')).toHaveLength(1);expect(source.canDispatch('claimQuest')).toBe(true);}finally{source.dispose();}
});
