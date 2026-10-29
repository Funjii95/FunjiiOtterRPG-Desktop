import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for(const width of [1400,390])test(`eleven equipment slots do not overlap at ${width}px`,async({page})=>{
 await page.route('**/trinket-preview',r=>r.fulfill({contentType:'text/html',body:readFileSync('../artifacts/trinket-character.html','utf8')}));
 await page.setViewportSize({width,height:900});await page.goto('/trinket-preview');
 await expect(page.locator('.paper-slot')).toHaveCount(11);
 const boxes=await page.locator('.paper-slot').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
 for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){const x=boxes[a],y=boxes[b];expect(x.right<=y.x||y.right<=x.x||x.bottom<=y.y||y.bottom<=x.y,`slots ${a}/${b}`).toBe(true);}
 for(const index of [9,10])await expect.poll(()=>page.locator(`.paper-slot-${index} img`).evaluate((el:HTMLImageElement)=>el.naturalWidth)).toBe(256);
 await page.screenshot({path:`test-results/trinkets-${width}.png`,fullPage:true});
});
