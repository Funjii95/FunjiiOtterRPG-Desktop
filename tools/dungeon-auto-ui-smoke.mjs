import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import http from 'node:http';import path from 'node:path';
const root=process.cwd(),require=createRequire(path.join(root,'otter-ui/package.json')),{chromium,expect}=require('@playwright/test');
const webRoot=path.join(root,'otter-ui/dist'),out=path.join(root,'artifacts/dungeon-auto-ui');await mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const file=path.resolve(webRoot,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(webRoot+path.sep))throw Error();const data=await readFile(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':file.endsWith('.png')?'image/png':'text/html');res.end(data);}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true});
try{const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
await page.addInitScript(()=>{
 const listeners=new Set(),now=new Date().toISOString(),session='11111111-1111-4111-8111-111111111111';window.smokeActions=[];
 const profile={UserId:'1001',DisplayName:'Testotter',Points:1000,UpdatedAt:now,Source:'plugin-snapshot',Rpg:{SchemaVersion:1,PlayerLevel:99,Experience:5000000,Role:2,SushiVersion:2,LegacyFishImported:true,Health:{CurrentHp:1000,AppliedMaximumHp:1000,LastPassiveRegen:now},Inventory:[],Equipment:{},Perks:{},Fish:{},Sushi:{},Buffs:[],Cooldowns:{},TalentRanks:{},CombatRewards:[]}};
 const party={snapshot:{Version:1,Invitations:[]},members:[],inviters:{}},dungeon={Id:'runen_halls',Name:'Die Versunkenen Runenhallen',ZoneId:'sunken_temples',MinimumLevel:10,Description:'Vergessene Wächter und Runenmagie.',BossId:'boss_thalruun'};
 const catalog={supported:['status','party','partyStatus','partyCombat','dungeonStatus'],partyInviteNames:true,automaticDungeons:true,progressionRules:{ExperiencePerLevel:1000,MaximumLevel:99},sets:[],perks:[],recipes:[]};
 function create(){party.snapshot.Party={Id:'party',LeaderId:'1001',Members:['1001']};party.members=[{userId:'1001',name:'Testotter',role:'Healer',level:99,hp:1000,maxHp:1000,healthPercent:100,recentlyActive:true,leader:true}];}
 window.otterDesktopIdentity={userId:'1001',displayName:'Testotter',channelId:'42',connected:true};
 window.chrome={webview:{addEventListener(_,cb){listeners.add(cb)},removeEventListener(_,cb){listeners.delete(cb)},postMessage(m){if(m.type!=='api')return;let data={},status=200;
 if(m.path==='/api/v1/me')data=profile;
 else if(m.path==='/api/v1/play/state')data={available:true,reason:'ready',sessionId:session,catalogJson:JSON.stringify(catalog)};
 else if(m.path==='/api/v1/play/actions'){status=202;const intent=JSON.parse(m.body);window.smokeActions.push(intent);let result={};
  if(intent.kind==='status')result={profile,stats:{Attack:100,HealingPower:20}};
  if(intent.kind==='partyStatus')result=party;
  if(intent.kind==='party'){if(intent.arguments.operation==='create')create();result={...party,notice:intent.arguments.operation==='invite'?'Einladung an Simoncat gesendet.':''};}
  if(intent.kind==='dungeonStatus')result={enabled:true,dungeons:[dungeon],party};
  if(intent.kind==='partyCombat'){const op=intent.arguments.operation;if(op==='startDungeon'){if(!party.snapshot.Party)create();party.snapshot.Party.Instance={Id:'instance',Kind:'dungeon',Status:'active',ZoneId:'sunken_temples',Difficulty:'normal',DungeonId:'runen_halls',Stage:0,Turn:0,EnemyId:'temple',EnemyName:'Tempelwächterkrabbe',Hp:600,MaximumHp:600,AddsHp:0,WaveCleared:false,Enraged:false,AutomaticCombat:true,NextAutomaticAt:now,PendingAbility:'',ExpiresAt:new Date(Date.now()+1800000).toISOString(),Rewarded:[],Cooldowns:{},Shields:{},Threat:{},Log:[]};}
   if(op==='pauseAutomatic')party.snapshot.Party.Instance.AutomaticCombat=false;
   if(op==='resumeAutomatic'){party.snapshot.Party.Instance.AutomaticCombat=true;setTimeout(()=>{party.snapshot.Party.Instance.Status='won';party.snapshot.Party.Instance.Hp=0;party.snapshot.Party.Instance.Stage=6;party.snapshot.Party.Instance.Turn=35;party.snapshot.Party.Instance.Rewarded=['1001'];profile.Rpg.CombatRewards=[{Id:'dungeon:one',Kind:'dungeon',EnemyId:'boss_thalruun',EnemyName:"Thal’Ruun, der Tempelhüter",ZoneId:'sunken_temples',AwardedAt:new Date().toISOString(),Pearls:250,Experience:300,Items:[{InstanceId:'drop-one',ItemId:'starter_crab_breaker',Name:'Krabbenbrecher',Rarity:4}],Materials:{white_pearl:3}}];profile.UpdatedAt=new Date().toISOString();},250);}
   result={party,profile,stats:{Attack:100,HealingPower:20}};
  }
  data={actionId:intent.actionId,state:'applied',outcome:{success:true,dataJson:JSON.stringify(result)}};
 }
 setTimeout(()=>{for(const cb of listeners)cb({data:{id:m.id,status,body:JSON.stringify(data)}});},0);
 }}};
});
await page.goto(base+'/desktop.html');await page.getByRole('button',{name:'Gruppen',exact:true}).click();await page.getByRole('button',{name:'Gruppe erstellen',exact:true}).click();await page.getByLabel('Mitspieler: Twitch-Name').fill('@Simoncat');await page.getByRole('button',{name:'Einladen',exact:true}).click();await expect(page.getByText('Einladung an Simoncat gesendet.',{exact:true})).toBeVisible();
await page.getByRole('button',{name:'Dungeons',exact:true}).click();await page.getByRole('button',{name:'Mit Gruppe betreten',exact:true}).click();await expect(page.getByText('Automatischer Kampf läuft',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Autokampf pausieren',exact:true}).click();await expect(page.getByRole('button',{name:'Autokampf fortsetzen',exact:true})).toBeVisible();await page.screenshot({path:path.join(out,'paused.png'),fullPage:true});await page.getByRole('button',{name:'Autokampf fortsetzen',exact:true}).click();
const popup=page.getByRole('status',{name:'Kampfbelohnungen'});await expect(popup).toBeVisible({timeout:12000});await expect(popup).toContainText('250 Perlen');await expect(popup).toContainText('300 EP');await expect(popup).toContainText('3 × Weiße Perle');await expect(popup).toContainText('Krabbenbrecher');await page.screenshot({path:path.join(out,'rewards.png'),fullPage:true});await expect(popup).toHaveCount(0,{timeout:7000});await page.waitForTimeout(1500);await expect(popup).toHaveCount(0);
const actions=await page.evaluate(()=>window.smokeActions);expect(actions.filter(a=>a.kind==='partyCombat').map(a=>a.arguments.operation)).toEqual(['startDungeon','pauseAutomatic','resumeAutomatic']);expect(actions.find(a=>a.kind==='party'&&a.arguments.operation==='invite').arguments).toEqual({operation:'invite',targetLogin:'@Simoncat'});expect(errors).toEqual([]);await writeFile(path.join(out,'result.txt'),'PASS: Windows desktop bundle/native API bridge; Twitch-name invite, automatic start, pause/resume, no attack clicks, actual reward popup/images/amounts and 5s timeout; synthetic responses only.');console.log('PASS: Windows automatic dungeon and reward popup.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
