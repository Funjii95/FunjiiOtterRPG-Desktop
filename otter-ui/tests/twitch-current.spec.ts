import {test,expect} from '@playwright/test';
import {profile,catalog,authorization} from './remote-fixtures';
import artwork from '../src/redesigned-art.json' with {type:'json'};
for(const [view,width,height] of [['panel',320,600],['mobile',390,844]] as const){
 test(`${view}: current Windows gameplay loads all rarities in Twitch`,async({page})=>{
  const current=profile();
  const names=['Common','Uncommon','Rare','Epic','Legendary','True','Cursed','Abyss','Eternal','Divine'];
  const artIds=['pearl_digger_chest','coast_runner_chest','kelp_collector_boots','reef_guardian_gloves','tide_king_chest','weapon_reef_wardens','coast_runner_helmet','pearl_digger_gloves','weapon_worldbreaker','tide_king_amulet'];
  current.rpg.inventory=names.map((name,index)=>({...current.rpg.inventory[0],InstanceId:`owned-${index}`,ItemId:artIds[index],IconId:artIds[index],Rarity:index,DisplayName:`Test ${name}`}));
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://extension-files.twitch.tv/**',r=>r.fulfill({contentType:'text/javascript',body:`window.Twitch={ext:{onAuthorized:cb=>cb(${JSON.stringify(authorization)}),actions:{requestIdShare:()=>{}}}};`}));
  await page.route(/^https:\/\/(?:rc1---)?funjii-otter-rpg-backend-test-cwzl75ajla-ey\.a\.run\.app\//,async r=>{
   const url=r.request().url();
   if(url.endsWith('/me'))return r.fulfill({json:current});
   if(url.endsWith('/state'))return r.fulfill({json:{available:true,sessionId:'11111111-1111-4111-8111-111111111111',catalogJson:JSON.stringify({...catalog(),supported:['status']})}});
   const intent=r.request().postDataJSON();
   return r.fulfill({status:202,json:{actionId:intent.actionId,state:'applied',outcome:{success:true,dataJson:JSON.stringify({profile:current,stats:{Damage:12.5,CritChance:3,Power:7}})}}});
  });
  await page.setViewportSize({width,height});await page.goto(`/${view}.html`);
  await expect(page.getByText('Seltenheit ist unbekannt.')).toHaveCount(0);
  await expect(page.locator('.statusbar')).toContainText('1.234');
  const nav=page.getByRole('navigation',{name:'Hauptnavigation'});
  await expect(nav.getByRole('button')).toHaveCount(7);
  const groups:Record<string,string>={Charakter:'Charakter',Inventar:'Inventar',Itemsets:'Inventar',Abenteuer:'Abenteuer',Kochen:'Küche',Sammlungen:'Inventar',Waffen:'Inventar',Quests:'Abenteuer',Boss:'Abenteuer',Dungeons:'Gruppen',Talente:'Charakter',Perks:'Charakter',Statistiken:'Charakter',Aufwerten:'Inventar',Einstellungen:'Einstellungen'};
  for(const [name,group] of Object.entries(groups)){
   await nav.getByRole('button',{name:group,exact:true}).click();
   const sub=page.getByRole('navigation',{name:group+' – Bereiche',exact:true});
   if(await sub.count())await sub.getByRole('button',{name,exact:true}).click();
   await expect(nav.getByRole('button',{name:group,exact:true})).toHaveAttribute('aria-current','page');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' should fit panel').toBe(true);
   if(name==='Inventar'){await expect(page.getByRole('heading',{name:'Test Eternal',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Test Divine',exact:true})).toBeVisible();}
  }
  await expect(page.getByText('Extension-Version 0.0.3.',{exact:false})).toBeVisible();
  await nav.getByRole('button',{name:'Inventar',exact:true}).click();
  for(let index=0;index<artIds.length;index++){
   const img=page.locator(`[data-instance-id="owned-${index}"] img.item-art`);
   await img.scrollIntoViewIfNeeded();
   await expect(img).toHaveAttribute('src',(artwork as Record<string,{src:string}>)[artIds[index]].src);
   await expect(img).toHaveAttribute('data-rarity',names[index]);
   await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.naturalWidth)).toBe(512);
   expect(await img.evaluate(el=>getComputedStyle(el).borderTopStyle)).not.toBe('none');
  }
  await page.locator('[data-instance-id="owned-0"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`test-results/twitch-0.0.3-${view}.png`,fullPage:false});
  expect(errors).toEqual([]);
 });
}
