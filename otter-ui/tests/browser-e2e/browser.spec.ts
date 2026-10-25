import {test,expect} from '@playwright/test';
import {profile,catalog,availability} from '../remote-fixtures';
test('Chrome login persists encrypted credentials, restores the same profile, hides zero stats and signs out',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let codes=0;const current=profile();
 await page.route('**/api/v1/desktop/config',r=>r.fulfill({json:{enabled:true,clientId:'publicclient12345',channelId:'42'}}));
 await page.route('https://id.twitch.tv/oauth2/**',r=>{
  if(r.request().url().endsWith('/device')){codes++;return r.fulfill({json:{device_code:'devicecredential12345',user_code:'ABCDEFGH',verification_uri:'https://www.twitch.tv/activate',expires_in:1800,interval:1}});}
  if(r.request().url().endsWith('/token'))return r.fulfill({json:{access_token:'testcredential12345',refresh_token:'refreshcredential12345',expires_in:3600}});
  return r.fulfill({json:{client_id:'publicclient12345',user_id:'1001',login:'Testotter',expires_in:3600}});
 });
 await page.route('**/api/v1/me',r=>{expect(r.request().headers().authorization).toBe('Desktop testcredential12345');return r.fulfill({json:current});});
 await page.route('**/api/v1/play/**',r=>{
  expect(r.request().headers().authorization).toBe('Desktop testcredential12345');
  if(r.request().url().endsWith('/state'))return r.fulfill({json:{...availability(),catalogJson:JSON.stringify({...catalog(),supported:['status']})}});
  const intent=r.request().postDataJSON();return r.fulfill({status:202,json:{actionId:intent.actionId,state:'applied',outcome:{success:true,dataJson:JSON.stringify({profile:current,stats:{Attack:100,Armor:0,MagicPower:0,Power:5}})}}});
 });
 await page.goto('/browser.html');await page.getByRole('button',{name:'Mit Twitch anmelden',exact:true}).click();await expect(page.getByText('ABCDEFGH',{exact:true})).toBeVisible();
 await expect(page.getByText('Angemeldet als Testotter',{exact:true})).toBeVisible({timeout:15000});
 await page.getByRole('button',{name:'Charakter',exact:true}).click();await expect(page.locator('.codex-stat').filter({has:page.getByText('Angriff',{exact:true})})).toContainText('100');
 await expect(page.locator('.codex-stat').filter({has:page.getByText('Magiekraft',{exact:true})})).toHaveCount(0);
 const encrypted=await page.evaluate(async()=>new Promise<boolean>((resolve,reject)=>{const q=indexedDB.open('funjii-browser-login');q.onsuccess=()=>{const db=q.result,tx=db.transaction('auth'),a=tx.objectStore('auth').get('session'),b=tx.objectStore('auth').get('key');tx.oncomplete=()=>{resolve(a.result.data instanceof ArrayBuffer&&!b.result.extractable&&!JSON.stringify(a.result).includes('testcredential'));db.close();};};q.onerror=reject;}));expect(encrypted).toBe(true);
 await page.reload();await expect(page.getByText('Angemeldet als Testotter',{exact:true})).toBeVisible();expect(codes).toBe(1);
 await page.getByRole('button',{name:'Inventar',exact:true}).click();await expect(page.getByRole('heading',{name:'Gespeicherter Dreizack',exact:true})).toBeVisible();
 await page.screenshot({path:'test-results/chrome-rpg.png',fullPage:true});await page.getByRole('button',{name:'Abmelden',exact:true}).click();await expect(page.getByRole('button',{name:'Mit Twitch anmelden',exact:true})).toBeEnabled();await page.reload();await expect(page.getByRole('button',{name:'Mit Twitch anmelden',exact:true})).toBeEnabled();expect(errors).toEqual([]);
});
test('Chrome can retry when initial backend config is unavailable',async({page})=>{
 let calls=0;await page.route('**/api/v1/desktop/config',r=>++calls===1?r.fulfill({status:503}):r.fulfill({json:{enabled:true,clientId:'publicclient12345',channelId:'42'}}));
 await page.goto('/browser.html');await page.getByRole('button',{name:'Verbindung erneut prüfen'}).click();await expect(page.getByRole('button',{name:'Mit Twitch anmelden',exact:true})).toBeEnabled();expect(calls).toBe(2);
});
