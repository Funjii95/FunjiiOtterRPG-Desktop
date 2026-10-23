import {describe,it,expect} from 'vitest';
import {DesktopSource} from '../src/desktop-source';
function storage(){const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)},removeItem:(k:string)=>{data.delete(k)}} as Storage;}
describe('Windows profile persistence',()=>{
 it('restores progress, separates Twitch users and guest, and never changes live data',async()=>{
  const s=storage(),identity={userId:'42',displayName:'Funjii'};const first=new DesktopSource(identity,s);
  const balance=first.getSnapshot().player.pearls;
  await first.settleMinigameFixture('test',100,150);
  const restored=new DesktopSource(identity,s);
  expect(restored.getSnapshot().player.pearls).toBe(balance+50);
  expect(restored.getSnapshot().player.username).toBe('Funjii');
  expect(new DesktopSource({userId:'43',displayName:'Anderer Otter'},s).getSnapshot().player.pearls).toBe(balance);
  expect(new DesktopSource({userId:'guest',displayName:'Gast'},s).getSnapshot().player.pearls).toBe(balance);
 });
 it('keeps a damaged save intact',()=>{const s=storage();s.setItem('funjii.desktop.preview.v1:42','broken');expect(()=>new DesktopSource({userId:'42',displayName:'Otter'},s)).toThrow();expect(s.getItem('funjii.desktop.preview.v1:42')).toBe('broken');});
});
