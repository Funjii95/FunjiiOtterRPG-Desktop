import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for(const width of [1400,390])test(`mythic eleven-piece sets render at ${width}px`,async({page})=>{
 await page.route('**/mythic-preview',r=>r.fulfill({contentType:'text/html',body:readFileSync('../artifacts/mythic-set-preview.html','utf8')}));
 await page.setViewportSize({width,height:950});await page.goto('/mythic-preview');
 await expect(page.locator('.loot-tile')).toHaveCount(22);
 for(const image of await page.locator('.loot-tile img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.naturalWidth)).toBeGreaterThan(0);await expect(image).toHaveAttribute('data-rarity','Mythic');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 // This server-rendered fixture checks artwork and responsive layout; it has no React event handlers.
 await page.screenshot({path:`test-results/mythic-sets-${width}.png`,fullPage:true});
});
