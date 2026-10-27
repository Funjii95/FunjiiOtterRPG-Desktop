import {test,expect} from '@playwright/test';
import {profile,catalog,authorization} from './remote-fixtures';
for(const [view,width,height] of [['panel',320,600],['mobile',390,844]] as const){
 test(`${view}: current Windows gameplay loads all rarities in Twitch`,async({page})=>{
  const current=profile();
  const names=['Common','Uncommon','Rare','Epic','Legendary','True','Cursed','Abyss','Eternal','Divine'];
  current.rpg.inventory=names.map((name,index)=>({...current.rpg.inventory[0],InstanceId:`owned-${index}`,Rarity:index,DisplayName:`Test ${name}`}));
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
  for(const name of ['Quests','Gruppen','Dungeons','Sammlungen','Waffen','Aufwertungs-Materialien','Einstellungen'])await expect(nav.getByRole('button',{name,exact:true})).toBeVisible();
  for(const name of ['Charakter','Inventar','Itemsets','Abenteuer','Kochen','Sammlungen','Waffen','Einstellungen']){
   await nav.getByRole('button',{name,exact:true}).click();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' should fit panel').toBe(true);
   if(name==='Inventar'){await expect(page.getByRole('heading',{name:'Test Eternal',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Test Divine',exact:true})).toBeVisible();}
  }
  await expect(page.getByText('Extension-Version 0.0.3.',{exact:false})).toBeVisible();
  await nav.getByRole('button',{name:'Inventar',exact:true}).click();
  await page.screenshot({path:`test-results/twitch-0.0.3-${view}.png`,fullPage:true});
  expect(errors).toEqual([]);
 });
}
