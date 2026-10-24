import {it,expect} from 'vitest';
import {BackendRpgDataSource} from '../src/remote/BackendRpgDataSource';
import {authorization,profile,catalog,memoryStorage} from './remote-fixtures';
it('retains confirmed loot previews when only HP or pearls change during a read',async()=>{
 const current=profile();const fetcher:typeof fetch=async(url,request)=>{
  if(String(url).endsWith('/me'))return Response.json(current);
  if(String(url).endsWith('/state'))return Response.json({available:true,sessionId:'11111111-1111-4111-8111-111111111111',catalogJson:JSON.stringify({...catalog(),supported:['preview']})});
  const intent=JSON.parse(request!.body as string);const origin=structuredClone(current);origin.points++;origin.rpg.health.currentHp++;
  return Response.json({actionId:intent.actionId,state:'applied',outcome:{success:true,dataJson:JSON.stringify({profile:origin,dive:{stake:'0',chance:12,rarities:['Epic']},fish:{stake:'0',chance:10,rarities:['Rare']},lootLocations:[]})}});
 };
 const source=new BackendRpgDataSource({loadStats:false,storage:memoryStorage().storage,fetch:fetcher,helper:{onAuthorized:cb=>cb(authorization)}});
 await source.refresh(true);await source.previewAdventures(0,0);expect(source.getSnapshot().remote!.adventurePreview?.dive.chance).toBe(12);
 current.points+=10;current.rpg.health.currentHp++;await source.refresh(true);expect(source.getSnapshot().remote!.adventurePreview?.dive.chance).toBe(12);(current.rpg as any).SelectedFishingZone="abyss";await source.refresh(true);expect(source.getSnapshot().remote!.adventurePreview).toBeUndefined();source.dispose();
});
